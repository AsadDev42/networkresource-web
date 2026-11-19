import type { Metadata } from "next";
import { CTABand, PageHero, RelatedLinks, SectionHeading } from "@/components/sections/shared";
import { PlanFeatures } from "@/components/sections/PlanFeatures";
import { TeamDiagram } from "@/components/diagrams/TeamDiagram";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/primitives";
import { completeFeatures } from "@/content/details";

export const metadata: Metadata = {
  title: "NR Complete: Remote and On-Site Managed IT",
  description:
    "NR Complete combines remote managed services with proactive on-site engineers, a 24x7 help desk, a client portal, project implementation and account management.",
  alternates: { canonical: "/service-plans/nr-complete" },
};

export default function NrCompletePage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Service Plans", href: "/service-plans" }, { label: "NR Complete" }]}
        title={["NR Complete:", "the best of technology", "*and people*"]}
        lead="A remote and on-site hybrid that brings you the most complete level of service available. NR Complete combines the efficiency and insight of the NR Remote tools with on-site attention and focus."
        aside={<TeamDiagram />}
      >
        <Button href="/request-a-quote">Get an NR Complete quote</Button>
        <Button href="/service-plans" variant="ghost">
          Compare plans
        </Button>
      </PageHero>

      <section className="container-x section-y" aria-labelledby="consistency-heading">
        <div className="grid gap-12 lg:grid-cols-12">
          <h2 id="consistency-heading" className="t-h2 lg:col-span-6">
            The same results, <em className="t-accent text-blue-300">whoever you talk to.</em>
          </h2>
          <Reveal className="lg:col-span-5 lg:col-start-8">
            <p className="t-lead text-mist-300">
              Your dedicated team meets weekly or monthly to discuss issues and share knowledge across our whole customer
              base. With that structure, detailed documentation and our standards and best practices, you get consistent
              results regardless of who you interact with at Network Resource.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y border-t border-bone-50/[0.07]" aria-labelledby="complete-features">
        <div className="container-x">
          <SectionHeading title={["Everything in", "*NR Complete*"]} />
          <h2 id="complete-features" className="sr-only">
            NR Complete features
          </h2>
          <div className="mt-14">
            <PlanFeatures features={completeFeatures} />
          </div>
        </div>
      </section>

      <RelatedLinks
        links={[
          { href: "/service-plans/nr-remote", title: "NR Remote", body: "Remote monitoring and management only." },
          { href: "/services/network-relocation", title: "Network relocation", body: "Your team handles the move, too." },
          { href: "/about", title: "About us", body: "Since 1998, with 97% client retention." },
        ]}
      />
      <CTABand title={["Interested in", "*NR Complete?*"]} body="Contact Network Resource today for a free network consultation." />
    </>
  );
}
