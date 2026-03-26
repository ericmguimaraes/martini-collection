import { Link } from 'react-router-dom'
import type { DvdItem } from '@/types/dvd'
import { getGenreColor } from '@/lib/colors'

export default function DvdCard({ dvd }: { dvd: DvdItem }) {
  return (
    <Link
      to={`/dvd/${dvd.id}`}
      className="group flex flex-col rounded-xl border border-surface-light bg-surface overflow-hidden transition-all hover:border-amber/30 hover:shadow-lg hover:shadow-amber/5"
    >
      <div className="aspect-[3/4] bg-surface-hover flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-copper/10 to-amber/5" />
        <div className="relative text-center space-y-2">
          {dvd.imdbRating && (
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-amber/40 bg-amber/10">
              <span className="font-mono text-sm text-amber font-bold">{dvd.imdbRating}</span>
            </div>
          )}
          <p className="font-display text-base text-foreground leading-tight line-clamp-3">{dvd.title}</p>
          {dvd.releaseYear && (
            <p className="font-mono text-xs text-muted-dark">{dvd.releaseYear}</p>
          )}
        </div>
      </div>
      <div className="p-3 space-y-1">
        <p className="text-sm text-foreground font-medium truncate group-hover:text-amber transition-colors">
          {dvd.directors.join(', ')}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {dvd.genres.slice(0, 2).map(g => (
            <span key={g} className={`rounded-full px-1.5 py-0.5 text-[9px] ${getGenreColor(g)}`}>
              {g}
            </span>
          ))}
          {dvd.country && (
            <span className="font-mono text-[10px] text-muted-dark">{dvd.country}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
