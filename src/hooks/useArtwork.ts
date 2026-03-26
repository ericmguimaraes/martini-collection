import { useState, useEffect } from 'react'
import type { CdItem } from '@/types/cd'
import type { DvdItem } from '@/types/dvd'

// ── Runtime fallback cache (for items without pre-resolved URLs) ─────────

const runtimeCache = new Map<string, string | null>()

// ── Cover Art Archive runtime fallback ───────────────────────────────────

async function fetchCoverArtArchive(
  artist: string,
  album: string,
  signal: AbortSignal,
): Promise<string | null> {
  const q = encodeURIComponent(`release:"${album}" AND artist:"${artist}"`)
  const mbRes = await fetch(
    `https://musicbrainz.org/ws/2/release/?query=${q}&limit=1&fmt=json`,
    {
      signal,
      headers: {
        'User-Agent':
          'MartiniCollection/1.0 (github.com/ericmguimaraes/martini-collection)',
      },
    },
  )
  if (!mbRes.ok) return null
  const mbData = await mbRes.json()
  const mbid = mbData.releases?.[0]?.id
  if (!mbid) return null

  const caaRes = await fetch(`https://coverartarchive.org/release/${mbid}`, {
    signal,
    redirect: 'follow',
  })
  if (!caaRes.ok) return null
  const caaData = await caaRes.json()
  const front = caaData.images?.find(
    (img: { front: boolean }) => img.front,
  )
  return (
    front?.thumbnails?.large ||
    front?.thumbnails?.['500'] ||
    front?.image ||
    null
  )
}

// ── iTunes runtime fallback ──────────────────────────────────────────────

async function fetchItunesArt(
  artist: string,
  album: string,
  signal: AbortSignal,
): Promise<{ artUrl: string | null; collectionId: number | null }> {
  const q = encodeURIComponent(`${artist} ${album}`)
  const res = await fetch(
    `https://itunes.apple.com/search?term=${q}&media=music&entity=album&limit=1`,
    { signal },
  )
  if (!res.ok) return { artUrl: null, collectionId: null }
  const data = await res.json()
  const result = data.results?.[0]
  const artUrl = result?.artworkUrl100?.replace('100x100', '600x600') ?? null
  const collectionId = result?.collectionId ?? null
  return { artUrl, collectionId }
}

// ── Shared iTunes collection ID cache (for useItunesTracks compat) ───────

const itunesIdCache = new Map<string, number | null>()

export function getItunesCollectionId(
  artist: string,
  album: string,
): number | null {
  return itunesIdCache.get(`${artist}|${album}`) ?? null
}

// ── CD Artwork Hook ──────────────────────────────────────────────────────

export function useCdArtwork(cd: CdItem): string | null {
  // If pre-resolved at build time, return immediately
  if (cd.artworkUrl) return cd.artworkUrl

  const key = `${cd.artist}|${cd.title}`
  const [url, setUrl] = useState<string | null>(runtimeCache.get(key) ?? null)
  const [tried, setTried] = useState(runtimeCache.has(key))

  useEffect(() => {
    if (tried) return

    const controller = new AbortController()
    const { signal } = controller

    async function resolve() {
      try {
        // Try iTunes first
        const itunes = await fetchItunesArt(cd.artist, cd.title, signal)
        itunesIdCache.set(key, itunes.collectionId)

        if (itunes.artUrl) {
          runtimeCache.set(key, itunes.artUrl)
          setUrl(itunes.artUrl)
          setTried(true)
          return
        }

        // Fallback: MusicBrainz + Cover Art Archive
        const caaUrl = await fetchCoverArtArchive(cd.artist, cd.title, signal)
        if (caaUrl) {
          runtimeCache.set(key, caaUrl)
          setUrl(caaUrl)
          setTried(true)
          return
        }

        // Nothing found
        runtimeCache.set(key, null)
        setTried(true)
      } catch {
        if (!signal.aborted) {
          runtimeCache.set(key, null)
          setTried(true)
        }
      }
    }

    resolve()
    return () => controller.abort()
  }, [cd.artist, cd.title, key, tried])

  return url
}

// ── DVD Poster Hook ──────────────────────────────────────────────────────

export function useDvdPoster(dvd: DvdItem): string | null {
  // DVDs only have build-time resolution (TMDB needs API key)
  return dvd.posterUrl ?? null
}
