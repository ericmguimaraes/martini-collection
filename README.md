# The Martini Collection

A curated personal collection of **1,687 CDs** and **507 DVDs** — spanning jazz, Brazilian music, classic cinema, and more.

This repository contains the collection data and a website to showcase it, hosted on GitHub Pages.

## The Collection

- **CDs**: Jazz-dominant (54%), strong Brazilian music presence (23%), plus Rock, Classical, and Pop. Labels like Blue Note, Verve, and Columbia. Artists from Miles Davis to Caetano Veloso.
- **DVDs**: Classic cinema focus — 40% pre-1970. Directors like Chaplin, Hitchcock, Kurosawa, and Fellini. Average IMDb rating of 7.6.
- **Vinyl**: Coming soon.

## Website

A mobile-first React SPA with a dark theme inspired by vinyl record stores.

- **Home**: Magazine-style showcase with featured picks and collection stats
- **Browse**: Search and filter CDs and DVDs across all fields (artist, title, genre, director, actors, label...)
- **Insights**: Beautiful data visualizations of the collection's patterns
- **Details**: Full item info with links to Spotify, YouTube, IMDb, and Google

### Development

```bash
npm install          # install dependencies
npm run prepare-data # generate JSON from CSV data
npm run dev          # start dev server
npm run build        # production build
```

### Tech Stack

Vite + React 18 + TypeScript, Tailwind CSS, Nivo charts, GitHub Pages deployment.

## Data Sources

Raw collection exports from CLZ Music/Movies apps in `resources/`:
- `20260325_Acervo CDs Martini.csv` — CD collection (77 columns)
- `20260325_Acervo DVDs Martini.csv` — DVD collection (68 columns)
- `collection_analysis.md` — Data analysis with genre distributions, timelines, and collector insights

## Implementation Plan

See [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) for the full plan with progress tracking.
