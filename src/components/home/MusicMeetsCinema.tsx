import { Link } from 'react-router-dom'
import type { CollectionStats } from '@/types/stats'

interface MusicMeetsCinemaProps {
  stats: CollectionStats
}

function BridgeCard({ composer }: { composer: { name: string; cdCount: number; dvdTitles: string[] } }) {
  return (
    <div className="rounded-xl border border-surface-light bg-surface overflow-hidden transition-all hover:border-amber/20 group">
      <div className="h-0.5 bg-gradient-to-r from-amber via-copper to-transparent" />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-lg text-foreground group-hover:text-amber transition-colors">
            {composer.name}
          </p>
          <div className="flex items-center gap-2 flex-none">
            <span className="font-mono text-[10px] text-amber bg-amber/10 rounded-full px-2 py-0.5">
              {composer.cdCount} {composer.cdCount === 1 ? 'CD' : 'CDs'}
            </span>
            <span className="font-mono text-[10px] text-copper bg-copper/10 rounded-full px-2 py-0.5">
              {composer.dvdTitles.length} {composer.dvdTitles.length === 1 ? 'DVD' : 'DVDs'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {composer.dvdTitles.slice(0, 5).map(title => (
            <span
              key={title}
              className="text-xs text-muted bg-surface-hover rounded-md px-2 py-1 leading-tight"
            >
              {title}
            </span>
          ))}
          {composer.dvdTitles.length > 5 && (
            <span className="text-xs text-muted-dark px-1 py-1">
              +{composer.dvdTitles.length - 5} more
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MusicMeetsCinema({ stats }: MusicMeetsCinemaProps) {
  // Show the top 4 most connected composers (sorted by DVD count descending)
  const topBridges = [...stats.deep.composerCrossovers]
    .sort((a, b) => b.dvdTitles.length - a.dvdTitles.length)
    .slice(0, 4)

  if (topBridges.length === 0) return null

  return (
    <section className="px-4">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex items-baseline justify-between">
          <div className="space-y-1">
            <h2 className="font-display text-2xl text-foreground">Music Meets Cinema</h2>
            <p className="text-xs text-muted-dark">Composers who bridge the CD and DVD collections</p>
          </div>
          <Link
            to="/insights"
            className="text-xs text-muted hover:text-amber transition-colors font-mono"
          >
            See all insights &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topBridges.map(composer => (
            <BridgeCard key={composer.name} composer={composer} />
          ))}
        </div>
      </div>
    </section>
  )
}
