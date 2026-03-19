import { Container } from "@/components/ui/Container";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60;

export default async function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[rgba(197,160,101,0.22)] blur-3xl" />
          <div className="absolute -bottom-28 -left-28 h-[520px] w-[520px] rounded-full bg-black/[0.06] blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_15%_10%,rgba(197,160,101,0.10),transparent_62%)]" />
        </div>

        <Container>
          <div className="relative py-10 md:py-14">
            <div className="grid items-center gap-8 md:grid-cols-12">
              {/* Left: heading/content */}
              <div className="md:col-span-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-[11px] font-semibold text-black/70 shadow-sm backdrop-blur">
                  Premium interior inspiration
                  <span className="h-1 w-1 rounded-full bg-black/30" />
                  Curated daily
                </div>

                <h1 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-tight text-[#111111] md:text-5xl">
                  Elevate Your Space
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-black/70 md:text-base">
                  Thoughtful room ideas, timeless palettes, and practical styling tips—designed to make your home feel intentional, calm, and beautifully lived-in.
                </p>

                <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row">
                  <Link
                    href="/blog"
                    className="btn-primary inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold shadow-sm shadow-black/10 transition"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/category/living-room"
                    className="btn-secondary inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold shadow-sm backdrop-blur transition"
                  >
                    Explore Living Room
                  </Link>
                </div>
              </div>

              {/* Right: hero image — larger, 3D depth */}
              <div className="md:col-span-6 flex items-center justify-center md:justify-end">
                <div
                  className="relative w-full max-w-[580px] aspect-[16/10] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white"
                  style={{
                    boxShadow:
                      "0 25px 50px -12px rgba(0,0,0,0.2), 0 12px 24px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
                    transform: "perspective(1200px) rotateY(-2deg) rotateX(1deg)",
                  }}
                >
                  <Image
                    src="/images/home.jpg"
                    alt="Home decor inspiration"
                    fill
                    priority
                    sizes="(min-width: 1024px) 580px, (min-width: 768px) 55vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="card p-6">
                <div className="text-xs font-semibold text-black/60">Palette</div>
                <div className="mt-2 text-base font-semibold">Warm + Premium</div>
                <div className="mt-3 flex gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[#1B1B1B]" />
                  <div className="h-8 w-8 rounded-lg bg-[#C9B89A]" />
                  <div className="h-8 w-8 rounded-lg bg-[#F7F4EF] ring-1 ring-black/10" />
                </div>
              </div>
              <div className="card p-6">
                <div className="text-xs font-semibold text-black/60">Style</div>
                <div className="mt-2 text-base font-semibold">Clean + Cozy</div>
                <p className="mt-2 text-sm text-black/70">
                  Elevated basics with warm neutrals and intentional accents.
                </p>
              </div>
              <div className="card p-6">
                <div className="text-xs font-semibold text-black/60">Start here</div>
                <div className="mt-2 text-base font-semibold">Room-by-room guides</div>
                <p className="mt-2 text-sm text-black/70">
                  Browse living room layouts, kitchen upgrades, and timeless decor edits.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/category/living-room"
              className="card group p-6"
            >
              <div className="label text-black/60">Living Room</div>
              <div className="mt-2 text-lg font-semibold tracking-tight">Comfort that looks intentional</div>
              <p className="mt-2 text-sm text-black/70">
                Layouts, lighting, and styling edits that instantly upgrade the feel.
              </p>
              <div className="mt-4 text-sm font-semibold text-black/80 group-hover:text-[#C5A065]">
                Explore →
              </div>
            </Link>

            <Link
              href="/category/kitchen"
              className="card group p-6"
            >
              <div className="label text-black/60">Kitchen</div>
              <div className="mt-2 text-lg font-semibold tracking-tight">Small upgrades, big impact</div>
              <p className="mt-2 text-sm text-black/70">
                Practical decor changes that feel premium without being expensive.
              </p>
              <div className="mt-4 text-sm font-semibold text-black/80 group-hover:text-[#C5A065]">
                Explore →
              </div>
            </Link>

            <Link
              href="/blog"
              className="card group p-6"
            >
              <div className="label text-black/60">Blog</div>
              <div className="mt-2 text-lg font-semibold tracking-tight">Fresh ideas, curated daily</div>
              <p className="mt-2 text-sm text-black/70">
                Room inspiration, styling tips, and category roundups.
              </p>
              <div className="mt-4 text-sm font-semibold text-black/80 group-hover:text-[#C5A065]">
                Browse →
              </div>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
