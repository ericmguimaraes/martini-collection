interface FilterBarProps {
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
  colorFn: (value: string) => string
}

export default function FilterBar({ options, selected, onToggle, colorFn }: FilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {options.map(opt => {
        const active = selected.includes(opt)
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={`flex-none rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              active
                ? `${colorFn(opt)} ring-1 ring-amber/40`
                : 'bg-surface-light text-muted hover:text-foreground hover:bg-surface-hover'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
