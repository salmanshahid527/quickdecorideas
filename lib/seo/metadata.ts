import type { Metadata } from "next";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from "./site";

type OgImage = { url: string; width?: number; height?: number; alt?: string };

export function buildMetadata(input: {
  title: string;
  description?: string;
  canonical: string;
  ogImage?: OgImage;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const canonical = absoluteUrl(input.canonical);
  const og = input.ogImage ?? DEFAULT_OG_IMAGE;

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical },
    openGraph: {
      type: input.type ?? "website",
      siteName: SITE_NAME,
      title: input.title,
      description: input.description,
      url: canonical,
      images: [
        {
          url: og.url.startsWith("http") ? og.url : absoluteUrl(og.url),
          width: og.width ?? DEFAULT_OG_IMAGE.width,
          height: og.height ?? DEFAULT_OG_IMAGE.height,
          alt: og.alt ?? DEFAULT_OG_IMAGE.alt,
        },
      ],
      ...(input.type === "article"
        ? {
            publishedTime: input.publishedTime,
            modifiedTime: input.modifiedTime,
          }
        : null),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [og.url.startsWith("http") ? og.url : absoluteUrl(og.url)],
    },
  };
}

