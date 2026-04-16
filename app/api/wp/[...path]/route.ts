import { NextRequest, NextResponse } from "next/server";
import { WP_API_BASE } from "@/lib/wp/constants";

/**
 * Proxies GET requests to WordPress REST API so React Query runs same-origin
 * (avoids CORS when the headless URL differs from the WP site).
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  if (!path?.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const joined = path.join("/");
  if (!joined.startsWith("wp/v2/")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const target = new URL(`${WP_API_BASE.replace(/\/$/, "")}/${joined}`);
  req.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value);
  });

  const res = await fetch(target.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
