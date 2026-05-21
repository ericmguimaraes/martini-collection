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
- **Multi-source cover art** — CD artwork from iTunes + MusicBrainz/Cover Art Archive; DVD posters from TMDB. Resolved at build time with runtime fallback
- **GitHub Pages** — deployed automatically via GitHub Actions on push to `main`

### Development

```bash
npm install            # install dependencies
npm run prepare-data   # generate JSON from CSV data
npm run resolve-artwork # resolve cover art & poster URLs (see below)
npm run dev            # start dev server
npm run build          # production build (runs prepare-data + type-check + bundle)
```

CSV data is processed at build time by `scripts/prepare-data.ts` into JSON files (`src/data/`). The React app imports these as static data with code-split chunks. `prepare-data` also merges the committed `artwork-cache.json` so each item gets its cover URL — the build never hits external APIs.

### Cover Art & Poster Setup

The `resolve-artwork` script fetches artwork URLs from external APIs at build time and caches them in `artwork-cache.json`. CD artwork works without any configuration (iTunes and MusicBrainz are free/keyless). DVD posters require a free TMDB API key.

**Local setup** — create a `.env.local` file in the project root (already gitignored):

```
TMDB_API_KEY=your_tmdb_api_key_here
```

Get a free TMDB API key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

**CI/CD** — the GitHub Actions workflow reads `TMDB_API_KEY` from repository secrets. Add it via Settings > Secrets and variables > Actions.

**Without a TMDB key**, the build still works — DVD posters are skipped and DVDs show styled gradient placeholders instead. CD artwork is unaffected.

The `artwork-cache.json` file is committed to git and is the source of truth for what the site renders. `prepare-data` reads it on every build, so once an item is in the cache the URL never needs to be re-fetched. The first run takes ~20 minutes for CDs (MusicBrainz rate-limit); after that it's near-instant.

### Updating the artwork cache

`artwork-cache.json` is keyed by `item.id` (e.g. `cd-0-abbey-lincoln-...`). Each entry is `{ url, source, resolvedAt }`. `url: null` means the item was tried and nothing was found.

> ⚠️ IDs are derived from the row's index in the CSV (`cd-${i}-...`, `dvd-${i}-...`). Inserting new rows in the middle of a CSV shifts the IDs and silently invalidates the cache. **Append new rows at the end.**

Common updates:

- **Added new items to a CSV** — run `npm run resolve-artwork`. Cached items are skipped; only new IDs hit external APIs. Any previous `url: null` is automatically retried.
- **Fix one specific item with wrong/broken artwork** — open `artwork-cache.json`, delete that entry (or set its `url` to `null`), then run `npm run resolve-artwork` again.
- **Force a full re-resolution** — delete `artwork-cache.json` entirely and re-run. Slow (~20 min for CDs).
- **DVD posters missing** — confirm `TMDB_API_KEY` is set in `.env.local` and re-run.
- **Speed up CD resolution** — `npm run resolve-artwork -- --delay 50` lowers the iTunes/TMDB delay. MusicBrainz is always clamped to ≥1200ms per their published policy.

After updating, run `npm run prepare-data` (or `npm run build`) so the generated `cds.json`/`dvds.json` pick up the new URLs, then commit `artwork-cache.json`.

### Search

A universal "search anything" bar works across both CDs and DVDs. Each item has a pre-built `_search` index that concatenates all relevant fields — type "hitchcock" to find DVDs by Hitchcock, "blue note" for CDs on that label, "jazz" for all jazz items.

Search combines with filter pills (AND logic) and syncs to URL parameters.

## Data Sources

Raw collection exports from CLZ Music/Movies apps in `resources/`:
- `20260325_Acervo CDs Martini.csv` — CD collection (77 columns)
- `20260325_Acervo DVDs Martini.csv` — DVD collection (68 columns)
- `collection_analysis.md` — Data analysis with genre distributions, timelines, and collector insights
