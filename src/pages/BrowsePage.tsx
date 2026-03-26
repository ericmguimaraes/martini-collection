import { useMemo } from 'react'
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
import { useLanguage } from '@/i18n'
import SearchBar from '@/components/shared/SearchBar'
import FilterBar from '@/components/shared/FilterBar'
import SortSelect from '@/components/shared/SortSelect'
import Pagination from '@/components/shared/Pagination'
import CdCard from '@/components/cd/CdCard'
import DvdCard from '@/components/dvd/DvdCard'

const cdData = cds as CdItem[]
const dvdData = dvds as DvdItem[]
const s = stats as CollectionStats

const cdTags = s.cd.tagDistribution.map(t => t.tag)
const dvdGenres = s.dvd.genreDistribution.map(g => g.genre)

function CdBrowse() {
  const { t } = useLanguage()
  const { state, setQuery, toggleTag, setSort, setPage } = useQueryParams('cds')
  const filtered = useFilteredCds(cdData, state)
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const page = Math.min(state.page, totalPages)
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const sortOptions = useMemo((): { label: string; field: SortField; direction: SortDirection }[] => [
    { label: t('browse.sortArtistAZ'), field: 'artist', direction: 'asc' },
    { label: t('browse.sortArtistZA'), field: 'artist', direction: 'desc' },
    { label: t('browse.sortTitleAZ'), field: 'title', direction: 'asc' },
    { label: t('browse.sortYearNewest'), field: 'year', direction: 'desc' },
    { label: t('browse.sortYearOldest'), field: 'year', direction: 'asc' },
  ], [t])

  return (
    <>
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm pb-3 space-y-3">
        <SearchBar
          value={state.query}
          onChange={setQuery}
          placeholder={t('browse.searchCdsPlaceholder')}
        />
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <FilterBar options={cdTags} selected={state.tags} onToggle={toggleTag} colorFn={getTagColor} />
          </div>
          <SortSelect
            options={sortOptions}
            value={`${state.sort}-${state.direction}`}
            onChange={setSort}
          />
        </div>
        <p className="text-xs text-muted">
          {t('browse.showingCds', { count: formatNumber(paged.length), total: formatNumber(filtered.length) })}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {paged.map(cd => (
          <CdCard key={cd.id} cd={cd} />
        ))}
      </div>

      {paged.length === 0 && (
        <div className="text-center py-16 space-y-5">
          <p className="font-display text-2xl text-amber">{t('browse.emptyTitle')}</p>
          <img
            src={`${import.meta.env.BASE_URL}panqueca-not-found.jpeg`}
            alt={t('browse.emptyAltCds')}
            className="mx-auto w-80 sm:w-96 rounded-xl shadow-lg"
          />
          <p className="text-muted-dark text-sm">{t('browse.emptyHint')}</p>
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  )
}

function DvdBrowse() {
  const { t } = useLanguage()
  const { state, setQuery, toggleGenre, setSort, setPage } = useQueryParams('dvds')
  const filtered = useFilteredDvds(dvdData, state)
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const page = Math.min(state.page, totalPages)
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const sortOptions = useMemo((): { label: string; field: SortField; direction: SortDirection }[] => [
    { label: t('browse.sortTitleAZ'), field: 'title', direction: 'asc' },
    { label: t('browse.sortDirectorAZ'), field: 'director', direction: 'asc' },
    { label: t('browse.sortYearNewest'), field: 'year', direction: 'desc' },
    { label: t('browse.sortYearOldest'), field: 'year', direction: 'asc' },
    { label: t('browse.sortRatingBest'), field: 'rating', direction: 'desc' },
    { label: t('browse.sortRatingLowest'), field: 'rating', direction: 'asc' },
  ], [t])

  return (
    <>
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm pb-3 space-y-3">
        <SearchBar
          value={state.query}
          onChange={setQuery}
          placeholder={t('browse.searchDvdsPlaceholder')}
        />
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <FilterBar options={dvdGenres} selected={state.genres} onToggle={toggleGenre} colorFn={getGenreColor} />
          </div>
          <SortSelect
            options={sortOptions}
            value={`${state.sort}-${state.direction}`}
            onChange={setSort}
          />
        </div>
        <p className="text-xs text-muted">
          {t('browse.showingDvds', { count: formatNumber(paged.length), total: formatNumber(filtered.length) })}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {paged.map(dvd => (
          <DvdCard key={dvd.id} dvd={dvd} />
        ))}
      </div>

      {paged.length === 0 && (
        <div className="text-center py-16 space-y-5">
          <p className="font-display text-2xl text-amber">{t('browse.emptyTitle')}</p>
          <img
            src={`${import.meta.env.BASE_URL}panqueca-not-found.jpeg`}
            alt={t('browse.emptyAltDvds')}
            className="mx-auto w-80 sm:w-96 rounded-xl shadow-lg"
          />
          <p className="text-muted-dark text-sm">{t('browse.emptyHint')}</p>
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  )
}

export default function BrowsePage() {
  const { type } = useParams<{ type: string }>()
  const { t } = useLanguage()

  if (type !== 'cds' && type !== 'dvds') {
    return <Navigate to="/browse/cds" replace />
  }

  const isCds = type === 'cds'

  return (
    <div className="px-4 py-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <h1 className="font-display text-3xl text-amber">
          {isCds ? t('browse.browseCds') : t('browse.browseDvds')}
        </h1>

        {isCds ? <CdBrowse /> : <DvdBrowse />}
      </div>
    </div>
  )
}
