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

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
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
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
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
  const mappedCategories = categoriesById
    ? post.categories.map((id) => categoriesById.get(id)).filter(Boolean)
    : undefined;

  const embeddedCategoryTerms = mappedCategories
    ? undefined
    : mapEmbeddedCategoryTerms(post._embedded?.["wp:term"] as Array<Array<WpTerm>> | undefined);
  const finalCategories = mappedCategories ?? embeddedCategoryTerms;

  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title?.rendered ?? ""),
    excerptHtml: post.excerpt?.rendered ?? "",
    contentHtml: post.content?.rendered ?? "",
    publishedAt: post.date_gmt,
    updatedAt: post.modified_gmt,
    canonicalUrl: post.link,
    author: mapWpUser(embeddedAuthor),
    featuredImage: mapWpFeaturedMedia(embeddedMedia),
    categoryIds: post.categories ?? [],
    categories: finalCategories as Category[] | undefined,
  };
}

export function mapWpPage(page: WpPage): Page {
  return {
    id: page.id,
    slug: page.slug,
    title: stripHtml(page.title?.rendered ?? ""),
    contentHtml: page.content?.rendered ?? "",
    canonicalUrl: page.link,
    publishedAt: page.date_gmt,
    updatedAt: page.modified_gmt,
  };
}

