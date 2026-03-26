import { useMemo } from 'react'
import stats from '@/data/stats.json'
import type { CollectionStats } from '@/types/stats'
import { useLanguage } from '@/i18n'
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

const mpbCount = s.cd.tagDistribution.find(t => t.tag === 'Música Brasileira')?.count || 0
const classicalCount = s.cd.tagDistribution.find(t => t.tag === 'Música Clássica')?.count || 0

const cdTagKeys = ['Jazz', 'Música Brasileira', 'Rock', 'Classical', 'Pop', 'Blues', 'Latin']
const dvdGenreKeys = ['Drama', 'Romance', 'Comedy', 'Crime', 'Thriller', 'Music', 'Film-Noir']

export default function InsightsPage() {
  const { t } = useLanguage()

  const radarData = useMemo(() => [
    { dimension: t('insights.jazzDepth'), value: Math.round((jazzCount / s.totalCds) * 100) },
    { dimension: t('insights.brazilianMusic'), value: Math.round((mpbCount / s.totalCds) * 100) },
    { dimension: t('insights.classical'), value: Math.round((classicalCount / s.totalCds) * 100) },
    { dimension: t('insights.classicCinema'), value: s.dvd.prePct1970 },
    { dimension: t('insights.qualityBarRadar'), value: Math.round(s.dvd.avgImdbRating * 10) },
    { dimension: t('insights.international'), value: Math.round((1 - (s.dvd.countryDistribution.find(c => (c as Record<string, unknown>).country === 'USA')?.count || 0) / s.totalDvds) * 100) },
  ], [t])

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-4xl text-amber">{t('insights.title')}</h1>
          <p className="text-muted">{t('insights.subtitle')}</p>
        </div>

        {/* Overview Stats */}
        <RevealSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard label={t('insights.cds')} value={s.totalCds} />
            <StatCard label={t('insights.dvds')} value={s.totalDvds} />
            <StatCard label={t('insights.artists')} value={s.uniqueArtists} />
            <StatCard label={t('insights.directorsLabel')} value={s.uniqueDirectors} />
            <StatCard label={t('insights.labels')} value={s.uniqueLabels} />
          </div>
        </RevealSection>

        {/* CD Section */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-foreground border-b border-surface-light pb-2">
            {t('insights.cdCollection')}
          </h2>

          <RevealSection>
            <HorizontalBarChart
              title={t('insights.tags')}
              data={s.cd.tagDistribution.map(t => ({ label: t.tag, value: t.count }))}
            />
          </RevealSection>

          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <HorizontalBarChart
                title={t('insights.topGenres')}
                data={s.cd.genreDistribution.map(g => ({ label: g.genre, value: g.count }))}
                maxItems={12}
              />
              <TopList title={t('insights.topArtists')} data={s.cd.topArtists} />
            </div>
          </RevealSection>

          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TopList title={t('insights.topLabels')} data={s.cd.topLabels} />
              <LineChart
                title={t('insights.catalogingTimeline')}
                data={s.cd.catalogingTimeline.map(t => ({ x: t.month, y: t.count }))}
              />
            </div>
          </RevealSection>
        </div>

        {/* DVD Section */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-foreground border-b border-surface-light pb-2">
            {t('insights.dvdCollection')}
          </h2>

          <RevealSection>
            <HorizontalBarChart
              title={t('insights.genres')}
              data={s.dvd.genreDistribution.map(g => ({ label: g.genre, value: g.count }))}
            />
          </RevealSection>

          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TopList title={t('insights.topDirectors')} data={s.dvd.topDirectors} />
              <LineChart
                title={t('insights.dvdsByDecade')}
                data={s.dvd.byDecade.map(d => ({ x: d.decade, y: d.count }))}
                area
              />
            </div>
          </RevealSection>

          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BarChart
                title={t('insights.imdbRatingDistribution')}
                data={s.dvd.ratingDistribution.map(r => ({ label: r.rating, value: r.count }))}
                annotation={`avg ${s.dvd.avgImdbRating}`}
              />
              <PieChart
                title={t('insights.countryOfOrigin')}
                data={s.dvd.countryDistribution.slice(0, 8).map(c => ({ label: c.country, value: c.count }))}
                donut
              />
            </div>
          </RevealSection>

          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PieChart
                title={t('insights.colorVsBw')}
                data={s.dvd.colorDistribution.map(c => ({ label: c.color, value: c.count }))}
              />
              <TopList title={t('insights.topActors')} data={s.dvd.topActors} />
            </div>
          </RevealSection>
        </div>

        {/* Cross-Collection */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-foreground border-b border-surface-light pb-2">
            {t('insights.acrossCollections')}
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

        {/* Deep Analysis */}
        <div className="border-t border-amber/20 pt-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-display text-3xl text-amber">{t('insights.deepAnalysis')}</h2>
            <p className="text-muted">{t('insights.deepAnalysisSubtitle')}</p>
          </div>

          {/* Collection Patterns */}
          <div className="space-y-6">
            <h3 className="font-display text-xl text-foreground border-b border-surface-light pb-2">
              {t('insights.collectionPatterns')}
            </h3>

            <RevealSection>
              <HeatmapChart
                title={t('insights.cdGenreCoOccurrence')}
                data={s.deep.cdGenreCoOccurrence}
                annotation={t('insights.cdGenreCoOccurrenceAnnotation')}
              />
            </RevealSection>

            <RevealSection>
              <HeatmapChart
                title={t('insights.dvdGenreCoOccurrence')}
                data={s.deep.dvdGenreCoOccurrence}
                annotation={t('insights.dvdGenreCoOccurrenceAnnotation')}
              />
            </RevealSection>

            <RevealSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <HeatmapChart
                  title={t('insights.labelIdentity')}
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
                  annotation={t('insights.labelIdentityAnnotation')}
                />
                <BarChart
                  title={t('insights.artistDepth')}
                  data={s.deep.artistTiers.map(t => ({ label: t.tier, value: t.count }))}
                  annotation={`${s.uniqueArtists} ${t('insights.artists').toLowerCase()}`}
                />
              </div>
            </RevealSection>
          </div>

          {/* Through the Decades */}
          <div className="space-y-6">
            <h3 className="font-display text-xl text-foreground border-b border-surface-light pb-2">
              {t('insights.throughTheDecades')}
            </h3>

            <RevealSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BarChart
                  title={t('insights.cdsByDecade')}
                  data={s.deep.cdByDecade.map(d => ({ label: d.decade, value: d.count }))}
                  annotation={`${s.deep.cdReleaseYearCoverage}% ${t('insights.cds').toLowerCase()}`}
                />
                <LineChart
                  title={t('insights.imdbRatingByDecade')}
                  data={s.deep.dvdRatingByDecade.map(d => ({ x: d.decade, y: d.avgRating }))}
                />
              </div>
            </RevealSection>

            <RevealSection>
              <StackedBarChart
                title={t('insights.cdCollectionByDecade')}
                data={s.deep.cdTagByDecade}
                indexKey="decade"
                keys={cdTagKeys}
                annotation={t('insights.cdCollectionByDecadeAnnotation')}
              />
            </RevealSection>

            <RevealSection>
              <StackedBarChart
                title={t('insights.dvdCollectionByDecade')}
                data={s.deep.dvdGenreByDecade}
                indexKey="decade"
                keys={dvdGenreKeys}
                annotation={t('insights.dvdCollectionByDecadeAnnotation')}
              />
            </RevealSection>
          </div>

          {/* Music Meets Cinema */}
          <div className="space-y-6">
            <h3 className="font-display text-xl text-foreground border-b border-surface-light pb-2">
              {t('insights.musicMeetsCinema')}
            </h3>

            {s.deep.composerCrossovers.length > 0 && (
              <RevealSection>
                <div className="rounded-xl border border-surface-light bg-surface p-5 space-y-4">
                  <h3 className="font-display text-lg text-foreground">{t('insights.composersBridging')}</h3>
                  <p className="text-xs text-muted-dark">{t('insights.composersBridgingDesc')}</p>
                  <div className="space-y-3">
                    {s.deep.composerCrossovers.slice(0, 8).map(c => (
                      <div key={c.name} className="rounded-lg bg-surface-hover p-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-foreground font-medium">{c.name}</span>
                          <span className="text-xs text-muted-dark font-mono">{c.cdCount} CDs / {c.dvdTitles.length} DVDs</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {c.dvdTitles.slice(0, 6).map(title => (
                            <span key={title} className="text-xs text-amber/80 bg-amber/5 rounded px-1.5 py-0.5">{title}</span>
                          ))}
                          {c.dvdTitles.length > 6 && (
                            <span className="text-xs text-muted-dark">{t('common.more', { count: c.dvdTitles.length - 6 })}</span>
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
                  <h3 className="font-display text-lg text-foreground">{t('insights.artistsOnScreen')}</h3>
                  <p className="text-xs text-muted-dark">{t('insights.artistsOnScreenDesc')}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {s.deep.actorCrossovers.slice(0, 12).map(a => (
                      <div key={a.name} className="rounded-lg bg-surface-hover p-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-foreground font-medium text-sm">{a.name}</span>
                          <span className="text-xs text-muted-dark font-mono">{a.cdCount} CDs / {a.dvdTitles.length} DVDs</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {a.dvdTitles.slice(0, 3).map(title => (
                            <span key={title} className="text-xs text-amber/70 bg-amber/5 rounded px-1.5 py-0.5">{title}</span>
                          ))}
                          {a.dvdTitles.length > 3 && (
                            <span className="text-xs text-muted-dark">{t('common.more', { count: a.dvdTitles.length - 3 })}</span>
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
                  title={t('insights.musicDvdsByCategory')}
                  data={s.deep.musicDvdBreakdown.map(c => ({ label: c.category, value: c.count }))}
                  donut
                />
                <RadarChart
                  title={t('insights.collectorTasteFingerprint')}
                  data={radarData}
                />
              </div>
            </RevealSection>

            {s.deep.tagGenreBridge.length > 0 && (
              <RevealSection>
                <div className="rounded-xl border border-surface-light bg-surface p-5 space-y-4">
                  <h3 className="font-display text-lg text-foreground">{t('insights.musicToFilmGenreBridge')}</h3>
                  <p className="text-xs text-muted-dark">{t('insights.musicToFilmGenreBridgeDesc')}</p>
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
