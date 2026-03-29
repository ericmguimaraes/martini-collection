import { Outlet } from 'react-router-dom'
import { useLanguage } from '@/i18n'
import Navbar from './Navbar'
import BottomNav from './BottomNav'

export default function AppShell() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <footer className="hidden md:block border-t border-surface-light py-6 text-center">
        <p className="font-mono text-xs text-muted-dark">
          {t('nav.siteTitle')} — {t('footer.tagline')}
        </p>
        <a
          href="https://github.com/ericmguimaraes/martini-collection"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 font-mono text-xs text-muted-dark hover:text-accent transition-colors"
        >
          GitHub
        </a>
      </footer>
      <BottomNav />
    </div>
  )
}
