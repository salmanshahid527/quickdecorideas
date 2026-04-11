import type {
  Author,
  Category,
  ImageAsset,
  Page,
  Post,
  WpCategory,
  WpMedia,
  WpPage,
  WpPost,
  WpTerm,
  WpUser,
} from "./types";
import { sanitizeHtml } from "@/lib/html/sanitize";

/** Decimal / hex numeric entities (e.g. `&#038;` → `&`) after double-encoding cleanup. */
function decodeNumericHtmlEntities(text: string): string {
  return text
    .replace(/&amp;#(\d{1,7});/g, "&#$1;")
    .replace(/&amp;#x([0-9a-f]{1,6});/gi, "&#x$1;")
    .replace(/&#(\d{1,7});/g, (_, dec) => {
      const n = Number.parseInt(dec, 10);
      if (!Number.isFinite(n) || n < 1 || n > 0x10ffff) return _;
      try {
        return String.fromCodePoint(n);
      } catch {
        return _;
      }
    })
    .replace(/&#x([0-9a-f]{1,6});/gi, (_, hex) => {
      const n = Number.parseInt(hex, 16);
      if (!Number.isFinite(n) || n < 1 || n > 0x10ffff) return _;
      try {
        return String.fromCodePoint(n);
      } catch {
        return _;
      }
    });
}

/** WordPress `rendered` fields often include basic HTML entities. */
function decodeWpEntities(input: string | undefined | null): string {
  if (input == null) return "";
  const named = input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, "\u201c")
    .replace(/&#8221;/g, "\u201d")
    .replace(/&#8230;/g, "…")
    .replace(/&nbsp;/g, " ");
  return decodeNumericHtmlEntities(named);
}

function stripHtml(input: string): string {
  return decodeWpEntities(input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim());
}

export function mapWpUser(user: WpUser | undefined): Author | undefined {
  if (!user) return undefined;
  const avatarUrl =
    user.avatar_urls?.["96"] ??
    user.avatar_urls?.["48"] ??
    user.avatar_urls?.["24"];
  return {
    id: user.id,
    name: user.name,
    slug: user.slug,
    bio: user.description,
    url: user.url,
    avatarUrl,
  };
}

export function mapWpFeaturedMedia(media: WpMedia | undefined): ImageAsset | undefined {
  if (!media?.source_url) return undefined;
  return {
    url: media.source_url,
    alt: media.alt_text,
    width: media.media_details?.width,
    height: media.media_details?.height,
  };
}

export function mapWpCategory(cat: WpCategory): Category {
  return {
    id: cat.id,
    name: decodeWpEntities(cat.name),
    slug: cat.slug,
    description: cat.description ? decodeWpEntities(cat.description) : cat.description,
    count: cat.count,
  };
}

function mapEmbeddedCategoryTerms(terms?: Array<Array<WpTerm>>): Category[] | undefined {
  if (!terms?.length) return undefined;

  const flat = terms.flat();
  const categoryTerms = flat.filter((t) => (t as WpTerm & { taxonomy?: string }).taxonomy === "category");
  if (!categoryTerms.length) return undefined;

  return categoryTerms.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
    count: t.count,
  }));
}

export function mapWpPost(post: WpPost, categoriesById?: Map<number, Category>): Post {
  const embeddedAuthor = post._embedded?.author?.[0];
  const embeddedMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const categoryIds = post.categories ?? [];
  const mappedCategories = categoriesById
    ? categoryIds.map((id) => categoriesById.get(id)).filter(Boolean)
    : undefined;

  const embeddedCategoryTerms = mappedCategories
    ? undefined
    : mapEmbeddedCategoryTerms(post._embedded?.["wp:term"] as Array<Array<WpTerm>> | undefined);
  const finalCategories = mappedCategories ?? embeddedCategoryTerms;

  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title?.rendered ?? ""),
    excerptHtml: sanitizeHtml(post.excerpt?.rendered),
    contentHtml: sanitizeHtml(post.content?.rendered),
    publishedAt: post.date_gmt,
    updatedAt: post.modified_gmt,
    canonicalUrl: post.link,
    author: mapWpUser(embeddedAuthor),
    featuredImage: mapWpFeaturedMedia(embeddedMedia),
    categoryIds,
    categories: finalCategories as Category[] | undefined,
  };
}

export function mapWpPage(page: WpPage): Page {
  return {
    id: page.id,
    slug: page.slug,
    title: stripHtml(page.title?.rendered ?? ""),
    contentHtml: sanitizeHtml(page.content?.rendered),
    canonicalUrl: page.link,
    publishedAt: page.date_gmt,
    updatedAt: page.modified_gmt,
  };
}

