import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CategoryView } from "@/components/category/CategoryView";
import { getCategories, getCategoryBySlug, getPosts, getPostsWithMeta } from "@/lib/wp/server";
import { buildMetadata } from "@/lib/seo/metadata";
import { PAGE_ISR_SECONDS } from "@/lib/seo/isr";
import { categoryMetaDescription } from "@/lib/seo/wpMeta";

export const revalidate = 43200;

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return buildMetadata({
    title: `${category.name} ideas & inspiration`,
    description: categoryMetaDescription(category),
    canonical: `/category/${slug}`,
    type: "website",
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const normalizedSlug = slug.toLowerCase();

  let category = await getCategoryBySlug(slug);
  if (!category) {
    const all = await getCategories({ revalidate: PAGE_ISR_SECONDS });
    const aliasSlug = normalizedSlug === "kitchen" ? "kitchen-dining" : null;
    if (aliasSlug) category = all.find((c) => c.slug.toLowerCase() === aliasSlug) ?? null;
    category =
      category ??
      all.find((c) => c.slug.toLowerCase() === normalizedSlug) ??
      all.find((c) => c.name.toLowerCase() === slug.replace(/-/g, " ").toLowerCase()) ??
      null;
  }
  if (!category) notFound();

  const [{ posts: initialPosts, totalPages }, fallbackPosts] = await Promise.all([
    getPostsWithMeta({ categoryId: category.id, perPage: 12, page: currentPage }, { revalidate: PAGE_ISR_SECONDS }),
    currentPage === 1
      ? getPosts({ perPage: 12, page: 1 }, { revalidate: PAGE_ISR_SECONDS })
      : Promise.resolve([]),
  ]);

  return (
    <div className="py-10">
      <Container>
        <div className="mb-10 space-y-2 md:mb-12">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {category.name}
          </h1>
          {category.description ? (
            <p className="text-[var(--muted)]">{category.description}</p>
          ) : null}
        </div>

        <CategoryView
          category={category}
          initialPosts={initialPosts}
          initialFallbackPosts={fallbackPosts}
          currentPage={currentPage}
          totalPages={totalPages}
          slug={slug}
        />
      </Container>
    </div>
  );
}

