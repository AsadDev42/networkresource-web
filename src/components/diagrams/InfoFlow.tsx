"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap, gsap, prefersReducedMotion } from "@/lib/motion";

const STAGES = ["Generated", "Distributed", "Updated", "Consumed", "Archived"];

/**
 * Advisory consulting: how information moves through an organisation.
 * The ring draws itself on scroll; a pulse travels the lifecycle.
 */
export function InfoFlow() {
  const ref = useRef<SVGSVGElement>(null);
  const R = 150;
  const C = 200;
  const nodes = STAGES.map((label, i) => {
    const a = (i / STAGES.length) * Math.PI * 2 - Math.PI / 2;
    return { label, x: Math.round((C + Math.cos(a) * R) * 100) / 100, y: Math.round((C + Math.sin(a) * R) * 100) / 100, a };
  });

  useGSAP(
    () => {
      registerGsap();
      const svg = ref.current;
      if (!svg) return;
      const ring = svg.querySelector<SVGCircleElement>("[data-ring]");
      const items = svg.querySelectorAll("[data-node]");
      if (prefersReducedMotion() || !ring) return;
      const len = 2 * Math.PI * R;
      gsap.set(ring, { strokeDasharray: len, strokeDashoffset: len });
      const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 80%", once: true } });
      tl.to(ring, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" }).from(
        items,
        { autoAlpha: 0, scale: 0.6, transformOrigin: "center", stagger: 0.12, duration: 0.8, ease: "back.out(2)" },
        0.3,
      );
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} viewBox="0 0 400 400" className="h-auto w-full max-w-[30rem]" role="img" aria-labelledby="infoflow-title">
      <title id="infoflow-title">
        Information lifecycle we evaluate: generated, distributed, updated, consumed and archived.
      </title>
      <circle cx={C} cy={C} r={R + 34} fill="none" stroke="currentColor" strokeOpacity="0.06" />
      <circle cx={C} cy={C} r={R - 46} fill="none" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="2 6" />
      <circle data-ring cx={C} cy={C} r={R} fill="none" stroke="var(--color-blue-500)" strokeWidth="1.5" transform={`rotate(-90 ${C} ${C})`} />
      <circle r="5" fill="var(--color-signal-500)" className="motion-reduce:hidden">
        <animateMotion dur="9s" repeatCount="indefinite" path={`M ${C} ${C - R} a ${R} ${R} 0 1 1 -0.01 0`} />
      </circle>
      {nodes.map((n, i) => {
        const lx = Math.round((C + Math.cos(n.a) * (R + 30)) * 100) / 100;
        const ly = Math.round((C + Math.sin(n.a) * (R + 30)) * 100) / 100;
        const anchor = Math.abs(Math.cos(n.a)) < 0.2 ? "middle" : Math.cos(n.a) > 0 ? "start" : "end";
        return (
          <g key={n.label} data-node>
            <circle cx={n.x} cy={n.y} r="9" fill="var(--color-ink-950)" stroke="var(--color-blue-400)" strokeWidth="1.5" />
            <circle cx={n.x} cy={n.y} r="3" fill="var(--color-blue-300)" />
            <text x={lx} y={ly + 4} textAnchor={anchor} className="fill-current font-mono text-[11px] uppercase tracking-[0.12em]">
              {String(i + 1).padStart(2, "0")} {n.label}
            </text>
          </g>
        );
      })}
      <text x={C} y={C - 6} textAnchor="middle" className="fill-current text-[15px] font-medium">
        Your information
      </text>
      <text x={C} y={C + 16} textAnchor="middle" className="fill-[var(--color-mist-400)] font-mono text-[10px] uppercase tracking-[0.14em]">
        Lifecycle review
      </text>
    </svg>
  );
}
