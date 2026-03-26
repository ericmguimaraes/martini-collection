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
import HeatmapChart from '@/components/stats/HeatmapChart'
import StackedBarChart from '@/components/stats/StackedBarChart'
import RadarChart from '@/components/stats/RadarChart'

const s = stats as CollectionStats

const jazzCount = s.cd.tagDistribution.find(t => t.tag === 'Jazz')?.count || 0
const jazzPct = Math.round((jazzCount / s.totalCds) * 100)

// Radar dimensions for collector taste fingerprint
const mpbCount = s.cd.tagDistribution.find(t => t.tag === 'Música Brasileira')?.count || 0
const classicalCount = s.cd.tagDistribution.find(t => t.tag === 'Música Clássica')?.count || 0
const radarData = [
  { dimension: 'Jazz Depth', value: Math.round((jazzCount / s.totalCds) * 100) },
  { dimension: 'Brazilian Music', value: Math.round((mpbCount / s.totalCds) * 100) },
  { dimension: 'Classical', value: Math.round((classicalCount / s.totalCds) * 100) },
  { dimension: 'Classic Cinema', value: s.dvd.prePct1970 },
  { dimension: 'Quality Bar', value: Math.round(s.dvd.avgImdbRating * 10) },
  { dimension: 'International', value: Math.round((1 - (s.dvd.countryDistribution.find(c => (c as Record<string, unknown>).country === 'USA')?.count || 0) / s.totalDvds) * 100) },
]

const cdTagKeys = ['Jazz', 'Música Brasileira', 'Rock', 'Classical', 'Pop', 'Blues', 'Latin']
const dvdGenreKeys = ['Drama', 'Romance', 'Comedy', 'Crime', 'Thriller', 'Music', 'Film-Noir']

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

        {/* ── Deep Analysis ─────────────────────────────────────────── */}
        <div className="border-t border-amber/20 pt-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-display text-3xl text-amber">Deep Analysis</h2>
            <p className="text-muted">Patterns, evolution, and connections beneath the surface</p>
          </div>

          {/* Collection Patterns */}
          <div className="space-y-6">
            <h3 className="font-display text-xl text-foreground border-b border-surface-light pb-2">
              Collection Patterns
            </h3>

            <RevealSection>
              <HeatmapChart
                title="CD Genre Co-occurrence"
                data={s.deep.cdGenreCoOccurrence}
                annotation="Which genres appear together on the same CDs"
              />
            </RevealSection>

            <RevealSection>
              <HeatmapChart
                title="DVD Genre Co-occurrence"
                data={s.deep.dvdGenreCoOccurrence}
                annotation="Which genres pair together in films"
              />
            </RevealSection>

            <RevealSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <HeatmapChart
                  title="Label Identity"
                  data={(() => {
                    const pairs: { source: string; target: string; value: number }[] = []
                    for (const row of s.deep.labelGenreAffinity) {
                      const label = row.label as string
                      for (const [key, val] of Object.entries(row)) {
                        if (key !== 'label' && key !== 'total' && typeof val === 'number' && val > 0) {
                          pairs.push({ source: label, target: key, value: val })
                        }
                      }
                    }
                    return pairs
                  })()}
                  annotation="% of each label's catalog by tag"
                />
                <BarChart
                  title="Artist Depth"
                  data={s.deep.artistTiers.map(t => ({ label: t.tier, value: t.count }))}
                  annotation={`${s.uniqueArtists} unique artists`}
                />
              </div>
            </RevealSection>
          </div>

          {/* Through the Decades */}
          <div className="space-y-6">
            <h3 className="font-display text-xl text-foreground border-b border-surface-light pb-2">
              Through the Decades
            </h3>

            <RevealSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BarChart
                  title="CDs by Decade"
                  data={s.deep.cdByDecade.map(d => ({ label: d.decade, value: d.count }))}
                  annotation={`${s.deep.cdReleaseYearCoverage}% of CDs have release year`}
                />
                <LineChart
                  title="IMDb Rating by Decade"
                  data={s.deep.dvdRatingByDecade.map(d => ({ x: d.decade, y: d.avgRating }))}
                />
              </div>
            </RevealSection>

            <RevealSection>
              <StackedBarChart
                title="CD Collection by Decade"
                data={s.deep.cdTagByDecade}
                indexKey="decade"
                keys={cdTagKeys}
                annotation="How the musical taste spans across decades"
              />
            </RevealSection>

            <RevealSection>
              <StackedBarChart
                title="DVD Collection by Decade"
                data={s.deep.dvdGenreByDecade}
                indexKey="decade"
                keys={dvdGenreKeys}
                annotation="Genre evolution in cinema across decades"
              />
            </RevealSection>
          </div>

          {/* Music Meets Cinema */}
          <div className="space-y-6">
            <h3 className="font-display text-xl text-foreground border-b border-surface-light pb-2">
              Music Meets Cinema
            </h3>

            {s.deep.composerCrossovers.length > 0 && (
              <RevealSection>
                <div className="rounded-xl border border-surface-light bg-surface p-5 space-y-4">
                  <h3 className="font-display text-lg text-foreground">Composers Bridging Both Worlds</h3>
                  <p className="text-xs text-muted-dark">CD artists who also appear as musicians/composers in DVDs</p>
                  <div className="space-y-3">
                    {s.deep.composerCrossovers.slice(0, 8).map(c => (
                      <div key={c.name} className="rounded-lg bg-surface-hover p-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-foreground font-medium">{c.name}</span>
                          <span className="text-xs text-muted-dark font-mono">{c.cdCount} CDs / {c.dvdTitles.length} DVDs</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {c.dvdTitles.slice(0, 6).map(t => (
                            <span key={t} className="text-xs text-amber/80 bg-amber/5 rounded px-1.5 py-0.5">{t}</span>
                          ))}
                          {c.dvdTitles.length > 6 && (
                            <span className="text-xs text-muted-dark">+{c.dvdTitles.length - 6} more</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealSection>
            )}

            {s.deep.actorCrossovers.length > 0 && (
              <RevealSection>
                <div className="rounded-xl border border-surface-light bg-surface p-5 space-y-4">
                  <h3 className="font-display text-lg text-foreground">Artists on Screen</h3>
                  <p className="text-xs text-muted-dark">CD artists who appear as actors in DVDs</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {s.deep.actorCrossovers.slice(0, 12).map(a => (
                      <div key={a.name} className="rounded-lg bg-surface-hover p-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-foreground font-medium text-sm">{a.name}</span>
                          <span className="text-xs text-muted-dark font-mono">{a.cdCount} CDs / {a.dvdTitles.length} DVDs</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {a.dvdTitles.slice(0, 3).map(t => (
                            <span key={t} className="text-xs text-amber/70 bg-amber/5 rounded px-1.5 py-0.5">{t}</span>
                          ))}
                          {a.dvdTitles.length > 3 && (
                            <span className="text-xs text-muted-dark">+{a.dvdTitles.length - 3}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealSection>
            )}

            <RevealSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <PieChart
                  title="Music DVDs by Category"
                  data={s.deep.musicDvdBreakdown.map(c => ({ label: c.category, value: c.count }))}
                  donut
                />
                <RadarChart
                  title="Collector Taste Fingerprint"
                  data={radarData}
                />
              </div>
            </RevealSection>

            {s.deep.tagGenreBridge.length > 0 && (
              <RevealSection>
                <div className="rounded-xl border border-surface-light bg-surface p-5 space-y-4">
                  <h3 className="font-display text-lg text-foreground">Music-to-Film Genre Bridge</h3>
                  <p className="text-xs text-muted-dark">When shared artists cross from music to film, which genres connect?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {s.deep.tagGenreBridge.map(bridge => (
                      <div key={bridge.cdTag} className="rounded-lg bg-surface-hover p-3 space-y-2">
                        <span className="text-amber font-medium text-sm">{bridge.cdTag}</span>
                        <div className="space-y-1">
                          {bridge.dvdGenres.slice(0, 5).map(g => (
                            <div key={g.genre} className="flex items-center gap-2">
                              <div
                                className="h-1.5 rounded-full bg-amber/60"
                                style={{ width: `${Math.min(100, g.count * 15)}%` }}
                              />
                              <span className="text-xs text-muted whitespace-nowrap">{g.genre} ({g.count})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealSection>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
