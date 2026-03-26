import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import BottomNav from './BottomNav'

export default function AppShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <footer className="hidden md:block border-t border-surface-light py-6 text-center">
        <p className="font-mono text-xs text-muted-dark">
          The Martini Collection — A curated collection of music and cinema
        </p>
      </footer>
      <BottomNav />
    </div>
  )
}
