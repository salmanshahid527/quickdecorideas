import Image from "next/image";
import Link from "next/link";
import { FaPinterest } from "react-icons/fa";
import type { Post } from "@/lib/wp/types";

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
      className="group overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-medium)] hover:shadow-[var(--shadow-card-hover)] h-full flex flex-col relative"
    >
      {/* Pinterest Button - Absolutely positioned outside Link */}
      <a
        href="https://pinterest.com/quickdecorideas"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Share on Pinterest"
        className={`
          absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4
          z-20
          w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12
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
        <FaPinterest className="w-5 h-5 text-white" />
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
                .map((c) => c.name)
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

          {/* Author and Date */}
          <div className="flex flex-col gap-1 text-xs text-[var(--muted)]">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {formatDateTimeShort(post.publishedAt)}
              </time>
            )}
            {post.author?.name && (
              <p>By {post.author.name}</p>
            )}
          </div>

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