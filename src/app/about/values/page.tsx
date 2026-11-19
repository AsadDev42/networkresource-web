import type { Metadata } from "next";
import { CTABand, PageHero } from "@/components/sections/shared";
import { AboutNav } from "@/components/sections/AboutNav";
import { Reveal } from "@/components/ui/Reveal";
import { values } from "@/content/details";

export const metadata: Metadata = {
  title: "Our Values",
  description:
    "The twelve beliefs, principles and values that guide Network Resource's strategic and operational decisions, including client focus, integrity and a sense of urgency.",
  alternates: { canonical: "/about/values" },
};

export default function ValuesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", href: "/about" }, { label: "Our values" }]}
        title={["Twelve beliefs,", "*equally* important"]}
        lead="Our strategic and operational decisions are guided by these absolute and equally important beliefs, principles and values."
      />
      <AboutNav />
      <section className="container-x section-y" aria-label="Values">
        <Reveal stagger={0.05} as="ol" className="grid gap-x-12 md:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <li key={v.title} className="group border-t border-bone-50/[0.08] pb-12 pt-8">
              <span className="font-mono text-[0.78rem] text-signal-400">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="t-h3 mt-6 transition-colors group-hover:text-blue-300">{v.title}</h2>
              <p className="mt-3 text-mist-400">{v.body}</p>
            </li>
          ))}
        </Reveal>
      </section>
      <CTABand />
    </>
  );
}
