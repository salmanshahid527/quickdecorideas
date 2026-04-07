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
        className="relative py-16 sm:py-20 lg:py-24 overflow-hidden rounded-2xl group"
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

        {/* Pinterest Button */}
        <a
          href="https://pinterest.com/quickdecorideas"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label="Share on Pinterest"
          className={`
            absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8
            z-20
            w-12 h-12 md:w-14 md:h-14
            bg-[#E60023] hover:bg-[#C41E14]
            rounded-full
            flex items-center justify-center
            shadow-lg hover:shadow-2xl
            transition-all duration-300 ease-out
            opacity-0 sm:group-hover:opacity-100
            md:group-hover:opacity-100
            lg:opacity-100
            pointer-events-auto
            active:scale-95
            ring-2 ring-white/20 hover:ring-white/40
          `}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-white"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <path d="M12 6c-3.3 0-6 2.7-6 6 0 2.5 1.5 4.7 3.7 5.6-.1-1-.2-2.5 0-3.6l2.2-9.4c.1-.4.6-.8 1.1-.8s1 .4 1.1.8l2.2 9.4c.2 1.1.1 2.6 0 3.6 2.2-.9 3.7-3.1 3.7-5.6 0-3.3-2.7-6-6-6z" />
          </svg>
        </a>

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
