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
  const data = await fetchWpJson<WpCategory[]>(
    wpUrl("wp/v2/categories", { per_page: 100, hide_empty: true, orderby: "count", order: "desc" }),
    nextOpts(opts),
  );
  return data.map(mapWpCategory);
}

export async function getCategoryBySlug(slug: string, opts?: WpServerFetchOptions): Promise<Category | null> {
  const data = await fetchWpJson<WpCategory[]>(
    wpUrl("wp/v2/categories", { slug, per_page: 1 }),
    nextOpts(opts),
  );
  const found = data[0];
  return found ? mapWpCategory(found) : null;
}

export async function getPosts(params?: {
  perPage?: number;
  page?: number;
  categoryId?: number;
  sticky?: boolean;
}, opts?: WpServerFetchOptions): Promise<Post[]> {
  const data = await fetchWpJson<WpPost[]>(
    wpUrl("wp/v2/posts", {
      per_page: params?.perPage ?? DEFAULT_PER_PAGE,
      page: params?.page ?? 1,
      categories: params?.categoryId,
      sticky: params?.sticky,
      _embed: true,
    }),
    nextOpts(opts),
  );
  return data.map((p) => mapWpPost(p));
}

export async function getPostBySlug(slug: string, opts?: WpServerFetchOptions): Promise<Post | null> {
  const data = await fetchWpJson<WpPost[]>(
    wpUrl("wp/v2/posts", { slug, _embed: true, per_page: 1 }),
    nextOpts(opts),
  );
  const found = data[0];
  return found ? mapWpPost(found) : null;
}

export async function getPageBySlug(slug: string, opts?: WpServerFetchOptions): Promise<Page | null> {
  const data = await fetchWpJson<WpPage[]>(
    wpUrl("wp/v2/pages", { slug, per_page: 1 }),
    nextOpts(opts),
  );
  const found = data[0];
  return found ? mapWpPage(found) : null;
}

export async function getPrimaryAuthor(opts?: WpServerFetchOptions): Promise<Author | null> {
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
}

