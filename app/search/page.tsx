import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SearchView } from "@/components/search/SearchView";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_NAME } from "@/lib/seo/site";

export const revalidate = 43200;

export const metadata: Metadata = {
  ...buildMetadata({
  title: "Search",
  description: `Search room ideas and decor articles on ${SITE_NAME}.`,
  canonical: "/search",
  type: "website",
  }),
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <div className="py-10">
      <Container>
        <SearchView />
      </Container>
    </div>
  );
}
