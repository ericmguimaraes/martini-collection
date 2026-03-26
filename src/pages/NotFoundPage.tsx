import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
      <img
        src={`${import.meta.env.BASE_URL}panqueca-not-found.jpeg`}
        alt="Panqueca the dog searching through records"
        className="w-72 rounded-xl shadow-lg"
      />
      <h1 className="font-display text-4xl text-amber">404</h1>
      <p className="text-muted">This record isn't in the collection.</p>
      <p className="text-muted-dark text-sm">Panqueca looked everywhere, but no luck!</p>
      <Link
        to="/"
        className="rounded-md bg-surface px-4 py-2 text-sm text-foreground hover:bg-surface-light transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
