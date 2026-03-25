import { WP_API_BASE } from "./constants";

export type WpFetchOptions = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

export function wpUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const base = path.startsWith("http") ? path : `${WP_API_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    throw new Error(
      `Invalid WordPress API URL (check WORDPRESS_URL / NEXT_PUBLIC_WORDPRESS_URL / NEXT_PUBLIC_API_URL): ${base}`,
    );
  }
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}


export async function fetchWpJson<T>(path: string, opts?: WpFetchOptions): Promise<T> {
  const url =
    path.startsWith("http") || path.startsWith("/") ? path : wpUrl(path);
  const res = await fetch(url, {
    headers: { Accept: "application/json", ...(opts?.headers ?? {}) },
    ...opts,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WP request failed (${res.status}) ${path}: ${text.slice(0, 400)}`);
  }

  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`WP response was not JSON (${path}): ${text.slice(0, 200)}`);
  }
}

