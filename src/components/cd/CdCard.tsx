import { Link } from 'react-router-dom'
import type { CdItem } from '@/types/cd'
import { useCdArtwork } from '@/hooks/useArtwork'
import { getTagColor } from '@/lib/colors'

export default function CdCard({ cd }: { cd: CdItem }) {
  const artUrl = useCdArtwork(cd)

  return (
    <Link
      to={`/cd/${cd.id}`}
      className="group flex flex-col rounded-xl border border-surface-light bg-surface overflow-hidden transition-all hover:border-amber/30 hover:shadow-lg hover:shadow-amber/5"
    >
      <div className="aspect-square bg-surface-hover relative overflow-hidden">
        {artUrl ? (
          <img
            src={artUrl}
            alt={`${cd.artist} — ${cd.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-3">
            <div className="absolute inset-0 bg-gradient-to-br from-amber/10 to-copper/10" />
            <div className="relative text-center space-y-1">
              <p className="font-display text-sm text-foreground leading-tight line-clamp-2">{cd.title}</p>
              <p className="text-[10px] text-muted">{cd.artist}</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-3 space-y-1">
        <p className="text-sm text-foreground font-medium truncate group-hover:text-amber transition-colors">
          {cd.artist}
        </p>
        <p className="text-xs text-muted truncate italic">{cd.title}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {cd.tag && (
            <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${getTagColor(cd.tag)}`}>
              {cd.tag}
            </span>
          )}
          {cd.releaseYear && (
            <span className="font-mono text-[10px] text-muted-dark">{cd.releaseYear}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
