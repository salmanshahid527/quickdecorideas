import Image from "next/image";
import Link from "next/link";
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
      className="group overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-medium)] hover:shadow-[var(--shadow-card-hover)]"
    >
      <Link href={`/blog/${post.slug}`} className="block">

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
        <div className="space-y-3 px-5 pb-5 pt-6">

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

          {/* Author */}
          {post.author?.name ? (
            <p className="text-xs text-[var(--muted)]">
              By {post.author.name}
            </p>
          ) : null}

          {/* Read More */}
          <div className="flex items-center gap-2 pt-2 text-sm font-medium text-[var(--brand-primary)] opacity-0 transition-all duration-300 group-hover:opacity-100">
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