import type { Metadata } from "next";
import Link from "next/link";
import { HomeHero } from "@/components/home/HomeHero";
import { StatsBento } from "@/components/home/StatsBento";
import { PartnerLogos } from "@/components/home/PartnerLogos";
import { CTABand } from "@/components/sections/shared";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import { ArrowIcon, Button, cx } from "@/components/ui/primitives";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { capabilities, company, outcomes, services } from "@/content/site";

/** The four services the original homepage featured with "Read more" links. */
const FEATURED = ["network-services", "network-relocation", "advisory-consulting", "it-distribution"]
  .map((slug) => services.find((s) => s.slug === slug))
  .filter((s): s is (typeof services)[number] => Boolean(s));

export const metadata: Metadata = {
  title: { absolute: "Network Resource | Business IT Support for the San Francisco Bay Area" },
  description:
    "Flat-fee managed IT, 24/7 network monitoring, office network relocation and advisory consulting for Bay Area businesses since 1998.",
  alternates: { canonical: "/" },
};

const OUTCOME_ICONS = [
  <path key="a" d="M4 17 9 11l4 3 7-8" />,
  <path key="b" d="M12 3a9 9 0 1 0 9 9M12 7v5l3 2" />,
  <path key="c" d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" />,
  <path key="d" d="M5 12h3l2 6 4-12 2 6h3" />,
];

const plans = [
  {
    name: "NR Remote",
    href: "/service-plans/nr-remote",
    tag: "Remote managed",
    summary: "Monitoring, patching, anti-virus and backup checks from our Network Operations Center.",
    items: ["Desktop, laptop & server monitoring", "Managed e-mail filtering", "Backup monitoring", "Anti-spyware & anti-virus", "Patch management"],
  },
  {
    name: "NR Complete",
    href: "/service-plans/nr-complete",
    tag: "Remote + on site",
    summary: "Everything in NR Remote, plus your own engineers on site and a team that runs IT end to end.",
    items: ["Proactive on-site engineers", "24x7 help desk", "Client portal", "Project implementation", "Account manager"],
    featured: true,
  },
];

export default function HomePage() {
  return (
    <>
      <HomeHero />

      {/* Services we provide + quick service form (both from the original homepage) */}
      <section className="section-y border-y border-bone-50/[0.07] bg-ink-900" aria-labelledby="capabilities-heading">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 id="capabilities-heading" className="t-h2">
              Services we <span className="t-accent">provide</span>
            </h2>
            <p className="t-lead mt-6 max-w-[38rem] text-mist-300">
              Network Resource brings clear thinking to the simplest and the most complex IT issues. Whether it&apos;s
              fixed-fee monthly support or complex IT project management, we have the depth and expertise to handle it.
            </p>
            <ul className="mt-10 grid gap-x-10 sm:grid-cols-2">
              {capabilities.map((c) => (
                <li key={c} className="flex items-center gap-3 border-t border-bone-50/[0.08] py-4 text-[1rem] text-bone-50">
                  <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-blue-300" aria-hidden="true">
                    <path d="m3 8.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-[var(--radius-card)] border border-bone-50/10 bg-ink-950 p-6 md:p-8">
              <h3 id="quick-service" className="t-h3">
                Quick service for your IT needs
              </h3>
              <p className="mt-2 text-[0.95rem] text-mist-400">
                Or call{" "}
                <a href={`tel:${company.phones.tollFree.tel}`} className="font-semibold text-bone-50 underline decoration-current/25 underline-offset-4 hover:decoration-current">
                  {company.phones.tollFree.display}
                </a>
              </p>
              <div className="mt-6">
                <QuoteForm variant="quick" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsBento />

      {/* Why / outcomes */}
      <section className="section-y relative bg-ink-950" aria-labelledby="why-heading">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SplitHeading id="why-heading" lines={["No in-house IT team?", "*You have one now*"]} className="t-h1" />
            </div>
            <Reveal className="lg:col-span-4 lg:col-start-9">
              <p className="t-lead text-mist-300">A team of technical experts for a flat fee, with lower costs and higher productivity.</p>
            </Reveal>
          </div>
          <Reveal stagger={0.08} as="ul" className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {outcomes.map((o, i) => (
              <li key={o.title}>
                <div className="h-full rounded-[20px] border border-bone-50/10 bg-ink-900 p-7">
                  <span className="grid size-12 place-items-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-300">
                    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {OUTCOME_ICONS[i]}
                    </svg>
                  </span>
                  <h3 className="t-h4 mt-10 text-bone-50">{o.title}</h3>
                  <p className="mt-2 text-[0.95rem] text-mist-400">{o.body}</p>
                </div>
              </li>
            ))}
          </Reveal>
          <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Button href="/about" variant="ghost">
              About Network Resource
            </Button>
            <a href={`tel:${company.phones.tollFree.tel}`} className="font-semibold text-mist-300 transition-colors hover:text-bone-50">
              Call us now: {company.phones.tollFree.display}
            </a>
          </div>
        </div>
      </section>

      {/* The four services the original homepage featured */}
      <section className="section-y border-t border-bone-50/[0.07] bg-ink-950" aria-labelledby="featured-heading">
        <div className="container-x">
          <SplitHeading id="featured-heading" lines={["How we keep your", "business *running*"]} className="t-h2" />
          <Reveal stagger={0.07} as="ul" className="mt-12 grid gap-4 md:grid-cols-2">
            {FEATURED.map((s) => (
              <li key={s.slug}>
                <Link
                  href={s.href}
                  className="group flex h-full flex-col rounded-[var(--radius-card)] border border-bone-50/10 bg-ink-900 p-7 transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-blue-400/60 hover:shadow-[0_18px_36px_-22px_rgba(18,58,156,0.45)] md:p-8"
                >
                  <h3 className="t-h3">{s.title}</h3>
                  <p className="mt-3 max-w-[30rem] text-mist-400">{s.short}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {s.points.map((p) => (
                      <li key={p} className="rounded-full border border-bone-50/10 px-3 py-1 text-[0.8rem] text-mist-400">
                        {p}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-2 pt-8 font-semibold text-bone-50">
                    Read more
                    <ArrowIcon className="transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-signal-500" />
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Plans */}
      <section className="section-y relative overflow-hidden border-t border-bone-50/[0.07] bg-ink-900" aria-labelledby="plans-heading">
        <div className="container-x relative">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SplitHeading id="plans-heading" lines={["Two flat-fee plans.", "*Unlimited* support"]} className="t-h1" />
            </div>
            <p className="max-w-[20rem] text-mist-400">Priced by your number of servers and workstations.</p>
          </div>
          <Reveal stagger={0.1} className="mt-16 grid gap-5 lg:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cx(
                  "flex h-full flex-col rounded-[24px] border p-8 md:p-11",
                  plan.featured ? "border-blue-400/50 bg-ink-950" : "border-bone-50/10 bg-ink-950",
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="t-label text-blue-300">{plan.tag}</span>
                  {plan.featured && <span className="t-label text-signal-400">Most complete</span>}
                </div>
                <h3 className="mt-8 font-display text-[clamp(2.4rem,4.5vw,3.75rem)] font-semibold leading-none tracking-[-0.05em]">{plan.name}</h3>
                <p className="mt-4 max-w-[28rem] text-mist-300">{plan.summary}</p>
                <ul className="mt-9 grid gap-3.5 border-t border-bone-50/10 pt-8">
                  {plan.items.map((i) => (
                    <li key={i} className="flex items-center gap-3 text-[0.98rem] text-bone-50">
                      <span className="grid size-5 place-items-center rounded-full bg-pulse-400/15 text-pulse-400">
                        <svg viewBox="0 0 16 16" className="size-3" aria-hidden="true">
                          <path d="m3 8.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {i}
                    </li>
                  ))}
                </ul>
                <div className="mt-11 flex-1 content-end">
                  <Button href={plan.href} variant={plan.featured ? "primary" : "light"}>
                    See {plan.name}
                  </Button>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Partners */}
      <section className="section-y overflow-hidden bg-ink-950" aria-labelledby="partners-heading">
        <div className="container-x flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="partners-heading" className="t-h2 max-w-[36rem]">
              Partnered with the <span className="t-accent">biggest names</span> in IT.
            </h2>
          </div>
          <Link href="/partners" className="group inline-flex items-center gap-2 font-semibold text-mist-300 hover:text-bone-50">
            All partners <ArrowIcon className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="container-x mt-14">
          <PartnerLogos />
        </div>
      </section>

      <CTABand />
    </>
  );
}
