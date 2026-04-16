import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { AboutPageFallback } from "@/components/pages/MarketingPageFallbacks";
import { getPageBySlug } from "@/lib/wp/server";
import { wpMarketingPageSlug } from "@/lib/wp/wpPageSlugs";
import { buildMetadata } from "@/lib/seo/metadata";
import { metaDescriptionFromWpPage } from "@/lib/seo/wpMeta";

export const revalidate = 3600;

const ABOUT_META_FALLBACK =
  "Learn more about Quick Decor Ideas — our mission, editorial approach, and practical home inspiration.";

export async function generateMetadata(): Promise<Metadata> {
  const wpSlug = wpMarketingPageSlug("about");
  const page = await getPageBySlug(wpSlug);
  return buildMetadata({
    title: page?.title ?? "About",
    description: page ? metaDescriptionFromWpPage(page, ABOUT_META_FALLBACK) : ABOUT_META_FALLBACK,
    canonical: "/about",
    type: "website",
  });
}

export default async function AboutPage() {
  const wpSlug = wpMarketingPageSlug("about");
  const page = await getPageBySlug(wpSlug);

  return (
    <div className="py-10">
      <Container>
        {page ? <WpPageContent page={page} /> : <AboutPageFallback />}
      </Container>
    </div>
  );
}

