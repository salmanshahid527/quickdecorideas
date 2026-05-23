"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SmartImage as Image } from "@/components/ui/SmartImage";
import { Container } from "@/components/ui/Container";

const primaryNavItems = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Disclaimer", href: "/disclaimer" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
    { label: "About Aria", href: "/meet-aria" },


] as const;

/** Matches live WP slugs when categories have not loaded yet. */
const FALLBACK_CATEGORY_NAV: { label: string; href: string }[] = [
  { label: "Living Room", href: "/category/living-room" },
  { label: "Bedroom", href: "/category/bedroom" },
  { label: "Kitchen & Dining", href: "/category/kitchen-dining" },
  { label: "Bathroom", href: "/category/bathroom" },
  { label: "Home Office", href: "/category/home-office" },
  { label: "Interior Design", href: "/category/interior-design" },
  { label: "Home Decor", href: "/category/home-decor" },
];

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

export type SiteHeaderCategoryNavItem = { label: string; href: string };

export function SiteHeader({ categoryNavItems }: { categoryNavItems?: SiteHeaderCategoryNavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const blogNavItems =
    categoryNavItems && categoryNavItems.length > 0 ? categoryNavItems : FALLBACK_CATEGORY_NAV;

  const activePrimaryHref = useMemo(() => {
    if (!pathname) return "/";
    const direct = primaryNavItems.find((it) => it.href !== "/" && pathname.startsWith(it.href));
    if (direct) return direct.href;
    if (pathname.startsWith("/category/")) return "/blog";
    if (pathname === "/") return "/";
    return "/";
  }, [pathname]);

  const activeBlogHref = useMemo(() => {
    if (!pathname || !pathname.startsWith("/category/")) return "";
    const direct = blogNavItems.find((it) => pathname === it.href || pathname.startsWith(`${it.href}/`));
    return direct?.href ?? "";
  }, [pathname, blogNavItems]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full overflow-x-clip border-b border-slate-200 bg-white text-slate-800 shadow-sm">
      <div
        className="h-0.5 w-full bg-gradient-to-r from-[var(--brand-secondary-soft)] via-[var(--brand-primary)] to-[var(--brand-green)] opacity-90"
        aria-hidden="true"
      />
      <Container>
        <div className="grid h-[4.25rem] grid-cols-12 items-center gap-3">
          <div className="col-span-7 md:col-span-3">
            <Link href="/" className="group inline-flex items-center gap-3">
              <Image
                src="/quick-decor-logo.png"
                alt="Quick Decor Ideas"
                width={160}
                height={40}
                priority
                className="h-9 w-auto object-contain sm:h-10"
              />
            </Link>
          </div>

          <nav className="col-span-6 hidden items-center justify-center gap-1 md:flex">
            {primaryNavItems.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-[var(--brand-primary)]",
                  activePrimaryHref === it.href &&
                    "bg-slate-100 text-[var(--brand-primary)] shadow-[inset_0_0_0_1px_rgb(226,232,240)]",
                )}
              >
                {it.label}
              </Link>
            ))}
          </nav>

          <div className="col-span-5 flex items-center justify-end gap-2 md:col-span-3">
      <Link href="/search"   aria-label="Search"
  className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-[var(--brand-primary)]"
>
  <SearchIcon className="h-4 w-4" /> 
  <span>Search</span>
</Link>


            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 hover:text-[var(--brand-primary)] md:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </div>
      </Container>

      <div className="hidden border-t border-slate-200 bg-white md:block">
        <Container>
          <nav className="flex h-12 items-center gap-1 overflow-x-auto py-1 text-sm" aria-label="Categories">
            {blogNavItems.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-[var(--brand-primary)]",
                  activeBlogHref === it.href &&
                    "bg-slate-50 font-semibold text-[var(--brand-primary)] shadow-[inset_0_0_0_1px_rgb(226,232,240)]",
                )}
              >
                {it.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <Container>
            <div className="py-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Main
              </div>
              <div className="grid gap-1">
                {primaryNavItems.map((it) => (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={cn(
                      "rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100",
                      activePrimaryHref === it.href && "bg-slate-100 text-[var(--brand-primary)]",
                    )}
                  >
                    {it.label}
                  </Link>
                ))}
              </div>

              <div className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Blog categories
              </div>
              <div className="grid gap-1">
                {blogNavItems.map((it) => (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={cn(
                      "rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100",
                      activeBlogHref === it.href && "bg-slate-100 text-[var(--brand-primary)]",
                    )}
                  >
                    {it.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-[var(--brand-primary)] px-4 text-sm font-semibold text-white shadow-[0_2px_10px_rgba(40,86,152,0.28)] transition hover:bg-[var(--brand-primary-hover)]"
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
