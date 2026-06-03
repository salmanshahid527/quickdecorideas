import { SmartImage as Image } from "@/components/ui/SmartImage";
import Link from "next/link";
import type { HeroFeatureCardData } from "@/lib/home/heroFeatureCards";

const FALLBACK_IMAGE = "/images/home-decor-inspiration.svg";

export function HeroFeatureCards({ items }: { items: HeroFeatureCardData[] }) {
  return (
    <div className="relative z-10 mt-10 grid gap-6 md:grid-cols-3">
      {items.map((item, index) => {
        const src = item.image?.src ?? FALLBACK_IMAGE;
        const alt = item.image?.alt ?? item.title;
        const isSvg = /\.svg(\?|$)/i.test(src);

        return (
          <Link
            key={`hero-feature-${index}-${item.href}`}
            href={item.href}
            className="card group flex h-full flex-col overflow-hidden p-0 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-secondary)]/40 hover:shadow-[0_16px_40px_-18px_rgba(40,86,152,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]"
          >
            <div className="relative aspect-[16/10] w-full shrink-0 bg-slate-100">
              <Image
                src={src}
                alt={alt}
                fill
                unoptimized={isSvg}
                 priority={index === 0}          // ← 1st card priority
                 loading={index === 0 ? "eager" : "lazy"}  // ← 1st card eager, baaki lazy
                className="object-cover transition duration-300 group-hover:scale-[1.04]"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="text-xs font-semibold text-[var(--muted)]">{item.label}</div>
              <div className="mt-1.5 text-base font-semibold tracking-tight text-[var(--foreground)] group-hover:text-[var(--brand-primary)]">
                {item.title}
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
              <span className="mt-3 inline-block text-xs font-semibold text-[var(--brand-primary)]">{item.cta}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
