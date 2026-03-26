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

  deep: {
    cdGenreCoOccurrence: { source: string; target: string; value: number }[]
    dvdGenreCoOccurrence: { source: string; target: string; value: number }[]
    labelGenreAffinity: Record<string, string | number>[]
    artistTiers: { tier: string; count: number }[]
    cdByDecade: { decade: string; count: number }[]
    cdReleaseYearCoverage: number
    cdTagByDecade: Record<string, string | number>[]
    dvdGenreByDecade: Record<string, string | number>[]
    dvdRatingByDecade: { decade: string; avgRating: number; count: number }[]
    composerCrossovers: { name: string; cdCount: number; dvdTitles: string[] }[]
    actorCrossovers: { name: string; cdCount: number; dvdTitles: string[] }[]
    tagGenreBridge: { cdTag: string; dvdGenres: { genre: string; count: number }[] }[]
    musicDvdBreakdown: { category: string; count: number }[]
  }
}
