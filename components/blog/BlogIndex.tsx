import Link from "next/link";
import { PostList } from "@/components/posts/PostList";
import type { Category, Post } from "@/lib/wp/types";

/** Blog listing from server-fetched props only (ISR). */
export function BlogIndex({
  initialPosts,
  initialCategories,
}: {
  initialPosts: Post[];
  initialCategories: Category[];
}) {
  const categoryLinks = initialCategories
    .filter((c) => c.slug && c.slug.toLowerCase() !== "uncategorized")
    .slice(0, 24);

  return (
    <div className="space-y-10 md:space-y-12">
      <nav
        aria-label="Browse posts by category"
        className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-soft)] md:p-5"
      >
        <div className="text-sm font-semibold text-[var(--foreground)]">Categories</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {categoryLinks.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="rounded-full border border-transparent bg-[var(--surface-muted)] px-3 py-1.5 text-sm font-medium text-[var(--muted)] transition hover:border-[var(--border-subtle)] hover:bg-white hover:text-[var(--brand-primary)]"
            >
              {c.name}
              {typeof c.count === "number" ? (
                <span className="ml-1.5 text-xs font-semibold text-[var(--muted)]/70">({c.count})</span>
              ) : null}
            </Link>
          ))}
        </div>
      </nav>

      <PostList posts={initialPosts} variant="blog" priorityImageCount={4} />
    </div>
  );
}
