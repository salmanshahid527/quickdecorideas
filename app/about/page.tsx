import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { WpPageContent } from "@/components/pages/WpPageContent";
import { getPageBySlug } from "@/lib/wp/server";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "About",
    description: "Learn more about Quick Decor Ideas.",
    canonical: "/about",
    type: "website",
  });
}

export default async function AboutPage() {
  const page = await getPageBySlug("about", { revalidate });
  if (!page) notFound();

  return (
    <div className="py-10">
      <Container>
        <WpPageContent slug="about" initialPage={page} />
      </Container>
    </div>
  );
}

