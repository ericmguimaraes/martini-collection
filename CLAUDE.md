# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

A personal media collection — the "Martini Collection" — containing a CD collection (1687 albums) and a DVD collection (507 titles), exported from CLZ Music/Movies apps. The repository includes both the raw data and a React website to showcase the collection.

## Current Project: Website

We are building a **Vite + React + TypeScript** website to showcase the collection, hosted on **GitHub Pages**.

**Full implementation plan with progress tracking**: [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md)

When starting a new session:
1. Read `docs/IMPLEMENTATION_PLAN.md` to see which phases/steps are completed (checkboxes)
2. Pick up the next unchecked step and continue
3. After completing a step, mark its checkbox as `- [x]` and commit

**Key design decisions**:
- Mobile-first, dark theme with vinyl record store aesthetic
- CSV data processed at build time into JSON (`scripts/prepare-data.ts`)
- iTunes Search API for CD cover art (free, no key)
- Styled text cards for DVDs (no poster API)
- Universal "search anything" bar across all fields
- Nivo charts for insights page
- HashRouter for GitHub Pages compatibility
- Vinyl section planned for future (show "Coming Soon" in nav)

## Repository Structure

- `resources/20260325_Acervo CDs Martini.csv` — Full CD collection export (CLZ Music format)
- `resources/20260325_Acervo DVDs Martini.csv` — Full DVD collection export (CLZ Movies format)
- `resources/collection_analysis.md` — Generated analysis with genre distributions, timelines, cross-genre patterns, and collector profile insights
- `resources/image (1-4).png` — Screenshots from the CLZ Music/Movies apps
- `docs/IMPLEMENTATION_PLAN.md` — Website implementation plan with progress checkboxes
- `src/` — React website source (once scaffolded)
- `scripts/` — Build-time data processing scripts

## Data Format Notes

- **CD CSV**: Key columns are `Artist`, `Title`, `Genre`, `Label`, `Tags`, `Discs`, `Length`, `Tracks`, `Added Date`. Genre field can contain pipe-separated multi-genre values (e.g., `Latin | MPB`). Tags are comma-separated and represent the primary organizational categories (Jazz, Música Brasileira, Rock, etc.).
- **DVD CSV**: Key columns are `Title`, `Genres`, `Director`, `Actor`, `Musician`, `Release Year`, `IMDb Rating`, `Country`, `Color`, `Tags`, `Runtime`. Genres are pipe-separated. Tags represent physical storage categories (Filmes, Boxes, Música, Séries) and curation flags (`Doar?` = consider donating).
- Both CSVs use UTF-8 encoding with standard CSV quoting.

## Working With the Data

For data analysis, use Python (`csv` module or `pandas`). When regenerating `collection_analysis.md`, write a Python script to `/tmp/` and run it from the repo root.

For the website, data is processed by `scripts/prepare-data.ts` at build time — run `npm run prepare-data` to regenerate the JSON files in `src/data/`.

## Website Development

```bash
npm install          # install dependencies
npm run prepare-data # generate JSON from CSVs
npm run dev          # start dev server
npm run build        # production build to dist/
```

Deploy happens automatically via GitHub Actions on push to `main`.
