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

export function PostCard({ post }: { post: Post }) {
  return (
    <article
      className="group overflow-hidden rounded-2xl bg-white 
      border border-transparent
      shadow-md transition-all duration-300
      hover:border-[#5555ff]
      hover:shadow-[0_20px_40px_rgba(85,85,255,0.3)]
      hover:-translate-y-1"
    >
      <Link href={`/blog/${post.slug}`} className="block">

        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {post.featuredImage?.url && (
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt ?? post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">

          {/* Categories */}
          {post.categories?.length ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5555ff]">
              {post.categories
                .slice(0, 2)
                .map((c) => c.name)
                .join(" • ")}
            </p>
          ) : null}

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 transition group-hover:text-[#5555ff]">
            {post.title}
          </h3>

          {/* Excerpt */}
          <div
            className="text-sm text-gray-600 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: post.excerptHtml }}
          />

          {/* Author */}
          {post.author?.name ? (
            <p className="text-xs text-gray-400">
              By {post.author.name}
            </p>
          ) : null}

          {/* Read More */}
          <div className="flex items-center gap-2 pt-2 text-sm font-medium text-[#5555ff] opacity-0 transition-all duration-300 group-hover:opacity-100">
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