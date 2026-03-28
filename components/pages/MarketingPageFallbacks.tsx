import Link from "next/link";

const muted = "text-[var(--muted)] leading-relaxed";
const link = "font-semibold text-[var(--brand-primary)] transition hover:underline";

export function AboutPageFallback() {
  return (
    <article className="space-y-5">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
        About Quick Decor Ideas
      </h1>
      <p className={muted}>
        Quick Decor Ideas is a home decor and interior inspiration site focused on practical tips, room-by-room
        guides, and ideas you can act on—whether you are refreshing one corner or planning a bigger update.
      </p>
      <p className={muted}>
        Our articles are published from our WordPress editorial workflow and mirrored here for a fast, readable
        experience.
      </p>
      <p>
        <Link href="/blog" className={link}>
          Browse all posts
        </Link>
      </p>
    </article>
  );
}

export function ContactPageFallback() {
  return (
    <article className="space-y-5">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">Contact</h1>
      <p className={muted}>
        We are still wiring a dedicated contact form to this headless site. In the meantime, you can reach the
        editorial team through the main site or explore our latest guides below.
      </p>
      <ul className={`list-inside list-disc space-y-2 ${muted}`}>
        <li>
          <Link href="/blog" className={link}>
            Blog & latest articles
          </Link>
        </li>
        <li>
          <a href="https://quickdecorideas.com" className={link} rel="noopener noreferrer">
            WordPress site (quickdecorideas.com)
          </a>
        </li>
      </ul>
    </article>
  );
}

export function PrivacyPageFallback() {
  return (
    <article className="space-y-5">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
        Privacy policy
      </h1>
      <p className={muted}>
        This site loads content from our WordPress backend and may use standard analytics as configured on your
        host. We do not sell personal data. For full legal text, a detailed policy can be added as a WordPress page
        and will appear here automatically once published.
      </p>
      <p>
        <Link href="/" className={link}>
          Back to home
        </Link>
      </p>
    </article>
  );
}
