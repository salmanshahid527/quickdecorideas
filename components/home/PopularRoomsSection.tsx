import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Category } from "@/lib/wp/types";

export type CategoryCardImage = { src: string; alt: string };

export type PopularRoomItem = {
  category: Category;
  image: CategoryCardImage | null;
};

const FALLBACK_IMAGE = "/images/home-decor-inspiration.svg";

function CategorySpaceCard({ category, image }: PopularRoomItem) {
  const src = image?.src ?? FALLBACK_IMAGE;
  const alt = image?.alt ?? `${category.name} decor ideas`;
  const isSvg = /\.svg(\?|$)/i.test(src);
  const count = typeof category.count === "number" ? category.count : null;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-[var(--surface-elevated)] shadow-[0_1px_3px_rgba(26,35,50,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--brand-secondary)]/40 hover:shadow-[0_16px_36px_-12px_rgba(40,86,152,0.2)]"
    >
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized={isSvg}
          className="object-cover transition duration-500 group-hover:scale-[1.05]"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#1a2332]/88 via-[#1a2332]/35 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
          <div className="text-sm font-semibold leading-snug text-white drop-shadow-sm sm:text-base">
            {category.name}
          </div>
          {count != null ? (
            <div className="mt-0.5 text-xs font-medium text-white/85">{count} posts</div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export function PopularRoomsSection({ items }: { items: PopularRoomItem[] }) {
  return (
    <section
      id="browse-by-space"
      className="relative scroll-mt-24 overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-white via-[#f8fafc] to-[#f2f7fc] py-12 md:py-16"
      aria-labelledby="browse-by-space-heading"
    >
      <div
        className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-[var(--brand-secondary-soft)]/40 blur-3xl"
        aria-hidden="true"
      />

      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Popular rooms</p>
            <h2
              id="browse-by-space-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl"
            >
              Browse by space
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-[15px]">
              Pick a room and jump straight into the ideas people are saving right now.
            </p>
            <div className="mt-6 rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-[var(--shadow-soft)] backdrop-blur-sm">
              <div className="text-sm font-semibold text-[var(--foreground)]">Tip</div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                Start with lighting + storage. It’s the fastest way to make any room feel intentional.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            {items.length ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
                {items.map((item) => (
                  <CategorySpaceCard key={item.category.id} {...item} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">Categories will appear here when WordPress is connected.</p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
