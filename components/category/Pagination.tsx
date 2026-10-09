import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
  slug,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  slug?: string;
  /** Overrides the category path, e.g. `/blog`. */
  basePath?: string;
}) {
  if (totalPages <= 1) return null;

  const base = basePath ?? `/category/${slug}`;
  const pageUrl = (p: number) => (p === 1 ? base : `${base}?page=${p}`);

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-3"
    >
      {hasPrev ? (
        <Link
          href={pageUrl(currentPage - 1)}
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:opacity-75"
        >
          ← Previous
        </Link>
      ) : (
        <span aria-disabled="true" className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium opacity-30 cursor-not-allowed">
          ← Previous
        </span>
      )}

      <span className="text-sm text-[var(--muted)]">
        Page {currentPage} of {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={pageUrl(currentPage + 1)}
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:opacity-75"
        >
          Next →
        </Link>
      ) : (
        <span aria-disabled="true" className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium opacity-30 cursor-not-allowed">
          Next →
        </span>
      )}

      {/* Numbered links keep every page a few clicks from the first one. */}
      {totalPages <= 20 ? (
        <div className="flex basis-full flex-wrap items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
            n === currentPage ? (
              <span
                key={n}
                aria-current="page"
                className="px-2 py-2 text-sm font-semibold text-[var(--foreground)]"
              >
                {n}
              </span>
            ) : (
              <Link
                key={n}
                href={pageUrl(n)}
                aria-label={`Page ${n}`}
                className="px-2 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                {n}
              </Link>
            ),
          )}
        </div>
      ) : null}
    </nav>
  );
}
