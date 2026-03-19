"use client";

import { PostList } from "@/components/posts/PostList";
import { usePosts } from "@/hooks/usePosts";
import type { Category, Post } from "@/lib/wp/types";

export function CategoryView({
  category,
  initialPosts,
  initialFallbackPosts,
}: {
  category: Category;
  initialPosts: Post[];
  initialFallbackPosts: Post[];
}) {
  const postsQ = usePosts({ categoryId: category.id, perPage: 12, page: 1 }, initialPosts);
  const posts = postsQ.data ?? [];
  const fallbackPosts = initialFallbackPosts ?? [];
  const showFallback = posts.length === 0 && fallbackPosts.length > 0;

  return (
    <div>
      <div>
        {showFallback ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="text-sm font-semibold">No posts in {category.name} yet</div>
              <div className="mt-1 text-sm text-black/70">
                Here are the latest posts while we add more to this category.
              </div>
            </div>
            <PostList posts={fallbackPosts} />
          </div>
        ) : (
          <PostList posts={posts} />
        )}
      </div>
    </div>
  );
}

