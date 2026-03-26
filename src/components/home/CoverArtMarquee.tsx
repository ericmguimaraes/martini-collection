import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { CdItem } from '@/types/cd'
import { useItunesArt } from '@/hooks/useItunesArt'

interface CoverArtMarqueeProps {
  cds: CdItem[]
}

function pickMarqueeCds(cds: CdItem[], count: number): CdItem[] {
  // Deterministic shuffle — all CDs are candidates since tiles without
  // iTunes art render as null, so only real covers will be visible
  const sorted = [...cds].sort((a, b) => {
    const ha = hashCode(a.id)
    const hb = hashCode(b.id)
    return ha - hb
  })
  return sorted.slice(0, count)
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return hash
}

function CoverTile({ cd }: { cd: CdItem }) {
  const artUrl = useItunesArt(cd.artist, cd.title)

  if (!artUrl) {
    return null
  }

  return (
    <Link
      to={`/cd/${cd.id}`}
      className="flex-none w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-surface-light/50 transition-all hover:border-amber/40 hover:scale-105"
    >
      <img
        src={artUrl}
        alt={`${cd.artist} — ${cd.title}`}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </Link>
  )
}

function MarqueeRow({ cds, direction }: { cds: CdItem[]; direction: 'left' | 'right' }) {
  const animClass = direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'

  return (
    <div className="overflow-hidden group">
      <div className={`flex gap-3 w-max ${animClass} group-hover:[animation-play-state:paused]`}>
        {/* Render twice for seamless loop */}
        {cds.map(cd => (
          <CoverTile key={`a-${cd.id}`} cd={cd} />
        ))}
        {cds.map(cd => (
          <CoverTile key={`b-${cd.id}`} cd={cd} />
        ))}
      </div>
    </div>
  )
}

export default function CoverArtMarquee({ cds }: CoverArtMarqueeProps) {
  const row1 = useMemo(() => pickMarqueeCds(cds, 60), [cds])
  const row2 = useMemo(() => {
    // Pick a different set for row 2
    const row1Ids = new Set(row1.map(c => c.id))
    const remaining = cds.filter(c => !row1Ids.has(c.id))
    return pickMarqueeCds(remaining, 40)
  }, [cds, row1])

  return (
    <section className="relative py-2 -mt-14">
      {/* Gradient fades on edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 z-10 bg-gradient-to-l from-background to-transparent" />

      <div className="space-y-3">
        <MarqueeRow cds={row1} direction="left" />
        <MarqueeRow cds={row2} direction="right" />
      </div>
    </section>
  )
}
