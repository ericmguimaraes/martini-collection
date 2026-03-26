import { Link } from 'react-router-dom'
import { ResponsivePie } from '@nivo/pie'
import { nivoTheme, chartColors } from '@/components/stats/ChartTheme'
import type { CollectionStats } from '@/types/stats'
import { useLanguage } from '@/i18n'

interface GenreBreakdownProps {
  stats: CollectionStats
}

export default function GenreBreakdown({ stats }: GenreBreakdownProps) {
  const { t } = useLanguage()

  const pieData = stats.cd.tagDistribution.slice(0, 8).map((t, i) => ({
    id: t.tag,
    label: t.tag,
    value: t.count,
    color: chartColors[i % chartColors.length],
  }))

  return (
    <section className="px-4">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-foreground">{t('home.musicByGenre')}</h2>
          <Link
            to="/insights"
            className="text-xs text-muted hover:text-amber transition-colors font-mono"
          >
            {t('home.fullBreakdown')}
          </Link>
        </div>

        <div className="rounded-xl border border-surface-light bg-surface p-4">
          <div style={{ height: 340 }}>
            <ResponsivePie
              data={pieData}
              margin={{ top: 20, right: 100, bottom: 20, left: 100 }}
              innerRadius={0.5}
              padAngle={1}
              cornerRadius={4}
              activeOuterRadiusOffset={6}
              colors={{ datum: 'data.color' }}
              borderWidth={0}
              theme={nivoTheme}
              arcLabelsTextColor="#f0e6d6"
              arcLabelsSkipAngle={15}
              arcLabel={d => `${d.value}`}
              arcLinkLabelsTextColor="#a09080"
              arcLinkLabelsColor={{ from: 'color' }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsThickness={2}
              animate={true}
              motionConfig="gentle"
              tooltip={({ datum }) => (
                <div className="rounded-lg bg-surface-light px-3 py-2 text-sm shadow-lg border border-surface-hover">
                  <span className="text-foreground font-medium">{datum.label}</span>
                  <span className="text-amber ml-2">{datum.value}</span>
                  <span className="text-muted-dark ml-1">
                    ({Math.round((datum.value / stats.totalCds) * 100)}%)
                  </span>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
