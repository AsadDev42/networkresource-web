import type { Metadata } from "next";
import { CTABand, PageHero, RelatedLinks } from "@/components/sections/shared";
import { ProgressScene } from "@/components/three/ProgressScene";
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

      <ProgressScene
        variant="relocation"
        layout="overlay"
        label="3D illustration: equipment is packed into crates at the current office, travels to the new office, and is reinstalled and tested."
      >
        <div className="container-x pointer-events-none">
          <div className="flex h-[70svh] items-end pb-16">
            <div className="pointer-events-auto max-w-[32rem]">
              <SplitHeading lines={["The five steps to a", "*successful* relocation"]} className="t-h2" />
            </div>
          </div>
          <ol className="grid">
            {relocationSteps.map((s, i) => (
              <li key={s.title} data-step data-state="idle" className="group flex min-h-[95svh] items-center">
                <div className="pointer-events-auto max-w-[30rem] rounded-[var(--radius-card)] border border-bone-50/10 bg-ink-950/80 p-7 backdrop-blur-md transition-[border-color] duration-500 group-data-[state=active]:border-signal-500/50 md:p-9">
                  <p className="flex items-center gap-3 font-mono text-[0.8rem]">
                    <span className="text-signal-400">{String(i + 1).padStart(2, "0")}</span>
                    <span className="h-px w-8 bg-bone-50/20" aria-hidden="true" />
                    <span className="uppercase tracking-[0.14em] text-mist-400">Step {i + 1} of 5</span>
                  </p>
                  <h3 className="t-h2 mt-5">{s.title}</h3>
                  <p className="mt-5 text-mist-300">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="h-[30svh]" />
        </div>
      </ProgressScene>

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
