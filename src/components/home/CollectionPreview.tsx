import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { CdItem } from '@/types/cd'
import type { DvdItem } from '@/types/dvd'
import { pickLatestAdditions } from '@/lib/featured'
import { getTagColor, getGenreColor } from '@/lib/colors'
import { useItunesArt } from '@/hooks/useItunesArt'

interface CollectionPreviewProps {
  cds: CdItem[]
  dvds: DvdItem[]
}

function isCd(item: CdItem | DvdItem): item is CdItem {
  return 'artist' in item
}

function CdPreviewCard({ item }: { item: CdItem }) {
  const artUrl = useItunesArt(item.artist, item.title)

  return (
    <Link
      to={`/cd/${item.id}`}
      className="group flex-none w-36 sm:w-44 rounded-lg border border-surface-light bg-surface overflow-hidden transition-all hover:border-amber/30"
    >
      <div className="aspect-square bg-surface-hover flex items-center justify-center relative overflow-hidden">
        {artUrl ? (
          <img
            src={artUrl}
            alt={`${item.artist} — ${item.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-amber/5 to-transparent" />
            <div className="relative text-center p-3">
              <p className="font-display text-sm text-foreground leading-tight line-clamp-2">{item.title}</p>
              <p className="text-[10px] text-muted mt-1">{item.artist}</p>
            </div>
          </>
        )}
      </div>
      <div className="p-2 space-y-1">
        <p className="text-xs text-foreground truncate group-hover:text-amber transition-colors">{item.artist}</p>
        {item.tag && (
          <span className={`inline-block rounded-full px-1.5 py-0.5 text-[9px] ${getTagColor(item.tag)}`}>
            {item.tag}
          </span>
        )}
      </div>
    </Link>
  )
}

function DvdPreviewCard({ item }: { item: DvdItem }) {
  return (
    <Link
      to={`/dvd/${item.id}`}
      className="group flex-none w-36 sm:w-44 rounded-lg border border-surface-light bg-surface overflow-hidden transition-all hover:border-amber/30"
    >
      <div className="aspect-square bg-surface-hover flex flex-col items-center justify-center p-3 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-copper/5 to-transparent" />
        <div className="relative text-center space-y-1">
          {item.imdbRating && (
            <span className="inline-block font-mono text-xs text-amber bg-amber/10 rounded-full px-1.5 py-0.5">
              {item.imdbRating}
            </span>
          )}
          <p className="font-display text-sm text-foreground leading-tight line-clamp-2">{item.title}</p>
          {item.releaseYear && <p className="font-mono text-[10px] text-muted-dark">{item.releaseYear}</p>}
        </div>
      </div>
      <div className="p-2 space-y-1">
        <p className="text-xs text-foreground truncate group-hover:text-amber transition-colors">{item.directors.join(', ')}</p>
        {item.genres[0] && (
          <span className={`inline-block rounded-full px-1.5 py-0.5 text-[9px] ${getGenreColor(item.genres[0])}`}>
            {item.genres[0]}
          </span>
        )}
      </div>
    </Link>
  )
}

function PreviewCard({ item }: { item: CdItem | DvdItem }) {
  if (isCd(item)) return <CdPreviewCard item={item} />
  return <DvdPreviewCard item={item} />
}

export default function CollectionPreview({ cds, dvds }: CollectionPreviewProps) {
  const latest = useMemo(() => pickLatestAdditions(cds, dvds, 8), [cds, dvds])

  return (
    <section className="px-4">
      <div className="mx-auto max-w-4xl space-y-4">
        <h2 className="font-display text-2xl text-foreground">Latest Additions</h2>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {latest.map(item => (
            <PreviewCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
