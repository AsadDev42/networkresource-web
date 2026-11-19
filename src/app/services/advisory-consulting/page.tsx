import type { Metadata } from "next";
import { CTABand, PageHero, RelatedLinks, SectionHeading } from "@/components/sections/shared";
import { InfoFlow } from "@/components/diagrams/InfoFlow";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/primitives";
import { advisoryPhases } from "@/content/details";

export const metadata: Metadata = {
  title: "Advisory Consulting",
  description:
    "Network Resource advises organizations on how to optimize the efficiency of their network: what improves productivity and what you do not need.",
  alternates: { canonical: "/services/advisory-consulting" },
};

export default function AdvisoryPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/services" }, { label: "Advisory Consulting" }]}
        title={["Know what your", "network needs", "*and what it doesn't*"]}
        lead="Given the complexity of networking technology today, we help you determine what will make your organization more efficient, and what may be superfluous to your needs."
      >
        <Button href="/request-a-quote">Book a consultation</Button>
      </PageHero>

      <section className="section-y" aria-labelledby="scope-heading">
        <div className="container-x grid items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SplitHeading id="scope-heading" lines={["The whole company,", "or *one department*"]} className="t-h2" />
            <Reveal>
              <p className="t-lead mt-8 text-mist-300">
                We look at how information is generated, distributed, updated, consumed and archived, and the software
                and hardware used to manage it. Then we recommend specific networking and Internet solutions and identify
                their potential value to your organization.
              </p>
            </Reveal>
          </div>
          <div className="flex justify-center text-bone-50 lg:col-span-6">
            <InfoFlow />
          </div>
        </div>
      </section>

      <section className="surface-light section-y" aria-labelledby="method-heading">
        <div className="container-x">
          <SectionHeading
            tone="light"
            title={["Four phases from", "*philosophy* to plan"]}
            lead="Advances in IT offer a plethora of options to increase productivity. Our consultants expose those options and implement them in a timely, secure and affordable manner."
          />
          <h2 id="method-heading" className="sr-only">
            Our advisory method
          </h2>
          <Reveal stagger={0.08} as="ol" className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-ink-950/10 bg-ink-950/10 md:grid-cols-2 lg:grid-cols-4">
            {advisoryPhases.map((p, i) => (
              <li key={p.title} className="flex min-h-[20rem] flex-col bg-bone-50 p-7">
                <span className="font-mono text-[0.8rem] text-brand-red">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-h3 mt-auto pt-12">{p.title}</h3>
                <p className="mt-3 text-[0.95rem] text-bone-700">{p.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <div className="pt-24">
        <RelatedLinks
          links={[
            { href: "/services/network-services", title: "Network services", body: "Implement the recommendations with our engineers." },
            { href: "/service-plans", title: "Service plans", body: "Keep it running for a flat monthly fee." },
            { href: "/about/values", title: "Our values", body: "Creativity: a unique solution for each situation." },
          ]}
        />
      </div>
      <CTABand />
    </>
  );
}
