/**
 * ISR intervals for WordPress `fetch(..., { next: { revalidate } })`.
 *
 * Route files must use a **numeric literal** for `export const revalidate` (Next.js
 * static analysis); keep that number equal to `PAGE_ISR_SECONDS`.
 */
export const PAGE_ISR_SECONDS = 60;

/** Sitemaps change less often than individual posts. */
export const SITEMAP_ISR_SECONDS = 3600;
