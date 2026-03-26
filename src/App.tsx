import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'

const HomePage = lazy(() => import('@/pages/HomePage'))
const InsightsPage = lazy(() => import('@/pages/InsightsPage'))
const BrowsePage = lazy(() => import('@/pages/BrowsePage'))
const CdDetailPage = lazy(() => import('@/pages/CdDetailPage'))
const DvdDetailPage = lazy(() => import('@/pages/DvdDetailPage'))
const VinylPage = lazy(() => import('@/pages/VinylPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/browse/:type" element={<BrowsePage />} />
            <Route path="/cd/:id" element={<CdDetailPage />} />
            <Route path="/dvd/:id" element={<DvdDetailPage />} />
            <Route path="/vinyl" element={<VinylPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
