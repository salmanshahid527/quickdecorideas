import Image from "next/image";
import type { Post } from "@/lib/wp/types";
import { RelatedPosts } from "./RelatedPosts";
import { FAQAccordion, type FAQItem } from "./FAQAccordion";
import { extractFAQFromHtml } from "@/lib/html/markup";

function formatDateTimeShort(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Server-rendered article body — data comes from RSC / ISR, no client refetch. */
export function PostView({ post, relatedPosts = [] }: { post: Post; relatedPosts?: Post[] }) {
  // Extract FAQ items from the content HTML
  const faqItems: FAQItem[] = post.contentHtml ? extractFAQFromHtml(post.contentHtml) : [];

  return (
    <article className="space-y-6">
      {/* Hero section with featured image as background */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <section 
        // eslint-disable-next-line react/no-danger-with-children
        className="relative py-16 sm:py-20 lg:py-24 overflow-hidden rounded-2xl"
        style={{
          backgroundImage: post.featuredImage?.url 
            ? `url('${post.featuredImage.url}')` 
            : 'linear-gradient(135deg, rgb(0, 0, 0, 0.1), rgb(0, 0, 0, 0.1))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50 rounded-2xl" />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl" />

        {/* Hero content */}
        <div className="relative">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl text-white drop-shadow-lg px-4">
            {post.title}
          </h1>
          
          <div className="space-y-2 mt-4 px-4">
            {post.author?.name ? (
              <div className="text-sm text-white/90 drop-shadow">By {post.author.name}</div>
            ) : null}
            {post.publishedAt ? (
              <div className="text-sm text-white/80 drop-shadow">
                <time dateTime={post.publishedAt}>
                  {formatDateTimeShort(post.publishedAt)}
                </time>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Article content */}

      <div className="wp-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

      {/* FAQ Section */}
      {faqItems.length > 0 && (
        <FAQAccordion items={faqItems} />
      )}

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <RelatedPosts posts={relatedPosts} currentPostSlug={post.slug} />
      )}
    </article>
  );
}
