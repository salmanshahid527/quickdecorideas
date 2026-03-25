export const SITE_NAME = "Quick Decor Ideas";

const DEFAULT_SITE_URL = "https://quickdecorideas.com";

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "";
  if (!raw) return DEFAULT_SITE_URL;
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return DEFAULT_SITE_URL;
    return raw;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

/** Always a valid absolute URL (empty/invalid env would crash `new URL()` in layout metadata). */
export const SITE_URL = resolveSiteUrl();

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} – Ideas & inspiration`,
};

export function absoluteUrl(pathname: string) {
  if (pathname.startsWith("http")) return pathname;
  return `${SITE_URL}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
}

