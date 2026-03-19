export const SITE_NAME = "Quick Decor Ideas";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://quickdecorideas.com";

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

