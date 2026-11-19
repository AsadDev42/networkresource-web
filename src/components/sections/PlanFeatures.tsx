import type { PlanFeature } from "@/content/details";
import { Reveal } from "@/components/ui/Reveal";
import { SpecList } from "./shared";

/** Two-column feature list used on the plan detail pages. */
export function PlanFeatures({ features }: { features: PlanFeature[] }) {
  return (
    <Reveal stagger={0.06} as="ol" className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-bone-50/[0.08] bg-bone-50/[0.08] md:grid-cols-2">
      {features.map((f, i) => (
        <li key={f.title} className="flex flex-col bg-ink-950 p-7 md:p-9">
          <span className="font-mono text-[0.78rem] text-signal-400">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="t-h3 mt-8">{f.title}</h3>
          <p className="mt-3 text-mist-400">{f.body}</p>
          {f.bullets && (
            <div className="mt-6">
              <SpecList items={f.bullets} />
            </div>
          )}
        </li>
      ))}
    </Reveal>
  );
}
