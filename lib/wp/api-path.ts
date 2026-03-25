/** Browser / React Query: same-origin proxy to `app/api/wp/[...path]`. */
export function wpApiProxyPath(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  const clean = path.replace(/^\//, "");
  const sp = new URLSearchParams();
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) sp.set(k, String(v));
    }
  }
  const q = sp.toString();
  return `/api/wp/${clean}${q ? `?${q}` : ""}`;
}
