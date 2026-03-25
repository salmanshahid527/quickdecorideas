"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const msg = error.message ?? "";
  const looksLikeStaleChunk =
    msg.includes("Cannot read properties of undefined") && msg.includes("call");

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-lg font-semibold text-[var(--foreground)]">Something went wrong</h1>
      <p className="text-sm leading-relaxed text-[var(--muted)]">
        {looksLikeStaleChunk
          ? "This often happens in local dev when the JavaScript bundle is briefly out of sync (hot reload). Try “Try again” or “Reload page”. If it keeps happening, stop the dev server, delete the .next folder, and run npm run dev again."
          : msg || "An unexpected error occurred."}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => reset()}
          className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn-secondary rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          Reload page
        </button>
      </div>
    </div>
  );
}
