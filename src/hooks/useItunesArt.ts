import { useState, useEffect } from 'react'

interface CacheEntry {
  artUrl: string | null
  collectionId: number | null
}

const cache = new Map<string, CacheEntry>()

function cacheKey(artist: string, album: string) {
  return `${artist}|${album}`
}

export function getItunesCollectionId(artist: string, album: string): number | null {
  return cache.get(cacheKey(artist, album))?.collectionId ?? null
}

export function useItunesArt(artist: string, album: string): string | null {
  const key = cacheKey(artist, album)
  const [url, setUrl] = useState<string | null>(cache.get(key)?.artUrl ?? null)
  const [tried, setTried] = useState(cache.has(key))

  useEffect(() => {
    if (tried) return

    const controller = new AbortController()

    async function fetchArt() {
      try {
        const q = encodeURIComponent(`${artist} ${album}`)
        const res = await fetch(
          `https://itunes.apple.com/search?term=${q}&media=music&entity=album&limit=1`,
          { signal: controller.signal },
        )
        const data = await res.json()
        const result = data.results?.[0]
        const artUrl: string | null =
          result?.artworkUrl100?.replace('100x100', '600x600') ?? null
        const collectionId: number | null = result?.collectionId ?? null
        cache.set(key, { artUrl, collectionId })
        setUrl(artUrl)
      } catch {
        if (!controller.signal.aborted) {
          cache.set(key, { artUrl: null, collectionId: null })
        }
      }
      setTried(true)
    }

    fetchArt()
    return () => controller.abort()
  }, [artist, album, key, tried])

  return url
}
