import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
  slug,
}: {
  currentPage: number;
  totalPages: number;
  slug: string;
}) {
  if (totalPages <= 1) return null;

  const pageUrl = (p: number) =>
    p === 1 ? `/category/${slug}` : `/category/${slug}?page=${p}`;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="mt-12 flex items-center justify-center gap-3">
      {hasPrev ? (
        <Link
          href={pageUrl(currentPage - 1)}
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:opacity-75"
        >
          ← Previous
        </Link>
      ) : (
        <span className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium opacity-30 cursor-not-allowed">
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
        <span className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium opacity-30 cursor-not-allowed">
          Next →
        </span>
      )}
    </div>
  );
}