import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { Footer } from "@/components/site/Footer";
import { OrganizationWebSiteJsonLd } from "@/components/seo/OrganizationWebSiteJsonLd";
import { getCategories } from "@/lib/wp/server";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { SiteHeader } from "@/components/site/SiteHeader";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Practical decor tips, room ideas, and inspiration.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-white font-sans text-[#111111] antialiased`}
      >
        <OrganizationWebSiteJsonLd />
        <ReactQueryProvider>
          <SiteHeader />

          <main className="min-h-[70vh] bg-white">{children}</main>
          <Footer categories={categories} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
