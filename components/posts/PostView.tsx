import { SmartImage as Image } from "@/components/ui/SmartImage";
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
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {post.title}
        </h1>
        {post.author?.name ? (
          <div className="text-sm text-(--muted)">By {post.author.name}</div>
        ) : null}
        {post.publishedAt ? (
          <div className="text-sm text-(--muted)">
            <time dateTime={post.publishedAt}>
              {formatDateTimeShort(post.publishedAt)}
            </time>
          </div>
        ) : null}
      </header>

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
