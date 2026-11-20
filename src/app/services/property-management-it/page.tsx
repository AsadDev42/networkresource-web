import type { Metadata } from "next";
import { CTABand, PageHero, SectionHeading } from "@/components/sections/shared";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { Button } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Property Management IT",
  description:
    "On-site and remote IT support for San Francisco Bay Area property management offices, leasing teams and multi-unit communities.",
  alternates: { canonical: "/services/property-management-it" },
};

const support = [
  {
    title: "Office & leasing support",
    body: "Help desk and on-site engineers for your management office and leasing teams.",
  },
  {
    title: "Networks across sites",
    body: "Routers, switches, firewalls and power set up and managed at each office and community you run.",
  },
  {
    title: "Security & backups",
    body: "Managed anti-virus, e-mail filtering, patching and monitored backups that protect tenant and owner records.",
  },
  {
    title: "Openings & moves",
    body: "When you open or move an office, we plan, move and test your equipment and circuits so it is running on day one.",
  },
  {
    title: "24x7 monitoring",
    body: "Internet, firewall and server availability watched around the clock by our Network Operations Center.",
  },
  {
    title: "One flat fee",
    body: "Managed plans priced by your number of servers and workstations.",
  },
] as const;

export default function PropertyManagementPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/services" }, { label: "Property Management IT" }]}
        title={["IT for property", "*management teams*"]}
        lead="Dedicated IT support for property management offices, leasing teams and multi-unit communities across the San Francisco Bay Area, on site and remote."
      >
        <Button href="/request-a-quote?topic=property">Talk to our team</Button>
      </PageHero>

      <section className="section-y" aria-labelledby="pm-heading">
        <div className="container-x">
          <h2 id="pm-heading" className="sr-only">
            How we support property management
          </h2>
          <SectionHeading title={["Everything your offices", "*depend on*"]} />
          <div className="mt-14">
            <FeatureGrid items={support} />
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
