import type { Metadata } from "next";
import Link from "next/link";
import { CTABand, PageHero } from "@/components/sections/shared";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon, Button } from "@/components/ui/primitives";
import { capabilities, services } from "@/content/site";

export const metadata: Metadata = {
  title: "IT Services",
  description:
    "Network services, network relocation, advisory consulting and IT distribution from Network Resource, the Bay Area's outsourced IT department since 1998.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services" }]}
        title={["A complete portfolio", "of *IT expertise*"]}
        lead="Planning, systems administration, office moves and help choosing what to buy."
      >
        <Button href="/request-a-quote">Request a consultation</Button>
        <Button href="/service-plans" variant="ghost">
          See flat-fee plans
        </Button>
      </PageHero>

      <section className="container-x section-y" aria-label="All services">
        <Reveal stagger={0.08} as="ol" className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-bone-50/[0.08] bg-bone-50/[0.08]">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={s.href} className="group grid gap-6 bg-ink-950 p-8 transition-colors duration-500 hover:bg-ink-900 md:grid-cols-12 md:items-center md:p-12">
                <span className="font-mono text-[0.85rem] text-signal-400 md:col-span-1">{s.index}</span>
                <h2 className="t-h2 md:col-span-5">{s.title}</h2>
                <div className="md:col-span-5">
                  <p className="text-mist-300">{s.short}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.points.map((p) => (
                      <li key={p} className="rounded-full border border-bone-50/10 px-3 py-1 text-[0.8rem] text-mist-400">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="hidden size-12 place-items-center justify-self-end rounded-full border border-bone-50/15 transition-[background-color,border-color] duration-500 group-hover:border-signal-500 group-hover:bg-signal-500 md:col-span-1 md:grid">
                  <ArrowIcon direction="up-right" />
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
      </section>

      <section className="surface-light section-y" aria-labelledby="capabilities-heading">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="t-label text-bone-700">At a glance</p>
            <h2 id="capabilities-heading" className="t-h2 mt-6">
              What we handle <em className="t-accent text-brand-blue">every day</em>
            </h2>
          </div>
          <Reveal stagger={0.05} as="ul" className="grid gap-0 lg:col-span-7">
            {capabilities.map((c, i) => (
              <li key={c} className="flex items-baseline gap-6 border-t border-ink-950/10 py-5 text-[1.15rem] tracking-[-0.015em]">
                <span className="font-mono text-[0.75rem] text-brand-red">{String(i + 1).padStart(2, "0")}</span>
                {c}
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <CTABand />
    </>
  );
}
