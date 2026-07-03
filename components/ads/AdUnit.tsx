'use client';

import { useEffect, useRef } from 'react';

interface AdUnitProps {
  adKey: string;
  width: number;
  height: number;
}

export default function AdUnit({ adKey, width, height }: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isProduction = process.env.NODE_ENV === 'production';
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

  useEffect(() => {
    if (!isProduction || !adsEnabled || !adRef.current) return;

    adRef.current.innerHTML = '';

    const optionsScript = document.createElement('script');
    optionsScript.type = 'text/javascript';
    optionsScript.innerHTML = `
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
    invokeScript.async = true;

    adRef.current.appendChild(optionsScript);
    adRef.current.appendChild(invokeScript);

    return () => {
      if (adRef.current) adRef.current.innerHTML = '';
    };
  }, [adKey, width, height, isProduction, adsEnabled]);

  if (!isProduction || !adsEnabled) return null;

  return (
    <div
      ref={adRef}
      className="flex justify-center items-center my-4"
      style={{ minWidth: width, minHeight: height }}
    />
  );
}