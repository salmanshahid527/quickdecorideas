import { PostList } from "@/components/posts/PostList";
import type { Category, Post } from "@/lib/wp/types";
import { decode } from "html-entities";
import Link from "next/link";

function Pagination({
  currentPage,
  totalPages,
  slug,
}: {
  currentPage: number;
  totalPages: number;
  slug: string;
}) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const pageUrl = (p: number) =>
    p === 1 ? `/category/${slug}` : `/category/${slug}?page=${p}`;

  return (
    <div className="mt-12 flex items-center justify-center gap-3">
      {/* Previous Button */}
      {hasPrev ? (
        <Link
          href={pageUrl(prevPage)}
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--muted-bg,#f5f5f5)]"
        >
          ← Previous
        </Link>
      ) : (
        <span className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--muted)] opacity-40 cursor-not-allowed">
          ← Previous
        </span>
      )}

      {/* Page Counter */}
      <span className="text-sm text-[var(--muted)]">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      {hasNext ? (
        <Link
          href={pageUrl(nextPage)}
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--muted-bg,#f5f5f5)]"
        >
          Next →
        </Link>
      ) : (
        <span className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--muted)] opacity-40 cursor-not-allowed">
          Next →
        </span>
      )}
    </div>
  );
}

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
