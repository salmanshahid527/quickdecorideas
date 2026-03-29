import { cache } from "react";
import { WP_SITEMAP_PAGE_SIZE } from "@/lib/seo/sitemapConfig";
import { DEFAULT_PER_PAGE, DEFAULT_REVALIDATE_SECONDS } from "./constants";
import { fetchWpCollectionJson, fetchWpJson, wpUrl } from "./http";
import { mapWpCategory, mapWpPage, mapWpPost } from "./map";
import type { Category, Page, Post, WpCategory, WpPage, WpPost, WpUser, Author } from "./types";

export type WpServerFetchOptions = {
  revalidate?: number;
};

function nextOpts(opts?: WpServerFetchOptions) {
  return { next: { revalidate: opts?.revalidate ?? DEFAULT_REVALIDATE_SECONDS } } as const;
}

export async function getCategories(opts?: WpServerFetchOptions): Promise<Category[]> {
  try {
    const data = await fetchWpJson<WpCategory[]>(
      wpUrl("wp/v2/categories", { per_page: 100, hide_empty: true, orderby: "count", order: "desc" }),
      nextOpts(opts),
    );
    return data.map(mapWpCategory);
  } catch (err) {
    console.error("getCategories: WordPress request failed", err);
    return [];
  }
}

const getCategoryBySlugCached = cache(async (slug: string): Promise<Category | null> => {
  try {
    const data = await fetchWpJson<WpCategory[]>(
      wpUrl("wp/v2/categories", { slug, per_page: 1 }),
      nextOpts({ revalidate: DEFAULT_REVALIDATE_SECONDS }),
    );
    const found = data[0];
    return found ? mapWpCategory(found) : null;
  } catch (err) {
    console.error("getCategoryBySlug: WordPress request failed", err);
    return null;
  }
});

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return getCategoryBySlugCached(slug);
}

function safeMapWpPost(p: WpPost): Post | null {
  try {
    return mapWpPost(p);
  } catch (err) {
    console.error("mapWpPost failed for post", p?.id, err);
    return null;
  }
}

export async function getPosts(params?: {
  perPage?: number;
  page?: number;
  categoryId?: number;
  sticky?: boolean;
  search?: string;
}, opts?: WpServerFetchOptions): Promise<Post[]> {
  try {
    const data = await fetchWpJson<WpPost[]>(
      wpUrl("wp/v2/posts", {
        per_page: params?.perPage ?? DEFAULT_PER_PAGE,
        page: params?.page ?? 1,
        categories: params?.categoryId,
        sticky: params?.sticky === true ? true : undefined,
        search: params?.search || undefined,
        _embed: true,
      }),
      nextOpts(opts),
    );
    return data.map((p) => safeMapWpPost(p)).filter((p): p is Post => p !== null);
  } catch (err) {
    console.error("getPosts: WordPress request failed", err);
    return [];
  }
}

const getPostBySlugCached = cache(async (slug: string): Promise<Post | null> => {
  try {
    const data = await fetchWpJson<WpPost[]>(
      wpUrl("wp/v2/posts", { slug, _embed: true, per_page: 1 }),
      nextOpts({ revalidate: DEFAULT_REVALIDATE_SECONDS }),
    );
    const found = data[0];
    return found ? safeMapWpPost(found) : null;
  } catch (err) {
    console.error("getPostBySlug: WordPress request failed", err);
    return null;
  }
});

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return getPostBySlugCached(slug);
}

const getPageBySlugCached = cache(async (slug: string): Promise<Page | null> => {
  try {
    const data = await fetchWpJson<WpPage[]>(
      wpUrl("wp/v2/pages", { slug, per_page: 1 }),
      nextOpts({ revalidate: DEFAULT_REVALIDATE_SECONDS }),
    );
    const found = data[0];
    return found ? mapWpPage(found) : null;
  } catch {
    return null;
  }
});

export async function getPageBySlug(slug: string): Promise<Page | null> {
  return getPageBySlugCached(slug);
}

type WpPostSitemapRow = { slug: string; modified_gmt?: string };

/** All categories (paginated), for sitemaps when there are more than 100 terms. */
export async function getAllCategoriesForSitemap(opts?: WpServerFetchOptions): Promise<Category[]> {
  try {
    const first = await fetchWpCollectionJson<WpCategory[]>(
      wpUrl("wp/v2/categories", {
        per_page: 100,
        hide_empty: true,
        orderby: "count",
        order: "desc",
        page: 1,
      }),
      nextOpts(opts),
    );
    const all: Category[] = first.data.map(mapWpCategory);
    for (let p = 2; p <= first.totalPages; p++) {
      const data = await fetchWpJson<WpCategory[]>(
        wpUrl("wp/v2/categories", {
          per_page: 100,
          hide_empty: true,
          orderby: "count",
          order: "desc",
          page: p,
        }),
        nextOpts(opts),
      );
      all.push(...data.map(mapWpCategory));
    }
    return all;
  } catch (err) {
    console.error("getAllCategoriesForSitemap: WordPress request failed", err);
    return [];
  }
}

/** Published post count from WordPress headers (one small request). */
export async function getPublishedPostsSitemapMeta(
  opts?: WpServerFetchOptions,
): Promise<{ total: number; totalPages: number }> {
  try {
    const { total, totalPages } = await fetchWpCollectionJson<Array<{ id?: number }>>(
      wpUrl("wp/v2/posts", {
        per_page: 1,
        page: 1,
        _fields: "id",
      }),
      nextOpts(opts),
    );
    return { total, totalPages };
  } catch (err) {
    console.error("getPublishedPostsSitemapMeta: WordPress request failed", err);
    return { total: 0, totalPages: 0 };
  }
}

/**
 * Published post URLs for sitemap: global slice [start, start + limit) by post order from the REST API.
 * Uses page-based fetching with an offset into the first page for efficiency on high `start` values.
 */
export async function getPublishedPostSitemapSlice(
  start: number,
  limit: number,
  opts?: WpServerFetchOptions,
): Promise<Array<{ slug: string; lastModified?: Date }>> {
  if (limit <= 0 || start < 0) return [];
  const perPage = WP_SITEMAP_PAGE_SIZE;
  const rows: Array<{ slug: string; lastModified?: Date }> = [];
  let wpPage = Math.floor(start / perPage) + 1;
  let skip = start % perPage;

  while (rows.length < limit) {
    try {
      const data = await fetchWpJson<WpPostSitemapRow[]>(
        wpUrl("wp/v2/posts", {
          per_page: perPage,
          page: wpPage,
          _fields: "slug,modified_gmt",
        }),
        nextOpts(opts),
      );
      if (!data?.length) break;
      const slice = skip > 0 ? data.slice(skip) : data;
      skip = 0;
      for (const row of slice) {
        if (!row.slug) continue;
        rows.push({
          slug: row.slug,
          lastModified: row.modified_gmt ? new Date(row.modified_gmt) : undefined,
        });
        if (rows.length >= limit) break;
      }
      if (data.length < perPage) break;
      wpPage += 1;
      if (wpPage > 60_000) break;
    } catch (err) {
      console.error("getPublishedPostSitemapSlice: page failed", wpPage, err);
      break;
    }
  }

  return rows;
}

export async function getPrimaryAuthor(opts?: WpServerFetchOptions): Promise<Author | null> {
  try {
    const data = await fetchWpJson<WpUser[]>(
      wpUrl("wp/v2/users", { per_page: 1, page: 1 }),
      nextOpts(opts),
    );
    const u = data[0];
    if (!u) return null;
    return {
      id: u.id,
      name: u.name,
      slug: u.slug,
      bio: u.description,
      url: u.url,
      avatarUrl: u.avatar_urls?.["96"] ?? u.avatar_urls?.["48"] ?? u.avatar_urls?.["24"],
    };
  } catch (err) {
    console.error("getPrimaryAuthor: WordPress request failed", err);
    return null;
  }
}

