import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { getCategories, getPosts } from "@/lib/wp/server";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Blog",
    description: "Latest decor ideas, room inspiration, and practical guides.",
    canonical: "/blog",
    type: "website",
  });
}

export default async function BlogPage() {
  const [initialPosts, initialCategories] = await Promise.all([
    getPosts({ perPage: 12, page: 1 }, { revalidate }),
    getCategories({ revalidate }),
  ]);

  return (
    <div className="py-10">
      <Container>
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Blog</h1>
          <p className="text-black/70">
            Fresh ideas, practical tips, and curated category roundups.
          </p>
        </div>
        <BlogIndex initialPosts={initialPosts} initialCategories={initialCategories} />
      </Container>
    </div>
  );
}

