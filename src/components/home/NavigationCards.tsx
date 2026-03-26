import { Link } from 'react-router-dom'
import { formatNumber } from '@/lib/format'

interface NavCard {
  to: string
  label: string
  count?: number
  countLabel?: string
  icon: React.ReactNode
  badge?: string
}

function DiscIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function FilmIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 8h20M2 16h20M8 4v16M16 4v16" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M3 3v18h18" />
      <path d="M7 17l4-8 4 4 5-10" />
    </svg>
  )
}

function VinylIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="5" strokeDasharray="2 2" />
    </svg>
  )
}

interface NavigationCardsProps {
  totalCds: number
  totalDvds: number
}

export default function NavigationCards({ totalCds, totalDvds }: NavigationCardsProps) {
  const cards: NavCard[] = [
    { to: '/browse/cds', label: 'CDs', count: totalCds, countLabel: 'albums', icon: <DiscIcon /> },
    { to: '/browse/dvds', label: 'DVDs', count: totalDvds, countLabel: 'titles', icon: <FilmIcon /> },
    { to: '/insights', label: 'Insights', icon: <ChartIcon /> },
    { to: '/vinyl', label: 'Vinyl', icon: <VinylIcon />, badge: 'Coming Soon' },
  ]

  return (
    <section className="px-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible scrollbar-none">
          {cards.map(card => (
            <Link
              key={card.to}
              to={card.to}
              className="group relative flex min-w-[100px] flex-1 flex-col items-center gap-3 rounded-xl border border-surface-light bg-surface p-4 sm:p-5 transition-all hover:border-amber/30 hover:bg-surface-hover hover:shadow-lg hover:shadow-amber/5"
            >
              <div className="text-muted group-hover:text-amber transition-colors">
                {card.icon}
              </div>
              <div className="text-center">
                <p className="font-display text-lg text-foreground">{card.label}</p>
                {card.count !== undefined && (
                  <p className="font-mono text-xs text-muted">
                    {formatNumber(card.count)} {card.countLabel}
                  </p>
                )}
              </div>
              {card.badge && (
                <span className="absolute -top-2 -right-2 rounded-full bg-amber/20 px-2 py-0.5 font-mono text-[10px] text-amber">
                  {card.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
