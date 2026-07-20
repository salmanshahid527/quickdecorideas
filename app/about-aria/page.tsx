import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { PrivacyPageFallback } from "@/components/pages/MarketingPageFallbacks";
import { getPageBySlug } from "@/lib/wp/server";
import { wpMarketingPageSlug } from "@/lib/wp/wpPageSlugs";
import { buildMetadata } from "@/lib/seo/metadata";
import { metaDescriptionFromWpPage } from "@/lib/seo/wpMeta";

export const revalidate = 43200;

const MEET_ARIA_META_FALLBACK =
  "Meet Aria, the creative mind behind Quick Decor Ideas. Discover practical decor tips, inspiration, and interior design stories.";

// Fallback safety slug in case the mapping function doesn't recognize this slug yet
const FALLBACK_SLUG = "meet-aria";

export async function generateMetadata(): Promise<Metadata> {
  // Safe fallback pattern to bypass rigid dynamic key restrictions
  let wpSlug = FALLBACK_SLUG;
  try {
    const configSlug = wpMarketingPageSlug(FALLBACK_SLUG as Parameters<typeof wpMarketingPageSlug>[0]);
    if (configSlug) wpSlug = configSlug;
  } catch {
    wpSlug = FALLBACK_SLUG;
  }
  
  const page = await getPageBySlug(wpSlug);
  
  return buildMetadata({
    title: page?.title ?? "Meet Aria",
    description: page ? metaDescriptionFromWpPage(page, MEET_ARIA_META_FALLBACK) : MEET_ARIA_META_FALLBACK,
    canonical: "/meet-aria",
    type: "website", 
  });
}

export default async function MeetAriaPage() {
  // Safe fallback pattern to bypass rigid dynamic key restrictions
  let wpSlug = FALLBACK_SLUG;
  try {
    const configSlug = wpMarketingPageSlug(FALLBACK_SLUG as Parameters<typeof wpMarketingPageSlug>[0]);
    if (configSlug) wpSlug = configSlug;
  } catch {
    wpSlug = FALLBACK_SLUG;
  }
  
  const page = await getPageBySlug(wpSlug);

  return (
    <div className="py-10">
      <Container>
        {/* Render page content from WordPress if available; otherwise show fallback template */}
        {page ? <WpPageContent page={page} /> : <PrivacyPageFallback />}
      </Container>
    </div>
  );
}