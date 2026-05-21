# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

A personal media collection — the "Martini Collection" — containing a CD collection (1,687 albums) and a DVD collection (507 titles), exported from CLZ Music/Movies apps. The repository includes both the raw data and a React website to showcase the collection.

**Live site**: https://ericmguimaraes.github.io/martini-collection/

## Tech Stack

- **Vite 6 + React 18 + TypeScript** — SPA with lazy-loaded routes
- **Tailwind CSS v4** — dark theme with warm amber/copper palette (`@theme` custom properties in `index.css`)
- **Nivo** — animated charts (`@nivo/bar`, `@nivo/line`, `@nivo/pie`, `@nivo/treemap`, `@nivo/heatmap`, `@nivo/radar`)
- **react-router-dom v6** — `HashRouter` for GitHub Pages compatibility
- **Multi-source artwork** — CD covers from iTunes Search API + MusicBrainz/Cover Art Archive; DVD posters from TMDB. Resolved at **build time** into `artwork-cache.json` (committed) with runtime fallback
- **GitHub Actions** — auto-deploy to GitHub Pages on push to `main`

## Development

```bash
npm install            # install dependencies
npm run prepare-data   # generate JSON from CSVs (required before dev/build)
npm run resolve-artwork # (optional) refresh artwork URL cache
npm run dev            # start dev server
npm run build          # production build to dist/
npm run preview        # serve the production build locally
```

The `build` script runs `prepare-data && tsc -b && vite build` — so it regenerates JSON, type-checks the project, then bundles. **`resolve-artwork` is NOT part of the build pipeline** (it was removed intentionally); the committed `artwork-cache.json` is treated as the source of truth at build time. Run `resolve-artwork` manually only when CSV data changes or when you want to retry items missing artwork.

Deploy happens automatically via GitHub Actions on push to `main`. The workflow reads `TMDB_API_KEY` from repo secrets.

### Artwork setup (optional)

To resolve DVD posters locally, create `.env.local` in the project root (gitignored):

```
TMDB_API_KEY=your_tmdb_api_key_here
```

Get a free key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api). Without it, `resolve-artwork` still works for CDs (iTunes + MusicBrainz are keyless) and DVDs fall back to styled placeholder cards.

## Architecture

### Data Pipeline

CSV data is processed at **build time** by `scripts/prepare-data.ts` into JSON files in `src/data/` (gitignored):
- `cds.json` — 1,687 CD items with `_search` index field
- `dvds.json` — 507 DVD items with `_search` index field
- `stats.json` — pre-computed statistics for the insights page

A separate script `scripts/resolve-artwork.ts` enriches `cds.json` / `dvds.json` with cover-art URLs. It uses a persistent **`artwork-cache.json` committed at the repo root** as both a cache (skip already-resolved items) and a manifest (it's the source of truth for what URLs the site uses). MusicBrainz requests are rate-limited to ≥1200ms per request; iTunes/TMDB use shorter delays.

The React app imports these JSON files as static data — there is no runtime backend.

### Active migration: bundling artwork locally

`docs/BUNDLE_LOCAL_ARTWORK_PLAN.md` describes an in-progress plan to download images during CI (cached via GitHub Actions cache) and serve them as static assets from GitHub Pages, eliminating runtime dependency on external CDNs. Recent commits (`chore: remove resolve-artwork from build pipeline`, `docs: add plan for bundling artwork locally`) are part of this transition. Any artwork-related work should be checked against that plan.

### Project Structure

```
src/
  App.tsx              # HashRouter + lazy-loaded routes
  main.tsx             # Entry point
  index.css            # Tailwind v4 config with @theme custom properties
  data/                # Generated JSON (gitignored)
  types/               # TypeScript interfaces (CdItem, DvdItem, Stats, Filters)
  hooks/
    useArtwork.ts        # Unified artwork hook (reads from cache, falls back to API)
    useItunesArt.ts      # iTunes cover lookup (legacy/fallback)
    useItunesTracks.ts   # iTunes track listing for CD detail
    useFilteredItems.ts  # Search + filter + sort + pagination
    useQueryParams.ts    # URL param sync with { replace: true }
    useReveal.ts         # IntersectionObserver scroll-reveal animations
  lib/                 # search, colors, featured picks, formatters, external link builders
  components/
    layout/              # AppShell (Outlet wrapper), Navbar (desktop), BottomNav (mobile)
    shared/              # SearchBar, FilterBar, SortSelect, Badge, Pagination
    home/                # Hero, NavigationCards, SpotlightStats, FeaturedPicks, CollectionPreview
    cd/                  # CdCard
    dvd/                 # DvdCard
    stats/               # Chart components, StatCard, RevealSection, ChartTheme
  pages/               # HomePage, BrowsePage (CDs or DVDs via route param), InsightsPage,
                       # CdDetailPage, DvdDetailPage, VinylPage, NotFoundPage

scripts/
  prepare-data.ts        # CSV → JSON pipeline (runs on every build)
  resolve-artwork.ts     # Cover/poster URL resolver (run manually, not in build)

resources/               # Raw CSV exports + screenshots (untouched)
artwork-cache.json       # Committed URL manifest produced by resolve-artwork
docs/
  IMPLEMENTATION_PLAN.md      # Original 8-phase plan (complete)
  BUNDLE_LOCAL_ARTWORK_PLAN.md # In-progress: bundle images as static assets
```

### Key Patterns

- **Path alias**: `@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig.json`)
- **Code splitting**: All pages lazy-loaded via `React.lazy()`. Vendor chunks split via `manualChunks` in `vite.config.ts` (`vendor-react`, `vendor-nivo`)
- **Base path**: `base: '/martini-collection/'` in `vite.config.ts` — required for GitHub Pages subpath hosting
- **Responsive layout**: Desktop uses sticky top `Navbar`; mobile uses fixed bottom `BottomNav`. Breakpoint: `sm:` (640px)
- **Image strategy**: CDs show real cover art (from `artwork-cache.json` URLs, with API fallback). DVDs use TMDB posters when a key is available, otherwise styled text cards
- **Search**: Pre-built `_search` field per item concatenates all searchable fields. The universal search bar filters across this field
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

Replace the CSV files in `resources/` and run `npm run prepare-data` to regenerate JSON. If new items are added, refresh `artwork-cache.json` (see below), commit it, then the website picks up changes on next build.

### Maintaining the artwork cache

`artwork-cache.json` is keyed by `item.id` (e.g. `cd-0-abbey-lincoln-...`, `dvd-0-2001-a-space-odyssey`). Each entry holds `{ url, source, resolvedAt }`. `prepare-data.ts` reads it and stitches `artworkUrl`/`posterUrl` into the generated JSON — so the cache file is the **source of truth for what the site renders**. The runtime build does not call external APIs.

**Important caveat about `item.id`**: IDs are derived from the row's index in the CSV (`cd-${i}-...`, `dvd-${i}-...`). If rows are reordered or inserted in the middle of a CSV, IDs shift and cache entries silently stop matching. When editing the CSVs, **append new rows at the end** — don't insert in the middle.

Common scenarios:

- **Added new items to a CSV** — run `npm run resolve-artwork`. It skips entries already in the cache, only hits APIs for new IDs, and re-tries any entry whose previous result was `url: null`. Commit the updated `artwork-cache.json`.
- **Re-try items that previously failed** — same command. `url: null` entries are always retried; no flag needed.
- **One specific item has wrong or broken artwork** — open `artwork-cache.json`, delete that single entry by `id` (or set its `url` to `null`), then `npm run resolve-artwork`. The script will re-fetch just that item.
- **Force a full re-resolution** — delete `artwork-cache.json` entirely and run `npm run resolve-artwork`. Slow (~20 min for CDs because of the MusicBrainz 1200ms rate-limit floor).
- **DVD posters missing** — confirm `.env.local` has `TMDB_API_KEY` and re-run. Without a key, CDs still resolve but DVDs are skipped.
- **Speed up CD resolution at your own risk** — `npm run resolve-artwork -- --delay 50` overrides the iTunes/TMDB delay. MusicBrainz is always clamped to ≥1200ms per their published policy; do not try to undercut it.

After any of the above, run `npm run prepare-data` (or just `npm run build`) so the generated `cds.json`/`dvds.json` pick up the new URLs, then commit `artwork-cache.json`.
