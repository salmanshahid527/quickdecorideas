import { cache } from "react";
import { DEFAULT_PER_PAGE, DEFAULT_REVALIDATE_SECONDS } from "./constants";
import { fetchWpJson, wpUrl } from "./http";
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
}, opts?: WpServerFetchOptions): Promise<Post[]> {
  try {
    const data = await fetchWpJson<WpPost[]>(
      wpUrl("wp/v2/posts", {
        per_page: params?.perPage ?? DEFAULT_PER_PAGE,
        page: params?.page ?? 1,
        categories: params?.categoryId,
        sticky: params?.sticky === true ? true : undefined,
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

/** Paginated slugs + dates for `sitemap.xml` (minimal `_fields` payload). */
export async function getPublishedPostSitemapEntries(
  opts?: WpServerFetchOptions,
): Promise<Array<{ slug: string; lastModified?: Date }>> {
  const rows: Array<{ slug: string; lastModified?: Date }> = [];
  const perPage = 100;
  const maxPages = 200;

  for (let page = 1; page <= maxPages; page++) {
    try {
      const data = await fetchWpJson<WpPostSitemapRow[]>(
        wpUrl("wp/v2/posts", {
          per_page: perPage,
          page,
          _fields: "slug,modified_gmt",
        }),
        nextOpts(opts),
      );
      if (!data?.length) break;
      for (const row of data) {
        if (row.slug) {
          rows.push({
            slug: row.slug,
            lastModified: row.modified_gmt ? new Date(row.modified_gmt) : undefined,
          });
        }
      }
      if (data.length < perPage) break;
    } catch (err) {
      console.error("getPublishedPostSitemapEntries: page failed", page, err);
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

