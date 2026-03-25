import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* Multiple lockfiles (e.g. ~/package-lock.json + this repo) make Next infer the wrong
 * workspace root, so PostCSS/Tailwind may not run and the site renders unstyled. */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "quickdecorideas.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.quickdecorideas.com",
        pathname: "/**",
      },
      // Yeh wala naya add karein
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;