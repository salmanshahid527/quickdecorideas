import Link from "next/link";
import { Container } from "@/components/ui/Container";

const FAQ_ITEMS: Array<{ q: string; a: string; icon: "leaf" | "wallet" | "calendar" | "mail" }> = [
  {
    q: "Are the ideas beginner-friendly?",
    a: "Yes. We focus on practical steps and design basics—so you can make progress without being overwhelmed.",
    icon: "leaf",
  },
  {
    q: "Do you cover both style and budget?",
    a: "Absolutely. Expect “premium look” guidance using approachable materials, lighting tricks, and smart storage.",
    icon: "wallet",
  },
  {
    q: "How often do you publish?",
    a: "New ideas are curated regularly—so you’ll always have something fresh to try in your own space.",
    icon: "calendar",
  },
  {
    q: "Can I contact you for help?",
    a: "Yes—send a note via the contact page and we’ll point you to the best starting room for your needs.",
    icon: "mail",
  },
];

function FaqIcon({ kind }: { kind: (typeof FAQ_ITEMS)[number]["icon"] }) {
  const cls = "h-5 w-5 text-[var(--brand-primary)]";
  switch (kind) {
    case "leaf":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 20s6-1.5 9.5-6S20 4 20 4s-6 1.5-9.5 6S6 20 6 20Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path d="M6 20c2.5-4 2-8.5 0-12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "wallet":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M19 8V6a2 2 0 0 0-2-2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a2 2 0 0 0 2-2v-2"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M16 12h5v4h-5a2 2 0 1 1 0-4Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "calendar":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M8 5V3m8 2V3M5 9h14M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "mail":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 6h16v12H4V6Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

/** FAQ copy is always visible (no accordion) for faster scanning and fewer clicks. */
export function HomeFaqSection() {
  return (
    <section
      className="border-t border-slate-200/60 bg-gradient-to-b from-[#f2f7fc] to-white pb-20 pt-10 md:pt-14"
      aria-labelledby="home-faq-heading"
    >
      <Container>
        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[var(--shadow-soft)] backdrop-blur-sm md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Quick FAQ</p>
          <h2
            id="home-faq-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl"
          >
            Questions you might have
          </h2>

          <ul className="mt-8 grid list-none gap-4 p-0 md:grid-cols-2">
            {FAQ_ITEMS.map(({ q, a, icon }) => (
              <li key={q}>
                <article className="group h-full rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 transition duration-300 hover:border-[var(--brand-secondary)]/35 hover:bg-white hover:shadow-md">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200/80 transition group-hover:ring-[var(--brand-secondary)]/25">
                      <FaqIcon kind={icon} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-[var(--foreground)]">{q}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{a}</p>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 border-t border-slate-200/70 pt-8 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[var(--muted)]">Want more ideas like this?</p>
            <Link
              href="/contact"
              className="btn-primary inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold"
            >
              Contact for guidance
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
