"use client";
import Script from "next/script";
import { useConsent } from "@/context/ConsentContext";
import { ConsentCategory } from "@/types/cookie-consent";

export default function ConsentGuard() {
  const { consent } = useConsent();
  const analyticsAllowed = consent.categories[ConsentCategory.Analytics];

  if (!analyticsAllowed) return null;

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
        strategy="lazyOnload"
      />
      <Script id="ga-init" strategy="lazyOnload">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXX');
      `}</Script>
    </>
  );
}