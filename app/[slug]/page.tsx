import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PostView } from "@/components/posts/PostView";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { getPostBySlug, getPageBySlug, getRelatedPostsByCategory } from "@/lib/wp/server";
import { buildMetadata } from "@/lib/seo/metadata";
import { metaDescriptionFromHtml } from "@/lib/seo/metaDescription";
import { metaDescriptionFromWpPage } from "@/lib/seo/wpMeta";
import { fetchRankMathDescription } from "@/lib/wp/rankmath";
import { SITE_NAME } from "@/lib/seo/site";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export const revalidate = 43200;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (page) {
    return buildMetadata({
      title: page.title,
      description: metaDescriptionFromWpPage(page, `${page.title} — ${SITE_NAME}.`),
      canonical: `/${slug}`,
      type: "website",
    });
  }

  const post = await getPostBySlug(slug);
  if (!post) return {};

  const rankMathDesc = await fetchRankMathDescription(slug);
  const description =
    rankMathDesc ??
    metaDescriptionFromHtml(post.excerptHtml) ??
    `${post.title} — practical decor ideas and inspiration from ${SITE_NAME}.`;

  return buildMetadata({
    title: post.title,
    description,
    canonical: `/${slug}`,
    ogImage: post.featuredImage?.url
      ? {
          url: post.featuredImage.url,
          width: post.featuredImage.width,
          height: post.featuredImage.height,
          alt: post.featuredImage.alt ?? post.title,
        }
      : undefined,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (page) {
    return (
      <div className="py-10">
        <Container>
          <WpPageContent page={page} />
        </Container>
      </div>
    );
  }

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const primaryCat = post.categories?.[0];

  // Fetch related posts if category exists
  const relatedPosts = [];
  if (primaryCat?.id) {
    try {
      const posts = await getRelatedPostsByCategory(primaryCat.id, post.slug, 4);
      relatedPosts.push(...posts);
    } catch (err) {
      console.log("Could not fetch related posts:", err);
    }
  }

  return (
    <div className="py-10">
      <Container>
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "/" },
            ...(primaryCat
              ? [{ name: primaryCat.name, url: `/category/${primaryCat.slug}` }]
              : [{ name: "Blog", url: "/blog" }]),
            { name: post.title, url: `/${post.slug}` },
          ]}
        />
        <ArticleJsonLd post={post} />
        <div className="mx-auto max-w-[860px]">
          <PostView post={post} relatedPosts={relatedPosts} />
        </div>
      </Container>
    </div>
  );
}
