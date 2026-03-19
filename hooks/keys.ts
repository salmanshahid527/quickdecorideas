export const wpKeys = {
  categories: ["wp", "categories"] as const,
  posts: (params?: Record<string, unknown>) => ["wp", "posts", params ?? {}] as const,
  post: (slug: string) => ["wp", "post", slug] as const,
  category: (slug: string) => ["wp", "category", slug] as const,
  page: (slug: string) => ["wp", "page", slug] as const,
};

