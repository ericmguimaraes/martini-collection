import type { CdItem } from '@/types/cd'
import type { DvdItem } from '@/types/dvd'

export function searchItems<T extends { _search: string }>(
  items: T[],
  query: string,
): T[] {
  if (!query.trim()) return items
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  return items.filter(item =>
    terms.every(term => item._search.includes(term))
  )
}

export function isCdItem(item: CdItem | DvdItem): item is CdItem {
  return 'artist' in item
}
