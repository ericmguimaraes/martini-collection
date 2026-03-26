import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { SortField, SortDirection } from '@/types/filters'
import { ITEMS_PER_PAGE } from '@/types/filters'

export interface QueryState {
  query: string
  tags: string[]
  genres: string[]
  sort: SortField
  direction: SortDirection
  page: number
}

const DEFAULT_CD_SORT: SortField = 'artist'
const DEFAULT_DVD_SORT: SortField = 'title'

export function useQueryParams(mediaType: 'cds' | 'dvds') {
  const [searchParams, setSearchParams] = useSearchParams()

  const state: QueryState = useMemo(() => ({
    query: searchParams.get('q') || '',
    tags: searchParams.getAll('tag'),
    genres: searchParams.getAll('genre'),
    sort: (searchParams.get('sort') as SortField) || (mediaType === 'cds' ? DEFAULT_CD_SORT : DEFAULT_DVD_SORT),
    direction: (searchParams.get('dir') as SortDirection) || 'asc',
    page: Math.max(1, parseInt(searchParams.get('page') || '1', 10)),
  }), [searchParams, mediaType])

  const setQuery = useCallback((q: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (q) next.set('q', q); else next.delete('q')
      next.delete('page')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const toggleTag = useCallback((tag: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      const tags = next.getAll('tag')
      next.delete('tag')
      if (tags.includes(tag)) {
        tags.filter(t => t !== tag).forEach(t => next.append('tag', t))
      } else {
        [...tags, tag].forEach(t => next.append('tag', t))
      }
      next.delete('page')
      return next
    })
  }, [setSearchParams])

  const toggleGenre = useCallback((genre: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      const genres = next.getAll('genre')
      next.delete('genre')
      if (genres.includes(genre)) {
        genres.filter(g => g !== genre).forEach(g => next.append('genre', g))
      } else {
        [...genres, genre].forEach(g => next.append('genre', g))
      }
      next.delete('page')
      return next
    })
  }, [setSearchParams])

  const setSort = useCallback((field: SortField, direction: SortDirection) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('sort', field)
      next.set('dir', direction)
      next.delete('page')
      return next
    })
  }, [setSearchParams])

  const setPage = useCallback((page: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (page > 1) next.set('page', String(page)); else next.delete('page')
      return next
    })
  }, [setSearchParams])

  return {
    state,
    setQuery,
    toggleTag,
    toggleGenre,
    setSort,
    setPage,
    itemsPerPage: ITEMS_PER_PAGE,
  }
}
