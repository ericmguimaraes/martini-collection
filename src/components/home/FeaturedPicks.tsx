import { useMemo } from 'react'
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

function CdPickCard({ cd }: { cd: CdItem }) {
  const artUrl = useItunesArt(cd.artist, cd.title)

  return (
    <Link
      to={`/cd/${cd.id}`}
      className="group flex flex-col rounded-xl border border-surface-light bg-surface overflow-hidden transition-all hover:border-amber/30 hover:shadow-lg hover:shadow-amber/5"
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

function DvdPickCard({ dvd }: { dvd: DvdItem }) {
  return (
    <Link
      to={`/dvd/${dvd.id}`}
      className="group flex flex-col rounded-xl border border-surface-light bg-surface overflow-hidden transition-all hover:border-amber/30 hover:shadow-lg hover:shadow-amber/5"
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

export default function FeaturedPicks({ cds, dvds }: FeaturedPicksProps) {
  const featuredCds = useMemo(() => pickFeaturedCds(cds, 3), [cds])
  const featuredDvds = useMemo(() => pickFeaturedDvds(dvds, 3), [dvds])

  return (
    <section className="px-4">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-2xl text-foreground">From the Collection</h2>
          <span className="text-xs text-muted-dark font-mono">refreshes each visit</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {featuredCds.map(cd => (
            <CdPickCard key={cd.id} cd={cd} />
          ))}
          {featuredDvds.map(dvd => (
            <DvdPickCard key={dvd.id} dvd={dvd} />
          ))}
        </div>
      </div>
    </section>
  )
}
