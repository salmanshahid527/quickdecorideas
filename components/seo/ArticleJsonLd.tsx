import { JsonLd } from "./JsonLd";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo/site";
import type { Post } from "@/lib/wp/types";

export function ArticleJsonLd({ post }: { post: Post }) {
  const imageUrl = post.featuredImage?.url;
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    mainEntityOfPage: absoluteUrl(`/${post.slug}`),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: post.author?.name
      ? { "@type": "Person", name: post.author.name }
      : undefined,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    image: imageUrl ? [imageUrl.startsWith("http") ? imageUrl : absoluteUrl(imageUrl)] : undefined,
  };

  return <JsonLd data={data} />;
}

