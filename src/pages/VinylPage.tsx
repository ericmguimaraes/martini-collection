export default function VinylPage() {
  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-2xl flex flex-col items-center gap-6 text-center">
        {/* Vinyl record illustration */}
        <div className="relative h-40 w-40">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full bg-surface border border-surface-light" />
          {/* Grooves */}
          <div className="absolute inset-4 rounded-full border border-muted-dark/30" />
          <div className="absolute inset-8 rounded-full border border-muted-dark/20" />
          <div className="absolute inset-12 rounded-full border border-muted-dark/30" />
          {/* Label */}
          <div className="absolute inset-[52px] rounded-full bg-amber/20 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-amber/40" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="font-display text-3xl text-amber">Vinyl Collection</h1>
          <span className="inline-block rounded-full bg-amber/20 px-3 py-1 font-mono text-sm text-amber">
            Coming Soon
          </span>
          <p className="text-muted text-lg max-w-md">
            This section is being curated. A collection of vinyl records will be added here soon.
          </p>
          <p className="text-muted-dark text-sm">Stay tuned.</p>
        </div>
      </div>
    </div>
  )
}
