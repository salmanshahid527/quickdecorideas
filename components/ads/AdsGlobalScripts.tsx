'use client';

import { useEffect } from 'react';

export default function AdsGlobalScripts() {
  const isProduction = process.env.NODE_ENV === 'production';
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
  const socialBarKey = process.env.NEXT_PUBLIC_ADSTERRA_SOCIALBAR_KEY!;

  useEffect(() => {
    if (!isProduction || !adsEnabled) return;

    // Social Bar
    const socialBar = document.createElement('script');
    socialBar.src = `https://pl30183608.effectivecpmnetwork.com/00/8a/18/${socialBarKey}.js`;
    document.body.appendChild(socialBar);

    return () => {
      socialBar.remove();
    };
  }, [isProduction, adsEnabled, socialBarKey]);

  return null;
}