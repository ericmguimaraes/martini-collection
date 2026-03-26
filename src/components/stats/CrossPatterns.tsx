interface CrossPatternsProps {
  musicDvdCount: number
  sharedArtists: string[]
}

export default function CrossPatterns({ musicDvdCount, sharedArtists }: CrossPatternsProps) {
  return (
    <div className="rounded-xl border border-surface-light bg-surface p-5 space-y-4">
      <h3 className="font-display text-lg text-foreground">Cross-Collection Patterns</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg bg-surface-hover p-4 text-center space-y-1">
          <p className="font-display text-2xl text-amber">{musicDvdCount}</p>
          <p className="text-sm text-muted">Music DVDs bridge both collections</p>
        </div>
        <div className="rounded-lg bg-surface-hover p-4 text-center space-y-1">
          <p className="font-display text-2xl text-amber">{sharedArtists.length}</p>
          <p className="text-sm text-muted">Artists appear in CDs and DVDs</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-dark font-mono">Shared artists</p>
        <div className="flex flex-wrap gap-1.5">
          {sharedArtists
            .filter(a => a !== 'various artists')
            .sort()
            .map(artist => (
              <span
                key={artist}
                className="rounded-full bg-amber/10 px-2.5 py-1 text-xs text-amber capitalize"
              >
                {artist}
              </span>
            ))}
        </div>
      </div>
    </div>
  )
}
