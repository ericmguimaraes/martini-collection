import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import cds from '@/data/cds.json'
import dvds from '@/data/dvds.json'
import type { CdItem } from '@/types/cd'
import type { DvdItem } from '@/types/dvd'
import { searchItems } from '@/lib/search'
import { formatNumber } from '@/lib/format'
import SearchBar from '@/components/shared/SearchBar'
import CdCard from '@/components/cd/CdCard'
import DvdCard from '@/components/dvd/DvdCard'

const cdData = cds as CdItem[]
const dvdData = dvds as DvdItem[]
const PREVIEW_COUNT = 8

function ResultSection({
  title,
  count,
  browseUrl,
  children,
}: {
  title: string
  count: number
  browseUrl: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-xl text-foreground">
          {title}
          <span className="ml-2 text-sm text-muted font-sans">
            {formatNumber(count)} {count === 1 ? 'result' : 'results'}
          </span>
        </h2>
        {count > PREVIEW_COUNT && (
          <Link
            to={browseUrl}
            className="text-sm text-amber hover:text-amber-light transition-colors whitespace-nowrap"
          >
            View all {formatNumber(count)} &rarr;
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {children}
      </div>
    </section>
  )
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''

  const cdResults = useMemo(() => searchItems(cdData, query), [query])
  const dvdResults = useMemo(() => searchItems(dvdData, query), [query])

  const totalResults = cdResults.length + dvdResults.length
  const hasQuery = query.trim().length > 0

  function handleQueryChange(val: string) {
    setParams(val ? { q: val } : {}, { replace: true })
  }

  return (
    <div className="px-4 py-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="font-display text-3xl text-amber">Search</h1>

        <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm pb-3">
          <SearchBar
            value={query}
            onChange={handleQueryChange}
            placeholder="Search artists, albums, directors, genres..."
            large
          />
        </div>

        {!hasQuery && (
          <p className="text-center text-muted py-12">
            Search across all collections — CDs, DVDs, and more
          </p>
        )}

        {hasQuery && totalResults === 0 && (
          <div className="text-center py-16 space-y-5">
            <p className="font-display text-2xl text-amber">
              Even Panqueca couldn't find what you're looking for!
            </p>
            <img
              src={`${import.meta.env.BASE_URL}panqueca-not-found.jpeg`}
              alt="Panqueca the dog searching"
              className="mx-auto w-80 sm:w-96 rounded-xl shadow-lg"
            />
            <p className="text-muted-dark text-sm">Try a different search term</p>
          </div>
        )}

        {hasQuery && totalResults > 0 && (
          <>
            <p className="text-xs text-muted">
              Found {formatNumber(cdResults.length)} CDs and{' '}
              {formatNumber(dvdResults.length)} DVDs matching &ldquo;{query}&rdquo;
            </p>

            {cdResults.length > 0 && (
              <ResultSection
                title="CDs"
                count={cdResults.length}
                browseUrl={`/browse/cds?q=${encodeURIComponent(query)}`}
              >
                {cdResults.slice(0, PREVIEW_COUNT).map(cd => (
                  <CdCard key={cd.id} cd={cd} />
                ))}
              </ResultSection>
            )}

            {dvdResults.length > 0 && (
              <ResultSection
                title="DVDs"
                count={dvdResults.length}
                browseUrl={`/browse/dvds?q=${encodeURIComponent(query)}`}
              >
                {dvdResults.slice(0, PREVIEW_COUNT).map(dvd => (
                  <DvdCard key={dvd.id} dvd={dvd} />
                ))}
              </ResultSection>
            )}
          </>
        )}
      </div>
    </div>
  )
}
