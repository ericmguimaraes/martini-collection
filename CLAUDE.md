# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

A personal media collection dataset — the "Martini Collection" — containing a CD collection (1687 albums) and a DVD collection (507 titles), exported from CLZ Music/Movies apps. This is a data analysis project, not a software application.

## Repository Structure

- `resources/20260325_Acervo CDs Martini.csv` — Full CD collection export (CLZ Music format)
- `resources/20260325_Acervo DVDs Martini.csv` — Full DVD collection export (CLZ Movies format)
- `resources/collection_analysis.md` — Generated analysis with genre distributions, timelines, cross-genre patterns, and collector profile insights
- `resources/image (1-4).png` — Screenshots from the CLZ Music/Movies apps

## Data Format Notes

- **CD CSV**: Key columns are `Artist`, `Title`, `Genre`, `Label`, `Tags`, `Discs`, `Length`, `Tracks`, `Added Date`. Genre field can contain pipe-separated multi-genre values (e.g., `Latin | MPB`). Tags are comma-separated and represent the primary organizational categories (Jazz, Música Brasileira, Rock, etc.).
- **DVD CSV**: Key columns are `Title`, `Genres`, `Director`, `Actor`, `Musician`, `Release Year`, `IMDb Rating`, `Country`, `Color`, `Tags`, `Runtime`. Genres are pipe-separated. Tags represent physical storage categories (Filmes, Boxes, Música, Séries) and curation flags (`Doar?` = consider donating).
- Both CSVs use UTF-8 encoding with standard CSV quoting.

## Working With the Data

Use Python (`csv` module or `pandas`) for analysis. No special dependencies or virtual environments are required — the standard library's `csv` module is sufficient for most tasks.

When regenerating `collection_analysis.md`, write a Python script to `/tmp/` and run it from the repo root, since shell quoting of inline Python can cause issues with special characters.
