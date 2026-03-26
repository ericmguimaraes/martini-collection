import type { CollectionStats } from '@/types/stats'

interface SpotlightStatsProps {
  stats: CollectionStats
}

interface StatCardProps {
  title: string
  value: string
  description: string
  accent?: 'amber' | 'copper'
}

function StatCard({ title, value, description, accent = 'amber' }: StatCardProps) {
  const textColor = accent === 'amber' ? 'text-amber' : 'text-copper'
  const gradientFrom = accent === 'amber' ? 'from-amber' : 'from-copper'

  return (
    <div className="rounded-xl border border-surface-light bg-surface overflow-hidden transition-all hover:border-amber/20">
      <div className={`h-0.5 bg-gradient-to-r ${gradientFrom} to-transparent`} />
      <div className="p-5 space-y-2">
        <p className="text-xs font-mono text-muted uppercase tracking-wider">{title}</p>
        <p className={`font-display text-3xl ${textColor}`}>{value}</p>
        <p className="text-sm text-muted">{description}</p>
      </div>
    </div>
  )
}

export default function SpotlightStats({ stats }: SpotlightStatsProps) {
  // The collection's musical DNA: strongest genre co-occurrence
  const topCoOccurrence = stats.deep.cdGenreCoOccurrence[0]
  const topPairValue = topCoOccurrence?.value ?? 0

  // Quality consistency: min-max IMDb across decades (excluding tiny samples)
  const significantDecades = stats.deep.dvdRatingByDecade.filter(d => d.count >= 5)
  const minRating = Math.min(...significantDecades.map(d => d.avgRating))
  const maxRating = Math.max(...significantDecades.map(d => d.avgRating))
  const ratingRange = `${minRating.toFixed(1)}–${maxRating.toFixed(1)}`

  // Depth over breadth
  const singleAlbumTier = stats.deep.artistTiers.find(t => t.tier === '1 album')
  const deepArtists = stats.deep.artistTiers
    .filter(t => !['1 album', '2 albums', '3–5 albums'].includes(t.tier))
    .reduce((sum, t) => sum + t.count, 0)

  // Music meets cinema bridges
  const bridgeCount = stats.deep.composerCrossovers.length

  return (
    <section className="px-4">
      <div className="mx-auto max-w-4xl space-y-4">
        <h2 className="font-display text-2xl text-foreground">Collection at a Glance</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            title="Musical DNA"
            value={`${topPairValue}`}
            description={`CDs bridge ${topCoOccurrence?.source ?? 'Latin'} & ${topCoOccurrence?.target ?? 'MPB'} — the collection's heartbeat`}
          />
          <StatCard
            title="Quality Bar"
            value={ratingRange}
            description="avg IMDb across every decade — unwavering for 100 years of cinema"
            accent="copper"
          />
          <StatCard
            title="Deep, Not Broad"
            value={`${deepArtists}`}
            description={`artists with 6+ albums — ${singleAlbumTier?.count ?? 0} have just one`}
          />
          <StatCard
            title="Worlds Bridged"
            value={`${bridgeCount}`}
            description="composers connect CDs to DVDs — music meets cinema"
            accent="copper"
          />
        </div>
      </div>
    </section>
  )
}
