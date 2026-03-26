export interface DvdItem {
  id: string
  title: string
  originalTitle: string
  sortTitle: string
  genres: string[]
  directors: string[]
  actors: string[]
  musicians: string[]
  releaseYear: number | null
  imdbRating: number | null
  imdbUrl: string
  imdbId?: string
  country: string
  color: string
  language: string
  runtime: number | null
  plot: string
  studios: string
  tag: string
  addedDate: string
  posterUrl?: string
  posterSource?: string
  _search: string
}
