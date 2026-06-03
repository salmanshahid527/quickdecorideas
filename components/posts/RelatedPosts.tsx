import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/wp/types";

interface RelatedPostsProps {
  posts: Post[];
  currentPostSlug: string;
}

/** Server-rendered related posts for crawlers and first paint. */
export function RelatedPosts({ posts, currentPostSlug }: RelatedPostsProps) {
  const relatedPosts = posts.filter((p) => p.slug !== currentPostSlug).slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="space-y-6 mt-12">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Related Articles</h2>
        <p className="text-(--muted)">Explore more topics in this category</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            href={`/${post.slug}`}
            className="group flex flex-col h-full rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-all hover:border-gray-300 overflow-hidden"
          >
            {post.featuredImage?.url && (
              <div className="relative w-full h-40 overflow-hidden bg-gray-100">
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.alt || post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized
                />
              </div>
            )}

            <div className="flex flex-col flex-1 p-4">
              {post.categories?.[0] && (
                <span className="inline-block w-fit mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
                  {post.categories[0].name}
                </span>
              )}

              <h3 className="font-semibold text-base lg:text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h3>

              <div className="flex items-center justify-between text-xs text-(--muted) pt-3 border-t border-gray-200">
                {post.author?.name && <span>{post.author.name}</span>}
                {post.publishedAt && (
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
