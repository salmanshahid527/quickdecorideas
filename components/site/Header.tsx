import Link from "next/link";
import type { Category } from "@/lib/wp/types";
import { Container } from "@/components/ui/Container";

export function Header({ categories }: { categories: Category[] }) {
  return (
    <header className="border-b border-black/10 bg-white">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Quick Decor Ideas
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-black/70 md:flex">
            <Link href="/blog" className="hover:text-black">
              Blog
            </Link>
            <Link href="/about" className="hover:text-black">
              About
            </Link>
            <Link href="/contact" className="hover:text-black">
              Contact
            </Link>
            <Link href="/shop" className="hover:text-black">
              Shop
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4">
          {categories.slice(0, 14).map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="whitespace-nowrap rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black/80 hover:bg-black/10"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </Container>
    </header>
  );
}

