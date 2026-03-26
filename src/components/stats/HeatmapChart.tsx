import { ResponsiveHeatMap } from '@nivo/heatmap'
import { nivoTheme } from './ChartTheme'

interface HeatmapChartProps {
  title: string
  data: { source: string; target: string; value: number }[]
  annotation?: string
}

export default function HeatmapChart({ title, data, annotation }: HeatmapChartProps) {
  const labels = [...new Set(data.flatMap(d => [d.source, d.target]))]

  const matrix = labels.map(row => ({
    id: row,
    data: labels.map(col => {
      const pair = data.find(
        d =>
          (d.source === row && d.target === col) ||
          (d.source === col && d.target === row)
      )
      return { x: col, y: pair ? pair.value : 0 }
    }),
  }))

  return (
    <div className="rounded-xl border border-surface-light bg-surface p-4 space-y-3">
      <div className="flex items-baseline gap-3">
        <h3 className="font-display text-lg text-foreground">{title}</h3>
        {annotation && <span className="text-xs text-muted-dark font-mono">{annotation}</span>}
      </div>
      <div style={{ height: Math.max(350, labels.length * 35) }}>
        <ResponsiveHeatMap
          data={matrix}
          margin={{ top: 60, right: 30, bottom: 30, left: 100 }}
          axisTop={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: -45,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
          }}
          colors={{
            type: 'sequential',
            scheme: 'oranges',
            minValue: 0,
          }}
          emptyColor="#1e1c1a"
          borderWidth={1}
          borderColor="#2a2523"
          theme={nivoTheme}
          labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
          hoverTarget="cell"
          animate={true}
          motionConfig="gentle"
          tooltip={({ cell }) => (
            <div className="rounded-lg bg-surface-light px-3 py-2 text-sm shadow-lg border border-surface-hover">
              <span className="text-foreground font-medium">
                {cell.serieId} + {cell.data.x}
              </span>
              <span className="text-amber ml-2">{cell.formattedValue}</span>
            </div>
          )}
        />
      </div>
    </div>
  )
}
