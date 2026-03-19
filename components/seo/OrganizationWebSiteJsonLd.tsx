import { JsonLd } from "./JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

export function OrganizationWebSiteJsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  ];

  return <JsonLd data={data} />;
}

