import { HashRouter, Routes, Route } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import HomePage from '@/pages/HomePage'
import InsightsPage from '@/pages/InsightsPage'
import BrowsePage from '@/pages/BrowsePage'
import CdDetailPage from '@/pages/CdDetailPage'
import DvdDetailPage from '@/pages/DvdDetailPage'
import VinylPage from '@/pages/VinylPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <HashRouter>
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
    </HashRouter>
  )
}
