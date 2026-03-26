import { useParams, Link, Navigate } from 'react-router-dom'
import type { DvdItem } from '@/types/dvd'
import { useDvdPoster } from '@/hooks/useArtwork'
import { getGenreColor } from '@/lib/colors'
import { googleFilmUrl } from '@/lib/links'
import { formatRuntime } from '@/lib/format'
import Badge from '@/components/shared/Badge'
import dvds from '@/data/dvds.json'

const allDvds = dvds as DvdItem[]

export default function DvdDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dvd = allDvds.find(d => d.id === id)

  if (!dvd) return <Navigate to="/browse/dvds" replace />

  return <DvdDetail dvd={dvd} />
}

function DvdDetail({ dvd }: { dvd: DvdItem }) {
  const posterUrl = useDvdPoster(dvd)

  return (
    <div className="px-4 py-8 pb-24 sm:pb-8">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          to="/browse/dvds"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-amber transition-colors mb-6"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to DVDs
        </Link>

        {/* Header with optional poster */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-6">
          {/* Poster */}
          <div className="shrink-0 mx-auto sm:mx-0">
            <div className="w-48 sm:w-56 aspect-[2/3] rounded-xl overflow-hidden border border-surface-light shadow-xl shadow-black/30">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={dvd.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-hover relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-copper/10 to-amber/5" />
                  <div className="relative text-center space-y-3 p-6">
                    {dvd.imdbRating && (
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full border-2 border-amber/50 bg-amber/10">
                        <span className="font-mono text-xl text-amber font-bold">{dvd.imdbRating}</span>
                      </div>
                    )}
                    <p className="font-display text-lg text-foreground leading-tight">{dvd.title}</p>
                    {dvd.releaseYear && <p className="font-mono text-xs text-muted-dark">{dvd.releaseYear}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title + meta */}
          <div className="flex-1 space-y-3 min-w-0">
            <div className="space-y-1">
              <h1 className="font-display text-2xl sm:text-3xl text-foreground leading-tight">{dvd.title}</h1>
              {dvd.originalTitle && dvd.originalTitle !== dvd.title && (
                <p className="text-sm text-muted italic">{dvd.originalTitle}</p>
              )}
            </div>

            <div className="flex items-center gap-3 text-sm text-muted">
              {dvd.releaseYear && <span className="font-mono">{dvd.releaseYear}</span>}
              {dvd.runtime && <span className="font-mono">{formatRuntime(dvd.runtime)}</span>}
              {dvd.color && <span>{dvd.color}</span>}
              {dvd.language && <span>{dvd.language}</span>}
            </div>

            {dvd.imdbRating && (
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full border border-amber/40 bg-amber/10 flex items-center justify-center">
                  <span className="font-mono text-sm text-amber font-bold">{dvd.imdbRating}</span>
                </div>
                <span className="text-xs text-muted-dark uppercase tracking-wider">IMDb</span>
              </div>
            )}

            {/* Genre badges */}
            {dvd.genres.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {dvd.genres.map(g => (
                  <Badge key={g} label={g} colorClass={getGenreColor(g)} />
                ))}
              </div>
            )}

            {/* External links */}
            <div className="flex items-center gap-3 pt-1">
              {dvd.imdbUrl && (
                <a
                  href={dvd.imdbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium bg-[#F5C518]/15 text-[#F5C518] hover:bg-[#F5C518]/25 transition-colors"
                >
                  <ImdbIcon />
                  IMDb
                </a>
              )}
              <a
                href={googleFilmUrl(dvd.title, dvd.releaseYear)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium bg-surface-hover text-muted hover:text-foreground hover:bg-surface-light transition-colors"
              >
                <SearchIcon />
                Google
              </a>
            </div>
          </div>
        </div>

        {/* Details card */}
        <div className="rounded-xl border border-surface-light bg-surface overflow-hidden">

          {/* Body */}
          <div className="px-6 py-6 space-y-6">
            {/* Director(s) */}
            {dvd.directors.length > 0 && (
              <div>
                <h2 className="text-xs text-muted-dark uppercase tracking-wider mb-1">
                  {dvd.directors.length > 1 ? 'Directors' : 'Director'}
                </h2>
                <p className="text-foreground font-medium">{dvd.directors.join(', ')}</p>
              </div>
            )}

            {/* Actors */}
            {dvd.actors.length > 0 && (
              <div>
                <h2 className="text-xs text-muted-dark uppercase tracking-wider mb-1">Cast</h2>
                <p className="text-foreground text-sm leading-relaxed">{dvd.actors.join(', ')}</p>
              </div>
            )}

            {/* Musicians (for music DVDs) */}
            {dvd.musicians.length > 0 && (
              <div>
                <h2 className="text-xs text-muted-dark uppercase tracking-wider mb-1">Musicians</h2>
                <p className="text-foreground text-sm leading-relaxed">{dvd.musicians.join(', ')}</p>
              </div>
            )}

            {/* Plot */}
            {dvd.plot && (
              <div>
                <h2 className="text-xs text-muted-dark uppercase tracking-wider mb-2">Synopsis</h2>
                <p className="text-muted text-sm leading-relaxed">{dvd.plot}</p>
              </div>
            )}

            {/* Metadata grid */}
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm">
              {dvd.country && <MetaItem label="Country" value={dvd.country} />}
              {dvd.studios && <MetaItem label="Studio" value={dvd.studios} />}
              {dvd.tag && <MetaItem label="Collection" value={dvd.tag} />}
            </dl>

          </div>
        </div>
      </div>
    </div>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-dark text-xs uppercase tracking-wider">{label}</dt>
      <dd className="text-foreground mt-0.5">{value}</dd>
    </div>
  )
}

function ImdbIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.31 9.588v.005c-.077-.048-.227-.07-.42-.07v4.815c.27 0 .44-.06.5-.165.062-.105.093-.39.093-.855v-2.98c0-.345-.007-.575-.02-.69a.46.46 0 00-.153-.06zM22.416 0H1.62C.742.06.06.744 0 1.596V22.38c.06.876.744 1.56 1.596 1.62H22.38c.876-.06 1.56-.744 1.62-1.596V1.62C23.94.744 23.256.06 22.416 0zM4.14 15.096H2.1V7.875h2.04v7.221zm6.03 0H8.28l-.009-4.26-.66 4.26H6.36l-.69-4.11-.009 4.11h-1.86V7.875h2.61c.09.48.18.99.27 1.53l.27 1.56.48-3.09h2.73v7.221zm4.56-1.86c0 .585-.033 1.005-.099 1.26-.066.255-.207.465-.423.63-.216.165-.48.24-.78.24-.21 0-.39-.03-.54-.09a1.29 1.29 0 01-.42-.294l-.072.384h-1.86V7.875h1.86v2.49c.12-.165.267-.285.444-.36a1.3 1.3 0 01.504-.108c.39 0 .69.12.876.357.186.237.27.72.27 1.449l.24.001v1.53zm4.56-1.11c0-.135-.015-.234-.045-.297a.363.363 0 00-.195-.12c-.048-.012-.111-.018-.195-.018h-.19v3.265h.255c.13 0 .221-.03.27-.09.05-.06.078-.195.078-.405l.022-2.335zm1.86.255v1.8c0 .645-.033 1.095-.1 1.35-.065.255-.2.48-.4.675-.2.195-.4.315-.63.36-.23.045-.625.067-1.185.067h-2.25V7.875h2.22c.705 0 1.17.03 1.395.09.225.06.42.18.585.36.165.18.27.39.315.63.045.24.067.675.067 1.305l-.017 2.121z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}
