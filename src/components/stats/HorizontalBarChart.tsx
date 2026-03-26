import { ResponsiveBar } from '@nivo/bar'
import { nivoTheme, AMBER } from './ChartTheme'

interface HorizontalBarChartProps {
  data: { label: string; value: number }[]
  title: string
  maxItems?: number
}

export default function HorizontalBarChart({ data, title, maxItems = 15 }: HorizontalBarChartProps) {
  const chartData = data
    .slice(0, maxItems)
    .map(d => ({ id: d.label, label: d.label, value: d.value }))
    .reverse()

  return (
    <div className="rounded-xl border border-surface-light bg-surface p-4 space-y-3">
      <h3 className="font-display text-lg text-foreground">{title}</h3>
      <div style={{ height: Math.max(200, chartData.length * 32) }}>
        <ResponsiveBar
          data={chartData}
          keys={['value']}
          indexBy="id"
          layout="horizontal"
          margin={{ top: 0, right: 40, bottom: 0, left: 120 }}
          padding={0.3}
          colors={[AMBER]}
          borderRadius={4}
          theme={nivoTheme}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
          }}
          axisBottom={null}
          enableGridY={false}
          enableLabel={true}
          label={d => String(d.value)}
          labelSkipWidth={20}
          labelTextColor="#f0e6d6"
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
