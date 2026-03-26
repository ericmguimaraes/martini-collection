import type { CollectionStats } from '@/types/stats'

interface SpotlightStatsProps {
  stats: CollectionStats
}

interface StatCardProps {
  title: string
  value: string
  description: string
  accent?: string
}

function StatCard({ title, value, description, accent = 'text-amber' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-surface-light bg-surface p-5 space-y-2">
      <p className="text-xs font-mono text-muted uppercase tracking-wider">{title}</p>
      <p className={`font-display text-3xl ${accent}`}>{value}</p>
      <p className="text-sm text-muted">{description}</p>
    </div>
  )
}

export default function SpotlightStats({ stats }: SpotlightStatsProps) {
  const jazzPct = Math.round(
    ((stats.cd.tagDistribution.find(t => t.tag === 'Jazz')?.count ?? 0) / stats.totalCds) * 100
  )

  return (
    <section className="px-4">
      <div className="mx-auto max-w-4xl grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Jazz Heart"
          value={`${jazzPct}%`}
          description="of the CD collection is Jazz"
        />
        <StatCard
          title="Classic Cinema"
          value={`${stats.dvd.prePct1970}%`}
          description="of DVDs are pre-1970 classics"
          accent="text-copper"
        />
        <StatCard
          title="Curated Quality"
          value={stats.dvd.avgImdbRating.toFixed(1)}
          description="average IMDb rating"
        />
        <StatCard
          title="Shared Artists"
          value={String(stats.cross.sharedArtists.length)}
          description="artists bridge both collections"
          accent="text-copper"
        />
      </div>
    </section>
  )
}
