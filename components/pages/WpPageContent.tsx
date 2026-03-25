import type { Page } from "@/lib/wp/types";

/** Server-rendered WordPress page HTML — no client fetch. */
export function WpPageContent({ page }: { page: Page }) {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
        {page.title}
      </h1>
      <div className="wp-content" dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
    </article>
  );
}
