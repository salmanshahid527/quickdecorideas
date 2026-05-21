import { SmartImage as Image } from "@/components/ui/SmartImage";
import Link from "next/link";
import type { Post } from "@/lib/wp/types";
import { decode } from "html-entities";

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

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

export function PostCard({
  post,
  priorityImage = false,
  imageSizes = "(min-width: 1024px) 32vw, (min-width: 640px) 45vw, 100vw",
}: {
  post: Post;
  priorityImage?: boolean;
  imageSizes?: string;
}) {
  return (
    <article
      className="relative group overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-medium)] hover:shadow-[var(--shadow-card-hover)] h-full flex flex-col"
    >

      {/*  Pinterest Button */}
    
      <a
        href="https://www.pinterest.com/quickdecorideas/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 left-3 z-20 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity duration-300 bg-red-600 text-white p-2 rounded-full shadow-md hover:scale-110 flex items-center justify-center"
        aria-label="Open Pinterest"
      >
        {/* Pinterest Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0C5.372 0 0 5.373 0 12c0 5.084 3.163 9.406 7.622 11.095-.105-.945-.2-2.395.042-3.429.218-.936 1.404-5.964 1.404-5.964s-.358-.716-.358-1.775c0-1.662.964-2.902 2.165-2.902 1.02 0 1.512.767 1.512 1.684 0 1.026-.654 2.558-.99 3.981-.283 1.196.602 2.17 1.784 2.17 2.14 0 3.786-2.257 3.786-5.516 0-2.878-2.066-4.886-5.019-4.886-3.426 0-5.44 2.568-5.44 5.224 0 1.034.397 2.145.893 2.747.098.119.112.223.083.344-.09.374-.293 1.193-.331 1.361-.052.22-.17.268-.396.162-1.482-.687-2.406-2.843-2.406-4.58 0-3.731 2.71-7.159 7.814-7.159 4.096 0 7.281 2.92 7.281 6.811 0 4.063-2.561 7.337-6.11 7.337-1.194 0-2.316-.62-2.7-1.352l-.735 2.805c-.265 1.012-.985 2.283-1.467 3.057C9.72 23.947 10.847 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      </a>

      <Link href={`/${post.slug}`} className="block">

        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {post.featuredImage?.url && (
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt ?? post.title}
              fill
              sizes={imageSizes}
              priority={priorityImage}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
          
        </div>

        {/* Content */}
        <div className="space-y-3 px-5 pb-5 pt-6 flex-1 flex flex-col">

          {/* Categories */}
          {post.categories?.length ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-secondary)]">
              {post.categories
                .slice(0, 2)
                .map((c) => decode(c.name) )
                .join(" • ")}
            </p>
          ) : null}

          {/* Title */}
          <h3 className="text-lg font-semibold text-[var(--foreground)] line-clamp-2 transition group-hover:text-[var(--brand-primary)]">
            {post.title}
          </h3>

          {/* Excerpt */}
          <div
            className="line-clamp-3 text-sm text-[var(--muted)]"
            dangerouslySetInnerHTML={{ __html: post.excerptHtml }}
          />

          {/* Author */}
          {post.author?.name ? (
            <p className="text-xs text-[var(--muted)]">
              By {post.author.name}
            </p>
          ) : null}

          {/* Published date/time */}
          {post.publishedAt ? (
            <p className="text-xs text-[var(--muted)]">
              <time dateTime={post.publishedAt}>
                {formatDateTimeShort(post.publishedAt)}
              </time>
            </p>
          ) : null}

          {/* Read More */}
          <div className="flex items-center gap-2 pt-2 text-sm font-medium text-[var(--brand-primary)] opacity-0 transition-all duration-300 group-hover:opacity-100 mt-auto">
            Read More
            <span className="transition group-hover:translate-x-1">
              <ArrowRightIcon />
            </span>
          </div>
        </div>

      </Link>
    </article>
  );
}