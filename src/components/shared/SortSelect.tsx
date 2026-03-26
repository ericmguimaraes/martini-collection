import type { SortField, SortDirection } from '@/types/filters'

interface SortOption {
  label: string
  field: SortField
  direction: SortDirection
}

interface SortSelectProps {
  options: SortOption[]
  value: string
  onChange: (field: SortField, direction: SortDirection) => void
}

export default function SortSelect({ options, value, onChange }: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={e => {
        const opt = options.find(o => `${o.field}-${o.direction}` === e.target.value)
        if (opt) onChange(opt.field, opt.direction)
      }}
      className="rounded-lg border border-surface-light bg-surface px-3 py-2 text-sm text-foreground focus:border-amber/50 focus:outline-none focus:ring-1 focus:ring-amber/30 transition-colors"
    >
      {options.map(opt => (
        <option key={`${opt.field}-${opt.direction}`} value={`${opt.field}-${opt.direction}`}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
