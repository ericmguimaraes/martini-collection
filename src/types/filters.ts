export type SortField = 'title' | 'year' | 'artist' | 'director' | 'rating'
export type SortDirection = 'asc' | 'desc'

export interface FilterState {
  query: string
  tags: string[]
  genres: string[]
  sort: SortField
  direction: SortDirection
  page: number
}

export const ITEMS_PER_PAGE = 48
