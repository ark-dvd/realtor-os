# Temporary Content Workflow — Relocation Guide Pages

**Status:** Active
**Scope:** Long-form informational pages (e.g., `/relocation-to-austin/*`)
**Decision Date:** January 2026

---

## 1) Purpose

This document defines the temporary content workflow for relocation guide pages.
It is intentionally minimal. Do not add tooling or automation until a full refactor is planned.

---

## 2) Current Temporary Workflow (Drafts → Page)

1. **Canonical source:** Markdown files live in `content/drafts/`.
2. **Manual conversion:** Content is converted to JSX and placed directly in page files under `app/`.
3. **No runtime markdown parsing:** Pages render static JSX, not dynamically loaded markdown.

Example path:
- Draft: `content/drafts/section5_housing_realestate_upgraded.md`
- Page: `app/relocation-to-austin/housing-real-estate/page.tsx`

---

## 3) Source of Truth Rules

| Layer | Locked? | Notes |
|-------|---------|-------|
| Markdown draft (`content/drafts/`) | Yes | Canonical text. Do not edit without explicit approval. |
| Page JSX content | Yes | Must match the markdown draft exactly. |
| Page metadata (title, description) | Yes | Derived from approved content. |
| UX/UI presentation (spacing, callouts) | No | May be adjusted without altering text. |

**Rule:** If the markdown draft changes, the page JSX must be updated to match.

---

## 4) How to Add a New Section

1. Write the section content in markdown format.
2. Save it to `content/drafts/` with a clear filename (e.g., `section6_schools.md`).
3. Get content approval (locked after approval).
4. Create the page route under `app/` following existing patterns.
5. Convert markdown to JSX manually, preserving structure exactly.
6. Add page-level metadata (title, description, canonical).
7. Add Article JSON-LD using the same metadata values.
8. Add the new route to `app/sitemap.xml/route.ts`.

---

## 5) Future CMS Integration (Sanity) — Deferred

Sanity CMS is already integrated for properties, neighborhoods, and site settings.
Relocation content pages are **not** in Sanity yet.

When a full refactor is planned:
- Add a `relocationSection` schema to Sanity.
- Migrate markdown content to Sanity documents.
- Update pages to fetch content via GROQ queries.
- Remove `content/drafts/` folder after migration.

**Do not implement this now.** The current workflow is sufficient until scale requires it.
