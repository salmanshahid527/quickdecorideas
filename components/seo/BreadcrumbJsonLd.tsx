import { JsonLd } from "./JsonLd";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo/site";

export type BreadcrumbItem = { name: string; url: string };

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : absoluteUrl(it.url),
    })),
  };

  return (
    <>
      <meta name="application-name" content={SITE_NAME} />
      <link rel="home" href={SITE_URL} />
      <JsonLd data={data} />
    </>
  );
}

