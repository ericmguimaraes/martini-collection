import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CdItem } from '@/types/cd'
import type { DvdItem } from '@/types/dvd'
import { pickFeaturedCds, pickFeaturedDvds } from '@/lib/featured'
import { getTagColor, getGenreColor } from '@/lib/colors'
import { useItunesArt } from '@/hooks/useItunesArt'

interface FeaturedPicksProps {
  cds: CdItem[]
  dvds: DvdItem[]
}

function CdPickCard({ cd, index }: { cd: CdItem; index: number }) {
  const artUrl = useItunesArt(cd.artist, cd.title)

  return (
    <Link
      to={`/cd/${cd.id}`}
      className="group flex flex-col rounded-xl border border-surface-light bg-surface overflow-hidden transition-all hover:border-amber/30 hover:shadow-lg hover:shadow-amber/5 animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="aspect-square bg-surface-hover flex items-center justify-center relative overflow-hidden">
        {artUrl ? (
          <img
            src={artUrl}
            alt={`${cd.artist} — ${cd.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-amber/10 to-copper/10" />
            <div className="relative text-center space-y-1 p-4">
              <p className="font-display text-lg text-foreground leading-tight line-clamp-2">{cd.title}</p>
              <p className="text-xs text-muted">{cd.artist}</p>
            </div>
          </>
        )}
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-sm text-foreground font-medium truncate group-hover:text-amber transition-colors">
          {cd.artist}
        </p>
        <p className="text-xs text-muted truncate italic">{cd.title}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {cd.tag && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] ${getTagColor(cd.tag)}`}>
              {cd.tag}
            </span>
          )}
          {cd.label && (
            <span className="font-mono text-[10px] text-muted-dark">{cd.label}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

function DvdPickCard({ dvd, index }: { dvd: DvdItem; index: number }) {
  return (
    <Link
      to={`/dvd/${dvd.id}`}
      className="group flex flex-col rounded-xl border border-surface-light bg-surface overflow-hidden transition-all hover:border-amber/30 hover:shadow-lg hover:shadow-amber/5 animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="aspect-square bg-surface-hover flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-copper/10 to-amber/5" />
        <div className="relative text-center space-y-2">
          {dvd.imdbRating && (
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-amber/40 bg-amber/10">
              <span className="font-mono text-sm text-amber font-bold">{dvd.imdbRating}</span>
            </div>
          )}
          <p className="font-display text-lg text-foreground leading-tight line-clamp-2">{dvd.title}</p>
          {dvd.releaseYear && <p className="font-mono text-xs text-muted-dark">{dvd.releaseYear}</p>}
        </div>
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-sm text-foreground font-medium truncate group-hover:text-amber transition-colors">
          {dvd.title}
        </p>
        <p className="text-xs text-muted truncate">{dvd.directors.join(', ')}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {dvd.genres.slice(0, 2).map(g => (
            <span key={g} className={`rounded-full px-2 py-0.5 text-[10px] ${getGenreColor(g)}`}>
              {g}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

function ShuffleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  )
}

export default function FeaturedPicks({ cds, dvds }: FeaturedPicksProps) {
  const [seed, setSeed] = useState(0)
  const featuredCds = useMemo(() => pickFeaturedCds(cds, 4), [cds, seed])
  const featuredDvds = useMemo(() => pickFeaturedDvds(dvds, 4), [dvds, seed])

  return (
    <section className="px-4">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl text-foreground">From the Collection</h2>
          <button
            onClick={() => setSeed(s => s + 1)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-muted border border-surface-light bg-surface hover:border-amber/30 hover:text-amber transition-all"
            title="Shuffle picks"
          >
            <ShuffleIcon />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" key={seed}>
          {featuredCds.map((cd, i) => (
            <CdPickCard key={cd.id} cd={cd} index={i} />
          ))}
          {featuredDvds.map((dvd, i) => (
            <DvdPickCard key={dvd.id} dvd={dvd} index={i + featuredCds.length} />
          ))}
        </div>
      </div>
    </section>
  )
}
