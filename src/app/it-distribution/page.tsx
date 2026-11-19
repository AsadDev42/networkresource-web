import type { Metadata } from "next";
import { CTABand, PageHero, RelatedLinks } from "@/components/sections/shared";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "IT Distribution: Hardware, Software & Supplies",
  description:
    "Network Resource supplies hardware, software, digital supplies and imaging products, with vendor-neutral recommendations and procurement handled by our engineers.",
  alternates: { canonical: "/it-distribution" },
};

const categories = [
  { title: "Hardware", body: "Servers, workstations, laptops and networking equipment, specified for your environment." },
  { title: "Software", body: "Operating systems, productivity, security and line-of-business software and licensing." },
  { title: "Digital supplies", body: "The consumables and accessories your office uses every day." },
  { title: "Imaging products", body: "Printing and imaging equipment and supplies." },
];

export default function DistributionPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "IT Distribution" }]}
        title={["The right equipment,", "*specified by engineers*"]}
        lead="In the traditional sense, we are one of the largest wholesale suppliers of hardware, software, digital supplies and imaging products. Because our engineers also support what you buy, recommendations start from your needs, not a vendor's catalogue."
      >
        <Button href="/request-a-quote">Request a quote</Button>
        <Button href="mailto:sales@networkresource.com" variant="ghost">
          sales@networkresource.com
        </Button>
      </PageHero>

      <section className="container-x section-y" aria-label="Product categories">
        <Reveal stagger={0.08} as="ul" className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-bone-50/[0.08] bg-bone-50/[0.08] md:grid-cols-2">
          {categories.map((c, i) => (
            <li key={c.title} className="flex min-h-64 flex-col bg-ink-950 p-8 md:p-10">
              <span className="font-mono text-[0.8rem] text-signal-400">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="t-h2 mt-auto pt-12">{c.title}</h2>
              <p className="mt-3 max-w-[28rem] text-mist-400">{c.body}</p>
            </li>
          ))}
        </Reveal>
      </section>

      <section className="surface-light section-y" aria-labelledby="procure-heading">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <h2 id="procure-heading" className="t-h2 lg:col-span-5">
            Procurement as part of <em className="t-accent text-brand-blue">the project.</em>
          </h2>
          <Reveal className="lg:col-span-6 lg:col-start-7">
            <p className="t-lead text-bone-700">
              On NR Complete projects, hardware and software recommendations, procurement and coordination are part of our
              project implementation process, and your account manager provides hardware specifications at no additional
              cost. We maintain no exclusive vendor relationships, so we recommend the combination that best fits your needs.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="pt-24">
        <RelatedLinks
          links={[
            { href: "/service-plans/nr-complete", title: "NR Complete", body: "Procurement and project implementation included." },
            { href: "/partners", title: "Partners", body: "Dell, Apple, Microsoft, Cisco and more." },
            { href: "/services/advisory-consulting", title: "Advisory consulting", body: "Decide what to buy before you buy it." },
          ]}
        />
      </div>
      <CTABand title={["Need equipment?", "*Ask an engineer first*"]} body="Tell us what you're trying to achieve and we'll quote the hardware, software and supplies that fit." />
    </>
  );
}
