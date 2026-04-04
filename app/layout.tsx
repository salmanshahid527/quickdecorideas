import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { Footer } from "@/components/site/Footer";
import { OrganizationWebSiteJsonLd } from "@/components/seo/OrganizationWebSiteJsonLd";
import { getCategories } from "@/lib/wp/server";
import { PAGE_ISR_SECONDS } from "@/lib/seo/isr";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { SiteHeader } from "@/components/site/SiteHeader";
import type { Category } from "@/lib/wp/types";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Practical decor tips, room ideas, and inspiration.",
  robots: { index: true, follow: true },
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

/** ISR for the shell (nav/footer categories). Literal required by Next.js — match `PAGE_ISR_SECONDS`. */
export const revalidate = 60;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f4f7" },
    { media: "(prefers-color-scheme: dark)", color: "#f2f4f7" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: Category[] = [];
  try {
    categories = await getCategories({ revalidate: PAGE_ISR_SECONDS });
  } catch (err) {
    console.error("Layout: failed to load WordPress categories (footer/nav may be empty)", err);
  }

  const categoryNavItems = categories
    .filter((c) => c.slug && c.name && c.slug.toLowerCase() !== "uncategorized")
    .map((c) => ({ label: c.name, href: `/category/${c.slug}` }));

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-[var(--surface)] font-sans text-[var(--foreground)] antialiased`}
      >
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
        <OrganizationWebSiteJsonLd />
        <ReactQueryProvider>
          <SiteHeader categoryNavItems={categoryNavItems} />

          <main className="min-h-[70vh] bg-[var(--surface)]">{children}</main>
          <Footer categories={categories} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
