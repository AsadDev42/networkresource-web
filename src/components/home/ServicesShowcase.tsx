import Link from "next/link";
import { services } from "@/content/site";
import { ArrowIcon } from "@/components/ui/primitives";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import { AdviseArt, MoveArt, RackArt, SupplyArt } from "./ServiceArt";

const ART = [RackArt, MoveArt, AdviseArt, SupplyArt];

/** The four services as a calm 2 × 2 grid: illustration on top, one line of copy, one link. */
export function ServicesShowcase() {
  return (
    <section className="section-y relative bg-ink-950" aria-labelledby="services-heading">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SplitHeading id="services-heading" lines={["Four ways we keep", "your business *running*"]} className="t-h1" />
          </div>
          <p className="t-lead text-mist-300 lg:col-span-4 lg:col-start-9">Everyday support, office moves and purchasing, handled by one team.</p>
        </div>

        <Reveal stagger={0.08} as="ul" className="mt-14 grid gap-5 md:grid-cols-2">
          {services.map((s, i) => {
            const Art = ART[i];
            return (
              <li key={s.slug}>
                <Link
                  href={s.href}
                  className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-bone-50/10 bg-ink-900 transition-colors duration-200 hover:border-blue-400/50"
                >
                  <div className="relative h-56 border-b border-bone-50/[0.07] bg-ink-950 md:h-64">
                    <div className="absolute inset-6">
                      <Art />
                    </div>
                  </div>
                  <div className="flex flex-1 items-end justify-between gap-6 p-7 md:p-8">
                    <div>
                      <h3 className="t-h3">{s.title}</h3>
                      <p className="mt-2 max-w-[26rem] text-[0.95rem] text-mist-400">{s.short}</p>
                    </div>
                    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-bone-50/15 transition-[background-color,border-color,color] duration-500 group-hover:border-signal-500 group-hover:bg-signal-500 group-hover:text-white">
                      <ArrowIcon direction="up-right" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
