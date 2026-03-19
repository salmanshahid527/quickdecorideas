"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Living Room", href: "/category/living-room" },
  { label: "Bedroom", href: "/category/bedroom" },
  { label: "Kitchen", href: "/category/kitchen" },
  { label: "Bathroom", href: "/category/bathroom" },
  { label: "Home Office", href: "/category/home-office" },
  { label: "Interior Design", href: "/category/interior-design" },
  { label: "Home Decor", href: "/category/home-decor" },
] as const;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
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

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      {open ? (
        <>
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const activeHref = useMemo(() => {
    // Basic active matching (keeps UX clean without overfitting)
    if (!pathname) return "/";
    if (pathname.startsWith("/category/")) {
      const m = navItems.find((it) => it.href !== "/" && pathname.startsWith(it.href));
      if (m) return m.href;
    }
    if (pathname.startsWith("/")) return "/";
    return "/";
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-[#5555ff] text-white shadow-sm">
      <Container>
        <div className="grid h-16 grid-cols-12 items-center gap-3">
          {/* Logo (left) */}
          <div className="col-span-7 md:col-span-3">
            <Link href="/" className="group inline-flex items-center gap-3">
              <Image
                src="/images/quickdecor.jpg"
                alt="Quick Decor Ideas"
                width={160}
                height={40}
                priority
                className="h-9 w-auto rounded-md object-contain sm:h-10"
              />
            </Link>
          </div>

          {/* Navigation (center) */}
          <nav className="col-span-6 hidden items-center justify-center gap-8 text-sm font-semibold text-white/80 md:flex">
            {navItems.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "relative transition-colors hover:text-[#C5A065]",
                  activeHref === it.href && "text-white",
                )}
              >
                {it.label}
              </Link>
            ))}
          </nav>

          {/* Actions (right) */}
          <div className="col-span-5 flex items-center justify-end gap-2 md:col-span-3">
            <button
              type="button"
              aria-label="Search"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/15 text-white/90 shadow-sm transition hover:border-[#C5A065]/60 hover:bg-white/20"
            >
              <SearchIcon />
            </button>

            <Link
              href="/contact"
              className="hidden h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-white/90 md:inline-flex"
            >
              Contact
            </Link>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white/90 shadow-sm transition hover:bg-white/20 md:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-white/20 bg-[#5555ff]/95 backdrop-blur-md md:hidden">
          <Container>
            <div className="py-3">
            <div className="grid gap-1">
              {navItems.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10",
                    activeHref === it.href && "bg-white/10 text-white",
                  )}
                >
                  {it.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="mt-1 inline-flex h-11 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-white/90"
              >
                Contact
              </Link>
            </div>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}

