import { useParams, Navigate } from 'react-router-dom'
import cds from '@/data/cds.json'
import dvds from '@/data/dvds.json'
import stats from '@/data/stats.json'
import type { CdItem } from '@/types/cd'
import type { DvdItem } from '@/types/dvd'
import type { CollectionStats } from '@/types/stats'
import type { SortField, SortDirection } from '@/types/filters'
import { ITEMS_PER_PAGE } from '@/types/filters'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useFilteredCds, useFilteredDvds } from '@/hooks/useFilteredItems'
import { getTagColor, getGenreColor } from '@/lib/colors'
import { formatNumber } from '@/lib/format'
import SearchBar from '@/components/shared/SearchBar'
import FilterBar from '@/components/shared/FilterBar'
import SortSelect from '@/components/shared/SortSelect'
import Pagination from '@/components/shared/Pagination'
import CdCard from '@/components/cd/CdCard'
import DvdCard from '@/components/dvd/DvdCard'

const cdData = cds as CdItem[]
const dvdData = dvds as DvdItem[]
const s = stats as CollectionStats

const CD_SORT_OPTIONS: { label: string; field: SortField; direction: SortDirection }[] = [
  { label: 'Artist A–Z', field: 'artist', direction: 'asc' },
  { label: 'Artist Z–A', field: 'artist', direction: 'desc' },
  { label: 'Title A–Z', field: 'title', direction: 'asc' },
  { label: 'Year (newest)', field: 'year', direction: 'desc' },
  { label: 'Year (oldest)', field: 'year', direction: 'asc' },
]

const DVD_SORT_OPTIONS: { label: string; field: SortField; direction: SortDirection }[] = [
  { label: 'Title A–Z', field: 'title', direction: 'asc' },
  { label: 'Director A–Z', field: 'director', direction: 'asc' },
  { label: 'Year (newest)', field: 'year', direction: 'desc' },
  { label: 'Year (oldest)', field: 'year', direction: 'asc' },
  { label: 'Rating (best)', field: 'rating', direction: 'desc' },
  { label: 'Rating (lowest)', field: 'rating', direction: 'asc' },
]

const cdTags = s.cd.tagDistribution.map(t => t.tag)
const dvdGenres = s.dvd.genreDistribution.map(g => g.genre)

function CdBrowse() {
  const { state, setQuery, toggleTag, setSort, setPage } = useQueryParams('cds')
  const filtered = useFilteredCds(cdData, state)
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const page = Math.min(state.page, totalPages)
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <>
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm pb-3 space-y-3">
        <SearchBar
          value={state.query}
          onChange={setQuery}
          placeholder="Search artists, albums, labels, genres..."
        />
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <FilterBar options={cdTags} selected={state.tags} onToggle={toggleTag} colorFn={getTagColor} />
          </div>
          <SortSelect
            options={CD_SORT_OPTIONS}
            value={`${state.sort}-${state.direction}`}
            onChange={setSort}
          />
        </div>
        <p className="text-xs text-muted">
          Showing {formatNumber(paged.length)} of {formatNumber(filtered.length)} CDs
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {paged.map(cd => (
          <CdCard key={cd.id} cd={cd} />
        ))}
      </div>

      {paged.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted text-lg">No CDs found</p>
          <p className="text-muted-dark text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  )
}

function DvdBrowse() {
  const { state, setQuery, toggleGenre, setSort, setPage } = useQueryParams('dvds')
  const filtered = useFilteredDvds(dvdData, state)
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const page = Math.min(state.page, totalPages)
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <>
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm pb-3 space-y-3">
        <SearchBar
          value={state.query}
          onChange={setQuery}
          placeholder="Search titles, directors, actors, genres..."
        />
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <FilterBar options={dvdGenres} selected={state.genres} onToggle={toggleGenre} colorFn={getGenreColor} />
          </div>
          <SortSelect
            options={DVD_SORT_OPTIONS}
            value={`${state.sort}-${state.direction}`}
            onChange={setSort}
          />
        </div>
        <p className="text-xs text-muted">
          Showing {formatNumber(paged.length)} of {formatNumber(filtered.length)} DVDs
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {paged.map(dvd => (
          <DvdCard key={dvd.id} dvd={dvd} />
        ))}
      </div>

      {paged.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted text-lg">No DVDs found</p>
          <p className="text-muted-dark text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  )
}

export default function BrowsePage() {
  const { type } = useParams<{ type: string }>()

  if (type !== 'cds' && type !== 'dvds') {
    return <Navigate to="/browse/cds" replace />
  }

  const isCds = type === 'cds'

  return (
    <div className="px-4 py-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <h1 className="font-display text-3xl text-amber">
          Browse {isCds ? 'CDs' : 'DVDs'}
        </h1>

        {isCds ? <CdBrowse /> : <DvdBrowse />}
      </div>
    </div>
  )
}
