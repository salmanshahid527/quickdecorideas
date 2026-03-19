import type { Post } from "@/lib/wp/types";
import { PostCard } from "./PostCard";

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}

