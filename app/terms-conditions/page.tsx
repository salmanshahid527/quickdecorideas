import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { PrivacyPageFallback } from "@/components/pages/MarketingPageFallbacks";
import { getPageBySlug } from "@/lib/wp/server";
import { wpMarketingPageSlug } from "@/lib/wp/wpPageSlugs";
import { buildMetadata } from "@/lib/seo/metadata";
import { metaDescriptionFromWpPage } from "@/lib/seo/wpMeta";

export const revalidate = 43200;

const TERMS_META_FALLBACK =
  "Terms and conditions for Quick Decor Ideas — guidelines and rules for using our website and services.";

// Fallback safety slug in case the mapping function returns undefined
const FALLBACK_SLUG = "terms-conditions";

export async function generateMetadata(): Promise<Metadata> {
  // Use Type Casting (as any) to prevent TypeScript from complaining if 'terms-conditions' isn't explicitly typed yet
  const configSlug = wpMarketingPageSlug("terms-conditions" as any);
  const wpSlug = typeof configSlug === "string" && configSlug ? configSlug : FALLBACK_SLUG;
  
  const page = await getPageBySlug(wpSlug);
  
  return buildMetadata({
    title: page?.title ?? "Terms and Conditions",
    description: page ? metaDescriptionFromWpPage(page, TERMS_META_FALLBACK) : TERMS_META_FALLBACK,
    canonical: "/terms-conditions",
    type: "website",
  });
}

export default async function TermsConditionsPage() {
  // Use Type Casting (as any) to prevent TypeScript from complaining if 'terms-conditions' isn't explicitly typed yet
  const configSlug = wpMarketingPageSlug("terms-conditions" as any);
  const wpSlug = typeof configSlug === "string" && configSlug ? configSlug : FALLBACK_SLUG;
  
  const page = await getPageBySlug(wpSlug);

  return (
    <div className="py-10">
      <Container>
        {/* Render page content if available from WordPress; otherwise show fallback template */}
        {page ? <WpPageContent page={page} /> : <PrivacyPageFallback />}
      </Container>
    </div>
  );
}