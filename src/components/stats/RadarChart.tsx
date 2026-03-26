import { ResponsiveRadar } from '@nivo/radar'
import { nivoTheme, AMBER } from './ChartTheme'

interface RadarChartProps {
  title: string
  data: { dimension: string; value: number }[]
  maxValue?: number
}

export default function RadarChart({ title, data, maxValue = 100 }: RadarChartProps) {
  return (
    <div className="rounded-xl border border-surface-light bg-surface p-4 space-y-3">
      <h3 className="font-display text-lg text-foreground">{title}</h3>
      <div style={{ height: 350 }}>
        <ResponsiveRadar
          data={data}
          keys={['value']}
          indexBy="dimension"
          maxValue={maxValue}
          margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
          curve="linearClosed"
          borderWidth={2}
          borderColor={AMBER}
          gridLevels={5}
          gridShape="circular"
          gridLabelOffset={16}
          dotSize={8}
          dotColor="#1e1c1a"
          dotBorderWidth={2}
          dotBorderColor={AMBER}
          colors={[AMBER]}
          fillOpacity={0.2}
          blendMode="normal"
          animate={true}
          motionConfig="gentle"
          theme={{
            ...nivoTheme,
            grid: {
              line: { stroke: '#2a2523', strokeWidth: 1 },
            },
          }}
          sliceTooltip={({ index, data: sliceData }) => (
            <div className="rounded-lg bg-surface-light px-3 py-2 text-sm shadow-lg border border-surface-hover">
              <span className="text-foreground font-medium">{index}</span>
              <span className="text-amber ml-2">{sliceData[0]?.value}</span>
            </div>
          )}
        />
      </div>
    </div>
  )
}
