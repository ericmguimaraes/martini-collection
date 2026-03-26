# The Martini Collection

**[Live Site](https://ericmguimaraes.github.io/martini-collection/)** — A curated personal collection of **1,687 CDs** and **507 DVDs**, spanning jazz, Brazilian music, classic cinema, and more.

## The Collection

- **CDs**: Jazz-dominant (54%), strong Brazilian music presence (23%), plus Rock, Classical, and Pop. Labels like Blue Note, Verve, and Columbia. Artists from Miles Davis to Caetano Veloso.
- **DVDs**: Classic cinema focus — 40% pre-1970. Directors like Chaplin, Hitchcock, Kurosawa, and Fellini. Average IMDb rating of 7.6.
- **Vinyl**: Coming soon.

## Website

A mobile-first React SPA with a dark theme inspired by vinyl record stores.

- **Home**: Magazine-style showcase with animated counters, featured picks, and collection stats
- **Browse**: Search and filter CDs and DVDs across all fields — artist, title, genre, director, actors, label, and more
- **Insights**: Data visualizations with Nivo charts — genre distributions, top artists/directors, decade timelines, IMDb ratings, and cross-collection patterns
- **Detail Pages**: Full item info with CD cover art (iTunes API), Spotify/YouTube links for music, IMDb/Google links for films

### Tech Stack

- **Vite 6 + React 18 + TypeScript** — SPA framework with lazy-loaded routes
- **Tailwind CSS v4** — dark theme with warm amber/copper palette
- **Nivo** — animated, responsive charts for the insights page
- **GitHub Pages** — deployed automatically via GitHub Actions on push to main
- **iTunes Search API** — free CD cover art fetched at runtime

### Development

```bash
npm install          # install dependencies
npm run prepare-data # generate JSON from CSV data
npm run dev          # start dev server
npm run build        # production build
```

CSV data is processed at build time by `scripts/prepare-data.ts` into JSON files. The React app imports these as static data with code-split chunks.

## Data Sources

Raw collection exports from CLZ Music/Movies apps in `resources/`:
- `20260325_Acervo CDs Martini.csv` — CD collection (77 columns)
- `20260325_Acervo DVDs Martini.csv` — DVD collection (68 columns)
- `collection_analysis.md` — Data analysis with genre distributions, timelines, and collector insights
