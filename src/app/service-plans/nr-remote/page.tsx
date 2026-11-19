import type { Metadata } from "next";
import { CTABand, PageHero, RelatedLinks, SectionHeading } from "@/components/sections/shared";
import { PlanFeatures } from "@/components/sections/PlanFeatures";
import { MonitorPanel } from "@/components/diagrams/MonitorPanel";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/primitives";
import { remoteFeatures } from "@/content/details";

export const metadata: Metadata = {
  title: "NR Remote: Remote Managed IT Services",
  description:
    "NR Remote: desktop, laptop and server monitoring, managed e-mail filtering, backup monitoring, anti-virus and patch management from our Network Operations Center, for a flat fee.",
  alternates: { canonical: "/service-plans/nr-remote" },
};

const goals = [
  { k: "Maximize", v: "employee productivity through maximum network uptime" },
  { k: "Minimize", v: "the business risks that come from IT" },
  { k: "Manage", v: "IT support costs effectively" },
];

export default function NrRemotePage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Service Plans", href: "/service-plans" }, { label: "NR Remote" }]}
        title={["NR Remote:", "rock-solid protection,", "*one flat fee*"]}
        lead="A comprehensive suite of remote managed-service tools aimed at the most common causes of network interruption and disruption. Enterprise-class software, managed from our Network Operations Center and shared across many businesses, so you get an outstanding solution at a cost-effective flat fee."
        aside={<MonitorPanel />}
      >
        <Button href="/request-a-quote">Get an NR Remote quote</Button>
        <Button href="/service-plans/nr-complete" variant="ghost">
          Compare with NR Complete
        </Button>
      </PageHero>

      <section className="container-x section-y" aria-label="Plan goals">
        <Reveal stagger={0.08} as="ul" className="grid gap-10 md:grid-cols-3">
          {goals.map((g) => (
            <li key={g.k} className="border-t border-bone-50/10 pt-6">
              <p className="t-h2 text-bone-50">{g.k}</p>
              <p className="mt-3 text-mist-400">{g.v}</p>
            </li>
          ))}
        </Reveal>
      </section>

      <section className="section-y border-t border-bone-50/[0.07]" aria-labelledby="remote-features">
        <div className="container-x">
          <SectionHeading title={["Everything in", "the *NR Remote* suite"]} />
          <h2 id="remote-features" className="sr-only">
            NR Remote features
          </h2>
          <div className="mt-14">
            <PlanFeatures features={remoteFeatures} />
          </div>
        </div>
      </section>

      <RelatedLinks
        links={[
          { href: "/service-plans/nr-complete", title: "NR Complete", body: "Add on-site engineers, help desk and a client portal." },
          { href: "/service-plans", title: "Compare plans", body: "Side by side, feature by feature." },
          { href: "/services/network-services", title: "Network services", body: "The engineering behind the monitoring." },
        ]}
      />
      <CTABand />
    </>
  );
}
