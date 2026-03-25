import { PostList } from "@/components/posts/PostList";
import type { Category, Post } from "@/lib/wp/types";

/** Category archive from server-fetched props only (ISR). */
export function CategoryView({
  category,
  initialPosts,
  initialFallbackPosts,
}: {
  category: Category;
  initialPosts: Post[];
  initialFallbackPosts: Post[];
}) {
  const showFallback = initialPosts.length === 0 && initialFallbackPosts.length > 0;

  return (
    <div>
      {showFallback ? (
        <div className="space-y-4">
          <div className="panel p-5">
            <div className="text-sm font-semibold text-[var(--foreground)]">No posts in {category.name} yet</div>
            <div className="mt-1 text-sm text-[var(--muted)]">
              Here are the latest posts while we add more to this category.
            </div>
          </div>
          <PostList posts={initialFallbackPosts} priorityImageCount={4} />
        </div>
      ) : (
        <PostList posts={initialPosts} priorityImageCount={4} />
      )}
    </div>
  );
}
