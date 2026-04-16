import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { PrivacyPageFallback } from "@/components/pages/MarketingPageFallbacks";
import { getPageBySlug } from "@/lib/wp/server";
import { wpMarketingPageSlug } from "@/lib/wp/wpPageSlugs";
import { buildMetadata } from "@/lib/seo/metadata";
import { metaDescriptionFromWpPage } from "@/lib/seo/wpMeta";

export const revalidate = 3600;

const PRIVACY_META_FALLBACK =
  "Privacy policy for Quick Decor Ideas — how we handle data when you use our site and content.";

export async function generateMetadata(): Promise<Metadata> {
  const wpSlug = wpMarketingPageSlug("privacy");
  const page = await getPageBySlug(wpSlug);
  return buildMetadata({
    title: page?.title ?? "Privacy Policy",
    description: page ? metaDescriptionFromWpPage(page, PRIVACY_META_FALLBACK) : PRIVACY_META_FALLBACK,
    canonical: "/privacy",
    type: "website",
  });
}

export default async function PrivacyPage() {
  const wpSlug = wpMarketingPageSlug("privacy");
  const page = await getPageBySlug(wpSlug);

  return (
    <div className="py-10">
      <Container>
        {page ? <WpPageContent page={page} /> : <PrivacyPageFallback />}
      </Container>
    </div>
  );
}

