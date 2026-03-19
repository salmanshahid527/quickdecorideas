import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CategoryView } from "@/components/category/CategoryView";
import { getCategories, getCategoryBySlug, getPosts } from "@/lib/wp/server";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug, { revalidate });
  if (!category) return {};

  return buildMetadata({
    title: category.name,
    description: category.description || `Browse posts in ${category.name}.`,
    canonical: `/category/${slug}`,
    type: "website",
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();

  let category = await getCategoryBySlug(slug, { revalidate });
  if (!category) {
    // Fallback for cases where WP slug differs from our route slug
    const all = await getCategories({ revalidate });

    // Explicit aliases (keeps your header slugs stable)
    const aliasSlug = normalizedSlug === "kitchen" ? "kitchen-dining" : null;
    if (aliasSlug) category = all.find((c) => c.slug.toLowerCase() === aliasSlug) ?? null;

    category =
      category ??
      all.find((c) => c.slug.toLowerCase() === normalizedSlug) ??
      all.find((c) => c.name.toLowerCase() === slug.replace(/-/g, " ").toLowerCase()) ??
      null;
  }
  if (!category) notFound();

  const [initialPosts, initialFallbackPosts] = await Promise.all([
    getPosts({ categoryId: category.id, perPage: 12, page: 1 }, { revalidate }),
    getPosts({ perPage: 12, page: 1 }, { revalidate }),
  ]);

  return (
    <div className="py-10">
      <Container>
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {category.name}
          </h1>
          {category.description ? (
            <p className="text-black/70">{category.description}</p>
          ) : null}
        </div>

        <CategoryView
          category={category}
          initialPosts={initialPosts}
          initialFallbackPosts={initialFallbackPosts}
        />
      </Container>
    </div>
  );
}

