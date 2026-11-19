import type { Metadata } from "next";
import { CTABand, PageHero } from "@/components/sections/shared";
import { AboutNav } from "@/components/sections/AboutNav";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Our Clients",
  description:
    "Network Resource offers a wide range of technical services in the private, public and education sectors. Request our partial client list.",
  alternates: { canonical: "/about/clients" },
};

const sectors = [
  { title: "Private sector", body: "From venture capital firms and legal services to construction." },
  { title: "Public sector", body: "Public and non-profit organizations." },
  { title: "Education", body: "Academic environments, alongside engineering, biotech and medical environments." },
];

export default function ClientsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", href: "/about" }, { label: "Our clients" }]}
        title={["Chances are we work", "with *someone you know*"]}
        lead="We offer a wide range of technical services in the private, public and education sectors. For a partial list of our client base, submit our request form and we'll contact you promptly with this information."
      >
        <Button href="/request-a-quote?topic=client-list">Request the client list</Button>
      </PageHero>
      <AboutNav />
      <section className="container-x section-y" aria-label="Sectors we serve">
        <Reveal stagger={0.08} as="ul" className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-bone-50/[0.08] bg-bone-50/[0.08] md:grid-cols-3">
          {sectors.map((s, i) => (
            <li key={s.title} className="flex min-h-72 flex-col bg-ink-950 p-8">
              <span className="font-mono text-[0.78rem] text-signal-400">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="t-h2 mt-auto pt-12">{s.title}</h2>
              <p className="mt-3 text-mist-400">{s.body}</p>
            </li>
          ))}
        </Reveal>
        <p className="mt-10 max-w-[44rem] text-mist-500">
          A partial client list is available on request through our request form.
        </p>
      </section>
      <CTABand />
    </>
  );
}
