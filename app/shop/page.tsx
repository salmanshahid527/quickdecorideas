import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { getPageBySlug } from "@/lib/wp/server";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Shop",
    description: "Shop recommendations and curated decor picks.",
    canonical: "/shop",
    type: "website",
  });
}

export default async function ShopPage() {
  const page = await getPageBySlug("shop", { revalidate });
  if (!page) notFound();

  return (
    <div className="py-10">
      <Container>
        <WpPageContent slug="shop" initialPage={page} />
      </Container>
    </div>
  );
}

