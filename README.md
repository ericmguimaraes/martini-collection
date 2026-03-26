# The Martini Collection

**[Live Site](https://ericmguimaraes.github.io/martini-collection/)** — A curated personal collection of **1,687 CDs** and **507 DVDs**, spanning jazz, Brazilian music, classic cinema, and more.

## The Collection

- **CDs**: Jazz-dominant (54%), strong Brazilian music presence (23%), plus Rock, Classical, and Pop. Labels like Blue Note, Verve, and Columbia. Artists from Miles Davis to Caetano Veloso.
- **DVDs**: Classic cinema focus — 40% pre-1970. Directors like Chaplin, Hitchcock, Kurosawa, and Fellini. Average IMDb rating of 7.6.
- **Vinyl**: Coming soon.

## Website

A mobile-first React SPA with a dark theme inspired by vinyl record stores — warm, intimate, and tactile.

### Pages

- **Home** — Magazine-style showcase with animated counters, featured picks with album cover art, spotlight stats, and latest additions
- **Browse CDs** — Search across artist, title, genre, label, and more. Filter by tag, sort by title/artist/year, paginated grid with iTunes album cover art
- **Browse DVDs** — Search across title, director, actors, genres, country, and more. Filter by genre, sort by title/director/year/IMDb rating, styled text cards with IMDb badges
- **Insights** — Data visualizations with Nivo charts: tag and genre distributions, top artists and directors, decade timelines, IMDb rating histogram, country breakdown, color vs B&W, cross-collection patterns, and a collector profile narrative
- **CD Detail** — Full album info with large iTunes cover art, genre and tag badges, metadata grid, Spotify and YouTube links
- **DVD Detail** — Full film info with IMDb rating circle, cast and crew, plot synopsis, IMDb and Google links
- **Vinyl** — "Coming Soon" teaser page

### Tech Stack

- **Vite 6 + React 18 + TypeScript** — SPA with lazy-loaded routes and vendor chunk splitting
- **Tailwind CSS v4** — dark theme with warm amber/copper palette via `@theme` custom properties
- **Nivo** — animated, responsive charts for the insights page
- **iTunes Search API** — free CD cover art fetched at runtime with in-memory caching
- **GitHub Pages** — deployed automatically via GitHub Actions on push to `main`

### Development

```bash
npm install          # install dependencies
npm run prepare-data # generate JSON from CSV data
npm run dev          # start dev server
npm run build        # production build (runs prepare-data automatically)
```

CSV data is processed at build time by `scripts/prepare-data.ts` into JSON files (`src/data/`). The React app imports these as static data with code-split chunks.

### Search

A universal "search anything" bar works across both CDs and DVDs. Each item has a pre-built `_search` index that concatenates all relevant fields — type "hitchcock" to find DVDs by Hitchcock, "blue note" for CDs on that label, "jazz" for all jazz items.

Search combines with filter pills (AND logic) and syncs to URL parameters.

## Data Sources

Raw collection exports from CLZ Music/Movies apps in `resources/`:
- `20260325_Acervo CDs Martini.csv` — CD collection (77 columns)
- `20260325_Acervo DVDs Martini.csv` — DVD collection (68 columns)
- `collection_analysis.md` — Data analysis with genre distributions, timelines, and collector insights
