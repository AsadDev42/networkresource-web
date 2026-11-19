"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/motion";
import { cx } from "@/components/ui/primitives";

const DEVICES = [
  { name: "File server", kind: "Server" },
  { name: "Exchange", kind: "Server" },
  { name: "Firewall", kind: "Network" },
  { name: "Internet link", kind: "Network" },
  { name: "Nightly backup", kind: "Backup" },
  { name: "Workstations", kind: "Endpoints" },
];

type Phase = "ok" | "alert" | "working";

/**
 * Illustrative NOC console: one device raises an alert, the NOC picks it up and resolves it remotely.
 * Labelled as an illustration — it shows the process, not live client data.
 */
export function MonitorPanel() {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1400);
    return () => window.clearInterval(id);
  }, [reduced]);

  const cycle = tick % 8;
  const target = Math.floor(tick / 8) % DEVICES.length;
  const phase: Phase = cycle === 2 || cycle === 3 ? "alert" : cycle === 4 || cycle === 5 ? "working" : "ok";
  const log = [
    { at: 2, text: `${DEVICES[target].name}: threshold crossed`, tone: "text-amber-400" },
    { at: 4, text: "NOC engineer assigned, remote session opened", tone: "text-blue-300" },
    { at: 6, text: "Resolved remotely, no site visit needed", tone: "text-pulse-400" },
  ];

  return (
    <figure className="rounded-[var(--radius-card)] border border-bone-50/10 bg-ink-900/80 p-5 backdrop-blur" aria-label="Illustration of the monitoring console">
      <div className="flex items-center justify-between border-b border-bone-50/[0.08] pb-4">
        <p className="t-label text-mist-400">NOC console</p>
        <p className="t-label flex items-center gap-2 text-mist-500">
          <span className="size-1.5 rounded-full bg-pulse-400" aria-hidden="true" /> 24 × 7
        </p>
      </div>
      <ul className="mt-4 grid gap-1.5" aria-hidden="true">
        {DEVICES.map((d, i) => {
          const state: Phase = i === target ? phase : "ok";
          return (
            <li key={d.name} className={cx("flex items-center justify-between rounded-md px-3 py-2.5 transition-colors duration-500", state !== "ok" && "bg-bone-50/[0.04]")}>
              <span className="flex items-center gap-3">
                <span
                  className={cx(
                    "size-2 rounded-full transition-colors duration-500",
                    state === "ok" ? "bg-pulse-400" : state === "alert" ? "bg-amber-400" : "bg-blue-400",
                  )}
                />
                <span className="text-[0.92rem] text-bone-50">{d.name}</span>
              </span>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-mist-500">
                {state === "ok" ? d.kind : state === "alert" ? "Alert" : "Fixing"}
              </span>
            </li>
          );
        })}
      </ul>
      <ol className="mt-4 grid min-h-[5.5rem] gap-1 border-t border-bone-50/[0.08] pt-4 font-mono text-[0.72rem]" aria-hidden="true">
        {log.map((l) => (
          <li key={l.at} className={cx("transition-opacity duration-500", (reduced || cycle >= l.at) ? "opacity-100" : "opacity-0", l.tone)}>
            › {l.text}
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-[0.75rem] text-mist-500">Illustration of the monitoring process, not live data</figcaption>
    </figure>
  );
}
