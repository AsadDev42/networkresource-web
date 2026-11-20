import type { Metadata } from "next";
import { CTABand, PageHero, SectionHeading } from "@/components/sections/shared";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { Button } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Cybersecurity",
  description:
    "Firewalls and VPNs, managed anti-virus, e-mail filtering, patching, backup monitoring and security audits for San Francisco Bay Area businesses.",
  alternates: { canonical: "/services/cybersecurity" },
};

const protections = [
  {
    title: "Firewalls & VPN",
    body: "Site security assessments, then configuration, installation and remote management of firewalls, routers and VPN concentrators.",
  },
  {
    title: "Managed anti-virus",
    body: "Anti-spyware and anti-virus installed locally and managed remotely from our Network Operations Center, so definitions stay current.",
  },
  {
    title: "E-mail filtering",
    body: "Managed e-mail filtering, part of our protection against the most common causes of network interruption.",
  },
  {
    title: "Patch management",
    body: "We choose the right patches for your systems, install them, test after installation and document every step.",
  },
  {
    title: "Backup monitoring",
    body: "Daily reports on every backup success, cancellation and failure. When something fails, we act right away, usually remotely.",
  },
  {
    title: "Audits & response",
    body: "Security audits, backup and disaster recovery assessments, and security response with forensic analysis when an incident happens.",
  },
] as const;

export default function CybersecurityPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", href: "/services" }, { label: "Cybersecurity" }]}
        title={["Keep your business", "*protected*"]}
        lead="Business firewalls, managed anti-virus, e-mail filtering and monitored backups, watched around the clock by our Network Operations Center."
      >
        <Button href="/request-a-quote?topic=security">Request a security review</Button>
      </PageHero>

      <section className="section-y" aria-labelledby="protect-heading">
        <div className="container-x">
          <h2 id="protect-heading" className="sr-only">
            What we protect
          </h2>
          <SectionHeading title={["What we *protect*"]} />
          <div className="mt-14">
            <FeatureGrid items={protections} />
          </div>
        </div>
      </section>

      <CTABand body="Find out where your network, firewall and backups stand." />
    </>
  );
}
