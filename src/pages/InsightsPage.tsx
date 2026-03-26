import stats from '@/data/stats.json'
import type { CollectionStats } from '@/types/stats'
import StatCard from '@/components/stats/StatCard'
import HorizontalBarChart from '@/components/stats/HorizontalBarChart'
import BarChart from '@/components/stats/BarChart'
import LineChart from '@/components/stats/LineChart'
import PieChart from '@/components/stats/PieChart'
import TopList from '@/components/stats/TopList'
import CrossPatterns from '@/components/stats/CrossPatterns'
import CollectorProfile from '@/components/stats/CollectorProfile'
import RevealSection from '@/components/stats/RevealSection'

const s = stats as CollectionStats

const jazzCount = s.cd.tagDistribution.find(t => t.tag === 'Jazz')?.count || 0
const jazzPct = Math.round((jazzCount / s.totalCds) * 100)

export default function InsightsPage() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-4xl text-amber">Collection Insights</h1>
          <p className="text-muted">A data-driven look at the Martini Collection</p>
        </div>

        {/* Overview Stats */}
        <RevealSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard label="CDs" value={s.totalCds} />
            <StatCard label="DVDs" value={s.totalDvds} />
            <StatCard label="Artists" value={s.uniqueArtists} />
            <StatCard label="Directors" value={s.uniqueDirectors} />
            <StatCard label="Labels" value={s.uniqueLabels} />
          </div>
        </RevealSection>

        {/* CD Section */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-foreground border-b border-surface-light pb-2">
            CD Collection
          </h2>

          <RevealSection>
            <HorizontalBarChart
              title="Tags"
              data={s.cd.tagDistribution.map(t => ({ label: t.tag, value: t.count }))}
            />
          </RevealSection>

          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <HorizontalBarChart
                title="Top Genres"
                data={s.cd.genreDistribution.map(g => ({ label: g.genre, value: g.count }))}
                maxItems={12}
              />
              <TopList title="Top Artists" data={s.cd.topArtists} />
            </div>
          </RevealSection>

          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TopList title="Top Labels" data={s.cd.topLabels} />
              <LineChart
                title="Cataloging Timeline"
                data={s.cd.catalogingTimeline.map(t => ({ x: t.month, y: t.count }))}
              />
            </div>
          </RevealSection>
        </div>

        {/* DVD Section */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-foreground border-b border-surface-light pb-2">
            DVD Collection
          </h2>

          <RevealSection>
            <HorizontalBarChart
              title="Genres"
              data={s.dvd.genreDistribution.map(g => ({ label: g.genre, value: g.count }))}
            />
          </RevealSection>

          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TopList title="Top Directors" data={s.dvd.topDirectors} />
              <LineChart
                title="DVDs by Decade"
                data={s.dvd.byDecade.map(d => ({ x: d.decade, y: d.count }))}
                area
              />
            </div>
          </RevealSection>

          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BarChart
                title="IMDb Rating Distribution"
                data={s.dvd.ratingDistribution.map(r => ({ label: r.rating, value: r.count }))}
                annotation={`avg ${s.dvd.avgImdbRating}`}
              />
              <PieChart
                title="Country of Origin"
                data={s.dvd.countryDistribution.slice(0, 8).map(c => ({ label: c.country, value: c.count }))}
                donut
              />
            </div>
          </RevealSection>

          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PieChart
                title="Color vs B&W"
                data={s.dvd.colorDistribution.map(c => ({ label: c.color, value: c.count }))}
              />
              <TopList title="Top Actors" data={s.dvd.topActors} />
            </div>
          </RevealSection>
        </div>

        {/* Cross-Collection */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-foreground border-b border-surface-light pb-2">
            Across Collections
          </h2>

          <RevealSection>
            <CrossPatterns
              musicDvdCount={s.cross.musicDvdCount}
              sharedArtists={s.cross.sharedArtists}
            />
          </RevealSection>

          <RevealSection>
            <CollectorProfile
              totalCds={s.totalCds}
              totalDvds={s.totalDvds}
              jazzPct={jazzPct}
              prePct1970={s.dvd.prePct1970}
              avgRating={s.dvd.avgImdbRating}
            />
          </RevealSection>
        </div>
      </div>
    </div>
  )
}
