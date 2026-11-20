import { Reveal } from "@/components/ui/Reveal";

export type Feature = { title: string; body: string };

/** Plain grid of numbered features used on the simpler service pages. */
export function FeatureGrid({ items }: { items: readonly Feature[] }) {
  return (
    <Reveal stagger={0.06} as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f, i) => (
        <li key={f.title} className="flex h-full flex-col rounded-[var(--radius-card)] border border-bone-50/10 bg-ink-900 p-7">
          <span className="font-mono text-[0.8rem] font-semibold text-signal-500">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="t-h4 mt-8 text-bone-50">{f.title}</h3>
          <p className="mt-2 text-[0.95rem] text-mist-400">{f.body}</p>
        </li>
      ))}
    </Reveal>
  );
}
