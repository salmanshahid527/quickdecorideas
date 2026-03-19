import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { getPageBySlug } from "@/lib/wp/server";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Privacy Policy",
    description: "Privacy policy for Quick Decor Ideas.",
    canonical: "/privacy",
    type: "website",
  });
}

export default async function PrivacyPage() {
  const page = await getPageBySlug("privacy", { revalidate });
  if (!page) notFound();

  return (
    <div className="py-10">
      <Container>
        <WpPageContent slug="privacy" initialPage={page} />
      </Container>
    </div>
  );
}

