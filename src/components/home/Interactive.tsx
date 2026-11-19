"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap, gsap, prefersReducedMotion } from "@/lib/motion";
import { cx } from "@/components/ui/primitives";

/** Counts a number up when it scrolls into view. Non-numeric parts (%, /7) are kept. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      const match = value.match(/^(\d+)(.*)$/);
      if (!el || !match || prefersReducedMotion()) return;
      const target = Number(match[1]);
      const suffix = match[2];
      const from = target > 1000 ? target - 60 : 0;
      const obj = { n: from };
      gsap.to(obj, {
        n: target,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(obj.n)}${suffix}`;
        },
      });
    },
    { scope: ref },
  );
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
