import type { Metadata } from "next";
import { Fragment } from "react";
import { CTABand, PageHero, SectionHeading } from "@/components/sections/shared";
import { Reveal } from "@/components/ui/Reveal";
import { Button, cx } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Flat-Fee IT Service Plans: NR Remote and NR Complete",
  description:
    "Two fixed-fee managed IT plans for networks of 5 to about 200 computers. Unlimited support, priced by the number of servers and workstations.",
  alternates: { canonical: "/service-plans" },
};

const rows: Array<{ group: string; items: Array<[string, boolean, boolean]> }> = [
  {
    group: "Remote management from our NOC",
    items: [
      ["Desktop, laptop & server monitoring", true, true],
      ["24x7 network monitoring", true, true],
      ["Backup monitoring", true, false],
      ["Managed e-mail filtering", true, false],
      ["Managed anti-spyware & anti-virus", true, true],
      ["Patch management", true, true],
    ],
  },
  {
    group: "People and process",
    items: [
      ["Proactive on-site support (primary + secondary engineer)", false, true],
      ["24x7 help desk", false, true],
      ["Integrated client portal", false, true],
      ["Project implementation", false, true],
      ["Account management", false, true],
    ],
  },
];

function Mark({ on }: { on: boolean }) {
  return on ? (
    <svg viewBox="0 0 16 16" className="mx-auto size-5 text-pulse-400" role="img" aria-label="Included">
      <path d="m3 8.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <span className="mx-auto block h-px w-3 bg-mist-500" role="img" aria-label="Not listed for this plan" />
  );
}

export default function ServicePlansPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Service Plans" }]}
        title={["Spend time on your", "business, *not your* technology"]}
        lead="Two fixed-fee plans, NR Remote and NR Complete, for networks from 5 to approximately 200 computers. Rates are based on the number of servers and workstations, and remote-access technology lets us offer unlimited support at a much lower price than our competitors."
      >
        <Button href="/request-a-quote">Get a plan quote</Button>
      </PageHero>

      <section className="container-x section-y" aria-label="Plans">
        <Reveal stagger={0.1} className="grid gap-5 lg:grid-cols-2">
          {[
            {
              name: "NR Remote",
              href: "/service-plans/nr-remote",
              tag: "Remote managed services",
              body: "Enterprise-class tools, managed from our Network Operations Center, that protect you from the most common causes of network interruption, for a flat fee.",
            },
            {
              name: "NR Complete",
              href: "/service-plans/nr-complete",
              tag: "Remote + on-site hybrid",
              body: "Everything NR Remote offers, plus a dedicated engineering team on site, a 24x7 help desk, a client portal, project implementation and account management.",
              featured: true,
            },
          ].map((p) => (
            <article
              key={p.name}
              className={cx(
                "flex min-h-[24rem] flex-col rounded-[var(--radius-card)] border p-8 md:p-10",
                p.featured ? "border-blue-500/50 bg-ink-900" : "border-bone-50/10 bg-ink-900",
              )}
            >
              <p className="t-label text-blue-300">{p.tag}</p>
              <h2 className="t-h1 mt-6">{p.name}</h2>
              <p className="mt-5 max-w-[32rem] text-mist-300">{p.body}</p>
              <div className="mt-auto pt-10">
                <Button href={p.href} variant={p.featured ? "primary" : "ghost"}>
                  Explore {p.name}
                </Button>
              </div>
            </article>
          ))}
        </Reveal>
      </section>

      <section className="border-t border-bone-50/[0.07] section-y" aria-labelledby="compare-heading">
        <div className="container-x">
          <SectionHeading title={["What each plan", "*includes*"]} lead="As listed in each plan's published description." />
          <h2 id="compare-heading" className="sr-only">
            Plan comparison
          </h2>
          <div className="mt-14 overflow-x-auto rounded-[var(--radius-card)] border border-bone-50/[0.08]">
            <table className="w-full min-w-[36rem] border-collapse text-left text-[0.95rem]">
              <caption className="sr-only">Features included in NR Remote and NR Complete</caption>
              <thead>
                <tr className="bg-ink-900">
                  <th scope="col" className="p-5 font-normal text-mist-400">
                    Feature
                  </th>
                  <th scope="col" className="w-36 p-5 text-center font-medium">
                    NR Remote
                  </th>
                  <th scope="col" className="w-36 p-5 text-center font-medium text-blue-300">
                    NR Complete
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((g) => (
                  <Fragment key={g.group}>
                    <tr>
                      <th colSpan={3} scope="colgroup" className="t-label border-t border-bone-50/[0.08] bg-ink-950 px-5 pb-3 pt-7 font-normal text-mist-500">
                        {g.group}
                      </th>
                    </tr>
                    {g.items.map(([label, remote, complete]) => (
                      <tr key={label} className="border-t border-bone-50/[0.06]">
                        <th scope="row" className="p-5 font-normal text-mist-300">
                          {label}
                        </th>
                        <td className="p-5">
                          <Mark on={remote} />
                        </td>
                        <td className="bg-blue-500/[0.04] p-5">
                          <Mark on={complete} />
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 max-w-[46rem] text-[0.88rem] text-mist-500">
            Backup monitoring and e-mail filtering are listed in the NR Remote suite. NR Complete includes the NR Remote
            monitoring tools; ask us to confirm the exact scope for your network.
          </p>
        </div>
      </section>

      <CTABand title={["Which plan fits?", "*We'll tell you honestly*"]} body="Contact us and someone will be more than happy to discuss your needs, starting with a free network consultation." />
    </>
  );
}
