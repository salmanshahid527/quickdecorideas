import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PostView } from "@/components/posts/PostView";
import { getPostBySlug } from "@/lib/wp/server";
import { buildMetadata } from "@/lib/seo/metadata";
import { metaDescriptionFromHtml } from "@/lib/seo/metaDescription";
import { SITE_NAME } from "@/lib/seo/site";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const description =
    metaDescriptionFromHtml(post.excerptHtml) ??
    `${post.title} — practical decor ideas and inspiration from ${SITE_NAME}.`;

  return buildMetadata({
    title: post.title,
    description,
    canonical: `/blog/${slug}`,
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

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="py-10">
      <Container>
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` },
          ]}
        />
        <ArticleJsonLd post={post} />
        <PostView post={post} />
      </Container>
    </div>
  );
}

