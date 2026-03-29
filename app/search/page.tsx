import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PostList } from "@/components/posts/PostList";
import { getPosts } from "@/lib/wp/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: "${q}"` : "Search",
    robots: { index: false, follow: false },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let posts: Awaited<ReturnType<typeof getPosts>> = [];
  if (query) {
    try {
      posts = await getPosts({ search: query, perPage: 24 });
    } catch {
      // silently fall through to empty results
    }
  }

  return (
    <div className="py-10">
      <Container>
        <div className="mb-8 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {query ? (
              <>
                Results for{" "}
                <span className="text-[var(--brand-primary)]">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              "Search"
            )}
          </h1>
          {query && (
            <p className="text-sm text-[var(--muted)]">
              {posts.length === 0
                ? "No posts found. Try a different keyword."
                : `${posts.length} post${posts.length !== 1 ? "s" : ""} found`}
            </p>
          )}
        </div>

        {posts.length > 0 ? (
          <PostList posts={posts} variant="blog" priorityImageCount={4} />
        ) : query ? (
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-6 py-12 text-center text-[var(--muted)]">
            <p className="text-lg font-medium">No posts found</p>
            <p className="mt-1 text-sm">Try searching for something else, like &ldquo;bedroom ideas&rdquo; or &ldquo;kitchen decor&rdquo;.</p>
          </div>
        ) : null}
      </Container>
    </div>
  );
}
