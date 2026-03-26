import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/browse/cds', label: 'CDs' },
  { to: '/browse/dvds', label: 'DVDs' },
  { to: '/insights', label: 'Insights' },
  { to: '/vinyl', label: 'Vinyl', badge: 'Soon' },
]

export default function Navbar() {
  return (
    <nav className="hidden md:flex items-center justify-between px-6 py-3 border-b border-surface-light bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <NavLink to="/" className="font-display text-xl text-amber hover:text-amber-light transition-colors">
        The Martini Collection
      </NavLink>

      <div className="flex items-center gap-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'text-amber bg-surface'
                  : 'text-muted hover:text-foreground hover:bg-surface/50'
              }`
            }
          >
            {link.label}
            {link.badge && (
              <span className="ml-1.5 rounded-full bg-amber/20 px-1.5 py-0.5 text-[10px] font-mono text-amber">
                {link.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
