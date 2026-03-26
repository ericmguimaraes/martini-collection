/**
 * Build-time script: resolves artwork URLs for CDs and DVDs from external APIs.
 * Reads cds.json/dvds.json (from prepare-data), enriches with image URLs, writes back.
 *
 * Sources:
 *   CDs:  1) iTunes Search API  2) MusicBrainz + Cover Art Archive
 *   DVDs: 1) TMDB (by IMDb ID or title search)
 *
 * Uses a persistent cache (artwork-cache.json) committed to git to avoid
 * re-resolving on every build.
 *
 * Environment variables (from .env.local or CI secrets):
 *   TMDB_API_KEY — required for DVD poster resolution
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// ── Load .env.local if present (no dotenv dependency) ────────────────────

function loadEnvLocal() {
  const envPath = join(import.meta.dirname, '..', '.env.local')
  if (!existsSync(envPath)) return
  const content = readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let val = trimmed.slice(eqIdx + 1).trim()
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) {
      process.env[key] = val
    }
  }
}

loadEnvLocal()

// ── Config ───────────────────────────────────────────────────────────────

const ROOT = join(import.meta.dirname, '..')
const DATA_DIR = join(ROOT, 'src', 'data')
const CDS_PATH = join(DATA_DIR, 'cds.json')
const DVDS_PATH = join(DATA_DIR, 'dvds.json')
const CACHE_PATH = join(ROOT, 'artwork-cache.json')

const TMDB_API_KEY = process.env.TMDB_API_KEY || ''
const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500'

// Rate limit delays (ms)
const ITUNES_DELAY = 200
const MUSICBRAINZ_DELAY = 1200 // >1s per their policy
const TMDB_DELAY = 50

// ── Types ────────────────────────────────────────────────────────────────

interface CacheEntry {
  url: string | null
  source: string
  resolvedAt: string
}

type ArtworkCache = Record<string, CacheEntry>

interface CdItem {
  id: string
  artist: string
  title: string
  artworkUrl?: string
  artworkSource?: string
  [key: string]: unknown
}

interface DvdItem {
  id: string
  title: string
  originalTitle: string
  releaseYear: number | null
  imdbId?: string
  posterUrl?: string
  posterSource?: string
  [key: string]: unknown
}

// ── Helpers ──────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

function loadJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function loadCache(): ArtworkCache {
  if (existsSync(CACHE_PATH)) {
    return loadJson<ArtworkCache>(CACHE_PATH)
  }
  return {}
}

function saveCache(cache: ArtworkCache) {
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2))
}

// ── iTunes Search API ────────────────────────────────────────────────────

async function fetchItunesArt(artist: string, album: string): Promise<string | null> {
  try {
    const q = encodeURIComponent(`${artist} ${album}`)
    const res = await fetch(
      `https://itunes.apple.com/search?term=${q}&media=music&entity=album&limit=1`
    )
    if (!res.ok) return null
    const data = await res.json()
    const artUrl = data.results?.[0]?.artworkUrl100
    if (!artUrl) return null
    return artUrl.replace('100x100', '600x600')
  } catch {
    return null
  }
}

// ── MusicBrainz + Cover Art Archive ──────────────────────────────────────

async function fetchMusicBrainzArt(artist: string, album: string): Promise<string | null> {
  try {
    // Search MusicBrainz for the release
    const q = encodeURIComponent(`release:"${album}" AND artist:"${artist}"`)
    const res = await fetch(
      `https://musicbrainz.org/ws/2/release/?query=${q}&limit=1&fmt=json`,
      { headers: { 'User-Agent': 'MartiniCollection/1.0 (github.com/ericmguimaraes/martini-collection)' } }
    )
    if (!res.ok) return null
    const data = await res.json()
    const mbid = data.releases?.[0]?.id
    if (!mbid) return null

    // Fetch cover from Cover Art Archive
    const caaRes = await fetch(`https://coverartarchive.org/release/${mbid}`, {
      redirect: 'follow',
    })
    if (!caaRes.ok) return null
    const caaData = await caaRes.json()
    const front = caaData.images?.find((img: { front: boolean }) => img.front)
    return front?.thumbnails?.large || front?.thumbnails?.['500'] || front?.image || null
  } catch {
    return null
  }
}

// ── TMDB ─────────────────────────────────────────────────────────────────

async function fetchTmdbByImdbId(imdbId: string): Promise<string | null> {
  if (!TMDB_API_KEY) return null
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${TMDB_API_KEY}`
    )
    if (!res.ok) return null
    const data = await res.json()
    // Check movie results first, then TV
    const movie = data.movie_results?.[0]
    if (movie?.poster_path) return `${TMDB_IMG_BASE}${movie.poster_path}`
    const tv = data.tv_results?.[0]
    if (tv?.poster_path) return `${TMDB_IMG_BASE}${tv.poster_path}`
    return null
  } catch {
    return null
  }
}

async function fetchTmdbByTitle(title: string, year: number | null): Promise<string | null> {
  if (!TMDB_API_KEY) return null
  try {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`
    if (year) url += `&year=${year}`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const movie = data.results?.[0]
    if (movie?.poster_path) return `${TMDB_IMG_BASE}${movie.poster_path}`
    return null
  } catch {
    return null
  }
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('Resolving artwork...')

  // Load data
  if (!existsSync(CDS_PATH) || !existsSync(DVDS_PATH)) {
    console.error('Error: cds.json/dvds.json not found. Run prepare-data first.')
    process.exit(1)
  }

  const cds = loadJson<CdItem[]>(CDS_PATH)
  const dvds = loadJson<DvdItem[]>(DVDS_PATH)
  const cache = loadCache()

  // ── Resolve CD artwork ──────────────────────────────────────────────

  let cdResolved = 0
  let cdSkipped = 0
  let cdMissed = 0

  for (const cd of cds) {
    // Check cache
    if (cache[cd.id]) {
      const entry = cache[cd.id]
      if (entry.url) {
        cd.artworkUrl = entry.url
        cd.artworkSource = entry.source
        cdResolved++
      } else {
        cdMissed++
      }
      cdSkipped++
      continue
    }

    // Try iTunes
    const itunesUrl = await fetchItunesArt(cd.artist, cd.title)
    await sleep(ITUNES_DELAY)

    if (itunesUrl) {
      cd.artworkUrl = itunesUrl
      cd.artworkSource = 'itunes'
      cache[cd.id] = { url: itunesUrl, source: 'itunes', resolvedAt: new Date().toISOString() }
      cdResolved++
      continue
    }

    // Try MusicBrainz + Cover Art Archive
    const caaUrl = await fetchMusicBrainzArt(cd.artist, cd.title)
    await sleep(MUSICBRAINZ_DELAY)

    if (caaUrl) {
      cd.artworkUrl = caaUrl
      cd.artworkSource = 'coverart'
      cache[cd.id] = { url: caaUrl, source: 'coverart', resolvedAt: new Date().toISOString() }
      cdResolved++
      continue
    }

    // No art found
    cache[cd.id] = { url: null, source: 'none', resolvedAt: new Date().toISOString() }
    cdMissed++
  }

  console.log(`  CDs: ${cdResolved} resolved, ${cdMissed} missed, ${cdSkipped} from cache`)

  // ── Resolve DVD posters ─────────────────────────────────────────────

  let dvdResolved = 0
  let dvdSkipped = 0
  let dvdMissed = 0

  if (!TMDB_API_KEY) {
    console.log('  DVDs: skipped (no TMDB_API_KEY set)')
  } else {
    for (const dvd of dvds) {
      // Check cache
      if (cache[dvd.id]) {
        const entry = cache[dvd.id]
        if (entry.url) {
          dvd.posterUrl = entry.url
          dvd.posterSource = entry.source
          dvdResolved++
        } else {
          dvdMissed++
        }
        dvdSkipped++
        continue
      }

      let posterUrl: string | null = null

      // Try TMDB by IMDb ID
      if (dvd.imdbId) {
        posterUrl = await fetchTmdbByImdbId(dvd.imdbId)
        await sleep(TMDB_DELAY)
      }

      // Fallback: TMDB search by title
      if (!posterUrl) {
        posterUrl = await fetchTmdbByTitle(
          dvd.originalTitle || dvd.title,
          dvd.releaseYear
        )
        await sleep(TMDB_DELAY)
      }

      if (posterUrl) {
        dvd.posterUrl = posterUrl
        dvd.posterSource = 'tmdb'
        cache[dvd.id] = { url: posterUrl, source: 'tmdb', resolvedAt: new Date().toISOString() }
        dvdResolved++
      } else {
        cache[dvd.id] = { url: null, source: 'none', resolvedAt: new Date().toISOString() }
        dvdMissed++
      }
    }

    console.log(`  DVDs: ${dvdResolved} resolved, ${dvdMissed} missed, ${dvdSkipped} from cache`)
  }

  // ── Write enriched data back ────────────────────────────────────────

  writeFileSync(CDS_PATH, JSON.stringify(cds, null, 2))
  writeFileSync(DVDS_PATH, JSON.stringify(dvds, null, 2))
  saveCache(cache)

  console.log('Artwork resolution complete.')
}

main()
