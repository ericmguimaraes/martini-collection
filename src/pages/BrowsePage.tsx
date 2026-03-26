import { useParams } from 'react-router-dom'

export default function BrowsePage() {
  const { type } = useParams<{ type: string }>()
  const label = type === 'dvds' ? 'DVDs' : 'CDs'

  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-6 text-center">
        <h1 className="font-display text-3xl text-amber">Browse {label}</h1>
        <p className="text-muted">Search, filter, and explore the collection. Coming in Phase 5.</p>
        <div className="rounded-lg bg-surface p-8">
          <p className="font-mono text-sm text-muted-dark">Cards and filters will appear here</p>
        </div>
      </div>
    </div>
  )
}
