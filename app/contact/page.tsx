import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { ContactPageFallback } from "@/components/pages/MarketingPageFallbacks";
import { getPageBySlug } from "@/lib/wp/server";
import { wpMarketingPageSlug } from "@/lib/wp/wpPageSlugs";
import { buildMetadata } from "@/lib/seo/metadata";
import { metaDescriptionFromWpPage } from "@/lib/seo/wpMeta";

export const revalidate = 3600;

const CONTACT_META_FALLBACK =
  "Contact Quick Decor Ideas — questions, collaborations, and reader feedback.";

export async function generateMetadata(): Promise<Metadata> {
  const wpSlug = wpMarketingPageSlug("contact");
  const page = await getPageBySlug(wpSlug);
  return buildMetadata({
    title: page?.title ?? "Contact",
    description: page ? metaDescriptionFromWpPage(page, CONTACT_META_FALLBACK) : CONTACT_META_FALLBACK,
    canonical: "/contact",
    type: "website",
  });
}

export default async function ContactPage() {
  const wpSlug = wpMarketingPageSlug("contact");
  const page = await getPageBySlug(wpSlug);

  return (
    <div className="py-10">
      <Container>
        {page ? <WpPageContent page={page} /> : <ContactPageFallback />}
      </Container>
    </div>
  );
}

