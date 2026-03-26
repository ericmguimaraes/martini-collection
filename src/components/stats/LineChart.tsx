import { ResponsiveLine } from '@nivo/line'
import { nivoTheme, AMBER } from './ChartTheme'

interface LineChartProps {
  data: { x: string; y: number }[]
  title: string
  area?: boolean
}

export default function LineChart({ data, title, area = false }: LineChartProps) {
  const lineData = [
    {
      id: title,
      data: data.map(d => ({ x: d.x, y: d.y })),
    },
  ]

  return (
    <div className="rounded-xl border border-surface-light bg-surface p-4 space-y-3">
      <h3 className="font-display text-lg text-foreground">{title}</h3>
      <div style={{ height: 300 }}>
        <ResponsiveLine
          data={lineData}
          margin={{ top: 10, right: 20, bottom: 50, left: 50 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0 }}
          curve="monotoneX"
          colors={[AMBER]}
          lineWidth={3}
          enableArea={area}
          areaBaselineValue={0}
          areaOpacity={0.15}
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
          pointSize={8}
          pointColor="#1e1c1a"
          pointBorderWidth={2}
          pointBorderColor={AMBER}
          enableGridX={false}
          animate={true}
          motionConfig="gentle"
          useMesh={true}
          tooltip={({ point }) => (
            <div className="rounded-lg bg-surface-light px-3 py-2 text-sm shadow-lg border border-surface-hover">
              <span className="text-foreground font-medium">{point.data.xFormatted}</span>
              <span className="text-amber ml-2">{point.data.yFormatted}</span>
            </div>
          )}
        />
      </div>
    </div>
  )
}
