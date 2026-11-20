import type { Metadata } from "next";
import { CTABand, PageHero, RelatedLinks } from "@/components/sections/shared";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/primitives";
import { relocationBenefits, relocationSteps, relocationTeam } from "@/content/details";

export const metadata: Metadata = {
  title: "Office Network Relocation",
  description:
    "Network Resource manages every facet of moving your computer equipment and telecom circuits: analysis, planning, moving, testing and going live, with a fixed-cost estimate.",
  alternates: { canonical: "/services/network-relocation" },
};

export default function RelocationPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/services" }, { label: "Network Relocation" }]}
        title={["Move offices.", "*Open on time*"]}
        lead="We manage all facets of relocating your computer equipment and telecommunication circuits on time and on budget, so your network is running smoothly on your first day in the new space."
        aside={
          <Reveal className="rounded-[var(--radius-card)] border border-bone-50/10 bg-ink-900/70 p-7 backdrop-blur">
            <p className="t-label text-mist-400">Your relocation team</p>
            <ul className="mt-5 grid gap-3">
              {relocationTeam.map((r, i) => (
                <li key={r} className="flex items-center justify-between border-t border-bone-50/[0.08] pt-3">
                  <span className="text-bone-50">{r}</span>
                  <span className="font-mono text-[0.75rem] text-mist-500">0{i + 1}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.92rem] text-mist-400">
              A site assessment of your existing and new locations becomes an Action Item List that details every step of the move.
            </p>
          </Reveal>
        }
      >
        <Button href="/request-a-quote">Plan your move</Button>
      </PageHero>

      <section className="section-y border-t border-bone-50/[0.07]" aria-labelledby="steps-heading">
        <div className="container-x">
          <SplitHeading id="steps-heading" lines={["The five steps to a", "*successful* relocation"]} className="t-h2" />
          <Reveal stagger={0.07} as="ol" className="mt-14 grid">
            {relocationSteps.map((s, i) => (
              <li key={s.title} className="grid gap-4 border-t border-bone-50/10 py-8 md:grid-cols-12 md:gap-8">
                <span className="font-mono text-[0.85rem] font-semibold text-signal-500 md:col-span-2">Step {i + 1}</span>
                <h3 className="t-h3 md:col-span-4">{s.title}</h3>
                <p className="text-mist-300 md:col-span-6">{s.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="surface-light section-y" aria-labelledby="benefits-heading">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="t-label text-bone-700">Benefits</p>
            <h2 id="benefits-heading" className="t-h2 mt-6">
              Why relocate with <em className="t-accent text-brand-blue">Network Resource?</em>
            </h2>
            <p className="t-lead mt-8 text-bone-700">
              Our objective is a productive working environment for your employees after the move. Using us rather than a
              moving company or your own staff guarantees proper dismantling, safe handling and installation of your
              equipment.
            </p>
            <blockquote className="mt-10 border-l-2 border-brand-red pl-6 text-[1.2rem] leading-snug tracking-[-0.015em] text-ink-950">
              We have moved a myriad of companies and have never been the cause of a move delay. In some instances we have
              worked around the clock, but on the first day of business our clients&apos; networks run smoothly.
            </blockquote>
          </div>
          <Reveal stagger={0.07} as="ul" className="grid content-start gap-0 lg:col-span-6 lg:col-start-7">
            {relocationBenefits.map((b, i) => (
              <li key={b} className="flex gap-6 border-t border-ink-950/10 py-6 text-[1.08rem] leading-snug">
                <span className="font-mono text-[0.75rem] text-brand-red">{String(i + 1).padStart(2, "0")}</span>
                {b}
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <div className="pt-24">
        <RelatedLinks
          links={[
            { href: "/services/network-services", title: "Network services", body: "The engineering behind everything we reinstall." },
            { href: "/service-plans/nr-complete", title: "NR Complete", body: "Keep the same team after you move in." },
            { href: "/contact", title: "Contact", body: "Four Bay Area offices, one number." },
          ]}
        />
      </div>
      <CTABand title={["Moving soon?", "*Start with a site visit*"]} body="We'll assess your current and new locations and give you a fixed-cost estimate for the move." />
    </>
  );
}
