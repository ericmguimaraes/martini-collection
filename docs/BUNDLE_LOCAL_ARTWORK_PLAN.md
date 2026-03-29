# Plan: Bundle Artwork Locally

## Context

The site currently loads ~1,900 cover art images from external CDNs (iTunes, Cover Art Archive, TMDB) at runtime. This creates a dependency on third-party services and can cause inconsistent load times or broken images if a CDN goes down or changes its URL scheme.

The goal is to download, optimize, and bundle images as static assets served from GitHub Pages — eliminating runtime dependency on external image CDNs while keeping the site performant.

## Strategy: CI Download + GitHub Actions Cache

Images are **not committed to git**. Instead, they're downloaded and optimized during CI, with aggressive caching so only new images get fetched on subsequent builds. Local dev continues working without images (falls back to external URLs as it does today).

**Why not commit images to git (or LFS)?**
- ~100 MB of binary files would bloat the git history permanently.
- LFS adds operational complexity and billing for a personal project.

**Why CI download + cache?**
- `artwork-cache.json` (already committed) contains all URLs — it acts as the manifest.
- GitHub Actions cache stores downloaded images between builds (10 GB limit).
- First build downloads everything (~5-10 min); subsequent builds restore from cache (<1 min).

### Size Estimates

| Asset | Count | Avg Size | Total |
|-------|-------|----------|-------|
| Thumbnails (300px WebP, quality 80) | ~1,894 | ~15 KB | ~28 MB |
| Full-size (600px WebP, quality 85) | ~1,894 | ~40 KB | ~76 MB |
| **Total images** | ~3,788 | | **~104 MB** |
| Current dist/ | | | 2 MB |
| **Projected dist/** | | | **~106 MB** |

Well within GitHub Pages' 1 GB limit.

---

## Implementation Steps

### 1. Create `scripts/download-artwork.ts`

New script that:
- Reads `artwork-cache.json` as its manifest
- Downloads each image with concurrency limit (10 parallel, with retries)
- Uses `sharp` to convert to WebP at two sizes:
  - `public/artwork/{id}.thumb.webp` — 300px wide, quality 80 (for browse grid cards)
  - `public/artwork/{id}.full.webp` — 600px wide, quality 85 (for detail pages)
- Skips already-downloaded files (idempotent/incremental)
- Writes `public/artwork/manifest.json` mapping each cache key to its download status
- Supports `--force` flag to re-download all images

**New dev dependency:** `sharp`

### 2. Update `scripts/prepare-data.ts`

- Read `public/artwork/manifest.json` (gracefully skip if missing — enables local dev without downloading)
- Inject `artworkThumb` and `artworkFull` path fields into `cds.json` and `dvds.json`
- Keep existing `artworkUrl` as the external CDN fallback

### 3. Update TypeScript types

Add optional fields to `CdItem` and `DvdItem`:
- `artworkThumb?: string` / `posterThumb?: string` — relative path to thumbnail WebP
- `artworkFull?: string` / `posterFull?: string` — relative path to full-size WebP

### 4. Update `src/hooks/useArtwork.ts`

New fallback chain: **local path → external URL → runtime API**

Add a `size` parameter (`'thumb' | 'full'`) to `useCdArtwork` and `useDvdPoster`. Local paths are prefixed with `import.meta.env.BASE_URL`.

### 5. Update components

- `CdCard.tsx` / `DvdCard.tsx` — request `'thumb'` size (smaller, faster for grid)
- `CdDetailPage.tsx` / `DvdDetailPage.tsx` — request `'full'` size

No other component changes needed. Existing `loading="lazy"` on `<img>` tags continues working.

### 6. Update `.gitignore`

Add `public/artwork/` — images are built in CI, not committed.

### 7. Update `package.json`

```json
{
  "download-artwork": "tsx scripts/download-artwork.ts",
  "build:full": "npm run download-artwork && npm run prepare-data && tsc -b && vite build"
}
```

Local dev uses `npm run dev` as before (no artwork download needed). CI uses `npm run build:full`.

### 8. Update `.github/workflows/deploy.yml`

- Add `actions/cache@v4` step for `public/artwork/` keyed on `hashFiles('artwork-cache.json')`
- Run `npm run download-artwork` before build (with 15 min timeout)
- Switch build command to `npm run build:full`

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `scripts/download-artwork.ts` | **Create** — download + optimization script |
| `scripts/prepare-data.ts` | Modify — read manifest, inject local paths |
| `src/types/cd.ts` | Modify — add `artworkThumb`, `artworkFull` |
| `src/types/dvd.ts` | Modify — add `posterThumb`, `posterFull` |
| `src/hooks/useArtwork.ts` | Modify — local-first fallback + size param |
| `src/components/cd/CdCard.tsx` | Modify — pass `'thumb'` to hook |
| `src/components/dvd/DvdCard.tsx` | Modify — pass `'thumb'` to hook |
| `src/pages/CdDetailPage.tsx` | Modify — pass `'full'` to hook |
| `src/pages/DvdDetailPage.tsx` | Modify — pass `'full'` to hook |
| `package.json` | Modify — new scripts + `sharp` dev dependency |
| `.gitignore` | Modify — add `public/artwork/` |
| `.github/workflows/deploy.yml` | Modify — cache + download step |

## Edge Cases

- **~300 items with no artwork:** No images to download. Components already show placeholder UI (gradient + text). No changes needed.
- **Download failures in CI:** Logged and marked as failed in manifest. Components fall back to external URL or runtime API.
- **Local development:** Works without downloading artwork. External URL fallback is unchanged.

## Verification

1. Run `npm run download-artwork` locally → check `public/artwork/` has ~3,788 WebP files, spot-check dimensions and sizes
2. Run `npm run build:full` → check `dist/artwork/` exists, total dist < 150 MB
3. Serve with `npx serve dist` → browse CDs/DVDs, verify images load from local paths
4. Delete a few local images, rebuild → verify fallback to external URLs works
5. Push to branch → verify CI caches artwork and subsequent builds are fast
