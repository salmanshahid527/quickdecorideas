import { PostList } from "@/components/posts/PostList";
import type { Category, Post } from "@/lib/wp/types";
import { decode } from "html-entities";
import { Pagination } from "./Pagination";

export function CategoryView({
  category,
  initialPosts,
  initialFallbackPosts,
  currentPage,
  totalPages,
  slug,
}: {
  category: Category;
  initialPosts: Post[];
  initialFallbackPosts: Post[];
  currentPage: number;
  totalPages: number;
  slug: string;
}) {
  const showFallback = initialPosts.length === 0 && initialFallbackPosts.length > 0;

  return (
    <div>
      {showFallback ? (
        <div className="space-y-4">
          <div className="panel p-5">
            <div className="text-sm font-semibold text-[var(--foreground)]">
              No posts in {decode(category.name)} yet
            </div>
            <div className="mt-1 text-sm text-[var(--muted)]">
              Here are the latest posts while we add more to this category.
            </div>
          </div>
          <PostList posts={initialFallbackPosts} priorityImageCount={4} />
        </div>
      ) : (
        <>
          <PostList posts={initialPosts} priorityImageCount={4} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            slug={slug}
          />
        </>
      )}
    </div>
  );
}
