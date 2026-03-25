"use client";

/**
 * Catches errors in the root layout. Must define its own <html> / <body>
 * (global CSS from the root layout may not apply here).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const msg = error.message ?? "";
  const looksLikeStaleChunk =
    msg.includes("Cannot read properties of undefined") && msg.includes("call");

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f2f4f7",
          color: "#1a2332",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <h1 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: 12 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "#5c6678", marginBottom: 20 }}>
            {looksLikeStaleChunk
              ? "Bundle out of sync — common in dev after edits. Reload the page, or delete .next and restart npm run dev."
              : msg || "An unexpected error occurred."}
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                borderRadius: 9999,
                border: "none",
                padding: "10px 20px",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                background: "#285698",
                color: "#fffef9",
              }}
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                borderRadius: 9999,
                border: "1px solid rgba(42,38,34,0.2)",
                padding: "10px 20px",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                background: "#ffffff",
                color: "#1a2332",
              }}
            >
              Reload page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
