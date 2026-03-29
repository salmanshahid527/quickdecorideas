"use client";

import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { PostList } from "@/components/posts/PostList";

function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function CloseGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

const SUGGESTIONS = ["Bedroom", "Kitchen", "Living room", "Bathroom", "Home office"];

export function SearchView() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);
  const { data: results = [], isLoading, isFetching } = useSearch(debouncedQuery);

  const isSearching = isLoading || isFetching;
  const hasQuery = debouncedQuery.trim().length >= 2;

  return (
    <div>
      <div className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-primary)]">
          Search
        </p>
        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
          Find decor ideas
        </h1>
        <div className="relative max-w-2xl">
          <SearchGlyph className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search room ideas, styles, tips…"
            autoFocus
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-14 pr-12 text-lg text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-700"
              aria-label="Clear search"
            >
              <CloseGlyph className="h-[18px] w-[18px]" />
            </button>
          ) : null}
        </div>
      </div>

      {isSearching && hasQuery ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)]"
            >
              <div className="aspect-[16/10] animate-pulse bg-slate-100" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {!isSearching && hasQuery && results.length > 0 ? (
        <>
          <p className="mb-6 text-sm text-[var(--muted)]">
            {results.length} {results.length === 1 ? "result" : "results"} for{" "}
            <span className="font-medium text-[var(--brand-primary)]">&ldquo;{debouncedQuery}&rdquo;</span>
          </p>
          <PostList posts={results} variant="blog" priorityImageCount={4} />
        </>
      ) : null}

      {!isSearching && hasQuery && results.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-6 py-16 text-center">
          <p className="mb-3 text-2xl" aria-hidden>
            🔍
          </p>
          <p className="text-lg font-medium text-slate-800">No results found</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Try &ldquo;bedroom ideas&rdquo;, &ldquo;kitchen decor&rdquo;, or another keyword.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-600 transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {!hasQuery ? (
        <div className="py-8 text-center text-[var(--muted)]">
          <p>Start typing to search posts (at least 2 characters)…</p>
        </div>
      ) : null}
    </div>
  );
}
