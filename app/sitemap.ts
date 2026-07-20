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
export const revalidate = 43200;

const SITEMAP_FETCH = { revalidate: SITEMAP_ISR_SECONDS } as const;

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
    url: `${SITE_URL}/${p.slug}`,
    lastModified: p.lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));
}

/**
 * Single sitemap at `/sitemap.xml` (required for crawlers / Search Console).
 *
 * Note: Do **not** export `generateSitemaps` unless you add a matching index UX:
 * with `generateSitemaps`, Next only serves `/sitemap/[id].xml` and `/sitemap.xml` 404s.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticE = staticMarketingEntries();
  const categories = await sitemapCategories();
  const catE = categorySitemapEntries(categories);
  const meta = await sitemapPostMeta();
  const postTotal = meta.total;
  const reserved = staticE.length + catE.length;
  const max = GOOGLE_MAX_SITEMAP_URLS;
  const maxPosts = Math.max(0, max - reserved);

  if (postTotal > maxPosts) {
    console.warn(
      `[sitemap] ${postTotal} posts exceed single-file budget (${maxPosts} slots after ${reserved} static/category URLs). ` +
        `Omitting oldest URLs unless you add split sitemaps.`,
    );
  }

  const posts = await getPublishedPostSitemapSlice(0, Math.min(postTotal, maxPosts), SITEMAP_FETCH);
  return [...staticE, ...catE, ...postRowsToEntries(posts)];
}
