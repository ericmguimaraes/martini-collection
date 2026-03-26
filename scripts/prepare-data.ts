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

// ── Deep Stats ──────────────────────────────────────────────────────────

function computeCoOccurrence(items: { genres: string[] }[], limit: number) {
  const pairs = new Map<string, number>()
  for (const item of items) {
    const g = item.genres
    if (g.length < 2) continue
    for (let i = 0; i < g.length; i++) {
      for (let j = i + 1; j < g.length; j++) {
        const [a, b] = [g[i], g[j]].sort()
        const key = `${a}|||${b}`
        pairs.set(key, (pairs.get(key) || 0) + 1)
      }
    }
  }
  return [...pairs.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, value]) => {
      const [source, target] = key.split('|||')
      return { source, target, value }
    })
}

const cdGenreCoOccurrence = computeCoOccurrence(cds, 30)
const dvdGenreCoOccurrence = computeCoOccurrence(dvds, 30)

const topLabelNames = topN(cdLabelMap, 15).map(l => l.name)
const labelGenreAffinity = topLabelNames.map(label => {
  const labelCds = cds.filter(c => c.label === label)
  const tagCounts = countMap(labelCds.map(c => c.tag).filter(Boolean))
  const total = labelCds.length
  const row: Record<string, string | number> = { label, total }
  for (const [tag, count] of tagCounts) {
    row[tag] = Math.round((count / total) * 100)
  }
  return row
})

const tierBuckets = [
  { tier: '1 album', min: 1, max: 1 },
  { tier: '2-3 albums', min: 2, max: 3 },
  { tier: '4-6 albums', min: 4, max: 6 },
  { tier: '7-10 albums', min: 7, max: 10 },
  { tier: '11+ albums', min: 11, max: Infinity },
]
const artistTiers = tierBuckets.map(({ tier, min, max }) => ({
  tier,
  count: [...cdArtistMap.values()].filter(v => v >= min && v <= max).length,
}))

const cdDecadeMap = new Map<string, number>()
let cdsWithYear = 0
for (const cd of cds) {
  if (cd.releaseYear) {
    cdsWithYear++
    const decade = `${Math.floor(cd.releaseYear / 10) * 10}s`
    cdDecadeMap.set(decade, (cdDecadeMap.get(decade) || 0) + 1)
  }
}
const cdByDecade = [...cdDecadeMap.entries()]
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([decade, count]) => ({ decade, count }))
const cdReleaseYearCoverage = Math.round((cdsWithYear / cds.length) * 100)

const topTags = ['Jazz', 'Música Brasileira', 'Rock', 'Classical', 'Pop', 'Blues', 'Latin']
const cdTagByDecade: Record<string, string | number>[] = []
for (const [decade] of [...cdDecadeMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const decadeCds = cds.filter(c => c.releaseYear && `${Math.floor(c.releaseYear / 10) * 10}s` === decade)
  const row: Record<string, string | number> = { decade }
  for (const tag of topTags) { row[tag] = decadeCds.filter(c => c.tag === tag).length }
  cdTagByDecade.push(row)
}

const topDvdGenres = ['Drama', 'Romance', 'Comedy', 'Crime', 'Thriller', 'Music', 'Film-Noir']
const dvdGenreByDecade: Record<string, string | number>[] = []
for (const [decade] of [...dvdDecadeMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const decadeDvds = dvds.filter(d => d.releaseYear && `${Math.floor(d.releaseYear / 10) * 10}s` === decade)
  const row: Record<string, string | number> = { decade }
  for (const genre of topDvdGenres) { row[genre] = decadeDvds.filter(d => d.genres.includes(genre)).length }
  dvdGenreByDecade.push(row)
}

const dvdRatingByDecade: { decade: string; avgRating: number; count: number }[] = []
for (const [decade] of [...dvdDecadeMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const decadeRated = dvds.filter(d =>
    d.releaseYear && `${Math.floor(d.releaseYear / 10) * 10}s` === decade && d.imdbRating !== null
  )
  if (decadeRated.length > 0) {
    const avg = decadeRated.reduce((s, d) => s + d.imdbRating!, 0) / decadeRated.length
    dvdRatingByDecade.push({ decade, avgRating: Math.round(avg * 10) / 10, count: decadeRated.length })
  }
}

const composerCrossovers: { name: string; cdCount: number; dvdTitles: string[] }[] = []
const actorCrossovers: { name: string; cdCount: number; dvdTitles: string[] }[] = []
for (const artist of cdArtistSet) {
  if (!artist) continue
  const cdCount = cdArtistMap.get(cds.find(c => c.artist.toLowerCase() === artist)?.artist || '') || 0
  const musicianDvds = dvds.filter(d => d.musicians.some(m => m.toLowerCase() === artist))
  if (musicianDvds.length > 0) {
    composerCrossovers.push({
      name: musicianDvds[0].musicians.find(m => m.toLowerCase() === artist) || artist,
      cdCount, dvdTitles: musicianDvds.map(d => d.title),
    })
  }
  const actorDvds = dvds.filter(d => d.actors.some(a => a.toLowerCase() === artist))
  if (actorDvds.length > 0) {
    actorCrossovers.push({
      name: actorDvds[0].actors.find(a => a.toLowerCase() === artist) || artist,
      cdCount, dvdTitles: actorDvds.map(d => d.title),
    })
  }
}
composerCrossovers.sort((a, b) => b.dvdTitles.length - a.dvdTitles.length || b.cdCount - a.cdCount)
actorCrossovers.sort((a, b) => b.dvdTitles.length - a.dvdTitles.length || b.cdCount - a.cdCount)

const tagGenreBridge: { cdTag: string; dvdGenres: { genre: string; count: number }[] }[] = []
const tagGenreTemp = new Map<string, Map<string, number>>()
for (const artist of sharedArtists) {
  const cd = cds.find(c => c.artist.toLowerCase() === artist)
  if (!cd || !cd.tag) continue
  const artistDvds = dvds.filter(d =>
    d.directors.some(n => n.toLowerCase() === artist) ||
    d.actors.some(n => n.toLowerCase() === artist) ||
    d.musicians.some(n => n.toLowerCase() === artist)
  )
  if (!tagGenreTemp.has(cd.tag)) tagGenreTemp.set(cd.tag, new Map())
  const genreMap = tagGenreTemp.get(cd.tag)!
  for (const dvd of artistDvds) { for (const genre of dvd.genres) { genreMap.set(genre, (genreMap.get(genre) || 0) + 1) } }
}
for (const [cdTag, genreMap] of tagGenreTemp) {
  tagGenreBridge.push({
    cdTag,
    dvdGenres: [...genreMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([genre, count]) => ({ genre, count })),
  })
}
tagGenreBridge.sort((a, b) => b.dvdGenres.reduce((s, g) => s + g.count, 0) - a.dvdGenres.reduce((s, g) => s + g.count, 0))

const musicDvdCategories = new Map<string, number>()
for (const dvd of musicDvds) {
  let category = 'Other'
  const genreLower = dvd.genres.map(g => g.toLowerCase()).join(' ')
  const plotLower = (dvd.plot || '').toLowerCase()
  const titleLower = dvd.title.toLowerCase()
  if (genreLower.includes('documentary') || plotLower.includes('documentary')) category = 'Documentary'
  else if (genreLower.includes('musical') || plotLower.includes('musical')) category = 'Musical'
  else if (plotLower.includes('concert') || plotLower.includes('live') || titleLower.includes('live')) category = 'Concert / Live'
  else if (plotLower.includes('biograph') || plotLower.includes('life of') || plotLower.includes('story of')) category = 'Biopic'
  else if (genreLower.includes('music')) category = 'Music Film'
  musicDvdCategories.set(category, (musicDvdCategories.get(category) || 0) + 1)
}
const musicDvdBreakdown = [...musicDvdCategories.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([category, count]) => ({ category, count }))

// ── Assemble Stats ──────────────────────────────────────────────────────

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

  deep: {
    cdGenreCoOccurrence, dvdGenreCoOccurrence, labelGenreAffinity, artistTiers,
    cdByDecade, cdReleaseYearCoverage, cdTagByDecade, dvdGenreByDecade, dvdRatingByDecade,
    composerCrossovers, actorCrossovers, tagGenreBridge, musicDvdBreakdown,
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
console.log(`  Deep: ${cdGenreCoOccurrence.length} CD pairs, ${composerCrossovers.length} composer crossovers`)
