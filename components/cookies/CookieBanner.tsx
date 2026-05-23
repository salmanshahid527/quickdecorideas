"use client";
import { useState, useEffect } from "react";
import { useConsent } from "@/context/ConsentContext";
import CookiePreferences from "@/components/cookies/CookiePreferences";

export default function CookieBanner() {
  const { hasConsented, acceptAll, rejectAll } = useConsent();
  const [showPrefs, setShowPrefs] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure the component only runs on the client-side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Do not render anything if the client hasn't loaded or if the user has already given consent
  if (!isClient || hasConsented) return null;

  return (
    <>
      {/* Responsive fixed banner with high z-index layout */}
      <div 
        role="dialog" 
        aria-label="Cookie consent" 
        className="fixed bottom-0 left-0 right-0 z-[99999] border-t border-[#e8e4dd] bg-[#f2f4f7] px-4 py-5 shadow-[0_-10px_25px_rgba(0,0,0,0.08)] md:px-8 md:py-5"
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {/* Text Section */}
          <p className="text-center text-sm leading-relaxed text-[#5a5a5a] md:text-left">
             We use cookies to enhance your browsing experience.{" "}
            <a href="/privacy" className="text-[#8a7560] underline underline-offset-2 hover:text-[#6b5c47]">
              Privacy Policy
            </a>
          </p>

          {/* Buttons Section - Fully Responsive */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
            <button 
              onClick={rejectAll} 
              className="rounded-full border border-[#c8c0b4] bg-transparent px-5 py-2 text-sm text-[#5a5a5a] transition active:scale-95 hover:bg-[#e8e4dd]"
            >
              Reject all
            </button>
            <button 
              onClick={acceptAll} 
              className="rounded-full bg-[#3d3730] px-5 py-2 text-sm text-white transition active:scale-95 hover:bg-[#5a5047]"
            >
              Accept all
            </button>
            <button 
              onClick={() => setShowPrefs(true)} 
              className="text-sm text-[#8a7560] underline underline-offset-2 hover:text-[#6b5c47]"
            >
              Manage preferences
            </button>
          </div>

        </div>
      </div>

      {showPrefs && <CookiePreferences onClose={() => setShowPrefs(false)} />}
    </>
  );
}
