import { DEFAULT_PER_PAGE } from "./constants";
import { wpApiProxyPath } from "./api-path";
import { fetchWpJson } from "./http";
import { mapWpCategory, mapWpPage, mapWpPost } from "./map";
import type { Category, Page, Post, WpCategory, WpPage, WpPost } from "./types";

// Browser-safe fetchers used by React Query hooks (same-origin /api/wp proxy).

export async function fetchCategories(): Promise<Category[]> {
  const data = await fetchWpJson<WpCategory[]>(
    wpApiProxyPath("wp/v2/categories", { per_page: 100, hide_empty: true }),
  );
  return data.map(mapWpCategory);
}

export async function fetchPosts(params?: {
  perPage?: number;
  page?: number;
  categoryId?: number;
  sticky?: boolean;
}): Promise<Post[]> {
  const data = await fetchWpJson<WpPost[]>(
    wpApiProxyPath("wp/v2/posts", {
      per_page: params?.perPage ?? DEFAULT_PER_PAGE,
      page: params?.page ?? 1,
      categories: params?.categoryId,
      sticky: params?.sticky,
      _embed: true,
    }),
  );
  return data.map((p) => mapWpPost(p));
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const data = await fetchWpJson<WpPost[]>(
    wpApiProxyPath("wp/v2/posts", { slug, _embed: true, per_page: 1 }),
  );
  const found = data[0];
  return found ? mapWpPost(found) : null;
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const data = await fetchWpJson<WpCategory[]>(wpApiProxyPath("wp/v2/categories", { slug, per_page: 1 }));
  const found = data[0];
  return found ? mapWpCategory(found) : null;
}

export async function fetchPageBySlug(slug: string): Promise<Page | null> {
  const data = await fetchWpJson<WpPage[]>(wpApiProxyPath("wp/v2/pages", { slug, per_page: 1 }));
  const found = data[0];
  return found ? mapWpPage(found) : null;
}

