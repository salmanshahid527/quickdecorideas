'use client';

import { useEffect, useRef } from 'react';

export default function NativeBannerAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProduction = process.env.NODE_ENV === 'production';
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
  const nativeKey = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_KEY!;
  const containerId = `container-${nativeKey}`;
  const scriptSrc = `https://pl30183607.effectivecpmnetwork.com/${nativeKey}/invoke.js`;

  useEffect(() => {
    if (!isProduction || !adsEnabled || !containerRef.current) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = scriptSrc;

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [isProduction, adsEnabled, scriptSrc]);

  if (!isProduction || !adsEnabled) return null;

  return (
    <div ref={containerRef} className="my-4">
      <div id={containerId}></div>
    </div>
  );
}