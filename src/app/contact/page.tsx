import type { Metadata } from "next";
import { CTABand, PageHero } from "@/components/sections/shared";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/primitives";
import { company } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Call Network Resource toll free at 800.553.7800 or visit our Peninsula, North Bay, South Bay and East Bay offices. Emails for sales, support, questions and employment.",
  alternates: { canonical: "/contact" },
};

const mapsUrl = (o: (typeof company.offices)[number]) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${o.street}, ${o.city}, ${o.state} ${o.zip}`)}`;

export default function ContactPage() {
  const phones = Object.values(company.phones);
  return (
    <>
      <PageHero
        crumbs={[{ label: "Contact" }]}
        title={["One number,", "*four offices*"]}
        lead="Call us toll free, reach the right team by email, or find the office nearest you around the Bay."
      >
        <Button href={`tel:${company.phones.tollFree.tel}`}>Call {company.phones.tollFree.display}</Button>
        <Button href="/request-a-quote" variant="ghost">
          Use the request form
        </Button>
      </PageHero>

      <section className="container-x section-y" aria-labelledby="offices-heading">
        <h2 id="offices-heading" className="t-label text-mist-500">
          Offices
        </h2>
        <Reveal stagger={0.08} as="ul" className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-bone-50/[0.08] bg-bone-50/[0.08] md:grid-cols-2">
          {company.offices.map((o) => (
            <li key={o.region} className="flex min-h-64 flex-col bg-ink-950 p-8 md:p-10">
              <p className="t-label text-signal-400">{o.region}</p>
              <h3 className="t-h2 mt-4">{o.city}</h3>
              <address className="mt-4 not-italic text-mist-300">
                {o.street}
                <br />
                {o.city}, {o.state} {o.zip}
              </address>
              <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-2 pt-8 text-[0.95rem]">
                <a href={`tel:+1${o.phone.replace(/\D/g, "")}`} className="font-mono text-bone-50 hover:text-blue-300">
                  {o.phone}
                </a>
                <a href={mapsUrl(o)} target="_blank" rel="noopener noreferrer" className="text-mist-400 underline decoration-bone-50/20 underline-offset-4 hover:text-bone-50">
                  Directions<span className="sr-only"> to the {o.region} office (opens in a new tab)</span>
                </a>
              </div>
            </li>
          ))}
        </Reveal>
        <p className="mt-6 text-mist-500">Mailing address: {company.mailing}</p>
      </section>

      <section className="surface-light section-y" aria-label="Phone numbers and email">
        <div className="container-x grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="t-h3">Phone</h2>
            <dl className="mt-8">
              {phones.map((p) => (
                <div key={p.label} className="flex items-baseline justify-between gap-6 border-t border-ink-950/10 py-4">
                  <dt className="text-bone-700">{p.label}</dt>
                  <dd className="font-mono text-[1.05rem]">
                    {p.label === "Fax" ? p.display : <a href={`tel:${p.tel}`} className="hover:text-brand-blue">{p.display}</a>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="t-h3">Email</h2>
            <dl className="mt-8">
              {company.emails.map((e) => (
                <div key={e.address} className="flex flex-col gap-1 border-t border-ink-950/10 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="text-bone-700">{e.label}</dt>
                  <dd>
                    <a href={`mailto:${e.address}`} className="text-[1.02rem] text-ink-950 underline decoration-ink-950/20 underline-offset-4 hover:decoration-brand-blue">
                      {e.address}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
