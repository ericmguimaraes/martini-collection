import { ResponsiveBar } from '@nivo/bar'
import { nivoTheme, chartColors } from './ChartTheme'

interface StackedBarChartProps {
  title: string
  data: Record<string, string | number>[]
  indexKey: string
  keys: string[]
  annotation?: string
}

export default function StackedBarChart({ title, data, indexKey, keys, annotation }: StackedBarChartProps) {
  return (
    <div className="rounded-xl border border-surface-light bg-surface p-4 space-y-3">
      <div className="flex items-baseline gap-3">
        <h3 className="font-display text-lg text-foreground">{title}</h3>
        {annotation && <span className="text-xs text-muted-dark font-mono">{annotation}</span>}
      </div>
      <div style={{ height: 350 }}>
        <ResponsiveBar
          data={data}
          keys={keys}
          indexBy={indexKey}
          margin={{ top: 10, right: 130, bottom: 50, left: 50 }}
          padding={0.2}
          groupMode="stacked"
          colors={chartColors.slice(0, keys.length)}
          borderRadius={2}
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
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              translateX: 120,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#a09080',
              symbolSize: 10,
              symbolShape: 'circle',
            },
          ]}
          tooltip={({ id, value, indexValue }) => (
            <div className="rounded-lg bg-surface-light px-3 py-2 text-sm shadow-lg border border-surface-hover">
              <span className="text-muted-dark">{indexValue}</span>
              <span className="text-foreground font-medium ml-2">{id}</span>
              <span className="text-amber ml-2">{value}</span>
            </div>
          )}
        />
      </div>
    </div>
  )
}
