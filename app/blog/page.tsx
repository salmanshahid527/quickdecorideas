import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { getCategories, getPosts } from "@/lib/wp/server";
import { buildMetadata } from "@/lib/seo/metadata";
import { PAGE_ISR_SECONDS } from "@/lib/seo/isr";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Blog",
    description:
      "Latest home decor articles: room ideas, seasonal styling, DIY tips, and category roundups — updated regularly.",
    canonical: "/blog",
    type: "website",
  });
}

export default async function BlogPage() {
  let initialPosts: Awaited<ReturnType<typeof getPosts>> = [];
  let initialCategories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    [initialPosts, initialCategories] = await Promise.all([
      getPosts({ perPage: 12, page: 1 }, { revalidate: PAGE_ISR_SECONDS }),
      getCategories({ revalidate: PAGE_ISR_SECONDS }),
    ]);
  } catch (err) {
    console.error("BlogPage: WordPress fetch failed", err);
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
      </Container>
    </div>
  );
}

