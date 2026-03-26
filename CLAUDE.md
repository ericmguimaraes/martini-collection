# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

A personal media collection — the "Martini Collection" — containing a CD collection (1,687 albums) and a DVD collection (507 titles), exported from CLZ Music/Movies apps. The repository includes both the raw data and a React website to showcase the collection.

**Live site**: https://ericmguimaraes.github.io/martini-collection/

## Tech Stack

- **Vite 6 + React 18 + TypeScript** — SPA with lazy-loaded routes
- **Tailwind CSS v4** — dark theme with warm amber/copper palette (`@theme` custom properties in `index.css`)
- **Nivo** — animated charts (`@nivo/bar`, `@nivo/line`, `@nivo/pie`, `@nivo/treemap`)
- **react-router-dom v6** — `HashRouter` for GitHub Pages compatibility
- **iTunes Search API** — free CD cover art fetched at runtime (no API key)
- **GitHub Actions** — auto-deploy to GitHub Pages on push to `main`

## Development

```bash
npm install          # install dependencies
npm run prepare-data # generate JSON from CSVs (required before dev/build)
npm run dev          # start dev server
npm run build        # production build to dist/
```

The `build` script runs `prepare-data` automatically before `vite build`.

Deploy happens automatically via GitHub Actions on push to `main`.

## Architecture

### Data Pipeline

CSV data is processed at **build time** by `scripts/prepare-data.ts` into JSON files in `src/data/` (gitignored):
- `cds.json` — 1,687 CD items with `_search` index field
- `dvds.json` — 507 DVD items with `_search` index field
- `stats.json` — pre-computed statistics for the insights page

The React app imports these as static data. No runtime backend.

### Project Structure

```
src/
  App.tsx              # HashRouter + lazy-loaded routes
  main.tsx             # Entry point
  index.css            # Tailwind v4 config with @theme custom properties
  data/                # Generated JSON (gitignored)
  types/               # TypeScript interfaces (CdItem, DvdItem, Stats, Filters)
  hooks/
    useFilteredItems.ts  # Search + filter + sort + pagination logic
    useQueryParams.ts    # URL param sync with { replace: true }
    useItunesArt.ts      # iTunes API fetch with in-memory Map cache
    useReveal.ts         # IntersectionObserver scroll-reveal animations
  lib/
    search.ts            # Text search across _search index
    colors.ts            # TAG_COLORS/GENRE_COLORS maps, getTagColor/getGenreColor
    featured.ts          # Random pick logic for featured section
    format.ts            # formatNumber, formatRuntime
    links.ts             # Spotify, YouTube, IMDb, Google URL builders
  components/
    layout/              # AppShell (Outlet wrapper), Navbar (desktop), BottomNav (mobile)
    shared/              # SearchBar, FilterBar, SortSelect, Badge, Pagination
    home/                # HeroSection, NavigationCards, SpotlightStats, FeaturedPicks, CollectionPreview
    cd/                  # CdCard (browse card with iTunes art)
    dvd/                 # DvdCard (styled text card with IMDb badge)
    stats/               # Chart components, StatCard, RevealSection, ChartTheme
  pages/
    HomePage.tsx         # Magazine-style: hero, nav cards, stats, featured picks, latest additions
    BrowsePage.tsx       # Search + filter + sort + paginated grid (CDs or DVDs via route param)
    InsightsPage.tsx     # Nivo charts: genres, artists, directors, decades, ratings, cross-patterns
    CdDetailPage.tsx     # Full CD info + iTunes cover art + Spotify/YouTube links
    DvdDetailPage.tsx    # Full DVD info + IMDb rating + IMDb/Google links
    VinylPage.tsx        # "Coming Soon" teaser
    NotFoundPage.tsx     # 404

scripts/
  prepare-data.ts        # CSV → JSON pipeline

resources/               # Raw CSV exports + screenshots (untouched)
docs/
  IMPLEMENTATION_PLAN.md # Original 8-phase plan (all complete)
```

### Key Patterns

- **Path alias**: `@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig.json`)
- **Code splitting**: All pages lazy-loaded via `React.lazy()`. Vendor chunks split via `manualChunks` in vite config (`vendor-react`, `vendor-nivo`)
- **Responsive layout**: Desktop uses sticky top `Navbar`; mobile uses fixed bottom `BottomNav`. Breakpoint: `sm:` (640px)
- **Image strategy**: CDs use iTunes Search API cover art (lazy-loaded, cached in-memory). DVDs use styled text cards (no poster API)
- **Search**: Pre-built `_search` field per item concatenates all searchable fields. Universal search bar filters across this field
- **URL state**: Browse page syncs search, filters, sort, and page to URL params via `useSearchParams`
- **Chart theme**: Dark background with amber/gold/copper palette. Shared config in `components/stats/ChartTheme.ts`

## Data Format Notes

- **CD CSV**: Key columns are `Artist`, `Title`, `Genre`, `Label`, `Tags`, `Discs`, `Length`, `Tracks`, `Added Date`. Genre field can contain pipe-separated multi-genre values (e.g., `Latin | MPB`). Tags are comma-separated and represent the primary organizational categories (Jazz, Música Brasileira, Rock, etc.).
- **DVD CSV**: Key columns are `Title`, `Genres`, `Director`, `Actor`, `Musician`, `Release Year`, `IMDb Rating`, `Country`, `Color`, `Tags`, `Runtime`. Genres are pipe-separated. Tags represent physical storage categories (Filmes, Boxes, Música, Séries) and curation flags (`Doar?` = consider donating).
- Both CSVs use UTF-8 encoding with standard CSV quoting.

## Extending the Collection

### Adding Vinyl Records (planned)

The architecture is ready for a vinyl section:
- Add a new CSV reader in `scripts/prepare-data.ts` → outputs `vinyl.json`
- Create `VinylItem` type in `src/types/`
- Add browse/detail pages following the CD/DVD pattern
- Update the nav config array in `Navbar.tsx` and `BottomNav.tsx`
- The "Coming Soon" page at `/vinyl` already exists

### Updating Collection Data

Replace the CSV files in `resources/` and run `npm run prepare-data` to regenerate JSON. The website picks up changes on next build.
