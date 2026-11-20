import type { Metadata } from "next";
import { CTABand, PageHero, RelatedLinks, SectionHeading, SpecList } from "@/components/sections/shared";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/primitives";
import { linuxStack, networkPractices } from "@/content/details";

export const metadata: Metadata = {
  title: "Network Services: Microsoft, Apple, Cisco and Linux",
  description:
    "Exchange, SQL, SharePoint, IIS, macOS Server, Cisco routers and firewalls, switching, UPS and Linux/Unix support from certified Bay Area engineers.",
  alternates: { canonical: "/services/network-services" },
};

const principles = [
  {
    title: "Planners and operators",
    body: "Our consultants are accomplished IT systems designers and experienced systems administrators. They plan the big picture and run the day-to-day implementation.",
  },
  {
    title: "Vendor-neutral",
    body: "We maintain no exclusive vendor relationships. We track the offerings of all major vendors and recommend the combination that best suits your needs.",
  },
  {
    title: "Experienced, trained staff",
    body: "We hire experienced engineers, train them continuously and deploy them productively, so we deliver at a lower cost with quality equal or superior to larger firms.",
  },
];

export default function NetworkServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/services" }, { label: "Network Services" }]}
        title={["Comfortable on", "*any* platform", "you're running"]}
        lead="Engineers with experience and certifications across Microsoft, Cisco, Citrix, Linux and Macintosh. We support most industry-specific software and systems, from venture capital and legal services to non-profit and construction."
      >
        <Button href="/request-a-quote">Get a free network consultation</Button>
      </PageHero>

      <section className="container-x section-y" aria-label="How we work">
        <Reveal stagger={0.08} as="ul" className="grid gap-10 md:grid-cols-3">
          {principles.map((p, i) => (
            <li key={p.title} className="border-t border-bone-50/10 pt-6">
              <span className="font-mono text-[0.75rem] text-signal-400">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="t-h3 mt-6">{p.title}</h2>
              <p className="mt-3 text-mist-400">{p.body}</p>
            </li>
          ))}
        </Reveal>
      </section>

      <section className="border-t border-bone-50/[0.07]" aria-label="Practices">
        <div className="container-x section-y">
          <h2 className="t-h2 max-w-[34rem]">Six practices, one accountable team.</h2>
          <nav aria-label="Practices" className="mt-8 flex flex-wrap gap-2">
            {networkPractices.map((p) => (
              <a key={p.id} href={`#${p.id}`} className="rounded-full border border-bone-50/15 px-3.5 py-1.5 text-[0.85rem] text-mist-300 transition-colors hover:border-bone-50/50 hover:text-bone-50">
                {p.title.replace(" Services", "").replace(" Support", "")}
              </a>
            ))}
          </nav>
          <div className="mt-16 grid gap-24">
            {networkPractices.map((practice) => (
              <article key={practice.id} id={practice.id} className="scroll-mt-28">
                <h3 className="t-h3">{practice.title}</h3>
                {practice.intro && <p className="mt-4 max-w-[36rem] text-mist-300">{practice.intro}</p>}
                <div className="mt-8 grid gap-10 xl:grid-cols-2">
                  {practice.groups.map((g) => (
                    <div key={g.title}>
                      <p className="t-label mb-3 text-blue-300">{g.title}</p>
                      <SpecList items={g.items} />
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-light section-y" aria-labelledby="stack-heading">
        <div className="container-x">
          <SectionHeading
            tone="light"
            title={["Supported technologies", "and *systems*"]}
            lead="Common open-source services associated with these systems are also supported."
          />
          <h2 id="stack-heading" className="sr-only">
            Supported Linux and Unix technologies
          </h2>
          <Reveal stagger={0.05} className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-ink-950/10 bg-ink-950/10 sm:grid-cols-2 lg:grid-cols-3">
            {linuxStack.map((g) => (
              <div key={g.title} className="bg-bone-50 p-7">
                <p className="t-label text-brand-red">{g.title}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {g.items.map((i) => (
                    <li key={i} className="rounded-full border border-ink-950/12 bg-ink-900 px-3 py-1 text-[0.85rem] text-ink-950">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <div className="pt-24">
        <RelatedLinks
          links={[
            { href: "/service-plans", title: "Flat-fee service plans", body: "Ongoing monitoring and support for a fixed monthly rate." },
            { href: "/services/advisory-consulting", title: "Advisory consulting", body: "Decide what your network needs and what it doesn't." },
            { href: "/partners", title: "Partners", body: "Apple, Microsoft, Cisco, SonicWALL and more." },
          ]}
        />
      </div>
      <CTABand />
    </>
  );
}
