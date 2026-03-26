import { HashRouter, Routes, Route } from 'react-router-dom'
import stats from '@/data/stats.json'
import cds from '@/data/cds.json'
import dvds from '@/data/dvds.json'
import type { CollectionStats } from '@/types/stats'
import type { CdItem } from '@/types/cd'
import type { DvdItem } from '@/types/dvd'

const s = stats as CollectionStats
const cdData = cds as CdItem[]
const dvdData = dvds as DvdItem[]

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-surface px-4 py-3 text-center">
      <p className="font-display text-2xl text-foreground">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  )
}

function HomePage() {
  const sampleCds = cdData.slice(0, 5)
  const sampleDvds = dvdData.filter(d => d.imdbRating && d.imdbRating >= 8).slice(0, 5)

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Hero */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-24 w-24 rounded-full bg-surface flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-amber/20 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-amber" />
            </div>
          </div>
          <h1 className="font-display text-4xl text-amber">The Martini Collection</h1>
          <p className="text-muted text-lg">A curated collection of music and cinema</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatPill label="CDs" value={s.totalCds.toLocaleString()} />
          <StatPill label="DVDs" value={s.totalDvds.toLocaleString()} />
          <StatPill label="Artists" value={s.uniqueArtists.toLocaleString()} />
          <StatPill label="Directors" value={s.uniqueDirectors} />
        </div>

        {/* CD Tag Distribution */}
        <div className="space-y-3">
          <h2 className="font-display text-xl text-foreground">CD Collection by Tag</h2>
          <div className="space-y-2">
            {s.cd.tagDistribution.map(t => (
              <div key={t.tag} className="flex items-center gap-3">
                <span className="w-36 text-sm text-muted truncate">{t.tag}</span>
                <div className="flex-1 h-5 rounded bg-surface overflow-hidden">
                  <div
                    className="h-full rounded bg-amber/60"
                    style={{ width: `${(t.count / s.totalCds) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right font-mono text-xs text-muted">{t.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DVD Highlights */}
        <div className="space-y-3">
          <h2 className="font-display text-xl text-foreground">
            DVD Highlights
            <span className="ml-2 text-sm text-muted font-sans">avg IMDb {s.dvd.avgImdbRating} · {s.dvd.prePct1970}% pre-1970</span>
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {s.dvd.topDirectors.slice(0, 6).map(d => (
              <div key={d.name} className="rounded-lg bg-surface px-3 py-2">
                <p className="text-sm text-foreground truncate">{d.name}</p>
                <p className="font-mono text-xs text-muted">{d.count} films</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sample CDs */}
        <div className="space-y-3">
          <h2 className="font-display text-xl text-foreground">Sample CDs</h2>
          <div className="space-y-1">
            {sampleCds.map(cd => (
              <div key={cd.id} className="flex items-baseline gap-2 text-sm">
                <span className="text-foreground">{cd.artist}</span>
                <span className="text-muted">—</span>
                <span className="text-muted italic truncate">{cd.title}</span>
                {cd.label && <span className="font-mono text-xs text-amber/60">{cd.label}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Sample DVDs */}
        <div className="space-y-3">
          <h2 className="font-display text-xl text-foreground">Top Rated DVDs</h2>
          <div className="space-y-1">
            {sampleDvds.map(dvd => (
              <div key={dvd.id} className="flex items-baseline gap-2 text-sm">
                <span className="rounded bg-amber/20 px-1.5 py-0.5 font-mono text-xs text-amber">{dvd.imdbRating}</span>
                <span className="text-foreground truncate">{dvd.title}</span>
                <span className="text-muted text-xs">{dvd.directors.join(', ')}</span>
                {dvd.releaseYear && <span className="font-mono text-xs text-muted-dark">{dvd.releaseYear}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Cross-collection */}
        <div className="rounded-lg border border-amber/20 bg-surface p-4 text-center space-y-2">
          <p className="text-sm text-muted">Cross-Collection</p>
          <p className="text-foreground">
            <span className="font-display text-xl text-amber">{s.cross.sharedArtists.length}</span>
            <span className="text-muted ml-2">artists appear in both CD and DVD collections</span>
          </p>
          <p className="text-foreground">
            <span className="font-display text-xl text-amber">{s.cross.musicDvdCount}</span>
            <span className="text-muted ml-2">music DVDs bridge both collections</span>
          </p>
        </div>

        <p className="text-center font-mono text-xs text-muted-dark">
          Phase 2 — Data pipeline complete · Full site coming soon
        </p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={
          <div className="flex min-h-screen items-center justify-center">
            <h1 className="font-display text-4xl text-amber">404 — Not Found</h1>
          </div>
        } />
      </Routes>
    </HashRouter>
  )
}
