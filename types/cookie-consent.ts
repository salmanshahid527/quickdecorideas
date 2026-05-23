export enum ConsentCategory {
  Necessary = "necessary",
  Analytics = "analytics",
  Marketing = "marketing",
}

export type ConsentState = "pending" | "accepted" | "rejected";

export interface CookieConsent {
  state: ConsentState;
  categories: Record<ConsentCategory, boolean>;
  timestamp: number;
  version: string;
}

export const DEFAULT_CONSENT: CookieConsent = {
  state: "pending",
  categories: {
    [ConsentCategory.Necessary]: true,
    [ConsentCategory.Analytics]: false,
    [ConsentCategory.Marketing]: false,
  },
  timestamp: 0,
  version: "1.0",
};