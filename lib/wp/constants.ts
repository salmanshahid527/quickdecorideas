import { PAGE_ISR_SECONDS } from "@/lib/seo/isr";

/**
 * WordPress REST API base (must be an absolute URL ending with /wp-json).
 * Override with WORDPRESS_URL (e.g. https://quickdecorideas.com) or full .../wp-json.
 * NEXT_PUBLIC_API_URL is accepted when it points at .../wp-json (common mis-name in .env).
 */
const DEFAULT_WP_ORIGIN = "https://quickdecorideas.com";

/** Avoid server-side fetch issues from plain http → https redirects (keep localhost http). */
function upgradeInsecureWpOrigin(urlStr: string): string {
  try {
    const u = new URL(urlStr);
    if (u.protocol !== "http:") return urlStr;
    const h = u.hostname;
    if (h === "localhost" || h === "127.0.0.1" || h === "[::1]") return urlStr;
    return urlStr.replace(/^http:\/\//i, "https://");
  } catch {
    return urlStr;
  }
}

function normalizeWpJsonBase(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, "");
  if (!trimmed) return `${DEFAULT_WP_ORIGIN}/wp-json`;
  let withJson = trimmed.endsWith("/wp-json") ? trimmed : `${trimmed}/wp-json`;
  withJson = upgradeInsecureWpOrigin(withJson);
  try {
    const u = new URL(withJson);
    if (u.protocol !== "http:" && u.protocol !== "https:") return `${DEFAULT_WP_ORIGIN}/wp-json`;
    return withJson;
  } catch {
    return `${DEFAULT_WP_ORIGIN}/wp-json`;
  }
}

const fromEnv = (
  process.env.WORDPRESS_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  process.env.WORDPRESS_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  ""
).trim();

export const WP_API_BASE = normalizeWpJsonBase(fromEnv || DEFAULT_WP_ORIGIN);

/** Must match `PAGE_ISR_SECONDS` in `lib/seo/isr.ts` (single ISR window for WP fetches). */
export const DEFAULT_REVALIDATE_SECONDS = PAGE_ISR_SECONDS;

export const DEFAULT_PER_PAGE = 12;
