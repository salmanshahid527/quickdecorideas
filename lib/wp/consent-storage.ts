import type { CookieConsent } from "@/types/cookie-consent";
// import { DEFAULT_CONSENT } from "@/types/cookie-consent";

const STORAGE_KEY = "qdi_cookie_consent";
const CONSENT_VERSION = "1.0";

export function saveConsent(consent: CookieConsent): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
}

export function loadConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: CookieConsent = JSON.parse(raw);
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearConsent(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}