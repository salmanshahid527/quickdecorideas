"use client";

import Image from "next/image";
import Link from "next/link";
import type { Author, Category, Post } from "@/lib/wp/types";
import { useCategories } from "@/hooks/useCategories";
import { usePosts } from "@/hooks/usePosts";
import { PostList } from "@/components/posts/PostList";

export type HomeInitialData = {
  categories: Category[];
  featuredPosts: Post[];
  primaryAuthor: Author | null;
  postsByCategory: Array<{ category: Category; posts: Post[] }>;
};

function CategorySection({ category, initialPosts }: { category: Category; initialPosts: Post[] }) {
  const { data } = usePosts({ categoryId: category.id, perPage: 6 }, initialPosts);
  const posts = data ?? [];

  if (!posts.length) return null;

  const title = category.slug === "kitchen-dining" ? "Kitchen & Dining" : category.name;

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <Link href={`/category/${category.slug}`} className="text-sm text-black/70 hover:text-black">
          View all
        </Link>
      </div>
      <PostList posts={posts.slice(0, 6)} />
    </section>
  );
}

export function HomeSections({ initial }: { initial: HomeInitialData }) {
  const categoriesQuery = useCategories(initial.categories);
  const featuredQuery = usePosts({ sticky: true, perPage: 6 }, initial.featuredPosts);

  const categories = categoriesQuery.data ?? [];
  const featured = featuredQuery.data ?? [];

  return (
    <div className="space-y-12">
      <section className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="rounded-3xl border border-black/10 bg-white p-6 md:p-8">
            <div className="text-xs font-medium text-black/60">Featured</div>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Decor ideas that feel fresh, simple, and doable.
            </h1>
            <p className="mt-3 text-base text-black/70">
              Browse the latest posts and category roundups—optimized for quick inspiration and practical steps.
            </p>

            {initial.primaryAuthor?.name ? (
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-black/5 p-4">
                {initial.primaryAuthor.avatarUrl ? (
                  <Image
                    src={initial.primaryAuthor.avatarUrl}
                    alt={initial.primaryAuthor.name}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-black/10" />
                )}
                <div>
                  <div className="text-sm font-semibold">{initial.primaryAuthor.name}</div>
                  <div className="text-xs text-black/60">Editor</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="space-y-4">
            {featured.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group block rounded-2xl border border-black/10 bg-white p-4 hover:bg-black/[0.02]"
              >
                <div className="line-clamp-2 text-sm font-semibold tracking-tight group-hover:underline">
                  {p.title}
                </div>
                <div
                  className="mt-2 line-clamp-2 text-sm text-black/70"
                  dangerouslySetInnerHTML={{ __html: p.excerptHtml }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Latest</h2>
          <Link href="/blog" className="text-sm text-black/70 hover:text-black">
            Browse all
          </Link>
        </div>
        <PostList posts={featured.slice(0, 6)} />
      </section>

      <section className="space-y-4">
        <div className="text-sm font-semibold tracking-tight">Top categories</div>
        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 16).map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="rounded-full bg-black/5 px-3 py-1 text-sm text-black/70 hover:bg-black/10"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {initial.postsByCategory.map(({ category, posts }) => (
        <CategorySection key={category.id} category={category} initialPosts={posts} />
      ))}
    </div>
  );
}

