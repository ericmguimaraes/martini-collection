import { HashRouter, Routes, Route } from 'react-router-dom'

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="h-24 w-24 rounded-full bg-surface flex items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-amber/20 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-amber" />
        </div>
      </div>
      <h1 className="font-display text-4xl text-amber">{title}</h1>
      <p className="text-muted text-lg">A curated collection of music and cinema</p>
      <div className="flex gap-8 text-center">
        <div>
          <p className="font-display text-3xl text-foreground">1,687</p>
          <p className="text-sm text-muted">CDs</p>
        </div>
        <div className="w-px bg-surface-light" />
        <div>
          <p className="font-display text-3xl text-foreground">507</p>
          <p className="text-sm text-muted">DVDs</p>
        </div>
      </div>
      <p className="mt-8 font-mono text-xs text-muted-dark">Site under construction</p>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Placeholder title="The Martini Collection" />} />
        <Route path="*" element={<Placeholder title="404 — Not Found" />} />
      </Routes>
    </HashRouter>
  )
}
