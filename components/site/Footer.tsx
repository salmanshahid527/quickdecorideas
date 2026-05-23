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
              <Link href="/terms-conditions" className="transition hover:text-[var(--brand-primary)]">
                Terms & Conditions  
              </Link>
              <Link href="/meet-aria" className="transition hover:text-[var(--brand-primary)]">
                 About Aria
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
