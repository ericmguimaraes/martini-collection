import { useParams } from 'react-router-dom'

export default function CdDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <h1 className="font-display text-3xl text-amber">CD Detail</h1>
        <p className="text-muted">Viewing CD: <span className="font-mono text-foreground">{id}</span></p>
        <p className="text-muted text-sm">Full detail page coming in Phase 7.</p>
      </div>
    </div>
  )
}
