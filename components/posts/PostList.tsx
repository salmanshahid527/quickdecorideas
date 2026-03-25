import type { Post } from "@/lib/wp/types";
import { PostCard } from "./PostCard";

const GRID_DEFAULT = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";
/** Full-width blog index: extra column on wide screens */
const GRID_BLOG = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export function PostList({
  posts,
  variant = "default",
  priorityImageCount = 0,
}: {
  posts: Post[];
  variant?: "default" | "blog";
  /** First N cards request `priority` on featured images (above-the-fold / LCP). */
  priorityImageCount?: number;
}) {
  const sizes =
    variant === "blog"
      ? "(min-width: 1280px) 24vw, (min-width: 768px) 33vw, 100vw"
      : "(min-width: 1024px) 32vw, (min-width: 640px) 45vw, 100vw";

  return (
    <div className={variant === "blog" ? GRID_BLOG : GRID_DEFAULT}>
      {posts.map((p, i) => (
        <PostCard
          key={p.id}
          post={p}
          imageSizes={sizes}
          priorityImage={i < priorityImageCount}
        />
      ))}
    </div>
  );
}

