import { WP_API_BASE } from "./constants";

export type WpFetchOptions = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

export function wpUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const base = path.startsWith("http") ? path : `${WP_API_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const url = new URL(base);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export async function fetchWpJson<T>(path: string, opts?: WpFetchOptions): Promise<T> {
  const res = await fetch(path.startsWith("http") ? path : wpUrl(path), {
    headers: { Accept: "application/json", ...(opts?.headers ?? {}) },
    ...opts,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WP request failed (${res.status}) ${path}: ${text.slice(0, 400)}`);
  }

  return (await res.json()) as T;
}

