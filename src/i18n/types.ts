export type Language = 'en' | 'pt'

export interface Translations {
  nav: {
    home: string
    cds: string
    dvds: string
    insights: string
    vinyl: string
    soon: string
    siteTitle: string
  }
  footer: {
    tagline: string
  }
  home: {
    tagline: string
    searchPlaceholder: string
    collectionAtAGlance: string
    musicalDna: string
    musicalDnaDesc: string
    qualityBar: string
    qualityBarDesc: string
    deepNotBroad: string
    deepNotBroadDesc: string
    worldsBridged: string
    worldsBridgedDesc: string
    musicByGenre: string
    fullBreakdown: string
    mostCollectedArtists: string
    album: string
    albums: string
    musicMeetsCinema: string
    musicMeetsCinemaDesc: string
    seeAllInsights: string
    fromTheCollection: string
    shuffle: string
    shufflePicks: string
    more: string
  }
  browse: {
    browseCds: string
    browseDvds: string
    searchCdsPlaceholder: string
    searchDvdsPlaceholder: string
    showingCds: string
    showingDvds: string
    emptyTitle: string
    emptyHint: string
    emptyAltCds: string
    emptyAltDvds: string
    sortArtistAZ: string
    sortArtistZA: string
    sortTitleAZ: string
    sortYearNewest: string
    sortYearOldest: string
    sortDirectorAZ: string
    sortRatingBest: string
    sortRatingLowest: string
  }
  cd: {
    backToCds: string
    label: string
    year: string
    discs: string
    tracks: string
    length: string
    catalogNo: string
    composer: string
    conductor: string
    tracklist: string
    disc: string
    loadingTracklist: string
  }
  dvd: {
    backToDvds: string
    imdb: string
    director: string
    directors: string
    cast: string
    musicians: string
    synopsis: string
    country: string
    studio: string
    collection: string
  }
  insights: {
    title: string
    subtitle: string
    cds: string
    dvds: string
    artists: string
    directorsLabel: string
    labels: string
    cdCollection: string
    tags: string
    topGenres: string
    topArtists: string
    topLabels: string
    catalogingTimeline: string
    dvdCollection: string
    genres: string
    topDirectors: string
    dvdsByDecade: string
    imdbRatingDistribution: string
    countryOfOrigin: string
    colorVsBw: string
    topActors: string
    acrossCollections: string
    deepAnalysis: string
    deepAnalysisSubtitle: string
    collectionPatterns: string
    cdGenreCoOccurrence: string
    cdGenreCoOccurrenceAnnotation: string
    dvdGenreCoOccurrence: string
    dvdGenreCoOccurrenceAnnotation: string
    labelIdentity: string
    labelIdentityAnnotation: string
    artistDepth: string
    throughTheDecades: string
    cdsByDecade: string
    imdbRatingByDecade: string
    cdCollectionByDecade: string
    cdCollectionByDecadeAnnotation: string
    dvdCollectionByDecade: string
    dvdCollectionByDecadeAnnotation: string
    musicMeetsCinema: string
    composersBridging: string
    composersBridgingDesc: string
    artistsOnScreen: string
    artistsOnScreenDesc: string
    musicDvdsByCategory: string
    collectorTasteFingerprint: string
    musicToFilmGenreBridge: string
    musicToFilmGenreBridgeDesc: string
    crossCollectionPatterns: string
    musicDvdsBridge: string
    artistsAppearInBoth: string
    sharedArtists: string
    collectorProfile: string
    collectorProfileP1: string
    collectorProfileP2: string
    collectorProfileP3: string
    collectorProfileP4: string
    jazzDepth: string
    brazilianMusic: string
    classical: string
    classicCinema: string
    qualityBarRadar: string
    international: string
  }
  pagination: {
    prev: string
    next: string
    previousPage: string
    nextPage: string
    page: string
  }
  notFound: {
    panquecaMessage: string
    code: string
    subtitle: string
    backHome: string
    panquecaAlt: string
  }
  vinyl: {
    title: string
    comingSoon: string
    description: string
    stayTuned: string
  }
  common: {
    clearSearch: string
    more: string
  }
}

type NestedKeyOf<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : NestedKeyOf<T[K], `${Prefix}${K}.`>
}[keyof T & string]

export type TranslationKey = NestedKeyOf<Translations>
