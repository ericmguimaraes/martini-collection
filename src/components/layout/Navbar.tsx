import { NavLink } from 'react-router-dom'
import { useLanguage } from '@/i18n'

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage()

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/browse/cds', label: t('nav.cds') },
    { to: '/browse/dvds', label: t('nav.dvds') },
    { to: '/insights', label: t('nav.insights') },
    { to: '/vinyl', label: t('nav.vinyl'), badge: t('nav.soon') },
  ]

  return (
    <nav className="hidden md:flex items-center justify-between px-6 py-3 border-b border-surface-light bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <NavLink to="/" className="font-display text-xl text-amber hover:text-amber-light transition-colors">
        {t('nav.siteTitle')}
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

        <button
          onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
          className="ml-3 flex items-center gap-0.5 rounded-md px-2 py-1.5 text-xs font-mono border border-surface-light hover:border-amber/30 transition-colors"
          aria-label={language === 'en' ? 'Mudar para Português' : 'Switch to English'}
        >
          <span className={language === 'en' ? 'text-amber font-bold' : 'text-muted'}>EN</span>
          <span className="text-muted-dark">/</span>
          <span className={language === 'pt' ? 'text-amber font-bold' : 'text-muted'}>PT</span>
        </button>
      </div>
    </nav>
  )
}
