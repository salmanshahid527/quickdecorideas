import type { Post } from "./types";

export type FeaturedImageData = { src: string; alt: string };

/** WordPress sometimes returns `http://` or protocol-relative URLs; Next/Image needs allowed https remotes. */
export function normalizeFeaturedImageUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  try {
    const u = new URL(trimmed);
    if (u.protocol === "http:") {
      const h = u.hostname;
      if (h !== "localhost" && h !== "127.0.0.1" && h !== "[::1]") {
        u.protocol = "https:";
        return u.toString();
      }
    }
    return trimmed;
  } catch {
    return trimmed;
  }
}

export function featuredImageFromPost(post: Post | undefined | null): FeaturedImageData | null {
  const url = post?.featuredImage?.url;
  if (!url) return null;
  const alt = post.featuredImage?.alt?.trim() || post.title;
  return { src: normalizeFeaturedImageUrl(url), alt };
}

export function firstFeaturedImageFromPosts(posts: Post[]): FeaturedImageData | null {
  for (const p of posts) {
    const img = featuredImageFromPost(p);
    if (img) return img;
  }
  return null;
}
