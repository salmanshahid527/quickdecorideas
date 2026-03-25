import { Container } from "@/components/ui/Container";

function IconPickRoom({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconQuickWin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBuildLook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 14h10v6H7v-6ZM5 8h14v5H5V8ZM8 3h8v4H8V3Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STEPS: Array<{
  n: number;
  title: string;
  body: string;
  Icon: typeof IconPickRoom;
}> = [
  {
    n: 1,
    title: "Pick a room",
    body: "Choose a category (living room, kitchen, bedroom…) and see the most relevant ideas first.",
    Icon: IconPickRoom,
  },
  {
    n: 2,
    title: "Save a quick win",
    body: "Look for small changes you can do this weekend: lighting, storage, textures, and color.",
    Icon: IconQuickWin,
  },
  {
    n: 3,
    title: "Build your look",
    body: "Combine ideas into a cohesive style—so your space feels calm, fresh, and fully yours.",
    Icon: IconBuildLook,
  },
];

/**
 * Explains how to use the site in three steps: browse by space → act on quick wins → combine into a style.
 * Helps first-time visitors understand the content model without reading a long intro.
 */
export function HowItWorksSection() {
  return (
    <section
      className="relative overflow-hidden border-t border-slate-200/60 py-20 md:py-24"
      aria-labelledby="how-it-works-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#e8f0fa] via-[#f2f7fc] to-[var(--surface)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-1/2 h-[min(28rem,80vw)] w-[min(28rem,80vw)] -translate-y-1/2 rounded-full bg-[var(--brand-secondary-soft)]/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[var(--brand-primary)]/[0.06] blur-3xl"
        aria-hidden="true"
      />

      <Container>
        <div className="relative">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">How it works</p>
          <h2
            id="how-it-works-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl md:leading-tight"
          >
            Inspiration, organized
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
            A simple path from browsing to a space you can actually refresh—without a full redesign.
          </p>
        </div>

        <ol className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
          {STEPS.map(({ n, title, body, Icon }) => (
            <li key={n} className="relative">
              <article className="group relative flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white/85 p-6 shadow-[0_1px_2px_rgba(26,35,50,0.04)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-[var(--brand-secondary)]/35 hover:shadow-[0_20px_40px_-18px_rgba(40,86,152,0.18)] md:p-7">
                <div
                  className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-secondary)] to-[var(--brand-green)] opacity-90"
                  aria-hidden="true"
                />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-primary)]/12 to-[var(--brand-secondary)]/8 text-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]/10 transition group-hover:from-[var(--brand-primary)]/18 group-hover:to-[var(--brand-secondary)]/14">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-3xl font-light tabular-nums leading-none text-slate-200 transition group-hover:text-[var(--brand-secondary)]/30">
                    {String(n).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-[var(--foreground)]">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
              </article>
            </li>
          ))}
        </ol>
        </div>
      </Container>
    </section>
  );
}
