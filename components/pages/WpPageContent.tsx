"use client";

import { useWpPage } from "@/hooks/useWpPage";
import type { Page } from "@/lib/wp/types";

export function WpPageContent({ slug, initialPage }: { slug: string; initialPage: Page | null }) {
  const { data } = useWpPage(slug, initialPage);
  const page = data ?? null;

  if (!page) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <div className="h-5 w-40 animate-pulse rounded bg-black/10" />
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-black/10" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-black/10" />
          <div className="h-4 w-10/12 animate-pulse rounded bg-black/10" />
        </div>
      </div>
    );
  }

  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
        {page.title}
      </h1>
      <div className="wp-content" dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
    </article>
  );
}

