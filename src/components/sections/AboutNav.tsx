"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/components/ui/primitives";

const ITEMS = [
  { href: "/about", label: "About us" },
  { href: "/about/values", label: "Our values" },
  { href: "/about/clients", label: "Our clients" },
];

/** Sub-navigation shared by the About section pages. */
export function AboutNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="About section" className="sticky top-[var(--header-h)] z-20 border-b border-bone-50/[0.07] bg-ink-950/85 backdrop-blur-xl">
      <ul className="container-x flex gap-1 overflow-x-auto py-3">
        {ITEMS.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              aria-current={pathname === i.href ? "page" : undefined}
              className={cx(
                "block whitespace-nowrap rounded-full px-4 py-2 text-[0.9rem] transition-colors",
                pathname === i.href ? "bg-bone-50 text-ink-950" : "text-mist-300 hover:text-bone-50",
              )}
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
