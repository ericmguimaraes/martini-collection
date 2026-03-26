import { useState, useEffect } from 'react'
import { getItunesCollectionId } from './useItunesArt'

export interface ItunesTrack {
  name: string
  trackNumber: number
  discNumber: number
  durationMs: number
}

const trackCache = new Map<number, ItunesTrack[]>()

export function useItunesTracks(artist: string, album: string): { tracks: ItunesTrack[]; loading: boolean } {
  const [tracks, setTracks] = useState<ItunesTrack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    async function fetchTracks() {
      // Wait for useItunesArt to populate the collectionId cache
      let collectionId: number | null = null
      for (let i = 0; i < 20; i++) {
        collectionId = getItunesCollectionId(artist, album)
        if (collectionId !== null) break
        await new Promise(r => setTimeout(r, 250))
      }

      if (!collectionId || cancelled) {
        if (!cancelled) setLoading(false)
        return
      }

      // Check cache
      const cached = trackCache.get(collectionId)
      if (cached) {
        if (!cancelled) {
          setTracks(cached)
          setLoading(false)
        }
        return
      }

      try {
        const res = await fetch(
          `https://itunes.apple.com/lookup?id=${collectionId}&entity=song`,
          { signal: controller.signal },
        )
        const data = await res.json()
        const results: ItunesTrack[] = (data.results ?? [])
          .filter((r: Record<string, unknown>) => r.wrapperType === 'track')
          .map((r: Record<string, unknown>) => ({
            name: r.trackName as string,
            trackNumber: r.trackNumber as number,
            discNumber: r.discNumber as number,
            durationMs: r.trackTimeMillis as number,
          }))
          .sort((a: ItunesTrack, b: ItunesTrack) =>
            a.discNumber !== b.discNumber
              ? a.discNumber - b.discNumber
              : a.trackNumber - b.trackNumber,
          )
        trackCache.set(collectionId, results)
        if (!cancelled) {
          setTracks(results)
          setLoading(false)
        }
      } catch {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTracks()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [artist, album])

  return { tracks, loading }
}
