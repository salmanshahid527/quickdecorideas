import type { Category, Page } from "@/lib/wp/types";
import { metaDescriptionFromHtml } from "./metaDescription";

/** Meta description from a WordPress page body (opening text). */
export function metaDescriptionFromWpPage(page: Page, fallback: string): string {
  return metaDescriptionFromHtml(page.contentHtml) ?? fallback;
}

/** Category archive meta: strip HTML from term descriptions when present. */
export function categoryMetaDescription(category: Category): string {
  if (category.description?.trim()) {
    return (
      metaDescriptionFromHtml(category.description) ??
      category.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    );
  }
  return `Browse ${category.name} decor ideas, tips, and inspiration — curated guides and room inspiration.`;
}
