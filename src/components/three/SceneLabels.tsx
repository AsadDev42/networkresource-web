"use client";

import type { ReactNode } from "react";
import { registerLabel } from "./Anchor";
import { RACK_UNITS } from "./parts/Rack";
import { company } from "@/content/site";

/** One positioned label. The wrapper is moved by <Anchor>; children are offset relative to the anchor point. */
function Label({ id, children, interactive = false }: { id: string; children: ReactNode; interactive?: boolean }) {
  return (
    <div
      ref={registerLabel(id)}
      className={interactive ? "pointer-events-auto absolute left-0 top-0" : "pointer-events-none absolute left-0 top-0"}
      style={{ opacity: 0, visibility: "hidden", willChange: "transform" }}
      aria-hidden={interactive ? undefined : true}
    >
      {children}
    </div>
  );
}

/** Rack unit label. Units alternate sides in the exploded view, so a left label grows leftward from its anchor. */
function UnitTag({ title, detail, side }: { title: string; detail: string; side: "left" | "right" }) {
  return (
    <div className={`flex -translate-y-1/2 items-center gap-2 whitespace-nowrap ${side === "left" ? "-translate-x-full flex-row-reverse" : ""}`}>
      <span className="h-px w-6 bg-bone-50/40" />
      <span className="rounded-lg border border-bone-50/10 bg-ink-900/92 px-2.5 py-1.5 shadow-[0_6px_20px_-8px_rgba(0,0,0,0.35)]">
        <span className="block text-[12px] font-semibold leading-tight text-bone-50">{title}</span>
        <span className="block text-[10.5px] font-medium text-mist-400">{detail}</span>
      </span>
    </div>
  );
}

export function RackLabels() {
  return (
    <>
      {RACK_UNITS.map((u, i) => (
        <Label key={u.name} id={`rack-${i}`}>
          <UnitTag title={u.name} detail={u.detail} side={i % 2 === 0 ? "right" : "left"} />
        </Label>
      ))}
    </>
  );
}

export function RelocationLabel() {
  return (
    <Label id="reloc-phase">
      <span
        data-text
        className="t-label block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-bone-50/15 bg-ink-950/95 px-3 py-1.5 text-bone-50"
      />
    </Label>
  );
}

function Hotspot({ id, label, target }: { id: string; label: string; target: string }) {
  return (
    <Label id={id} interactive>
      <button
        type="button"
        tabIndex={-1}
        onClick={() => {
          const el = document.getElementById(target);
          if (!el) return;
          if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.8 });
          else el.scrollIntoView();
        }}
        className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full max-lg:hidden border border-bone-50/20 bg-ink-950/95 py-1 pl-1 pr-3 text-[11px] font-semibold text-bone-50 transition-colors hover:border-bone-50/50"
      >
        <span className="grid size-5 place-items-center rounded-full bg-signal-500/20">
          <span className="size-1.5 rounded-full bg-signal-500" />
        </span>
        <span className="whitespace-nowrap">{label}</span>
      </button>
    </Label>
  );
}

/** All labels used by the homepage story scene. Hotspots are mouse shortcuts; keyboard users have the chapter rail. */
export function HomeLabels() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <RackLabels />
      <Label id="noc">
        <div className="-translate-y-1/2 whitespace-nowrap rounded-lg border border-bone-50/10 bg-ink-900/92 px-2.5 py-1.5 shadow-[0_6px_20px_-8px_rgba(0,0,0,0.35)]">
          <span className="t-label block text-blue-300">Network Operations Center</span>
          <span className="block text-[12px] text-mist-300">Monitoring 24 × 7</span>
        </div>
      </Label>
      <Label id="engineer">
        <div className="-translate-x-1/2 -translate-y-[calc(100%+8px)] whitespace-nowrap text-center rounded-lg border border-bone-50/10 bg-ink-900/92 px-2.5 py-1.5 shadow-[0_6px_20px_-8px_rgba(0,0,0,0.35)]">
          <span className="t-label block text-signal-400">On site</span>
          <span className="block text-[12px] font-semibold text-bone-50">Your primary engineer</span>
        </div>
      </Label>
      <RelocationLabel />
      {company.offices.map((o, i) => (
        <Label key={o.region} id={`bay-${i}`}>
          <div className="-translate-x-1/2 -translate-y-[calc(100%+6px)] whitespace-nowrap text-center rounded-lg border border-bone-50/10 bg-ink-900/92 px-2.5 py-1.5 shadow-[0_6px_20px_-8px_rgba(0,0,0,0.35)]">
            <span className="t-label block text-signal-400">{o.region}</span>
            <span className="block text-[12.5px] font-semibold text-bone-50">{o.city}</span>
          </div>
        </Label>
      ))}
      <Hotspot id="hot-closet" label="Network closet" target="chapter-closet" />
      <Hotspot id="hot-noc" label="Operations center" target="chapter-noc" />
      <Hotspot id="hot-team" label="Your team" target="chapter-onsite" />
    </div>
  );
}
