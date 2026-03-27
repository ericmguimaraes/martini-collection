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
 *
 * CLI flags:
 *   --delay <ms>  Override rate-limit delay for iTunes/TMDB (default: 200ms/50ms).
 *                  MusicBrainz delay is clamped to ≥1200ms regardless.
 *                  Previously missed items (url: null in cache) are always retried.
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

// ── CLI args ─────────────────────────────────────────────────────────────

function parseCliArgs() {
  const args = process.argv.slice(2)
  let delay: number | undefined
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--delay' && args[i + 1]) {
      delay = parseInt(args[i + 1], 10)
      if (isNaN(delay) || delay < 0) {
        console.error('Error: --delay must be a non-negative integer (ms)')
        process.exit(1)
      }
      i++
    }
  }
  return { delay }
}

const cliArgs = parseCliArgs()

// ── Config ───────────────────────────────────────────────────────────────

const ROOT = join(import.meta.dirname, '..')
const DATA_DIR = join(ROOT, 'src', 'data')
const CDS_PATH = join(DATA_DIR, 'cds.json')
const DVDS_PATH = join(DATA_DIR, 'dvds.json')
const CACHE_PATH = join(ROOT, 'artwork-cache.json')

const TMDB_API_KEY = process.env.TMDB_API_KEY || ''
const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500'

// Rate limit delays (ms) — override iTunes/TMDB with --delay flag
const ITUNES_DELAY = cliArgs.delay ?? 200
const MUSICBRAINZ_DELAY = Math.max(cliArgs.delay ?? 1200, 1200) // never below 1200 per their policy
const TMDB_DELAY = cliArgs.delay ?? 50

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
  const q = encodeURIComponent(`${artist} ${album}`)
  const res = await fetch(
    `https://itunes.apple.com/search?term=${q}&media=music&entity=album&limit=1`
  )
  if (!res.ok) throw new Error(`iTunes HTTP ${res.status}`)
  const data = await res.json()
  const artUrl = data.results?.[0]?.artworkUrl100
  if (!artUrl) return null
  return artUrl.replace('100x100', '600x600')
}

// ── MusicBrainz + Cover Art Archive ──────────────────────────────────────

async function fetchMusicBrainzArt(artist: string, album: string): Promise<string | null> {
  // Search MusicBrainz for the release
  const q = encodeURIComponent(`release:"${album}" AND artist:"${artist}"`)
  const res = await fetch(
    `https://musicbrainz.org/ws/2/release/?query=${q}&limit=1&fmt=json`,
    { headers: { 'User-Agent': 'MartiniCollection/1.0 (github.com/ericmguimaraes/martini-collection)' } }
  )
  if (!res.ok) throw new Error(`MusicBrainz HTTP ${res.status}`)
  const data = await res.json()
  const mbid = data.releases?.[0]?.id
  if (!mbid) return null

  // Fetch cover from Cover Art Archive
  const caaRes = await fetch(`https://coverartarchive.org/release/${mbid}`, {
    redirect: 'follow',
  })
  if (!caaRes.ok) return null // 404 is normal (no cover)
  const caaData = await caaRes.json()
  const front = caaData.images?.find((img: { front: boolean }) => img.front)
  return front?.thumbnails?.large || front?.thumbnails?.['500'] || front?.image || null
}

// ── TMDB ─────────────────────────────────────────────────────────────────

async function fetchTmdbByImdbId(imdbId: string): Promise<string | null> {
  if (!TMDB_API_KEY) return null
  const res = await fetch(
    `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id&api_key=${TMDB_API_KEY}`
  )
  if (!res.ok) throw new Error(`TMDB find HTTP ${res.status}`)
  const data = await res.json()
  const movie = data.movie_results?.[0]
  if (movie?.poster_path) return `${TMDB_IMG_BASE}${movie.poster_path}`
  const tv = data.tv_results?.[0]
  if (tv?.poster_path) return `${TMDB_IMG_BASE}${tv.poster_path}`
  return null
}

async function fetchTmdbByTitle(title: string, year: number | null): Promise<string | null> {
  if (!TMDB_API_KEY) return null
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`
  if (year) url += `&year=${year}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`TMDB search HTTP ${res.status}`)
  const data = await res.json()
  const movie = data.results?.[0]
  if (movie?.poster_path) return `${TMDB_IMG_BASE}${movie.poster_path}`
  return null
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
  const cachedCount = Object.keys(cache).length

  console.log(`  Loaded ${cds.length} CDs, ${dvds.length} DVDs, ${cachedCount} cached entries`)
  console.log(`  Delays: iTunes=${ITUNES_DELAY}ms, MusicBrainz=${MUSICBRAINZ_DELAY}ms, TMDB=${TMDB_DELAY}ms`)

  // ── Resolve CD artwork ──────────────────────────────────────────────

  let cdResolved = 0
  let cdCached = 0
  let cdMissed = 0
  let cdErrors = 0

  console.log(`\n── CDs (${cds.length}) ──`)

  for (let i = 0; i < cds.length; i++) {
    const cd = cds[i]
    const prefix = `  [${i + 1}/${cds.length}]`

    // Check cache — skip only if already resolved with artwork
    if (cache[cd.id]?.url) {
      const entry = cache[cd.id]
      cd.artworkUrl = entry.url!
      cd.artworkSource = entry.source
      cdResolved++
      cdCached++
      continue
    }

    // Try iTunes
    let source = ''
    let url: string | null = null
    try {
      url = await fetchItunesArt(cd.artist, cd.title)
      await sleep(ITUNES_DELAY)
      if (url) source = 'itunes'
    } catch (err) {
      console.error(`${prefix} ERROR iTunes: ${cd.artist} — ${cd.title}: ${err}`)
      cdErrors++
      await sleep(ITUNES_DELAY)
    }

    // Fallback: MusicBrainz + Cover Art Archive
    if (!url && !source) {
      try {
        url = await fetchMusicBrainzArt(cd.artist, cd.title)
        await sleep(MUSICBRAINZ_DELAY)
        if (url) source = 'coverart'
      } catch (err) {
        console.error(`${prefix} ERROR MusicBrainz: ${cd.artist} — ${cd.title}: ${err}`)
        cdErrors++
        await sleep(MUSICBRAINZ_DELAY)
      }
    }

    if (url) {
      cd.artworkUrl = url
      cd.artworkSource = source
      cache[cd.id] = { url, source, resolvedAt: new Date().toISOString() }
      cdResolved++
      console.log(`${prefix} ✓ ${source}: ${cd.artist} — ${cd.title}`)
    } else {
      cache[cd.id] = { url: null, source: 'none', resolvedAt: new Date().toISOString() }
      cdMissed++
      console.log(`${prefix} ✗ miss: ${cd.artist} — ${cd.title}`)
    }

    // Save cache every 50 items so progress isn't lost on crash
    if ((i + 1) % 50 === 0) {
      saveCache(cache)
      console.log(`  (cache saved at ${i + 1})`)
    }
  }

  console.log(`\n  CDs summary: ${cdResolved} resolved, ${cdMissed} missed, ${cdCached} cached, ${cdErrors} errors`)

  // ── Resolve DVD posters ─────────────────────────────────────────────

  let dvdResolved = 0
  let dvdCached = 0
  let dvdMissed = 0
  let dvdErrors = 0

  if (!TMDB_API_KEY) {
    console.log('\n── DVDs: skipped (no TMDB_API_KEY set) ──')
  } else {
    console.log(`\n── DVDs (${dvds.length}) ──`)

    for (let i = 0; i < dvds.length; i++) {
      const dvd = dvds[i]
      const prefix = `  [${i + 1}/${dvds.length}]`

      // Check cache — skip only if already resolved with poster
      if (cache[dvd.id]?.url) {
        const entry = cache[dvd.id]
        dvd.posterUrl = entry.url!
        dvd.posterSource = entry.source
        dvdResolved++
        dvdCached++
        continue
      }

      let posterUrl: string | null = null

      // Try TMDB by IMDb ID
      if (dvd.imdbId) {
        try {
          posterUrl = await fetchTmdbByImdbId(dvd.imdbId)
          await sleep(TMDB_DELAY)
        } catch (err) {
          console.error(`${prefix} ERROR TMDB/imdb: ${dvd.title} (${dvd.imdbId}): ${err}`)
          dvdErrors++
          await sleep(TMDB_DELAY)
        }
      }

      // Fallback: TMDB search by title
      if (!posterUrl) {
        try {
          posterUrl = await fetchTmdbByTitle(
            dvd.originalTitle || dvd.title,
            dvd.releaseYear
          )
          await sleep(TMDB_DELAY)
        } catch (err) {
          console.error(`${prefix} ERROR TMDB/search: ${dvd.title} (${dvd.releaseYear}): ${err}`)
          dvdErrors++
          await sleep(TMDB_DELAY)
        }
      }

      if (posterUrl) {
        dvd.posterUrl = posterUrl
        dvd.posterSource = 'tmdb'
        cache[dvd.id] = { url: posterUrl, source: 'tmdb', resolvedAt: new Date().toISOString() }
        dvdResolved++
        console.log(`${prefix} ✓ tmdb: ${dvd.title} (${dvd.releaseYear ?? '?'})`)
      } else {
        cache[dvd.id] = { url: null, source: 'none', resolvedAt: new Date().toISOString() }
        dvdMissed++
        console.log(`${prefix} ✗ miss: ${dvd.title} (${dvd.releaseYear ?? '?'})`)
      }

      // Save cache every 50 items
      if ((i + 1) % 50 === 0) {
        saveCache(cache)
        console.log(`  (cache saved at ${i + 1})`)
      }
    }

    console.log(`\n  DVDs summary: ${dvdResolved} resolved, ${dvdMissed} missed, ${dvdCached} cached, ${dvdErrors} errors`)
  }

  // ── Write enriched data back ────────────────────────────────────────

  writeFileSync(CDS_PATH, JSON.stringify(cds, null, 2))
  writeFileSync(DVDS_PATH, JSON.stringify(dvds, null, 2))
  saveCache(cache)

  console.log('\nArtwork resolution complete.')
}

main()
