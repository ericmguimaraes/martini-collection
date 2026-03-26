import { useMemo } from 'react'
import type { CdItem } from '@/types/cd'
import type { DvdItem } from '@/types/dvd'
import type { SortField, SortDirection } from '@/types/filters'
import { searchItems } from '@/lib/search'

interface FilterParams {
  query: string
  tags: string[]
  genres: string[]
  sort: SortField
  direction: SortDirection
}

function compareCds(a: CdItem, b: CdItem, field: SortField): number {
  switch (field) {
    case 'artist': return a.artist.localeCompare(b.artist)
    case 'title': return a.title.localeCompare(b.title)
    case 'year': return (a.releaseYear || 0) - (b.releaseYear || 0)
    default: return a.artist.localeCompare(b.artist)
  }
}

function compareDvds(a: DvdItem, b: DvdItem, field: SortField): number {
  switch (field) {
    case 'title': return a.title.localeCompare(b.title)
    case 'director': return (a.directors[0] || '').localeCompare(b.directors[0] || '')
    case 'year': return (a.releaseYear || 0) - (b.releaseYear || 0)
    case 'rating': return (a.imdbRating || 0) - (b.imdbRating || 0)
    default: return a.title.localeCompare(b.title)
  }
}

export function useFilteredCds(cds: CdItem[], params: FilterParams) {
  return useMemo(() => {
    let result = searchItems(cds, params.query)

    if (params.tags.length > 0) {
      result = result.filter(cd => params.tags.includes(cd.tag))
    }
    if (params.genres.length > 0) {
      result = result.filter(cd => cd.genres.some(g => params.genres.includes(g)))
    }

    const dir = params.direction === 'desc' ? -1 : 1
    result.sort((a, b) => compareCds(a, b, params.sort) * dir)

    return result
  }, [cds, params.query, params.tags, params.genres, params.sort, params.direction])
}

export function useFilteredDvds(dvds: DvdItem[], params: FilterParams) {
  return useMemo(() => {
    let result = searchItems(dvds, params.query)

    if (params.genres.length > 0) {
      result = result.filter(dvd => dvd.genres.some(g => params.genres.includes(g)))
    }

    const dir = params.direction === 'desc' ? -1 : 1
    result.sort((a, b) => compareDvds(a, b, params.sort) * dir)

    return result
  }, [dvds, params.query, params.genres, params.sort, params.direction])
}
