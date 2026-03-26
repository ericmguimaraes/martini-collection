import type { Theme } from '@nivo/core'

export const nivoTheme: Theme = {
  text: {
    fill: '#a09080',
    fontSize: 11,
  },
  axis: {
    ticks: {
      text: { fill: '#a09080', fontSize: 10 },
      line: { stroke: '#2a2523' },
    },
    legend: {
      text: { fill: '#a09080', fontSize: 12 },
    },
  },
  grid: {
    line: { stroke: '#2a2523', strokeWidth: 1 },
  },
  tooltip: {
    container: {
      background: '#1e1c1a',
      color: '#f0e6d6',
      fontSize: 12,
      borderRadius: '8px',
      border: '1px solid #2a2523',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    },
  },
  labels: {
    text: { fill: '#f0e6d6', fontSize: 11, fontWeight: 600 },
  },
  legends: {
    text: { fill: '#a09080', fontSize: 11 },
  },
}

export const AMBER = '#d4a053'
export const COPPER = '#b8734a'

export const chartColors = [
  '#d4a053', // amber
  '#b8734a', // copper
  '#c4923a', // amber-dark
  '#e0b56a', // amber-light
  '#c9885f', // copper-light
  '#a09080', // muted
  '#8b7355', // warm brown
  '#d4a053cc', // amber semi
  '#b8734acc', // copper semi
  '#c4923acc', // amber-dark semi
  '#6b5e50', // muted-dark
  '#e0b56acc', // amber-light semi
]
