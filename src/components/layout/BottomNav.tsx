import { NavLink } from 'react-router-dom'
import { useLanguage } from '@/i18n'

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function DiscIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function FilmIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
      <line x1="17" y1="17" x2="22" y2="17" />
    </svg>
  )
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

function VinylIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

export default function BottomNav() {
  const { language, setLanguage, t } = useLanguage()

  const tabs = [
    { to: '/', label: t('nav.home'), icon: HomeIcon },
    { to: '/browse/cds', label: t('nav.cds'), icon: DiscIcon },
    { to: '/browse/dvds', label: t('nav.dvds'), icon: FilmIcon },
    { to: '/insights', label: t('nav.insights'), icon: ChartIcon },
    { to: '/vinyl', label: t('nav.vinyl'), icon: VinylIcon, badge: t('nav.soon') },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-surface-light bg-background/95 backdrop-blur-sm safe-area-pb">
      <div className="flex items-center justify-around py-1">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-0.5 px-3 py-2 min-w-[52px] transition-colors ${
                isActive ? 'text-amber' : 'text-muted'
              }`
            }
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
            {'badge' in tab && tab.badge && (
              <span className="absolute -top-0.5 right-0.5 rounded-full bg-amber/20 px-1 py-px text-[7px] font-mono text-amber leading-tight">
                {tab.badge}
              </span>
            )}
          </NavLink>
        ))}
        <button
          onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
          className="flex flex-col items-center gap-0.5 px-3 py-2 min-w-[52px] text-muted transition-colors"
          aria-label={language === 'en' ? 'Mudar para Português' : 'Switch to English'}
        >
          <GlobeIcon className="h-5 w-5" />
          <span className="text-[10px] font-bold">{language.toUpperCase()}</span>
        </button>
      </div>
    </nav>
  )
}
