import { ResponsiveBar } from '@nivo/bar'
import { nivoTheme, AMBER } from './ChartTheme'

interface BarChartProps {
  data: { label: string; value: number }[]
  title: string
  annotation?: string
  maxItems?: number
}

export default function BarChart({ data, title, annotation, maxItems = 15 }: BarChartProps) {
  const chartData = data.slice(0, maxItems).map(d => ({
    id: d.label,
    label: d.label,
    value: d.value,
  }))

  return (
    <div className="rounded-xl border border-surface-light bg-surface p-4 space-y-3">
      <div className="flex items-baseline gap-3">
        <h3 className="font-display text-lg text-foreground">{title}</h3>
        {annotation && <span className="text-xs text-muted-dark font-mono">{annotation}</span>}
      </div>
      <div style={{ height: 300 }}>
        <ResponsiveBar
          data={chartData}
          keys={['value']}
          indexBy="id"
          margin={{ top: 10, right: 10, bottom: 50, left: 40 }}
          padding={0.3}
          colors={[AMBER]}
          borderRadius={4}
          theme={nivoTheme}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: -35,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
          }}
          enableGridX={false}
          enableLabel={false}
          animate={true}
          motionConfig="gentle"
          tooltip={({ indexValue, value }) => (
            <div className="rounded-lg bg-surface-light px-3 py-2 text-sm shadow-lg border border-surface-hover">
              <span className="text-foreground font-medium">{indexValue}</span>
              <span className="text-amber ml-2">{value}</span>
            </div>
          )}
        />
      </div>
    </div>
  )
}
