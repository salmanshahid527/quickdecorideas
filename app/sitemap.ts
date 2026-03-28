import type { MetadataRoute } from "next";
import { cache } from "react";
import { SITEMAP_ISR_SECONDS } from "@/lib/seo/isr";
import { GOOGLE_MAX_SITEMAP_URLS } from "@/lib/seo/sitemapConfig";
import { SITE_URL } from "@/lib/seo/site";
import type { Category } from "@/lib/wp/types";
import {
  getAllCategoriesForSitemap,
  getPublishedPostsSitemapMeta,
  getPublishedPostSitemapSlice,
} from "@/lib/wp/server";

/** Literal for Next.js; keep equal to `SITEMAP_ISR_SECONDS` in `lib/seo/isr.ts`. */
export const revalidate = 3600;

const SITEMAP_FETCH = { revalidate: SITEMAP_ISR_SECONDS } as const;

/** One WP round-trip per server pass (generateSitemaps + each child sitemap share this). */
const sitemapCategories = cache(() => getAllCategoriesForSitemap(SITEMAP_FETCH));
const sitemapPostMeta = cache(() => getPublishedPostsSitemapMeta(SITEMAP_FETCH));

function staticMarketingEntries(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}

function categorySitemapEntries(categories: Category[]): MetadataRoute.Sitemap {
  return categories
    .filter((c) => c.slug && c.slug.toLowerCase() !== "uncategorized")
    .map((c) => ({
      url: `${SITE_URL}/category/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
}

function postRowsToEntries(
  rows: Array<{ slug: string; lastModified?: Date }>,
): MetadataRoute.Sitemap {
  return rows.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));
}

/**
 * When URL count exceeds Google's per-file limit, Next.js emits a sitemap index at `/sitemap.xml`
 * and child files at `/sitemap/[id].xml`. Submit the index URL in Search Console.
 */
export async function generateSitemaps() {
  const [categories, meta] = await Promise.all([sitemapCategories(), sitemapPostMeta()]);
  const staticE = staticMarketingEntries();
  const catE = categorySitemapEntries(categories);
  const reserved = staticE.length + catE.length;
  const postTotal = meta.total;
  const total = reserved + postTotal;
  const max = GOOGLE_MAX_SITEMAP_URLS;

  if (total <= max) {
    return [{ id: 0 }];
  }

  const postsInFirst = Math.max(0, max - reserved);
  const remainingAfterFirst = Math.max(0, postTotal - postsInFirst);
  const extraSitemaps = remainingAfterFirst === 0 ? 0 : Math.ceil(remainingAfterFirst / max);
  return Array.from({ length: 1 + extraSitemaps }, (_, i) => ({ id: i }));
}

export default async function sitemap({
  id,
}: {
  id?: string | number;
}): Promise<MetadataRoute.Sitemap> {
  const staticE = staticMarketingEntries();
  const categories = await sitemapCategories();
  const catE = categorySitemapEntries(categories);
  const meta = await sitemapPostMeta();
  const postTotal = meta.total;
  const reserved = staticE.length + catE.length;
  const max = GOOGLE_MAX_SITEMAP_URLS;

  const sitemapId =
    id === undefined || id === null ? 0 : Number.parseInt(String(id), 10);
  if (Number.isNaN(sitemapId) || sitemapId < 0) {
    return [];
  }

  if (reserved + postTotal <= max) {
    const posts = await getPublishedPostSitemapSlice(0, postTotal, SITEMAP_FETCH);
    return [...staticE, ...catE, ...postRowsToEntries(posts)];
  }

  const postsInFirst = Math.max(0, max - reserved);

  if (sitemapId === 0) {
    const n = Math.min(postsInFirst, postTotal);
    const posts = await getPublishedPostSitemapSlice(0, n, SITEMAP_FETCH);
    return [...staticE, ...catE, ...postRowsToEntries(posts)];
  }

  const start = postsInFirst + (sitemapId - 1) * max;
  const posts = await getPublishedPostSitemapSlice(start, max, SITEMAP_FETCH);
  return postRowsToEntries(posts);
}
