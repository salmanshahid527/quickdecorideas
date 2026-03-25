This is a **Next.js 15 (App Router)** site built with a **server-first + ISR** architecture on top of the **WordPress REST API** at `https://quickdecorideas.com/wp-json/`.

## Getting started

Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## ISR strategy (how it works)

- All routes in `app/**/page.tsx` are **Server Components** (no `"use client"` in pages/layouts).
- CMS-driven pages export `export const revalidate = 60;` to enable **ISR everywhere**.
- Server fetchers in `lib/wp/server.ts` use Next’s `fetch(..., { next: { revalidate } })` so the HTML and cached data revalidate together.

## Data access (no ad-hoc fetches)

- **Server fetchers (ISR / cached)** live in `lib/wp/server.ts`
  - Used by route `page.tsx` files (SSR/ISR).
- **Browser-safe fetchers** live in `lib/wp/api.ts`
  - Used by React Query hooks.
- **React Query hooks** live in `hooks/*`
  - Hooks accept `initialData` so client markup matches SSR (no “empty then load” flash).

## SEO

- `generateMetadata()` per route (Blog index, Category, Post, WP pages)
  - Canonicals via `alternates.canonical`
  - OpenGraph + Twitter cards
- JSON-LD components in `components/seo/`
  - `OrganizationWebSiteJsonLd` is rendered in `app/layout.tsx`
  - Post pages render `ArticleJsonLd` + `BreadcrumbJsonLd`
- `app/opengraph-image.tsx` provides a default OG image (no binary assets required)

## Routes implemented

- `/` (Home)
- `/blog`
- `/blog/[slug]`
- `/category/[slug]`
- `/about`
- `/contact`
- `/privacy`
- `/shop`

## Add a new WP page route

1. Create `app/<route>/page.tsx`
2. Use `getPageBySlug("<wp-slug>")` in the server page (marketing routes: `lib/wp/wpPageSlugs.ts`)
3. Render `<WpPageContent wpSlug="<wp-slug>" initialPage={page} />`

