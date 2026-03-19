import Link from "next/link";
import type { Category } from "@/lib/wp/types";
import { Container } from "@/components/ui/Container";

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="bg-[#0D6EFF] text-white">
      <Container>
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-3">
          
          {/* About */}
          <div className="flex flex-col items-start space-y-4">
            <h3 className="text-sm font-semibold tracking-wide">
              Quick Decor Ideas
            </h3>
            <p className="text-sm leading-relaxed text-white/80">
              Practical decor tips, room ideas, and inspiration—updated daily to
              help you design beautiful spaces effortlessly.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-col items-start space-y-4">
            <h3 className="text-sm font-semibold tracking-wide">
              Categories
            </h3>
            <div className="flex flex-col gap-2">
              {categories.slice(0, 18).map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="text-sm text-white/80 hover:text-white transition"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div className="flex flex-col items-start space-y-4">
            <h3 className="text-sm font-semibold tracking-wide">
              Pages
            </h3>
            <div className="flex flex-col gap-2 text-sm text-white/80">
              <Link href="/privacy" className="hover:text-white transition">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
              <Link href="/about" className="hover:text-white transition">
                About
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 py-6 text-center text-xs text-white/70">
          © {new Date().getFullYear()} Quick Decor Ideas. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}