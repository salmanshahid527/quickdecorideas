import { SmartImage as Image } from "@/components/ui/SmartImage";
import type { Post } from "@/lib/wp/types";
import { RelatedPosts } from "./RelatedPosts";
// import { FAQAccordion, type FAQItem } from "./FAQAccordion";
// import { extractFAQFromHtml } from "@/lib/html/markup";
import { addPinterestOverlaysToPostContentHtml } from "@/lib/html/pinterestOverlay";
import { addMissingImageAlts } from "@/lib/html/imageAlt";
import Link from "next/link";

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
  // const faqItems: FAQItem[] = post.contentHtml ? extractFAQFromHtml(post.contentHtml) : [];
  const contentHtml = post.contentHtml
    ? addPinterestOverlaysToPostContentHtml(addMissingImageAlts(post.contentHtml))
    : "";

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

      <div className="wp-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      
{/* Author Card */}
{post.author?.name && (
  <div className="mt-10 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6 shadow-sm">

    <div className="flex items-start gap-4">

      {/* Avatar */}
      {post.author?.avatarUrl ? (
        <div className="relative h-14 w-14 overflow-hidden rounded-full shrink-0">
          <Image
            src={post.author.avatarUrl}
            alt={post.author.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)] text-lg font-semibold text-white">
          {post.author.name.charAt(0)}
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          {post.author.name}
        </h3>

        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
          {post.author.bio}
        </p>

        <div className="mt-3 text-xs font-medium uppercase tracking-wide text-[var(--brand-primary)]">
          Author • Quick Decor Ideas
        </div>
      </div>
      <Link 
            href="/about" 
            className="text-xs font-medium text-[#8a7560] underline underline-offset-4 transition hover:text-[#6b5c47]"
          >
            About the author &rarr;
          </Link>

    </div>
  </div>
)}
      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <RelatedPosts posts={relatedPosts} currentPostSlug={post.slug} />
      )}
    </article>
  );
}
