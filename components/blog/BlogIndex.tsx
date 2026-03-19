"use client";

import Link from "next/link";
import { PostList } from "@/components/posts/PostList";
import { useCategories } from "@/hooks/useCategories";
import { usePosts } from "@/hooks/usePosts";
import type { Category, Post } from "@/lib/wp/types";

export function BlogIndex({
  initialPosts,
  initialCategories,
}: {
  initialPosts: Post[];
  initialCategories: Category[];
}) {
  const postsQ = usePosts({ perPage: 12, page: 1 }, initialPosts);
  const catsQ = useCategories(initialCategories);
  const posts = postsQ.data ?? [];
  const categories = catsQ.data ?? [];

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <PostList posts={posts} />
      </div>
      <aside className="lg:col-span-4">
        <div className="sticky top-6 space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-sm font-semibold">Categories</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.slice(0, 24).map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="rounded-full bg-black/5 px-3 py-1 text-sm text-black/70 hover:bg-black/10"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

