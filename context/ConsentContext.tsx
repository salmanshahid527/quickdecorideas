"use client";
import {
  createContext, useContext, useState,
  useEffect, useCallback, type ReactNode,
} from "react";
import type { CookieConsent, ConsentCategory } from "../types/cookie-consent";
import { DEFAULT_CONSENT } from "../types/cookie-consent";
import { saveConsent, loadConsent } from "../lib/wp/consent-storage";

interface ConsentContextValue {
  consent: CookieConsent;
  acceptAll: () => void;
  rejectAll: () => void;
  updateCategory: (cat: ConsentCategory, value: boolean) => void;
  saveCustom: () => void;
  hasConsented: boolean;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent>(DEFAULT_CONSENT);

  useEffect(() => {
    const saved = loadConsent();
    if (saved) setConsent(saved);
  }, []);

  const acceptAll = useCallback(() => {
    const updated: CookieConsent = {
      ...consent,
      state: "accepted",
      categories: {
        necessary: true,
        analytics: true,
        marketing: true,
      },
      timestamp: Date.now(),
      version: "1.0",
    };
    setConsent(updated);
    saveConsent(updated);
  }, [consent]);

  const rejectAll = useCallback(() => {
    const updated: CookieConsent = {
      ...consent,
      state: "rejected",
      categories: {
        necessary: true,
        analytics: false,
        marketing: false,
      },
      timestamp: Date.now(),
      version: "1.0",
    };
    setConsent(updated);
    saveConsent(updated);
  }, [consent]);

  const updateCategory = useCallback(
    (cat: ConsentCategory, value: boolean) => {
      setConsent((prev) => ({
        ...prev,
        categories: { ...prev.categories, [cat]: value },
      }));
    },
    []
  );

  const saveCustom = useCallback(() => {
    const updated: CookieConsent = {
      ...consent,
      state: "accepted",
      timestamp: Date.now(),
    };
    setConsent(updated);
    saveConsent(updated);
  }, [consent]);

  return (
    <ConsentContext.Provider
      value={{
        consent,
        acceptAll,
        rejectAll,
        updateCategory,
        saveCustom,
        hasConsented: consent.state !== "pending",
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be inside ConsentProvider");
  return ctx;
}