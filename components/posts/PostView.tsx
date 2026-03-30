import Image from "next/image";
import type { Post } from "@/lib/wp/types";

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
export function PostView({ post }: { post: Post }) {
  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {post.title}
        </h1>
        {post.author?.name ? (
          <div className="text-sm text-[var(--muted)]">By {post.author.name}</div>
        ) : null}
        {post.publishedAt ? (
          <div className="text-sm text-[var(--muted)]">
            <time dateTime={post.publishedAt}>
              {formatDateTimeShort(post.publishedAt)}
            </time>
          </div>
        ) : null}
      </header>

      {post.featuredImage?.url ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-black/5">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt ?? post.title}
            fill
            priority
            sizes="(min-width: 1280px) 1120px, (min-width: 768px) 90vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="wp-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
