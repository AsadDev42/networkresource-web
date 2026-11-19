"use client";

import { useTheme } from "@/lib/theme";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap, ScrollTrigger, gsap, isLowPowerDevice, useReducedMotion } from "@/lib/motion";
import { storyState, CHAPTERS } from "@/components/three/storyState";
import { SceneGuard, ScenePoster, supportsWebGL } from "@/components/three/SceneGuard";
import { HomeLabels } from "@/components/three/SceneLabels";
import { RELOCATION_PHASES, relocationPhase } from "@/components/three/parts/Relocation";
import { RACK_UNITS } from "@/components/three/parts/Rack";
import { range } from "@/components/three/math";
import { Button, cx } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/ui/Reveal";
import { company, services } from "@/content/site";

const HomeScene = dynamic(() => import("@/components/three/HomeScene"), { ssr: false, loading: () => null });

type Layout = "left" | "right" | "top" | "bottom";

/** Text placement per layout (desktop). On phones every chapter docks to the bottom, the scene above it. */
const LAYOUT_CLASS: Record<Layout, { wrap: string; panel: string; shade: string }> = {
  left: {
    wrap: "items-end lg:items-center lg:justify-start",
    panel: "lg:max-w-[30rem]",
    shade: "lg:bg-[linear-gradient(90deg,var(--color-ink-950)_0%,color-mix(in_oklab,var(--color-ink-950)_70%,transparent)_30%,transparent_52%)]",
  },
  right: {
    wrap: "items-end lg:items-center lg:justify-end",
    panel: "lg:max-w-[30rem]",
    shade: "lg:bg-[linear-gradient(270deg,var(--color-ink-950)_0%,color-mix(in_oklab,var(--color-ink-950)_70%,transparent)_30%,transparent_52%)]",
  },
  top: {
    wrap: "items-end lg:items-start lg:justify-center lg:pt-[calc(var(--header-h)+3vh)]",
    panel: "lg:max-w-[56rem] lg:text-center",
    shade: "lg:bg-[linear-gradient(180deg,var(--color-ink-950)_0%,color-mix(in_oklab,var(--color-ink-950)_70%,transparent)_26%,transparent_45%)]",
  },
  bottom: {
    wrap: "items-end lg:justify-center lg:pb-[6vh]",
    panel: "lg:max-w-[56rem] lg:text-center",
    shade: "lg:bg-[linear-gradient(0deg,var(--color-ink-950)_0%,color-mix(in_oklab,var(--color-ink-950)_70%,transparent)_28%,transparent_48%)]",
  },
};

function Chapter({
  id,
  title,
  children,
  height,
  layout = "left",
}: {
  id: string;
  title: string[];
  children: ReactNode;
  height: string;
  layout?: Layout;
}) {
  const l = LAYOUT_CLASS[layout];
  const centred = layout === "top" || layout === "bottom";
  return (
    <section id={id} data-chapter data-layout={layout} className={cx("relative", height)} aria-labelledby={`${id}-title`}>
      <div data-sticky className="sticky top-0 h-[100svh]">
        <div className={cx("pointer-events-none absolute inset-0 [mask-image:linear-gradient(180deg,transparent,#000_22%,#000_78%,transparent)]", l.shade)} aria-hidden="true" />
        <div className={cx("container-x relative flex h-full pb-6 lg:pb-0", l.wrap)}>
          <div
            data-panel
            className={cx(
              "pointer-events-auto relative w-full rounded-[var(--radius-card)] border border-bone-50/[0.08] bg-ink-950/85 p-6 backdrop-blur-md lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none",
              l.panel,
            )}
          >
            <SplitHeading id={`${id}-title`} lines={title} className="t-h2" />
            <div className={cx("t-lead mt-5 text-mist-300", centred && "lg:mx-auto lg:max-w-[40rem]")}>{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeStory() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [lowPower, setLowPower] = useState(false);
  const [active, setActive] = useState(true);
  const [chapter, setChapter] = useState(0);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);
  const logRefs = useRef<Array<HTMLLIElement | null>>([]);

  // Decide on the client whether, and how heavily, to render 3D.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setWebgl(supportsWebGL());
      setLowPower(isLowPowerDevice() || window.innerWidth < 768);
      setMounted(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Measure where each chapter's text sits and publish the free screen area to the 3D camera.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      const header = (document.querySelector("header")?.getBoundingClientRect().height ?? 72) / window.innerHeight;
      const wide = window.innerWidth >= 1024;
      el.querySelectorAll<HTMLElement>("[data-chapter]").forEach((section, i) => {
        const sticky = section.querySelector<HTMLElement>("[data-sticky]");
        const panel = section.querySelector<HTMLElement>("[data-panel]");
        if (!sticky || !panel) return;
        const s = sticky.getBoundingClientRect();
        const p = panel.getBoundingClientRect();
        const top = (p.top - s.top) / s.height;
        const bottom = (p.bottom - s.top) / s.height;
        const left = (p.left - s.left) / s.width;
        const right = (p.right - s.left) / s.width;
        const layout = wide ? (section.dataset.layout ?? "left") : "bottom";
        const gap = 0.025;
        const y0 = header + 0.02;
        const edge = wide ? 0.05 : 0.03; // leave room for the chapter rail on desktop
        let r = { x0: edge, y0, x1: 1 - edge, y1: 0.97 };
        if (layout === "left") r = { x0: right + gap, y0, x1: 1 - edge, y1: 0.96 };
        else if (layout === "right") r = { x0: 0.03, y0, x1: left - gap, y1: 0.96 };
        else if (layout === "bottom") r = { x0: edge, y0, x1: 1 - edge, y1: Math.max(y0 + 0.2, top - gap) };
        else if (layout === "top") r = { x0: edge, y0: Math.min(0.75, bottom + gap), x1: 1 - edge, y1: 0.97 };
        storyState.regions[i] = r;
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.querySelectorAll("[data-panel]").forEach((p) => ro.observe(p));
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Pause rendering when the story is off-screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "60% 0px 60% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      registerGsap();
      const sections = gsap.utils.toArray<HTMLElement>("[data-chapter]", root.current);
      let lastIdx = -1;

      const sync = (value: number) => {
        storyState.chapter = value;
        const idx = Math.min(sections.length - 1, Math.floor(value));
        if (idx !== lastIdx) {
          lastIdx = idx;
          setChapter(idx);
        }
        // Relocation steps follow the 3D sequence.
        const relT = range(value, 4.0, 4.82);
        const phase = relocationPhase(relT);
        stepRefs.current.forEach((el, i) => {
          if (!el) return;
          el.dataset.state = value < 4 ? "idle" : i < phase || relT >= 1 ? "done" : i === phase ? "active" : "idle";
        });
        // NOC event log follows the alert → fix sequence.
        const l2 = value >= 2 && value < 3 ? value - 2 : value >= 3 ? 1 : 0;
        const thresholds = [0.16, 0.3, 0.47];
        logRefs.current.forEach((el, i) => {
          if (el) el.dataset.state = l2 >= thresholds[i] ? "on" : "off";
        });
      };

      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => sync(i + self.progress),
          onLeave: () => sync(Math.min(i + 1, sections.length - 0.001)),
          onLeaveBack: () => sync(i),
        });
      });
      sync(0);
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      {/* Sticky 3D stage */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden" aria-hidden={!webgl}>
        <ScenePoster />
        {mounted && webgl && (
          <SceneGuard fallback={null}>
            <div className="absolute inset-0 animate-[fadein_1.2s_ease-out_both]">
              <HomeScene active={active} reduced={reduced} lowPower={lowPower} theme={theme} />
            </div>
            <HomeLabels />
          </SceneGuard>
        )}
        {/* readability gradients */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink-950 to-transparent" />
        <p className="sr-only">
          An animated 3D illustration of a client office, its network closet and the Network Resource Network Operations
          Center. The same story is told in the text that follows.
        </p>
      </div>

      {/* Chapter rail */}
      <nav
        aria-label="Story chapters"
        className={cx(
          "fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 transition-opacity duration-500 lg:block",
          active ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <ol className="grid gap-3">
          {CHAPTERS.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById(`chapter-${c.id}`);
                  if (!el) return;
                  if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.6, offset: i === 0 ? 0 : 2 });
                  else el.scrollIntoView();
                }}
                aria-current={chapter === i ? "step" : undefined}
                className="group flex items-center justify-end gap-3"
              >
                <span
                  className={cx(
                    "t-label transition-[opacity,color] duration-300",
                    "text-bone-50 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                  )}
                >
                  {c.label}
                </span>
                <span
                  className={cx(
                    "block h-px transition-[width,background-color] duration-500",
                    chapter === i ? "w-8 bg-signal-500" : "w-4 bg-bone-50/30 group-hover:bg-bone-50/70",
                  )}
                />
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* Chapters scroll over the stage */}
      <div className="pointer-events-none relative -mt-[100svh]">
        {/* 0 — Hero */}
        <section id="chapter-hero" data-chapter data-layout="left" className="relative h-[150svh]" aria-labelledby="hero-title">
          <div data-sticky className="sticky top-0 flex h-[100svh] flex-col pb-8 pt-[var(--header-h)]">
            <div className={cx("pointer-events-none absolute inset-0", LAYOUT_CLASS.left.shade)} aria-hidden="true" />
            <div className="container-x relative flex flex-1 items-end py-6 lg:items-center">
              <div data-panel className="pointer-events-auto max-w-[40rem] lg:max-w-[min(38rem,42vw)]">
                <SplitHeading
                  as="h1"
                  id="hero-title"
                  immediate
                  delay={0.15}
                  lines={["Your IT department,", "*running quietly*"]}
                  className="t-display"
                />
                <p className="t-lead mt-6 max-w-[30rem] text-mist-300">
                  Flat-fee support and 24/7 monitoring for businesses with 5 to 200 computers.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Button href="/request-a-quote">Free network assessment</Button>
                  <Button href="/service-plans" variant="ghost">
                    Service plans
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 1 — Network closet */}
        <Chapter layout="right" id="chapter-closet" title={["The closet,", "*engineered*"]} height="h-[230svh]">
          <p>Certified engineers build and run your servers, security, switching, storage and power.</p>
          <Chips items={RACK_UNITS.map((u) => u.name)} />
        </Chapter>

        {/* 2 — NOC */}
        <Chapter layout="left" id="chapter-noc" title={["Fixed before", "*you notice*"]} height="h-[240svh]">
          <p>Our Network Operations Center watches your network around the clock and fixes most issues remotely.</p>
          <ol className="mt-6 grid gap-1.5 text-[0.82rem] max-md:hidden" aria-label="How an alert is handled">
            {[
              ["Alert", "Threshold crossed", "bg-amber-400"],
              ["Diagnose", "Traced to the source", "bg-blue-400"],
              ["Resolve", "Fixed remotely", "bg-pulse-400"],
            ].map(([k, v, dot], i) => (
              <li
                key={k}
                ref={(el) => void (logRefs.current[i] = el)}
                data-state="off"
                className="flex items-center gap-3 rounded-lg border border-bone-50/[0.08] bg-ink-950/60 px-3.5 py-2.5 opacity-35 transition-opacity duration-500 data-[state=on]:opacity-100"
              >
                <span className={cx("size-2 rounded-full", dot)} aria-hidden="true" />
                <span className="w-20 font-semibold text-bone-50">{k}</span>
                <span className="text-mist-400">{v}</span>
              </li>
            ))}
          </ol>
        </Chapter>

        {/* 3 — On site */}
        <Chapter layout="right" id="chapter-onsite" title={["A team that", "*knows your office*"]} height="h-[220svh]">
          <p>NR Complete adds a dedicated team on your side.</p>
          <Chips items={["Primary engineer", "Secondary engineer", "24x7 help desk", "Client portal", "Account manager"]} />
        </Chapter>

        {/* 4 — Relocation */}
        <Chapter layout="left" id="chapter-relocation" title={["Your network moves.", "*Work doesn't stop*"]} height="h-[320svh]">
          <ol className="mt-5 grid gap-1">
            {RELOCATION_PHASES.map((p, i) => (
              <li
                key={p.name}
                ref={(el) => void (stepRefs.current[i] = el)}
                data-state="idle"
                className="group flex items-center gap-4 whitespace-nowrap rounded-lg px-3 py-2.5 transition-colors duration-500 data-[state=active]:bg-bone-50/[0.07]"
              >
                <span className="t-label w-6 text-mist-500 group-data-[state=active]:text-signal-400 group-data-[state=done]:text-pulse-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-semibold text-mist-400 transition-colors group-data-[state=active]:text-bone-50 group-data-[state=done]:text-mist-300">
                  {p.name}
                </span>
              </li>
            ))}
          </ol>
        </Chapter>

        {/* 5 — Bay Area */}
        <Chapter layout="left" id="chapter-bay" title={["Four offices", "*around the Bay*"]} height="h-[200svh]">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
            {company.offices.map((o) => (
              <li key={o.region}>
                <span className="t-label block text-signal-400">{o.region}</span>
                <span className="font-semibold text-bone-50">{o.city}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Button href="/contact" variant="light" arrow={false}>
              Find your office
            </Button>
            <Link href={`tel:${company.phones.tollFree.tel}`} className="font-semibold text-mist-300 hover:text-bone-50">
              {company.phones.tollFree.display}
            </Link>
          </div>
        </Chapter>
      </div>

      {/* Summary of services for assistive tech */}
      <ul className="sr-only">
        {services.map((s) => (
          <li key={s.slug}>
            {s.title}: {s.short}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chips({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2 max-md:hidden">
      {items.map((i) => (
        <li key={i} className="rounded-full border border-bone-50/12 bg-ink-950/60 px-3.5 py-1.5 text-[0.82rem] font-medium text-mist-300">
          {i}
        </li>
      ))}
    </ul>
  );
}
