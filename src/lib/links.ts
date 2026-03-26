function encode(s: string): string {
  return encodeURIComponent(s)
}

export function spotifySearchUrl(artist: string, title: string): string {
  return `https://open.spotify.com/search/${encode(`${artist} ${title}`)}`
}

export function youtubeSearchUrl(artist: string, title: string): string {
  const q = `${artist} ${title} full album`
  return `https://www.youtube.com/results?search_query=${encode(q)}`
}

export function googleFilmUrl(title: string, year: number | null): string {
  const q = year ? `${title} ${year} film` : `${title} film`
  return `https://www.google.com/search?q=${encode(q)}`
}

export function itunesSearchUrl(artist: string, title: string): string {
  const term = `${artist} ${title}`
  return `https://itunes.apple.com/search?term=${encode(term)}&media=music&entity=album&limit=1`
}
