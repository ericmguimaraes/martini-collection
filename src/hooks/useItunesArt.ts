import { useState, useEffect } from 'react'

const cache = new Map<string, string | null>()

export function useItunesArt(artist: string, album: string): string | null {
  const key = `${artist}|${album}`
  const [url, setUrl] = useState<string | null>(cache.get(key) ?? null)
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
        const artUrl: string | null =
          data.results?.[0]?.artworkUrl100?.replace('100x100', '600x600') ?? null
        cache.set(key, artUrl)
        setUrl(artUrl)
      } catch {
        if (!controller.signal.aborted) {
          cache.set(key, null)
        }
      }
      setTried(true)
    }

    fetchArt()
    return () => controller.abort()
  }, [artist, album, key, tried])

  return url
}
