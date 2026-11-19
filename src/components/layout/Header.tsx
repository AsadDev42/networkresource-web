"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { navigation, company } from "@/content/site";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ArrowIcon, cx } from "@/components/ui/primitives";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const baseId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation (state adjusted during render, as React recommends).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  // Escape and outside click close the desktop dropdown.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    if (mobileOpen) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [mobileOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled || mobileOpen ? "border-b border-bone-50/[0.07] bg-ink-950/75 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="relative z-10 shrink-0 text-bone-50" aria-label="Network Resource home">
          <Logo />
        </Link>

        <nav ref={navRef} aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((group) => {
              const menuId = `${baseId}-${group.label}`;
              const open = openMenu === group.label;
              if (!group.children) {
                return (
                  <li key={group.label}>
                    <Link
                      href={group.href}
                      aria-current={isActive(group.href) ? "page" : undefined}
                      className={cx(
                        "rounded-full px-4 py-2 text-[0.9rem] transition-colors",
                        isActive(group.href) ? "text-bone-50" : "text-mist-300 hover:text-bone-50",
                      )}
                    >
                      {group.label}
                    </Link>
                  </li>
                );
              }
              return (
                <li
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(group.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={menuId}
                    onClick={() => setOpenMenu(open ? null : group.label)}
                    className={cx(
                      "flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.9rem] transition-colors",
                      isActive(group.href) || open ? "text-bone-50" : "text-mist-300 hover:text-bone-50",
                    )}
                  >
                    {group.label}
                    <svg viewBox="0 0 10 6" className={cx("w-2.5 transition-transform duration-300", open && "rotate-180")} aria-hidden="true">
                      <path d="m1 1 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </button>
                  <div
                    id={menuId}
                    className={cx(
                      "absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-300 ease-[var(--ease-out-expo)]",
                      open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
                    )}
                  >
                    <ul className="rounded-[var(--radius-card)] border border-bone-50/10 bg-ink-900/95 p-2 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.3)]">
                      {group.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            aria-current={pathname === child.href ? "page" : undefined}
                            className="group flex items-start justify-between gap-4 rounded-[10px] px-4 py-3 transition-colors hover:bg-bone-50/[0.05] focus-visible:bg-bone-50/[0.05]"
                          >
                            <span>
                              <span className="block text-[0.95rem] text-bone-50">{child.label}</span>
                            </span>
                            <ArrowIcon className="mt-1 text-mist-500 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-signal-500" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="relative z-10" />
          <a
            href={`tel:${company.phones.tollFree.tel}`}
            className="hidden font-mono text-[0.8rem] tracking-wide text-mist-300 transition-colors hover:text-bone-50 xl:block"
          >
            {company.phones.tollFree.display}
          </a>
          <Link
            href="/request-a-quote"
            className="hidden min-h-10 items-center gap-2 rounded-full bg-bone-50 px-5 text-[0.875rem] font-medium text-ink-950 transition-colors hover:bg-bone-200 sm:inline-flex xl:ml-4"
          >
            Free assessment
          </Link>
          <button
            type="button"
            className="relative z-10 grid size-11 place-items-center rounded-full border border-bone-50/15 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="relative block h-3 w-4" aria-hidden="true">
              <span className={cx("absolute left-0 h-px w-4 bg-bone-50 transition-transform duration-300", mobileOpen ? "top-1.5 rotate-45" : "top-0.5")} />
              <span className={cx("absolute left-0 h-px w-4 bg-bone-50 transition-transform duration-300", mobileOpen ? "top-1.5 -rotate-45" : "top-2.5")} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cx(
          "fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto bg-ink-950 transition-[opacity,visibility] duration-300 lg:hidden",
          mobileOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
        data-lenis-prevent
      >
        <nav aria-label="Mobile" className="container-x flex min-h-full flex-col justify-between gap-10 pb-10 pt-6">
          <ul className="divide-y divide-bone-50/[0.08] border-y border-bone-50/[0.08]">
            {navigation.map((group) => (
              <li key={group.label} className="py-4">
                <Link href={group.href} className="t-h3 block text-bone-50">
                  {group.label}
                </Link>
                {group.children && (
                  <ul className="mt-3 grid gap-2">
                    {group.children
                      .filter((c) => c.href !== group.href)
                      .map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} className="text-mist-300 hover:text-bone-50">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="grid gap-4">
            <Link href="/request-a-quote" className="inline-flex min-h-12 items-center justify-center rounded-full bg-signal-500 font-medium text-white">
              Request a free network assessment
            </Link>
            <a href={`tel:${company.phones.tollFree.tel}`} className="text-center font-mono text-sm text-mist-300">
              Call {company.phones.tollFree.display}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
