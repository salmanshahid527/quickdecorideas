import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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