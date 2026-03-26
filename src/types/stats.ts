export interface CollectionStats {
  totalCds: number
  totalDvds: number
  uniqueArtists: number
  uniqueDirectors: number
  uniqueLabels: number

  cd: {
    tagDistribution: { tag: string; count: number }[]
    genreDistribution: { genre: string; count: number }[]
    topArtists: { name: string; count: number }[]
    topLabels: { name: string; count: number }[]
    catalogingTimeline: { month: string; count: number }[]
  }

  dvd: {
    genreDistribution: { genre: string; count: number }[]
    topDirectors: { name: string; count: number }[]
    byDecade: { decade: string; count: number }[]
    ratingDistribution: { rating: string; count: number }[]
    countryDistribution: { country: string; count: number }[]
    colorDistribution: { color: string; count: number }[]
    topActors: { name: string; count: number }[]
    avgImdbRating: number
    prePct1970: number
  }

  cross: {
    musicDvdCount: number
    sharedArtists: string[]
  }
}
