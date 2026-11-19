"use client";

import { useTheme } from "@/lib/theme";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap, ScrollTrigger, useReducedMotion } from "@/lib/motion";
import { SceneGuard, ScenePoster, supportsWebGL } from "./SceneGuard";
import type { InnerVariant, Progress } from "./InnerScenes";
import { relocationPhase } from "./parts/Relocation";
import { RackLabels, RelocationLabel } from "./SceneLabels";
import { cx } from "@/components/ui/primitives";

const InnerScene = dynamic(() => import("./InnerScenes"), { ssr: false, loading: () => null });

/**
 * A pinned 3D stage whose animation is scrubbed by scrolling through `children`.
 * layout="split": stage sticks on one side while content scrolls on the other.
 * layout="overlay": stage fills the viewport and content cards scroll over it.
 */
export function ProgressScene({
  variant,
  layout = "split",
  children,
  className,
  label,
}: {
  variant: InnerVariant;
  layout?: "split" | "overlay";
  children: ReactNode;
  className?: string;
  label: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const progress = useMemo<Progress>(() => ({ value: 0 }), []);
  const reduced = useReducedMotion();
  const theme = useTheme();
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setWebgl(supportsWebGL());
      setReady(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      registerGsap();
      const steps = root.current?.querySelectorAll<HTMLElement>("[data-step]") ?? [];
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progress.value = self.progress;
          if (variant === "relocation") {
            const phase = relocationPhase(self.progress);
            steps.forEach((s, i) => (s.dataset.state = i < phase ? "done" : i === phase && self.progress > 0.001 ? "active" : "idle"));
          }
        },
      });
    },
    { scope: root },
  );

  const stage = (
    <div className="relative h-full w-full overflow-hidden">
      <ScenePoster />
      {ready && webgl && (
        <SceneGuard fallback={null}>
          <div className="absolute inset-0 animate-[fadein_1s_ease-out_both]">
            <InnerScene variant={variant} progress={progress} reduced={reduced} active={active} theme={theme} />
          </div>
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">{variant === "rack" ? <RackLabels /> : <RelocationLabel />}</div>
        </SceneGuard>
      )}
      <p className="sr-only">{label}</p>
    </div>
  );

  if (layout === "overlay") {
    return (
      <div ref={root} className={cx("relative", className)}>
        <div className="sticky top-0 h-[100svh]">
          {stage}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-ink-950/90 via-ink-950/30 to-transparent md:w-[60%]" />
        </div>
        <div className="relative -mt-[100svh]">{children}</div>
      </div>
    );
  }

  return (
    <div ref={root} className={cx("relative grid lg:grid-cols-2", className)}>
      <div className="relative h-[60svh] border-b border-bone-50/[0.07] lg:sticky lg:top-0 lg:h-[100svh] lg:border-b-0 lg:border-r">{stage}</div>
      <div className="relative">{children}</div>
    </div>
  );
}
