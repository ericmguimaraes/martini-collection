import { ResponsivePie } from '@nivo/pie'
import { nivoTheme, chartColors } from './ChartTheme'

interface PieChartProps {
  data: { label: string; value: number }[]
  title: string
  donut?: boolean
}

export default function PieChart({ data, title, donut = false }: PieChartProps) {
  const pieData = data.map((d, i) => ({
    id: d.label,
    label: d.label,
    value: d.value,
    color: chartColors[i % chartColors.length],
  }))

  return (
    <div className="rounded-xl border border-surface-light bg-surface p-4 space-y-3">
      <h3 className="font-display text-lg text-foreground">{title}</h3>
      <div style={{ height: 300 }}>
        <ResponsivePie
          data={pieData}
          margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
          innerRadius={donut ? 0.5 : 0}
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
              <span className="text-muted-dark ml-1">({Math.round((datum.value / data.reduce((s, d) => s + d.value, 0)) * 100)}%)</span>
            </div>
          )}
        />
      </div>
    </div>
  )
}
