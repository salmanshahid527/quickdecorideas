import type { MetadataRoute } from "next";
import { SITEMAP_ISR_SECONDS } from "@/lib/seo/isr";
import { SITE_URL } from "@/lib/seo/site";
import { getCategories, getPublishedPostSitemapEntries } from "@/lib/wp/server";

/** Literal for Next.js; keep equal to `SITEMAP_ISR_SECONDS` in `lib/seo/isr.ts`. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, posts] = await Promise.all([
    getCategories({ revalidate: SITEMAP_ISR_SECONDS }),
    getPublishedPostSitemapEntries({ revalidate: SITEMAP_ISR_SECONDS }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/shop`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter((c) => c.slug && c.slug.toLowerCase() !== "uncategorized")
    .map((c) => ({
      url: `${SITE_URL}/category/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticEntries, ...categoryEntries, ...postEntries];
}
