import type { Metadata } from "next";
import { CTABand, PageHero, RelatedLinks } from "@/components/sections/shared";
import { AboutNav } from "@/components/sections/AboutNav";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/primitives";
import { company } from "@/content/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Since 1998 Network Resource has been the outsourced IT department for Bay Area businesses, combining business and technology expertise, 24x7 availability and a 97% client retention rate.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About" }]}
        title={["Technology working", "*seamlessly* in", "the background"]}
        lead="Our clients range across industries but share one goal: to focus on their core business. We make that possible as an outsourced IT department that combines business and technology expertise, 24x7 availability and relentless customer service."
      >
        <Button href="/contact">Talk to us</Button>
      </PageHero>
      <AboutNav />

      <section className="container-x section-y" aria-label="Key facts">
        <Reveal stagger={0.08} as="dl" className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-bone-50/[0.08] bg-bone-50/[0.08] sm:grid-cols-3">
          {[
            { v: String(company.founded), k: "The year we started" },
            { v: company.retention, k: "Consistent client retention rate since we started" },
            { v: "24x7", k: "Availability for our clients" },
          ].map((f) => (
            <div key={f.k} className="flex flex-col-reverse bg-ink-950 p-8 md:p-10">
              <dt className="mt-3 text-mist-400">{f.k}</dt>
              <dd className="text-[clamp(3rem,6vw,5rem)] font-medium leading-none tracking-[-0.05em]">{f.v}</dd>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="surface-light section-y" aria-labelledby="side-heading">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <h2 id="side-heading" className="t-h1 lg:col-span-6">
            We sit on <em className="t-accent text-brand-blue">your side</em> of the table.
          </h2>
          <Reveal className="grid gap-6 text-[1.1rem] leading-relaxed text-bone-700 lg:col-span-5 lg:col-start-8">
            <p>
              We add value by helping clients make intelligent business technology decisions. We never try to sell specific
              hardware, software or technology solutions. Instead, our team focuses on helping you meet your business goals.
              Technology is a means to that end.
            </p>
            <p>
              Ultimately, we believe that helping our clients succeed in their businesses is our path to success. With over 100 small and medium-sized business customers, chances are we
              work with someone you know.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="pt-24">
        <RelatedLinks
          links={[
            { href: "/about/values", title: "Our values", body: "Twelve principles that guide every decision." },
            { href: "/about/clients", title: "Our clients", body: "Private, public and education sectors." },
            { href: "/partners", title: "Partners", body: "Apple, Microsoft, Cisco, SonicWALL and more." },
          ]}
        />
      </div>
      <CTABand />
    </>
  );
}
