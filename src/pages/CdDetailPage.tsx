import { useParams, Link, Navigate } from 'react-router-dom'
import type { CdItem } from '@/types/cd'
import { useCdArtwork } from '@/hooks/useArtwork'
import { getTagColor, getGenreColor } from '@/lib/colors'
import { spotifySearchUrl, youtubeSearchUrl } from '@/lib/links'
import Badge from '@/components/shared/Badge'
import cds from '@/data/cds.json'

const allCds = cds as CdItem[]

export default function CdDetailPage() {
  const { id } = useParams<{ id: string }>()
  const cd = allCds.find(c => c.id === id)

  if (!cd) return <Navigate to="/browse/cds" replace />

  return <CdDetail cd={cd} />
}

function CdDetail({ cd }: { cd: CdItem }) {
  const artUrl = useCdArtwork(cd)

  return (
    <div className="px-4 py-8 pb-24 sm:pb-8">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          to="/browse/cds"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-amber transition-colors mb-6"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to CDs
        </Link>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          {/* Cover Art */}
          <div className="shrink-0 mx-auto sm:mx-0">
            <div className="w-64 sm:w-72 aspect-square rounded-xl overflow-hidden border border-surface-light shadow-xl shadow-black/30">
              {artUrl ? (
                <img
                  src={artUrl}
                  alt={`${cd.artist} — ${cd.title}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-hover relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber/10 to-copper/10" />
                  <div className="relative text-center space-y-2 p-6">
                    <p className="font-display text-xl text-foreground leading-tight">{cd.title}</p>
                    <p className="text-sm text-muted">{cd.artist}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4 min-w-0">
            <div className="space-y-1">
              <h1 className="font-display text-2xl sm:text-3xl text-foreground leading-tight">{cd.artist}</h1>
              <p className="text-lg sm:text-xl text-muted italic">{cd.title}</p>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {cd.tag && <Badge label={cd.tag} colorClass={getTagColor(cd.tag)} />}
              {cd.genres.map(g => (
                <Badge key={g} label={g} colorClass={getGenreColor(g)} small />
              ))}
            </div>

            {/* Metadata grid */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {cd.label && <MetaItem label="Label" value={cd.label} />}
              {cd.releaseYear && <MetaItem label="Year" value={String(cd.releaseYear)} mono />}
              {cd.discs > 0 && <MetaItem label="Discs" value={String(cd.discs)} mono />}
              {cd.tracks > 0 && <MetaItem label="Tracks" value={String(cd.tracks)} mono />}
              {cd.length && <MetaItem label="Length" value={cd.length} mono />}
              {cd.catNo && <MetaItem label="Catalog #" value={cd.catNo} mono />}
              {cd.composer && <MetaItem label="Composer" value={cd.composer} />}
              {cd.conductor && <MetaItem label="Conductor" value={cd.conductor} />}
            </dl>

            {/* External links */}
            <div className="flex items-center gap-3 pt-2">
              <ExternalButton
                href={spotifySearchUrl(cd.artist, cd.title)}
                label="Spotify"
                icon={<SpotifyIcon />}
                color="bg-[#1DB954]/15 text-[#1DB954] hover:bg-[#1DB954]/25"
              />
              <ExternalButton
                href={youtubeSearchUrl(cd.artist, cd.title)}
                label="YouTube"
                icon={<YouTubeIcon />}
                color="bg-[#FF0000]/15 text-[#FF0000] hover:bg-[#FF0000]/25"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetaItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-muted-dark text-xs uppercase tracking-wider">{label}</dt>
      <dd className={`text-foreground mt-0.5 ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </div>
  )
}

function ExternalButton({ href, label, icon, color }: { href: string; label: string; icon: React.ReactNode; color: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${color}`}
    >
      {icon}
      {label}
    </a>
  )
}

function SpotifyIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}
