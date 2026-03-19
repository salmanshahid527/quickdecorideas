export type WpRendered = { rendered: string };

export type WpMedia = {
  id: number;
  source_url: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<
      string,
      { source_url: string; width: number; height: number; mime_type?: string }
    >;
  };
};

export type WpUser = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  url?: string;
  avatar_urls?: Record<string, string>;
};

export type WpTerm = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  parent?: number;
  // Present in WP responses when using `_embed` (taxonomy: "category" vs "post_tag").
  taxonomy?: string;
};

export type WpCategory = WpTerm;

export type WpPage = {
  id: number;
  slug: string;
  date_gmt?: string;
  modified_gmt?: string;
  title: WpRendered;
  content: WpRendered;
  excerpt?: WpRendered;
  link: string;
};

export type WpPost = {
  id: number;
  slug: string;
  date_gmt: string;
  modified_gmt?: string;
  title: WpRendered;
  content: WpRendered;
  excerpt: WpRendered;
  link: string;
  author: number;
  featured_media: number;
  categories: number[];
  _embedded?: {
    author?: WpUser[];
    "wp:featuredmedia"?: WpMedia[];
    "wp:term"?: Array<WpTerm[]>;
  };
};

export type Author = {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  avatarUrl?: string;
  url?: string;
};

export type ImageAsset = {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerptHtml: string;
  contentHtml: string;
  publishedAt: string;
  updatedAt?: string;
  canonicalUrl: string;
  author?: Author;
  featuredImage?: ImageAsset;
  categoryIds: number[];
  categories?: Category[];
};

export type Page = {
  id: number;
  slug: string;
  title: string;
  contentHtml: string;
  canonicalUrl: string;
  publishedAt?: string;
  updatedAt?: string;
};

