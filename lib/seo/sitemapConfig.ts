/**
 * Google Search Console / sitemap protocol limits (per file).
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
 */
export const GOOGLE_MAX_SITEMAP_URLS = 50_000;

/** WordPress REST default cap; raising requires a server-side filter. */
export const WP_SITEMAP_PAGE_SIZE = 100;
