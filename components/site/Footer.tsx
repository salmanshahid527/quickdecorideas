import Link from "next/link";
import type { Category } from "@/lib/wp/types";
import { Container } from "@/components/ui/Container";

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface-muted)] text-[var(--foreground)]">
      <Container>
        <div className="grid grid-cols-1 gap-12 py-14 md:grid-cols-3">
          <div className="flex flex-col items-start space-y-4">
            <h3 className="text-sm font-semibold tracking-wide text-[var(--brand-primary)]">
              Quick Decor Ideas
            </h3>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              Practical decor tips, room ideas, and inspiration—updated daily to help you design
              beautiful spaces effortlessly.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-[var(--muted)] transition hover:text-[var(--brand-primary)]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.5 2.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM12 7.25a4.75 4.75 0 1 1 0 9.5 4.75 4.75 0 0 1 0-9.5Zm0 1.5a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5Z" />
                </svg>
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-[var(--muted)] transition hover:text-[var(--brand-primary)]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M13.5 3.5h2.75V0h-3.75c-3.02 0-5.5 2.48-5.5 5.5v2.5H4.5v3.5h2.75V24h4.25v-12h3.5l.5-3.5h-4V5.5c0-.55.45-1 1-1Z" />
                </svg>
              </a>

              <a
                href="https://www.pinterest.com/quickdecorideas/"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="text-[var(--muted)] transition hover:text-[var(--brand-primary)]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 0C5.372 0 0 5.373 0 12c0 5.012 3.138 9.285 7.565 11.016-.104-.935-.198-2.37.041-3.392.216-.935 1.393-5.958 1.393-5.958s-.357-.714-.357-1.77c0-1.657.96-2.896 2.157-2.896 1.018 0 1.51.764 1.51 1.679 0 1.023-.651 2.551-.987 3.97-.282 1.182.599 2.145 1.776 2.145 2.133 0 3.773-2.248 3.773-5.493 0-2.859-2.054-4.86-4.99-4.86-3.399 0-5.394 2.55-5.394 5.182 0 1.039.399 2.158.9 2.766.1.123.114.23.084.354-.092.374-.301 1.182-.342 1.346-.053.214-.174.26-.403.157-1.505-.695-2.441-2.9-2.441-4.667 0-3.803 2.766-7.293 7.979-7.293 4.184 0 7.44 2.989 7.44 6.978 0 4.163-2.621 7.518-6.26 7.518-1.222 0-2.371-.633-2.762-1.379 0 0-.587 2.24-.71 2.68-.254.94-.946 1.88-1.517 2.611C9.61 23.92 10.79 24 12 24c6.628 0 12-5.373 12-12S18.628 0 12 0Z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col items-start space-y-4">
            <h3 className="text-sm font-semibold tracking-wide text-[var(--brand-primary)]">
              Categories
            </h3>
            <div className="flex flex-col gap-2">
              {categories.slice(0, 18).map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="text-sm text-[var(--muted)] transition hover:text-[var(--brand-primary)]"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start space-y-4">
            <h3 className="text-sm font-semibold tracking-wide text-[var(--brand-primary)]">Pages</h3>
            <div className="flex flex-col gap-2 text-sm text-[var(--muted)]">
             <Link href="/" className="transition hover:text-[var(--brand-primary)]">
                Home
              </Link>
              <Link href="/contact" className="transition hover:text-[var(--brand-primary)]">
                Contact
              </Link>
              <Link href="/about" className="transition hover:text-[var(--brand-primary)]">
                About
              </Link>
              <Link href="/privacy" className="transition hover:text-[var(--brand-primary)]">
                Privacy Policy
              </Link>
              <Link href="/disclaimer" className="transition hover:text-[var(--brand-primary)]">
                Disclaimer  
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] py-6 text-center text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} Quick Decor Ideas. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
