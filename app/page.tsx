import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { SmartImage as Image } from "@/components/ui/SmartImage";
import { HeroFeatureCards } from "@/components/home/HeroFeatureCards";
import { PopularRoomsSection, type PopularRoomItem } from "@/components/home/PopularRoomsSection";
import { PostList } from "@/components/posts/PostList";
import { resolveHeroFeatureCards } from "@/lib/home/heroFeatureCards";
import {
  featuredImageFromPost,
  firstFeaturedImageFromPosts,
  type FeaturedImageData,
} from "@/lib/wp/postFeaturedImage";
import { buildMetadata } from "@/lib/seo/metadata";
import { PAGE_ISR_SECONDS } from "@/lib/seo/isr";
import { SITE_NAME } from "@/lib/seo/site";
import { getCategories, getPosts } from "@/lib/wp/server";
import type { Category, Post } from "@/lib/wp/types";

/** Next.js: must be a literal. Match `PAGE_ISR_SECONDS` in `lib/seo/isr.ts`. */
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: SITE_NAME,
    absoluteTitle: true,
    description:
      "Room-by-room decor ideas, color palettes, and practical styling tips for a calmer, more intentional home.",
    canonical: "/",
  });
}

const FALLBACK_EXPLORE_IMAGE = "/images/home-decor-inspiration.svg";

function HomeExploreLinkCard({
  href,
  label,
  title,
  description,
  cta,
  image,
  fallbackAlt,
}: {
  href: string;
  label: string;
  title: string;
  description: string;
  cta: string;
  image: FeaturedImageData | null;
  fallbackAlt: string;
}) {
  const src = image?.src ?? FALLBACK_EXPLORE_IMAGE;
  const alt = image?.alt ?? fallbackAlt;
  const isSvg = /\.svg(\?|$)/i.test(src);

  return (
    <Link href={href} className="card group flex flex-col overflow-hidden p-0">
      <div className="relative aspect-[16/10] w-full shrink-0 bg-slate-100">
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized={isSvg}
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
      </div>
      <div className="p-6">
        <div className="label text-[var(--muted)]">{label}</div>
        <div className="mt-2 text-lg font-semibold tracking-tight text-[var(--foreground)]">{title}</div>
        <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
        <div className="mt-4 text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--brand-green)]">
          {cta}
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  let editorPicks: Post[] = [];
  let allCats: Category[] = [];
  let exploreImages: {
    living: FeaturedImageData | null;
    kitchen: FeaturedImageData | null;
    blog: FeaturedImageData | null;
  } = { living: null, kitchen: null, blog: null };
  let popularRoomItems: PopularRoomItem[] = [];
  let livingRoomHref = "/category/living-room";

  try {
    const [stickyPosts, categories] = await Promise.all([
      getPosts({ sticky: true, perPage: 3 }, { revalidate: PAGE_ISR_SECONDS }),
      getCategories({ revalidate: PAGE_ISR_SECONDS }),
    ]);
    allCats = categories;
    editorPicks = stickyPosts.length
      ? stickyPosts
      : await getPosts({ perPage: 3 }, { revalidate: PAGE_ISR_SECONDS });

    const livingCat = allCats.find((c) => c.slug === "living-room");
    if (livingCat?.slug) livingRoomHref = `/category/${livingCat.slug}`;
    const kitchenCat =
      allCats.find((c) => c.slug === "kitchen-dining") ?? allCats.find((c) => c.slug === "kitchen");

    const [livingPosts, kitchenPosts] = await Promise.all([
      livingCat
        ? getPosts({ categoryId: livingCat.id, perPage: 1 }, { revalidate: PAGE_ISR_SECONDS })
        : Promise.resolve([] as Post[]),
      kitchenCat
        ? getPosts({ categoryId: kitchenCat.id, perPage: 1 }, { revalidate: PAGE_ISR_SECONDS })
        : Promise.resolve([] as Post[]),
    ]);

    exploreImages = {
      living: featuredImageFromPost(livingPosts[0]),
      kitchen: featuredImageFromPost(kitchenPosts[0]),
      blog: featuredImageFromPost(editorPicks[0]),
    };

    const browseCats = allCats.filter((c) => c.slug !== "uncategorized").slice(0, 12);
    const thumbPosts = await Promise.all(
      browseCats.map((c) => getPosts({ categoryId: c.id, perPage: 1 }, { revalidate: PAGE_ISR_SECONDS })),
    );
    popularRoomItems = browseCats.map((c, i) => ({
      category: c,
      image: featuredImageFromPost(thumbPosts[i]?.[0]),
    }));
  } catch (err) {
    // If WP is temporarily unavailable, render the rest of the homepage
    // instead of crashing with a 500.
    console.error("Failed to load home page data", err);
  }

  const heroFeatureCards = await resolveHeroFeatureCards(allCats);

  const heroFeatured =
    firstFeaturedImageFromPosts(editorPicks) ?? exploreImages.living ?? exploreImages.kitchen;
  const heroImageSrc = heroFeatured?.src ?? FALLBACK_EXPLORE_IMAGE;
  const heroImageAlt = heroFeatured?.alt ?? "Home decor inspiration";
  const heroImageUnopt = /\.svg(\?|$)/i.test(heroImageSrc);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-[#d8e6f5] via-[#e4eef9] to-[#edf4fb]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[rgba(181,204,231,0.45)] blur-3xl" />
          <div className="absolute -bottom-28 -right-16 h-[380px] w-[380px] rounded-full bg-[rgba(143,184,90,0.08)] blur-3xl" />
          <div className="absolute -bottom-28 -left-28 h-[520px] w-[520px] rounded-full bg-[rgba(255,255,255,0.55)] blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(880px_circle_at_88%_18%,rgba(40,86,152,0.07),transparent_58%)]" />
        </div>

        <Container>
          <div className="relative py-10 md:py-14">
            <div className="grid items-center gap-8 md:grid-cols-12">
              {/* Left: heading/content */}
              <div className="relative z-10 md:col-span-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)]/90 px-3 py-1.5 text-[11px] font-semibold text-[var(--muted)] shadow-[var(--shadow-soft)] backdrop-blur">
                  Premium interior inspiration
                  <span className="h-1 w-1 rounded-full bg-[var(--brand-secondary)]" />
                  Curated daily
                </div>

                <h1 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-tight text-[var(--foreground)] md:text-5xl">
                  Elevate Your Space
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
                  Thoughtful room ideas, timeless palettes, and practical styling tips—designed to make your home feel intentional, calm, and beautifully lived-in.
                </p>

                <div className="relative z-10 mt-6 flex flex-col items-start gap-3 sm:flex-row">
                  <Link
                    href="/blog"
                    className="btn-primary relative z-10 inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition"
                  >
                    Get Started
                  </Link>
                  <Link
                    href={livingRoomHref}
                    className="btn-secondary relative z-10 inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition"
                  >
                    Explore Living Room
                  </Link>
                </div>
              </div>

              {/* Right: hero image — first editor pick featured image when available */}
              <div className="relative z-10 md:col-span-6 flex items-center justify-center md:justify-end">
                <div
                  className="relative aspect-[16/10] w-full max-w-[580px] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-slate-100 shadow-[0_22px_44px_-14px_rgba(26,35,50,0.11),0_10px_24px_-12px_rgba(26,35,50,0.06),0_0_0_1px_rgba(26,35,50,0.07)]"
                >
                  <Image
                    src={heroImageSrc}
                    alt={heroImageAlt}
                    fill
                    priority
                    unoptimized={heroImageUnopt}
                    sizes="(min-width: 1024px) 580px, (min-width: 768px) 55vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <HeroFeatureCards items={heroFeatureCards} />
          </div>
        </Container>
      </section>

      <section className="border-b border-slate-200/60 bg-white py-12">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            <HomeExploreLinkCard
              href="/category/living-room"
              label="Living Room"
              title="Comfort that looks intentional"
              description="Layouts, lighting, and styling edits that instantly upgrade the feel."
              cta="Explore →"
              image={exploreImages.living}
              fallbackAlt="Living room decor inspiration"
            />
            <HomeExploreLinkCard
              href="/category/kitchen-dining"
              label="Kitchen & dining"
              title="Small upgrades, big impact"
              description="Practical decor changes that feel premium without being expensive."
              cta="Explore →"
              image={exploreImages.kitchen}
              fallbackAlt="Kitchen and dining decor inspiration"
            />
            <HomeExploreLinkCard
              href="/blog"
              label="Blog"
              title="Fresh ideas, curated daily"
              description="Room inspiration, styling tips, and category roundups."
              cta="Browse →"
              image={exploreImages.blog}
              fallbackAlt="Home decor blog ideas"
            />
          </div>
        </Container>
      </section>

      <section className="border-y border-slate-200/60 bg-[#f2f7fc] py-14">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                Editors picks
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                Room ideas you can actually finish
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                Fresh posts curated for quick wins: layout tweaks, lighting choices, and practical styling steps.
              </p>
            </div>
            <Link
              href="/blog"
              className="btn-primary inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold"
            >
              Browse all posts
            </Link>
          </div>

          <div className="mt-8">
            <PostList posts={editorPicks} priorityImageCount={3} />
          </div>
        </Container>
      </section>

      <PopularRoomsSection items={popularRoomItems} />
    </div>
  );
}
