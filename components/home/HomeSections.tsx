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
        <Link
          href={`/category/${category.slug}`}
          className="text-sm text-[var(--muted)] transition hover:text-[var(--brand-primary)]"
        >
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
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-soft)] md:p-8">
            <div className="text-xs font-medium text-[var(--muted)]">Featured</div>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Decor ideas that feel fresh, simple, and doable.
            </h1>
            <p className="mt-3 text-base text-[var(--muted)]">
              Browse the latest posts and category roundups—optimized for quick inspiration and practical steps.
            </p>

            {initial.primaryAuthor?.name ? (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-4">
                {initial.primaryAuthor.avatarUrl ? (
                  <Image
                    src={initial.primaryAuthor.avatarUrl}
                    alt={initial.primaryAuthor.name}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-[var(--surface-muted)]" />
                )}
                <div>
                  <div className="text-sm font-semibold">{initial.primaryAuthor.name}</div>
                  <div className="text-xs text-[var(--muted)]">Editor</div>
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
                href={`/${p.slug}`}
                className="group block rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-soft)] transition hover:border-[var(--border-medium)] hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="line-clamp-2 text-sm font-semibold tracking-tight group-hover:underline">
                  {p.title}
                </div>
                <div
                  className="mt-2 line-clamp-2 text-sm text-[var(--muted)]"
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
          <Link
            href="/blog"
            className="text-sm text-[var(--muted)] transition hover:text-[var(--brand-primary)]"
          >
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
              className="rounded-full border border-transparent bg-[var(--surface-muted)] px-3 py-1 text-sm text-[var(--muted)] transition hover:border-[var(--border-subtle)] hover:bg-[var(--surface-elevated)] hover:text-[var(--brand-primary)]"
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

