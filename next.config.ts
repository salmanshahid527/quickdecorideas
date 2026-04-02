import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* Multiple lockfiles (e.g. ~/package-lock.json + this repo) make Next infer the wrong
 * workspace root, so PostCSS/Tailwind may not run and the site renders unstyled. */
const configDir = path.dirname(fileURLToPath(import.meta.url));

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

/** Hostnames allowed for `next/image` (must include WordPress media origin, often api.*). */
function imageRemotePatterns(): RemotePattern[] {
  const patterns: RemotePattern[] = [];
  const seen = new Set<string>();

  function add(protocol: "http" | "https", hostname: string) {
    const key = `${protocol}://${hostname}`;
    if (seen.has(key)) return;
    seen.add(key);
    patterns.push({ protocol, hostname, pathname: "/**" });
  }

  const envBases = [
    process.env.WORDPRESS_URL,
    process.env.NEXT_PUBLIC_WORDPRESS_URL,
    process.env.WORDPRESS_API_URL,
    process.env.NEXT_PUBLIC_API_URL,
  ];

  for (const raw of envBases) {
    const trimmed = raw?.trim();
    if (!trimmed) continue;
    const base = trimmed.replace(/\/wp-json\/?$/i, "");
    try {
      const u = new URL(/^[a-z]+:\/\//i.test(base) ? base : `https://${base}`);
      add(u.protocol === "http:" ? "http" : "https", u.hostname);
    } catch {
      /* ignore invalid env */
    }
  }

  for (const hostname of [
    "quickdecorideas.com",
    "www.quickdecorideas.com",
    "api.quickdecorideas.com",
    "secure.gravatar.com",
  ]) {
    add("https", hostname);
  }

  return patterns;
}

const nextConfig: NextConfig = {
  outputFileTracingRoot: configDir,
  images: {
    remotePatterns: imageRemotePatterns(),
  },
};

export default nextConfig;