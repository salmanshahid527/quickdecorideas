import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { getPageBySlug } from "@/lib/wp/server";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Contact",
    description: "Get in touch with Quick Decor Ideas.",
    canonical: "/contact",
    type: "website",
  });
}

export default async function ContactPage() {
  const page = await getPageBySlug("contact", { revalidate });
  if (!page) notFound();

  return (
    <div className="py-10">
      <Container>
        <WpPageContent slug="contact" initialPage={page} />
      </Container>
    </div>
  );
}

