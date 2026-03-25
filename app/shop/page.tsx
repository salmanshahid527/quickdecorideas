import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { ShopPageFallback } from "@/components/pages/MarketingPageFallbacks";
import { getPageBySlug } from "@/lib/wp/server";
import { wpMarketingPageSlug } from "@/lib/wp/wpPageSlugs";
import { buildMetadata } from "@/lib/seo/metadata";
import { metaDescriptionFromWpPage } from "@/lib/seo/wpMeta";

export const revalidate = 60;

const SHOP_META_FALLBACK =
  "Curated decor picks and shopping guides — product roundups and ideas from Quick Decor Ideas.";

export async function generateMetadata(): Promise<Metadata> {
  const wpSlug = wpMarketingPageSlug("shop");
  const page = await getPageBySlug(wpSlug);
  return buildMetadata({
    title: page?.title ?? "Shop",
    description: page ? metaDescriptionFromWpPage(page, SHOP_META_FALLBACK) : SHOP_META_FALLBACK,
    canonical: "/shop",
    type: "website",
  });
}

export default async function ShopPage() {
  const wpSlug = wpMarketingPageSlug("shop");
  const page = await getPageBySlug(wpSlug);

  return (
    <div className="py-10">
      <Container>
        {page ? <WpPageContent page={page} /> : <ShopPageFallback />}
      </Container>
    </div>
  );
}

