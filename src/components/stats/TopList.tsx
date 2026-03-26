interface TopListProps {
  data: { name: string; count: number }[]
  title: string
  maxItems?: number
}

export default function TopList({ data, title, maxItems = 15 }: TopListProps) {
  const items = data.slice(0, maxItems)
  const maxCount = items[0]?.count || 1

  return (
    <div className="rounded-xl border border-surface-light bg-surface p-4 space-y-3">
      <h3 className="font-display text-lg text-foreground">{title}</h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.name} className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-dark w-5 text-right">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-sm text-foreground truncate">{item.name}</span>
                <span className="font-mono text-xs text-amber flex-none">{item.count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-hover overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber to-copper transition-all duration-700"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
