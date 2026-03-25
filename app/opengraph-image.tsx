import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo/site";

/** Literal for Next.js; keep equal to `SITEMAP_ISR_SECONDS` in `lib/seo/isr.ts`. */
export const revalidate = 3600;

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "white",
          fontSize: 64,
          fontWeight: 700,
          letterSpacing: -1,
          padding: 80,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ opacity: 0.75, fontSize: 22, fontWeight: 600 }}>
            {SITE_NAME}
          </div>
          <div>Decor ideas, simplified.</div>
        </div>
      </div>
    ),
    size,
  );
}

