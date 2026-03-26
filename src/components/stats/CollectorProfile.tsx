interface CollectorProfileProps {
  totalCds: number
  totalDvds: number
  jazzPct: number
  prePct1970: number
  avgRating: number
}

export default function CollectorProfile({
  totalCds,
  totalDvds,
  jazzPct,
  prePct1970,
  avgRating,
}: CollectorProfileProps) {
  return (
    <div className="rounded-xl border border-amber/20 bg-gradient-to-br from-surface to-surface-hover p-6 space-y-4">
      <h3 className="font-display text-xl text-amber">Collector Profile</h3>
      <div className="space-y-3 text-sm text-muted leading-relaxed">
        <p>
          A collection of <span className="text-foreground font-medium">{totalCds.toLocaleString()} CDs</span> and{' '}
          <span className="text-foreground font-medium">{totalDvds} DVDs</span> that reveals a deep appreciation for
          jazz, Brazilian music, and classic cinema.
        </p>
        <p>
          With <span className="text-amber font-medium">{jazzPct}%</span> of the CD collection dedicated to Jazz — anchored by
          labels like Blue Note, Verve, and Columbia — and strong currents of MPB and Música Brasileira, the musical
          taste is rooted in improvisation, rhythm, and cultural depth.
        </p>
        <p>
          The cinema collection favors quality over quantity, with an average IMDb rating of{' '}
          <span className="text-amber font-medium">{avgRating}</span> and{' '}
          <span className="text-foreground font-medium">{prePct1970}%</span> of films from before 1970 — Chaplin,
          Hitchcock, Kurosawa, Fellini, and Visconti feature prominently. Drama, romance, and classic comedies dominate.
        </p>
        <p>
          Brazilian culture threads through both collections — from Caetano Veloso and Gilberto Gil in the CDs to
          Brazilian cinema in the DVDs. A collector who values craft, history, and artistic integrity.
        </p>
      </div>
    </div>
  )
}
