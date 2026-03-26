# Plan: Martini Collection Website (Vite + React + TypeScript)

## Context

The Martini Collection is a personal media collection (1,687 CDs + 507 DVDs) currently stored as CSV exports. We need a beautiful, mobile-first website hosted on GitHub Pages to showcase the collection with a magazine-style homepage, rich data insights, browsing, detail pages, and external links.

## Tech Stack

- **Vite + React 18 + TypeScript** — SPA framework
- **Tailwind CSS v4** — styling (mobile-first, dark theme, vinyl store aesthetic)
- **react-router-dom v6** — routing with `HashRouter` (GitHub Pages compatible)
- **Nivo** — beautiful animated charts for insights page
- **csv-parse** — dev dependency for build-time CSV processing
- **tsx** — runs the TypeScript prebuild script

## Architecture

CSV data is processed at **build time** by `scripts/prepare-data.ts` into JSON files (`src/data/cds.json`, `dvds.json`, `stats.json`). The React app imports these as static data.

`HashRouter` + `base: '/martini-collection/'` in Vite config for GitHub Pages.

## Visual Theme — Dark Theme with Vinyl Store Warmth

A **dark theme** inspired by the atmosphere of a curated vinyl record store — warm, intimate, and tactile. The dark foundation is non-negotiable; the vinyl store vibe comes through the warm tones, textures, and typography.

**Color Palette (dark-first)**:
- **Background**: Near-black (`#121212`, `#0f0f0f`) — the dominant surface, always dark
- **Surface/cards**: Dark warm gray (`#1e1c1a`, `#2a2523`) — subtle warmth over pure gray
- **Primary accent**: Warm amber/gold (`#d4a053`, `#c4923a`) — vinyl label lettering, highlights
- **Secondary accent**: Muted copper (`#b8734a`) — vintage warmth for secondary elements
- **Text**: Warm off-white (`#f0e6d6`) — cream tone, not cold white
- **Muted text**: Dusty tan (`#a09080`) — secondary info, metadata

**Typography**:
- **Headings**: Serif or display font (e.g., Playfair Display, DM Serif) — classic, elegant
- **Body**: Clean sans-serif (e.g., Inter, DM Sans) — readable, modern contrast
- **Monospace accents** for metadata (track counts, runtimes, catalog numbers)

**Visual Elements**:
- Subtle grain/noise texture overlay on backgrounds (like aged paper/cardboard)
- Cards with slight warm shadow and hover lift — like pulling a record from a shelf
- Genre badges as rounded pills with warm muted colors
- Dividers using subtle dotted or dashed lines (like shelf edges)
- IMDb rating badges as vinyl-label-style circles
- Hover effects with warm glow, not cold blue focus rings
- Charts use the amber/gold/copper palette consistently

**Mood**: Warm, curated, analog. Like a collector's personal listening room — not a sterile digital catalog.

## Extensibility — Future Vinyl Section

A vinyl record section will be added later. The architecture accounts for this:
- **Data pipeline**: `prepare-data.ts` processes each media type independently — adding vinyl = adding a new CSV reader + JSON output
- **Types**: media-type-aware design so `CdItem`, `DvdItem`, and future `VinylItem` follow the same patterns
- **Navigation**: nav bar and homepage navigation cards are driven by a config array of media types — adding a new entry is trivial
- **Browse/Detail**: follow the same pattern per media type (reusable hooks, new card/detail components)
- **UX "Coming Soon" hint**: Navigation shows a "Vinyl" entry with a "Coming Soon" badge. Clicking it opens a teaser page: "This section is being curated. Stay tuned." — visible but clearly WIP.

## Image Strategy

- **CD covers**: **iTunes Search API** at runtime — free, no API key, no account. The app queries `https://itunes.apple.com/search?term={artist}+{album}&media=music&entity=album&limit=1` and displays the returned artwork URL. Lazy-loaded as cards scroll into view. Fallback: styled text card with genre-colored accent.
- **DVD posters**: **Styled text cards** — no external images. Rich typography with prominent IMDb rating badge, genre color accents, director name, and year. Clean and elegant on the dark theme.
- **Detail pages**: CD detail shows iTunes cover art (larger). DVD detail uses styled layout without poster.

## Search Architecture

**"Search anything" bar** — prominent on both the homepage and browse pages. Searches across ALL relevant fields using a pre-built `_search` index per item:

- **CDs**: `artist + title + genres + tag + label + composer + conductor`
- **DVDs**: `title + directors + actors + genres + tags + country + studios`

Typing "hitchcock" → DVDs by Hitchcock. "blue note" → CDs on that label. "jazz" → CDs and DVDs with jazz. "chaplin" → DVDs by/with Chaplin.

The homepage search bar navigates to the browse page with the query pre-filled. On browse pages, search combines with filter pills (AND logic). State syncs to URL params.

## Pages

### 1. Home Page (`/`) — Magazine-Style Full Showcase

**Hero Section** (full viewport height on mobile)
- Large title "The Martini Collection" with elegant serif/display font
- Tagline: "A curated collection of music and cinema"
- Animated counters: **1,687 CDs** / **507 DVDs**
- Warm gradient background with subtle texture
- **Search anything bar** — centered, prominent, placeholder: "Search artists, albums, directors, genres..."
  - On submit → navigates to `/browse/cds` or `/browse/dvds` with query (or a unified results view)

**Navigation Strip** (first-class, always visible)
- Prominent navigation cards/buttons right below the hero: **CDs** / **DVDs** / **Insights**
- On mobile: horizontal card strip, large touch targets
- On desktop: three elegant cards in a row with icons and item counts

**Spotlight Stats** (3-4 visual cards)
- "Jazz Heart" — 54% of CDs are Jazz, mini donut/ring visual
- "Classic Cinema" — 40% of DVDs are pre-1970
- "Curated Quality" — Average IMDb rating 7.6
- "26 Artists" bridge both CD and DVD collections

**Featured Picks — "From the Collection"**
Random selection of 4-6 items, filtered to quality items matching the collector's style:
- CDs: randomly pick from Jazz + Música Brasileira tags (the core of the collection), from well-known labels (Blue Note, Verve, Columbia)
- DVDs: randomly pick from items with IMDb rating ≥ 7.5, from notable directors (Hitchcock, Kurosawa, Chaplin, Fellini, Visconti, etc.)
- Refreshes on each page load (random seed)
- CD picks show iTunes cover art, DVD picks show styled cards
- Each links to its detail page

**Collection Preview Strip**
- "Latest additions" — 6-8 most recently added items (from Added Date) as a horizontal scrollable strip
- Shows a mix of CDs and DVDs

### 2. Insights Page (`/insights`) — Beautiful Data Visualizations

First-class data page with polished Nivo charts. Dark backgrounds, amber/gold/warm accent colors, smooth animations.

**Collection Overview**
- Big animated stat cards: total CDs, DVDs, unique artists, unique directors, unique labels

**CD Collection Section**
- Tag distribution — **Nivo horizontal bar chart** (Jazz 913, Música Brasileira 395, Rock 111, etc.)
- Genre distribution — **Nivo treemap** showing genre variety within tags
- Top 15 artists — **Nivo bar chart** (Various Artists 62, Thelonious Monk 16, Miles Davis 15...)
- Top labels — **Nivo bar chart** (Blue Note 97, Verve 70, Columbia 49...)
- Cataloging timeline — **Nivo line chart** (Jan 877, Feb 459, Mar 351)

**DVD Collection Section**
- Genre distribution — **Nivo horizontal bar chart** (Drama 284, Romance 158, Comedy 130...)
- Top 15 directors — **Nivo bar chart** (Chaplin 17, Hitchcock 14, Kurosawa 8...)
- DVDs by decade — **Nivo area chart** (1920s through 2010s, peak in 2000s, 40% pre-1970)
- IMDb rating distribution — **Nivo bar histogram** (annotated avg 7.6)
- Country of origin — **Nivo pie/donut** (USA 61%, UK 11%, Italy 7%, Brazil 4%...)
- Color vs B&W — **Nivo pie** (79% color, 21% B&W)
- Top actors — styled ranked list (Chaplin 15, Mastroianni 11, etc.)

**Cross-Collection Patterns**
- 85 Music DVDs bridge both collections
- 26+ shared artists (B.B. King, Caetano Veloso, Frank Sinatra...)
- Brazilian culture in both: MPB in CDs, Brazilian cinema in DVDs

**Collector Profile**
- Narrative card summarizing musical and cinema taste

All charts: responsive (full-width mobile, 2-col desktop), animated on scroll into view.

### 3. Browse Page (`/browse/cds` and `/browse/dvds`)
- Route-based toggle: CDs | DVDs
- **Search bar** (sticky) — same universal search, pre-filled if coming from homepage
- Filter pills by genre/tag (horizontally scrollable on mobile)
- Sort dropdown (title, year, artist/director, IMDb rating for DVDs)
- Result count: "Showing 42 of 1,687 CDs"
- Responsive card grid (1 col mobile, 2 tablet, 3-4 desktop)
- CD cards show iTunes cover art (lazy loaded) + artist, title, genre badges, year
- DVD cards show styled text card + director, genre badges, year, IMDb rating badge
- Pagination (48 items/page)
- Each card links to detail page

### 4. Detail Pages (`/cd/:id` and `/dvd/:id`)

**CD Detail Page**:
- iTunes album cover art (large, ~300px)
- Artist name (large), album title
- Genre badges, tag, label, release year
- Disc count, track count, total length
- Composer, conductor (if available)
- **Spotify button**: opens `https://open.spotify.com/search/{artist} {title}`
- **YouTube button**: opens `https://www.youtube.com/results?search_query={artist}+{title}+full+album`
- Back to browse

**DVD Detail Page**:
- Styled header (no poster) with title large, year, IMDb badge prominent
- Director(s), full actor list
- Genre badges, country, runtime, color/B&W, language
- Plot synopsis
- **IMDb button**: direct link from `imdbUrl` field
- **Google button**: opens `https://www.google.com/search?q={title}+{year}+film`
- Back to browse

## Mobile-First Design

- **Bottom navigation bar** on mobile: Home, Insights, CDs, DVDs — always accessible
- **Top navbar** on desktop with same links + search bar
- Homepage search bar: full-width, large, centered
- Touch targets ≥ 44px
- Horizontal scroll for filter pills, featured picks, preview strips
- Charts full-width on mobile
- Detail pages full-width stacked on mobile

## Project Structure

```
martini-collection/
  resources/              # existing (untouched)
  package.json
  tsconfig.json
  vite.config.ts
  index.html
  .gitignore
  .github/workflows/deploy.yml

  scripts/
    prepare-data.ts       # CSV -> JSON

  src/
    data/                 # generated JSON (gitignored)
    types/
      cd.ts
      dvd.ts
      stats.ts
      filters.ts
    hooks/
      useFilteredItems.ts
      useQueryParams.ts
      useItunesArt.ts     # lazy fetch iTunes cover art
    components/
      layout/
        AppShell.tsx      # responsive shell with bottom/top nav
        Navbar.tsx
        BottomNav.tsx
        Footer.tsx
      shared/
        SearchBar.tsx     # universal search bar
        FilterBar.tsx
        SortSelect.tsx
        Badge.tsx
        Pagination.tsx
        StatCard.tsx      # animated number card
      cd/
        CdCard.tsx        # browse card with iTunes art
      dvd/
        DvdCard.tsx       # styled text card with IMDb badge
      home/
        HeroSection.tsx
        NavigationCards.tsx
        SpotlightStats.tsx
        FeaturedPicks.tsx
        CollectionPreview.tsx
      stats/
        GenreBarChart.tsx
        DirectorChart.tsx
        DecadeAreaChart.tsx
        RatingHistogram.tsx
        CountryPieChart.tsx
        ColorPieChart.tsx
        TopList.tsx
        CollectionSummary.tsx
        CrossPatterns.tsx
        CollectorProfile.tsx
    pages/
      HomePage.tsx
      InsightsPage.tsx
      BrowsePage.tsx
      CdDetailPage.tsx
      DvdDetailPage.tsx
      NotFoundPage.tsx
    lib/
      search.ts
      format.ts
      colors.ts
      links.ts            # Spotify, YouTube, IMDb, Google URL builders
      featured.ts         # Random pick logic for featured section
    App.tsx
    main.tsx
    index.css
```

## Implementation Phases

Each phase ends with polish (responsive check, visual QA) and a deploy to GitHub Pages so the site is always live and incremental. Update the checkboxes below after completing each step.

### Phase 1 — Scaffolding + Deploy Pipeline
- [ ] 1. `package.json` with all deps, configs (tsconfig, vite, tailwind, postcss)
- [ ] 2. `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css` with dark theme
- [ ] 3. `.gitignore` (node_modules, dist, src/data/*.json)
- [ ] 4. `.github/workflows/deploy.yml` — set up GitHub Actions deploy early
- [ ] 5. **Polish & deploy**: verify dev + build, push, confirm Pages works with placeholder

### Phase 2 — Data Pipeline
- [ ] 6. TypeScript interfaces (`src/types/`)
- [ ] 7. `scripts/prepare-data.ts` — CSV parsing, field extraction, `_search` index, stats computation
- [ ] 8. `src/lib/links.ts` + `src/lib/featured.ts`
- [ ] 9. **Polish & deploy**: verify JSON output, build works, deploy

### Phase 3 — Layout & Navigation
- [ ] 10. AppShell + BottomNav (mobile) + Navbar (desktop)
- [ ] 11. Routes: `/`, `/insights`, `/browse/cds`, `/browse/dvds`, `/cd/:id`, `/dvd/:id`, `/vinyl` (coming soon)
- [ ] 12. Dark theme styling
- [ ] 13. Vinyl "Coming Soon" teaser page
- [ ] 14. **Polish & deploy**: test nav on mobile/desktop, responsive check, deploy

### Phase 4 — Home Page
- [ ] 15. HeroSection with search bar
- [ ] 16. NavigationCards (first-class, includes Vinyl "Coming Soon")
- [ ] 17. SpotlightStats
- [ ] 18. FeaturedPicks (random quality items matching collector style)
- [ ] 19. CollectionPreview strip
- [ ] 20. **Polish & deploy**: responsive check (375px-1440px), deploy

### Phase 5 — Browse Pages
- [ ] 21. SearchBar, FilterBar, SortSelect, Badge, Pagination
- [ ] 22. `useFilteredItems`, `useQueryParams` hooks
- [ ] 23. CdCard (with `useItunesArt` hook), DvdCard (styled text)
- [ ] 24. BrowsePage wired up for both CDs and DVDs
- [ ] 25. **Polish & deploy**: test search across all fields, filters, sort, pagination, mobile, deploy

### Phase 6 — Insights Page
- [ ] 26. All Nivo chart components with dark theme and amber palette
- [ ] 27. InsightsPage — all sections (overview, CDs, DVDs, cross-patterns, collector profile)
- [ ] 28. Scroll animations for chart reveals
- [ ] 29. **Polish & deploy**: verify charts match collection_analysis.md, responsive charts, deploy

### Phase 7 — Detail Pages
- [ ] 30. CdDetailPage + iTunes art + Spotify/YouTube buttons
- [ ] 31. DvdDetailPage + IMDb/Google buttons
- [ ] 32. **Polish & deploy**: verify all links, responsive layout, deploy

### Phase 8 — Final Polish
- [ ] 33. Full responsive pass (375px, 768px, 1024px, 1440px)
- [ ] 34. Performance check (bundle size, image lazy loading)
- [ ] 35. Update README.md
- [ ] 36. Final deploy

## Verification (per phase)

After each phase deploy:
1. Site loads on GitHub Pages URL
2. New features work on both mobile and desktop
3. No regressions on previously shipped features

End-to-end checks:
- Homepage: hero + search + navigation + featured picks + preview strip
- Browse: "miles davis" finds CDs, "hitchcock" finds DVDs, filters + search combine
- Insights: all charts render beautifully, data matches collection_analysis.md
- Detail: CD shows iTunes cover + Spotify/YouTube links, DVD shows IMDb/Google links
- Mobile: bottom nav, horizontal scrolls, stacked layouts all work at 375px
- Vinyl nav entry shows "Coming Soon" badge/teaser
