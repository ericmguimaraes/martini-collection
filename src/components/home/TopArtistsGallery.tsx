import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { CdItem } from '@/types/cd'
import type { CollectionStats } from '@/types/stats'
import { useItunesArt } from '@/hooks/useItunesArt'
import { useLanguage } from '@/i18n'

interface TopArtistsGalleryProps {
  stats: CollectionStats
  cds: CdItem[]
}

interface ArtistInfo {
  name: string
  count: number
  sampleCd: CdItem
}

const EXCLUDED_ARTISTS = new Set(['Various Artists', 'Various'])

function ArtistCard({ artist }: { artist: ArtistInfo }) {
  const { t } = useLanguage()
  const artUrl = useItunesArt(artist.sampleCd.artist, artist.sampleCd.title)

  return (
    <Link
      to={`/browse/cds?q=${encodeURIComponent(artist.name)}`}
      className="group relative flex-none w-40 sm:w-auto rounded-xl overflow-hidden border border-surface-light bg-surface transition-all hover:border-amber/30 hover:shadow-lg hover:shadow-amber/5"
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        {artUrl ? (
          <img
            src={artUrl}
            alt={artist.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-surface-hover to-surface flex items-center justify-center">
            <span className="font-display text-2xl text-muted-dark">{artist.name.charAt(0)}</span>
          </div>
        )}

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Text overlay */}
        <div className="absolute bottom-0 inset-x-0 p-3 space-y-1">
          <p className="font-display text-base text-foreground leading-tight group-hover:text-amber transition-colors">
            {artist.name}
          </p>
          <p className="font-mono text-xs text-amber/80">
            {artist.count} {artist.count === 1 ? t('home.album') : t('home.albums')}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default function TopArtistsGallery({ stats, cds }: TopArtistsGalleryProps) {
  const { t } = useLanguage()

  const artists = useMemo(() => {
    const filtered = stats.cd.topArtists.filter(a => !EXCLUDED_ARTISTS.has(a.name))
    const top5 = filtered.slice(0, 5)
    return top5.map(({ name, count }): ArtistInfo => {
      const sampleCd = cds.find(cd => cd.artist === name) ?? cds[0]!
      return { name, count, sampleCd }
    })
  }, [stats, cds])

  return (
    <section className="px-4">
      <div className="mx-auto max-w-4xl space-y-4">
        <h2 className="font-display text-2xl text-foreground">{t('home.mostCollectedArtists')}</h2>

        <div className="flex sm:grid sm:grid-cols-5 gap-3 overflow-x-auto pb-2 scrollbar-none">
          {artists.map(artist => (
            <ArtistCard key={artist.name} artist={artist} />
          ))}
        </div>
      </div>
    </section>
  )
}
