import Link from "next/link";
import type { ReactNode } from "react";
import { company } from "@/content/site";
import { Button, ArrowIcon, cx } from "@/components/ui/primitives";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import { OrbitBackdrop } from "@/components/ui/OrbitBackdrop";
import { OrbitMark } from "@/components/ui/OrbitMark";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="t-label flex flex-wrap items-center gap-2 text-mist-500">
        <li>
          <Link href="/" className="hover:text-bone-50">
            Home
          </Link>
        </li>
        {items.map((c) => (
          <li key={c.label} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {c.href ? (
              <Link href={c.href} className="hover:text-bone-50">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-mist-300">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Standard inner-page hero: breadcrumbs, index, masked headline, lead and optional visual. */
export function PageHero({
  crumbs,
  title,
  lead,
  children,
  aside,
}: {
  crumbs: Crumb[];
  title: string[];
  lead: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-bone-50/[0.07] pb-20 pt-[calc(var(--header-h)+3.5rem)] md:pb-28 md:pt-[calc(var(--header-h)+5rem)]">
      <OrbitBackdrop />
      <div className="container-x relative">
        <Breadcrumbs items={crumbs} />
        <div className={cx("mt-14 grid gap-12", Boolean(aside) && "lg:grid-cols-12 lg:items-end")}>
          <div className={aside ? "lg:col-span-7" : "max-w-[58rem]"}>
            <SplitHeading as="h1" immediate delay={0.1} lines={title} className="t-h1" />
            <Reveal delay={0.35}>
              <p className="t-lead mt-8 max-w-[40rem] text-mist-300">{lead}</p>
              {children && <div className="mt-10 flex flex-wrap gap-3">{children}</div>}
            </Reveal>
          </div>
          {aside && <div className="lg:col-span-5">{aside}</div>}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  title,
  lead,
  tone = "dark",
  className,
}: {
  title: string[];
  lead?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={cx("grid gap-8 lg:grid-cols-12", className)}>
      <div className="lg:col-span-7">
        <SplitHeading lines={title} className="t-h2" />
      </div>
      {lead && (
        <Reveal className="lg:col-span-5 lg:self-end">
          <p className={cx("t-lead", tone === "dark" ? "text-mist-300" : "text-bone-700")}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Closing call to action used at the end of every page. */
export function CTABand({
  title = ["Start with a free", "*network assessment.*"],
  body = "Find out where your network stands and what a flat monthly fee covers.",
}: {
  title?: string[];
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-bone-50/[0.07] bg-ink-900">
      <div className="container-x section-y relative grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SplitHeading lines={title} className="t-h1" />
          <Reveal>
            <p className="t-lead mt-7 max-w-[34rem] text-mist-300">{body}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Button href="/request-a-quote">Request a consultation</Button>
              <a href={`tel:${company.phones.tollFree.tel}`} className="font-semibold text-mist-300 transition-colors hover:text-bone-50">
                or call {company.phones.tollFree.display}
              </a>
            </div>
          </Reveal>
        </div>
        <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <OrbitMark className="w-full max-w-[26rem]" />
        </div>
      </div>
    </section>
  );
}

/** Numbered list of bullet items, used for spec sheets. */
export function SpecList({ items, tone = "dark" }: { items: readonly string[]; tone?: "dark" | "light" }) {
  return (
    <ul className="grid gap-0">
      {items.map((item) => (
        <li
          key={item}
          className={cx(
            "flex gap-4 border-t py-3 text-[0.95rem] leading-snug",
            tone === "dark" ? "border-bone-50/[0.08] text-mist-300" : "border-ink-950/10 text-bone-700",
          )}
        >
          <span className={cx("mt-[0.55em] size-1 shrink-0 rounded-full", tone === "dark" ? "bg-blue-400" : "bg-brand-blue")} aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Related pages, shown near the bottom of inner pages. */
export function RelatedLinks({ links }: { links: Array<{ href: string; title: string; body: string }> }) {
  return (
    <section className="container-x pb-24">
      <p className="t-label text-mist-500">Keep exploring</p>
      <Reveal stagger={0.08} className="mt-6 grid gap-4 md:grid-cols-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex min-h-48 flex-col justify-between rounded-[var(--radius-card)] border border-bone-50/[0.08] bg-ink-900 p-6 transition-colors hover:border-bone-50/25"
          >
            <span className="t-h4 text-bone-50">{l.title}</span>
            <span className="flex items-end justify-between gap-4 text-[0.92rem] text-mist-400">
              {l.body}
              <ArrowIcon className="mb-1 text-signal-500 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
