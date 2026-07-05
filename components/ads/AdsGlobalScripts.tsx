'use client';

import { useEffect } from 'react';

export default function AdsGlobalScripts() {
  const isProduction = process.env.NODE_ENV === 'production';
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
  const popunderKey = process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_KEY!;
  const socialBarKey = process.env.NEXT_PUBLIC_ADSTERRA_SOCIALBAR_KEY!;

  useEffect(() => {
    if (!isProduction || !adsEnabled) return;

    // Popunder
    const popunder = document.createElement('script');
    popunder.src = `https://pl30183606.effectivecpmnetwork.com/6e/47/1c/${popunderKey}.js`;
    document.head.appendChild(popunder);

    // Social Bar
    const socialBar = document.createElement('script');
    socialBar.src = `https://pl30183608.effectivecpmnetwork.com/00/8a/18/${socialBarKey}.js`;
    document.body.appendChild(socialBar);

    return () => {
      popunder.remove();
      socialBar.remove();
    };
  }, [isProduction, adsEnabled, popunderKey, socialBarKey]);

  return null;
}