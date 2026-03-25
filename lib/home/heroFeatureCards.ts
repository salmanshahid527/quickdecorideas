import { PAGE_ISR_SECONDS } from "@/lib/seo/isr";
import { getPosts } from "@/lib/wp/server";
import type { Category, Post } from "@/lib/wp/types";
import { featuredImageFromPost } from "@/lib/wp/postFeaturedImage";

export type HeroFeatureCardData = {
  href: string;
  label: string;
  title: string;
  description: string;
  cta: string;
  image: { src: string; alt: string } | null;
};

type CategorySlot = {
  kind: "category";
  label: string;
  categorySlugs: string[];
  fallback: { title: string; description: string; cta: string };
};

type AnchorSlot = {
  kind: "anchor";
  label: string;
  href: string;
  previewCategorySlugs: string[];
  fallback: { title: string; description: string; cta: string };
};

const HERO_FEATURE_SLOTS: (CategorySlot | AnchorSlot)[] = [
  {
    kind: "category",
    label: "Design",
    categorySlugs: ["interior-design", "interior"],
    fallback: {
      title: "Interior design",
      description: "Layouts, color, and styling direction for polished rooms.",
      cta: "Explore design →",
    },
  },
  {
    kind: "category",
    label: "Decor",
    categorySlugs: ["home-decor", "decor"],
    fallback: {
      title: "Home decor",
      description: "Accents, textiles, and finishing touches that elevate everyday spaces.",
      cta: "Shop the look →",
    },
  },
  {
    kind: "anchor",
    label: "Start here",
    href: "/#browse-by-space",
    previewCategorySlugs: ["living-room", "bedroom", "kitchen-dining", "bathroom"],
    fallback: {
      title: "Room-by-room guides",
      description: "Browse ideas by space—living room, bedroom, kitchen, and more.",
      cta: "Browse by space →",
    },
  },
];

function findCategory(cats: Category[], slugs: string[]): Category | null {
  for (const slug of slugs) {
    const c = cats.find((x) => x.slug === slug && x.slug.toLowerCase() !== "uncategorized");
    if (c) return c;
  }
  return null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptPlain(post: Post | null | undefined, maxLen: number): string {
  if (!post?.excerptHtml) return "";
  const t = stripHtml(post.excerptHtml);
  if (!t) return "";
  return t.length > maxLen ? `${t.slice(0, maxLen - 1).trim()}…` : t;
}

function descriptionForCategory(cat: Category | null, post: Post | null | undefined, fallback: string): string {
  const fromTerm = cat?.description?.trim() ? stripHtml(cat.description) : "";
  if (fromTerm.length > 20) {
    return fromTerm.length > 160 ? `${fromTerm.slice(0, 159).trim()}…` : fromTerm;
  }
  const fromPost = excerptPlain(post, 130);
  return fromPost || fallback;
}

/**
 * Builds the three hero feature cards from WordPress categories + the latest post in each (for image + excerpt).
 */
export async function resolveHeroFeatureCards(allCats: Category[]): Promise<HeroFeatureCardData[]> {
  const resolved = HERO_FEATURE_SLOTS.map((slot) => {
    if (slot.kind === "category") {
      const cat = findCategory(allCats, slot.categorySlugs);
      return { slot, cat, href: cat ? `/category/${cat.slug}` : "/blog" };
    }
    const cat = findCategory(allCats, slot.previewCategorySlugs);
    return { slot, cat, href: slot.href };
  });

  const posts = await Promise.all(
    resolved.map(async ({ cat }) => {
      if (!cat) return null;
      const list = await getPosts({ categoryId: cat.id, perPage: 1 }, { revalidate: PAGE_ISR_SECONDS });
      return list[0] ?? null;
    }),
  );

  return resolved.map(({ slot, cat, href }, i) => {
    const post = posts[i];
    const fb = slot.fallback;
    const isAnchor = slot.kind === "anchor";
    const title = isAnchor ? fb.title : (cat?.name ?? fb.title);
    const description = descriptionForCategory(cat, post, fb.description);
    const image = featuredImageFromPost(post);

    return {
      href,
      label: slot.label,
      title,
      description,
      cta: fb.cta,
      image,
    };
  });
}
