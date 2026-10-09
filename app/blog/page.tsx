import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Pagination } from "@/components/category/Pagination";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { getCategories, getPostsWithMeta } from "@/lib/wp/server";
import { buildMetadata } from "@/lib/seo/metadata";
import { PAGE_ISR_SECONDS } from "@/lib/seo/isr";

export const revalidate = 43200;

type Props = { searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  return buildMetadata({
    title: currentPage > 1 ? `Blog, page ${currentPage}` : "Blog",
    description:
      "Latest home decor articles: room ideas, seasonal styling, DIY tips, and category roundups — updated regularly.",
    canonical: currentPage > 1 ? `/blog?page=${currentPage}` : "/blog",
    type: "website",
  });
}

export default async function BlogPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  let initialPosts: Awaited<ReturnType<typeof getPostsWithMeta>>["posts"] = [];
  let totalPages = 0;
  let initialCategories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    const [postsResult, categories] = await Promise.all([
      getPostsWithMeta({ perPage: 12, page: currentPage }, { revalidate: PAGE_ISR_SECONDS }),
      getCategories({ revalidate: PAGE_ISR_SECONDS }),
    ]);
    initialPosts = postsResult.posts;
    totalPages = postsResult.totalPages;
    initialCategories = categories;
  } catch (err) {
    console.error("BlogPage: WordPress fetch failed", err);
  }

  // A page past the last one would be an empty, indexable page (a soft 404).
  // getPostsWithMeta returns empty on a WordPress error too, so ask page 1 for the real
  // page count: 404 only when it answered, and fail (not 404) when it did not.
  if (currentPage > 1 && initialPosts.length === 0) {
    const first = await getPostsWithMeta({ perPage: 12, page: 1 }, { revalidate: PAGE_ISR_SECONDS });
    if (first.totalPages === 0) throw new Error("BlogPage: WordPress unavailable");
    if (currentPage > first.totalPages) notFound();
  }

  return (
    <div className="py-10">
      <Container>
        <div className="mb-10 space-y-2 md:mb-12">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Blog</h1>
          <p className="text-[var(--muted)]">
            Fresh ideas, practical tips, and curated category roundups.
          </p>
        </div>
        <BlogIndex initialPosts={initialPosts} initialCategories={initialCategories} />
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
      </Container>
    </div>
  );
}

