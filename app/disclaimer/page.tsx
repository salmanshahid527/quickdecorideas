import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { PrivacyPageFallback } from "@/components/pages/MarketingPageFallbacks";
import { getPageBySlug } from "@/lib/wp/server";
import { buildMetadata } from "@/lib/seo/metadata";
import { metaDescriptionFromWpPage } from "@/lib/seo/wpMeta";

export const revalidate = 3600;

const DISCLAIMER_META_FALLBACK =
  "Disclaimer for Quick Decor Ideas — general informational content, no professional advice, and liability limitations.";

export async function generateMetadata(): Promise<Metadata> {
  const wpSlug = "disclaimer";
  const page = await getPageBySlug(wpSlug);

  return buildMetadata({
    title: page?.title ?? "Disclaimer",
    description: page
      ? metaDescriptionFromWpPage(page, DISCLAIMER_META_FALLBACK)
      : DISCLAIMER_META_FALLBACK,
    canonical: "/disclaimer",
    type: "website",
  });
}

export default async function disclaimerPage() {
  const wpSlug = "disclaimer";
  const page = await getPageBySlug(wpSlug);

  return (
    <div className="py-10">
      <Container>
        {page ? <WpPageContent page={page} /> : <PrivacyPageFallback />}
      </Container>
    </div>
  );
}