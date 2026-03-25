/**
 * Next.js marketing routes → WordPress page `slug` (wp/v2/pages?slug=…).
 * Sync with Pages in WP admin when slugs change.
 *
 * Live site (quickdecorideas.com) publishes: about-us, contact-us, privacy-policy.
 * `shop` is reserved for a future WP page; until then the route shows the fallback UI.
 */
export const WP_MARKETING_PAGE_SLUG = {
  about: "about-us",
  contact: "contact-us",
  privacy: "privacy-policy",
  shop: "shop",
} as const;

export type MarketingPageRoute = keyof typeof WP_MARKETING_PAGE_SLUG;

export function wpMarketingPageSlug(route: MarketingPageRoute): string {
  return WP_MARKETING_PAGE_SLUG[route];
}
