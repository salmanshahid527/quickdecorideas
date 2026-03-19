"use client";

import Image from "next/image";
import { usePost } from "@/hooks/usePost";
import type { Post } from "@/lib/wp/types";

export function PostView({ slug, initialPost }: { slug: string; initialPost: Post | null }) {
  const { data } = usePost(slug, initialPost);
  const post = data ?? null;

  if (!post) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-3/4 animate-pulse rounded bg-black/10" />
        <div className="h-64 w-full animate-pulse rounded-2xl bg-black/10" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-black/10" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-black/10" />
          <div className="h-4 w-10/12 animate-pulse rounded bg-black/10" />
        </div>
      </div>
    );
  }

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {post.title}
        </h1>
        {post.author?.name ? (
          <div className="text-sm text-black/60">By {post.author.name}</div>
        ) : null}
      </header>

      {post.featuredImage?.url ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-black/5">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt ?? post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="wp-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}

