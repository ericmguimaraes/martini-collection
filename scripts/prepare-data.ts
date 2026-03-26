/**
 * Build-time script: processes CSV exports into JSON for the React app.
 * Reads CD and DVD CSVs, extracts fields, builds search indices, computes stats.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { parse } from 'csv-parse/sync'

const ROOT = join(import.meta.dirname, '..')
const DATA_DIR = join(ROOT, 'src', 'data')
const CD_CSV = join(ROOT, 'resources', '20260325_Acervo CDs Martini.csv')
const DVD_CSV = join(ROOT, 'resources', '20260325_Acervo DVDs Martini.csv')

mkdirSync(DATA_DIR, { recursive: true })

// ── Helpers ──────────────────────────────────────────────────────────────

function parseCsv(path: string): Record<string, string>[] {
  const content = readFileSync(path, 'utf-8')
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
  })
}

function splitPipe(val: string): string[] {
  if (!val) return []
  return val.split('|').map(s => s.trim()).filter(Boolean)
}

function parseIntOrNull(val: string): number | null {
  const n = parseInt(val, 10)
  return isNaN(n) ? null : n
}

function parseFloatOrNull(val: string): number | null {
  const n = parseFloat(val)
  return isNaN(n) ? null : n
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function countMap<T extends string>(items: T[]): Map<T, number> {
  const m = new Map<T, number>()
  for (const item of items) {
    m.set(item, (m.get(item) || 0) + 1)
  }
  return m
}

function topN(map: Map<string, number>, n: number): { name: string; count: number }[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, count]) => ({ name, count }))
}

function topNKeyed(map: Map<string, number>, n: number, key: string): { [k: string]: string | number }[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([val, count]) => ({ [key]: val, count }))
}

// ── Process CDs ──────────────────────────────────────────────────────────

interface CdRow {
  id: string
  artist: string
  title: string
  genre: string
  genres: string[]
  label: string
  tag: string
  discs: number
  tracks: number
  length: string
  composer: string
  conductor: string
  releaseYear: number | null
  addedDate: string
  catNo: string
  _search: string
}

const cdRows = parseCsv(CD_CSV)
const cds: CdRow[] = cdRows.map((row, i) => {
  const artist = row['Artist'] || ''
  const title = row['Title'] || ''
  const genre = row['Genre'] || ''
  const genres = splitPipe(genre)
  const label = row['Label'] || ''
  const tag = (row['Tags'] || '').split(',').map(t => t.trim()).filter(Boolean)[0] || ''
  const composer = row['Composer'] || ''
  const conductor = row['Conductor'] || ''

  const searchParts = [artist, title, genre, tag, label, composer, conductor].filter(Boolean)

  return {
    id: `cd-${i}-${slugify(artist + ' ' + title).slice(0, 40)}`,
    artist,
    title,
    genre,
    genres,
    label,
    tag,
    discs: parseIntOrNull(row['Discs']) || 1,
    tracks: parseIntOrNull(row['Tracks']) || 0,
    length: row['Length'] || '',
    composer,
    conductor,
    releaseYear: parseIntOrNull(row['Release Year']) || parseIntOrNull(row['Original Release Year']),
    addedDate: row['Added Date'] || '',
    catNo: row['Cat No'] || '',
    _search: searchParts.join(' ').toLowerCase(),
  }
})

// ── Process DVDs ─────────────────────────────────────────────────────────

interface DvdRow {
  id: string
  title: string
  originalTitle: string
  sortTitle: string
  genres: string[]
  directors: string[]
  actors: string[]
  musicians: string[]
  releaseYear: number | null
  imdbRating: number | null
  imdbUrl: string
  country: string
  color: string
  language: string
  runtime: number | null
  plot: string
  studios: string
  tag: string
  addedDate: string
  _search: string
}

const dvdRows = parseCsv(DVD_CSV)
const dvds: DvdRow[] = dvdRows.map((row, i) => {
  const title = row['Title'] || ''
  const genres = splitPipe(row['Genres'] || '')
  const directors = splitPipe(row['Director'] || '')
  const actors = splitPipe(row['Actor'] || '')
  const musicians = splitPipe(row['Musician'] || '')
  const country = row['Country'] || ''
  const studios = row['Studios'] || ''
  const tag = (row['Tags'] || '').split(',').map(t => t.trim()).filter(Boolean)[0] || ''

  const searchParts = [
    title,
    row['Original Title'] || '',
    directors.join(' '),
    actors.join(' '),
    genres.join(' '),
    tag,
    country,
    studios,
  ].filter(Boolean)

  return {
    id: `dvd-${i}-${slugify(title).slice(0, 40)}`,
    title,
    originalTitle: row['Original Title'] || '',
    sortTitle: row['Sort Title'] || title,
    genres,
    directors,
    actors,
    musicians,
    releaseYear: parseIntOrNull(row['Release Year']),
    imdbRating: parseFloatOrNull(row['IMDb Rating']),
    imdbUrl: row['IMDb Url'] || '',
    country,
    color: row['Color'] || '',
    language: row['Language'] || '',
    runtime: parseIntOrNull(row['Runtime']),
    plot: row['Plot'] || '',
    studios,
    tag,
    addedDate: row['Added Date'] || '',
    _search: searchParts.join(' ').toLowerCase(),
  }
})

// ── Compute Stats ────────────────────────────────────────────────────────

// CD stats
const cdTagMap = countMap(cds.map(c => c.tag).filter(Boolean))
const cdGenreMap = new Map<string, number>()
for (const cd of cds) {
  for (const g of cd.genres) {
    cdGenreMap.set(g, (cdGenreMap.get(g) || 0) + 1)
  }
}
const cdArtistMap = countMap(cds.map(c => c.artist).filter(Boolean))
const cdLabelMap = countMap(cds.map(c => c.label).filter(Boolean))

// CD cataloging timeline (by month from Added Date)
const cdMonthMap = new Map<string, number>()
for (const cd of cds) {
  if (cd.addedDate) {
    const d = new Date(cd.addedDate)
    if (!isNaN(d.getTime())) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      cdMonthMap.set(key, (cdMonthMap.get(key) || 0) + 1)
    }
  }
}
const catalogingTimeline = [...cdMonthMap.entries()]
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([month, count]) => ({ month, count }))

// DVD stats
const dvdGenreMap = new Map<string, number>()
for (const dvd of dvds) {
  for (const g of dvd.genres) {
    dvdGenreMap.set(g, (dvdGenreMap.get(g) || 0) + 1)
  }
}
const dvdDirectorMap = new Map<string, number>()
for (const dvd of dvds) {
  for (const d of dvd.directors) {
    dvdDirectorMap.set(d, (dvdDirectorMap.get(d) || 0) + 1)
  }
}
const dvdActorMap = new Map<string, number>()
for (const dvd of dvds) {
  for (const a of dvd.actors) {
    dvdActorMap.set(a, (dvdActorMap.get(a) || 0) + 1)
  }
}

// DVDs by decade
const dvdDecadeMap = new Map<string, number>()
for (const dvd of dvds) {
  if (dvd.releaseYear) {
    const decade = `${Math.floor(dvd.releaseYear / 10) * 10}s`
    dvdDecadeMap.set(decade, (dvdDecadeMap.get(decade) || 0) + 1)
  }
}
const byDecade = [...dvdDecadeMap.entries()]
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([decade, count]) => ({ decade, count }))

// IMDb rating distribution (buckets: 5.0-5.4, 5.5-5.9, ... 9.0-9.4)
const ratingBuckets = new Map<string, number>()
const ratedDvds = dvds.filter(d => d.imdbRating !== null)
for (const dvd of ratedDvds) {
  const r = dvd.imdbRating!
  const bucket = `${Math.floor(r * 2) / 2}`
  ratingBuckets.set(bucket, (ratingBuckets.get(bucket) || 0) + 1)
}
const ratingDistribution = [...ratingBuckets.entries()]
  .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
  .map(([rating, count]) => ({ rating, count }))

const avgImdbRating = ratedDvds.length > 0
  ? Math.round((ratedDvds.reduce((s, d) => s + d.imdbRating!, 0) / ratedDvds.length) * 10) / 10
  : 0

// Country distribution
const dvdCountryMap = countMap(dvds.map(d => d.country).filter(Boolean))

// Color distribution
const dvdColorMap = countMap(dvds.map(d => d.color).filter(Boolean))

// Pre-1970 percentage
const pre1970 = dvds.filter(d => d.releaseYear && d.releaseYear < 1970).length
const prePct1970 = dvds.length > 0 ? Math.round((pre1970 / dvds.length) * 100) : 0

// Unique counts
const uniqueArtists = new Set(cds.map(c => c.artist).filter(Boolean)).size
const uniqueDirectors = new Set(dvds.flatMap(d => d.directors)).size
const uniqueLabels = new Set(cds.map(c => c.label).filter(Boolean)).size

// Cross-collection: music DVDs and shared artists
const musicDvds = dvds.filter(d =>
  d.tag === 'Música' || d.genres.some(g => g.toLowerCase().includes('music'))
)

const cdArtistSet = new Set(cds.map(c => c.artist.toLowerCase()).filter(Boolean))
const dvdArtistSet = new Set([
  ...dvds.flatMap(d => d.directors.map(n => n.toLowerCase())),
  ...dvds.flatMap(d => d.actors.map(n => n.toLowerCase())),
  ...dvds.flatMap(d => d.musicians.map(n => n.toLowerCase())),
])
const sharedArtists = [...cdArtistSet].filter(a => dvdArtistSet.has(a)).sort()

const stats = {
  totalCds: cds.length,
  totalDvds: dvds.length,
  uniqueArtists,
  uniqueDirectors,
  uniqueLabels,

  cd: {
    tagDistribution: topNKeyed(cdTagMap, 20, 'tag') as { tag: string; count: number }[],
    genreDistribution: topNKeyed(cdGenreMap, 30, 'genre') as { genre: string; count: number }[],
    topArtists: topN(cdArtistMap, 15),
    topLabels: topN(cdLabelMap, 15),
    catalogingTimeline,
  },

  dvd: {
    genreDistribution: topNKeyed(dvdGenreMap, 20, 'genre') as { genre: string; count: number }[],
    topDirectors: topN(dvdDirectorMap, 15),
    byDecade,
    ratingDistribution,
    countryDistribution: topNKeyed(dvdCountryMap, 15, 'country') as { country: string; count: number }[],
    colorDistribution: topNKeyed(dvdColorMap, 5, 'color') as { color: string; count: number }[],
    topActors: topN(dvdActorMap, 15),
    avgImdbRating,
    prePct1970,
  },

  cross: {
    musicDvdCount: musicDvds.length,
    sharedArtists,
  },
}

// ── Write output ─────────────────────────────────────────────────────────

writeFileSync(join(DATA_DIR, 'cds.json'), JSON.stringify(cds, null, 2))
writeFileSync(join(DATA_DIR, 'dvds.json'), JSON.stringify(dvds, null, 2))
writeFileSync(join(DATA_DIR, 'stats.json'), JSON.stringify(stats, null, 2))

console.log(`Prepared: ${cds.length} CDs, ${dvds.length} DVDs, stats computed.`)
console.log(`  CD tags: ${[...cdTagMap.entries()].map(([k, v]) => `${k}(${v})`).join(', ')}`)
console.log(`  DVD genres (top 5): ${topN(dvdGenreMap, 5).map(g => `${g.name}(${g.count})`).join(', ')}`)
console.log(`  Shared artists: ${sharedArtists.length}`)
console.log(`  Avg IMDb: ${avgImdbRating}`)
