import type { Metadata } from "next";
import { CTABand, PageHero } from "@/components/sections/shared";
import { Reveal } from "@/components/ui/Reveal";
import { partners } from "@/content/details";

export const metadata: Metadata = {
  title: "Technology Partners",
  description:
    "Network Resource is an Apple Authorized Business Agent and Microsoft Certified Partner, Cisco and SonicWALL certified, and works with Check Point, EVault, Aladdin and more.",
  alternates: { canonical: "/partners" },
};

const featured = partners.slice(0, 4);
const rest = partners.slice(4);

export default function PartnersPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Partners" }]}
        title={["Partnered with the", "*biggest names* in IT"]}
        lead="These relationships keep us up to date with cutting-edge developments in IT systems so we can give our clients the best. Our recommendations stay vendor-neutral."
      />

      <section className="container-x section-y" aria-labelledby="certified-heading">
        <h2 id="certified-heading" className="t-label text-mist-500">
          Certifications &amp; authorizations
        </h2>
        <Reveal stagger={0.08} as="ul" className="mt-8 grid gap-5 md:grid-cols-2">
          {featured.map((p) => (
            <li key={p.name} className="flex min-h-[17rem] flex-col rounded-[var(--radius-card)] border border-bone-50/10 bg-ink-900 p-8 md:p-10">
              <p className="t-label text-blue-300">{p.role}</p>
              <h3 className="mt-auto pt-10 text-[clamp(2.25rem,4vw,3.25rem)] font-medium leading-none tracking-[-0.045em]">{p.name}</h3>
              <p className="mt-4 max-w-[30rem] text-mist-400">{p.body}</p>
            </li>
          ))}
        </Reveal>
      </section>

      <section className="surface-light section-y" aria-labelledby="ecosystem-heading">
        <div className="container-x">
          <h2 id="ecosystem-heading" className="t-h2 max-w-[40rem]">
            The wider <em className="t-accent text-brand-blue">ecosystem.</em>
          </h2>
          <p className="mt-6 max-w-[40rem] text-bone-700">
            Partners listed on our original partners page. Several of these products and companies have since changed name
            or ownership; ask us about current equivalents.
          </p>
          <Reveal stagger={0.04} as="ul" className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-ink-950/10 bg-ink-950/10 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <li key={p.name} className="bg-bone-50 p-7">
                <p className="t-label text-brand-red">{p.role}</p>
                <h3 className="t-h3 mt-5">{p.name}</h3>
                <p className="mt-3 text-[0.95rem] text-bone-700">{p.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <CTABand />
    </>
  );
}
