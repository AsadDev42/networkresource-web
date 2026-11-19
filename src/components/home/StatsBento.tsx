"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap, gsap, prefersReducedMotion } from "@/lib/motion";
import { company } from "@/content/site";
import { cx } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/ui/Reveal";
import { CountUp } from "./Interactive";

const r2 = (n: number) => Math.round(n * 100) / 100;

const card = "relative flex flex-col overflow-hidden rounded-[22px] border border-bone-50/10 bg-ink-900 p-7 md:p-8";

/**
 * Network Resource in numbers — every figure comes from the original site, and each one
 * is drawn so it explains itself: a retention ring, a 24-hour dial, a timeline, a network of dots.
 */
export function StatsBento() {
  const root = useRef<HTMLElement>(null);
  const years = new Date().getFullYear() - company.founded;

  useGSAP(
    () => {
      registerGsap();
      const el = root.current;
      if (!el) return;
      const reduced = prefersReducedMotion();
      const st = { trigger: el, start: "top 75%", once: true };

      const ring = el.querySelector<SVGCircleElement>("[data-ring]");
      if (ring) {
        const len = 2 * Math.PI * 88;
        gsap.fromTo(ring, { strokeDashoffset: len }, { strokeDashoffset: len * 0.03, duration: reduced ? 0 : 2.2, ease: "power3.out", scrollTrigger: st });
      }
      gsap.fromTo(el.querySelectorAll("[data-tick]"), { opacity: 0.12 }, { opacity: 1, stagger: reduced ? 0 : 0.035, duration: 0.25, scrollTrigger: st });
      gsap.fromTo(el.querySelectorAll("[data-dot]"), { opacity: 0.1 }, { opacity: 1, stagger: reduced ? 0 : 0.006, duration: 0.2, scrollTrigger: st });
      gsap.fromTo(el.querySelector("[data-timeline]"), { scaleX: 0 }, { scaleX: 1, duration: reduced ? 0 : 1.8, ease: "power2.out", scrollTrigger: st });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section-y relative overflow-hidden bg-ink-950" aria-labelledby="stats-heading">
      <div className="container-x relative">
        <SplitHeading id="stats-heading" lines={["Trusted by Bay Area", "businesses *since 1998*"]} className="t-h1" />

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
          {/* Retention ring — the headline number */}
          <article className={cx(card, "md:row-span-2 lg:col-span-2")}>
            <p className="t-label text-mist-400">Client retention</p>
            <div className="flex flex-1 flex-col items-center justify-center gap-8 py-8 sm:flex-row sm:justify-between">
              <div className="relative size-56 shrink-0">
                <svg viewBox="0 0 200 200" className="size-full -rotate-90" aria-hidden="true">
                  <circle cx="100" cy="100" r="88" fill="none" stroke="var(--color-ink-700)" strokeWidth="10" />
                  <circle data-ring cx="100" cy="100" r="88" fill="none" stroke="var(--color-signal-500)" strokeWidth="10" strokeLinecap="round" strokeDasharray={552.92} strokeDashoffset={16.59} />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-display text-[3.6rem] font-semibold leading-none tracking-[-0.06em]">
                    <CountUp value={company.retention} />
                  </span>
                </div>
              </div>
              <p className="max-w-[16rem] text-center text-[1.05rem] leading-snug text-mist-300 sm:text-left">
                A consistent client retention rate since we started in {company.founded}.
              </p>
            </div>
          </article>

          {/* 24/7 dial */}
          <article className={card}>
            <p className="t-label text-mist-400">Always on</p>
            <div className="mt-6 flex items-center gap-5">
              <svg viewBox="0 0 100 100" className="size-20 shrink-0" aria-hidden="true">
                {Array.from({ length: 24 }, (_, i) => {
                  const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
                  return (
                    <line
                      key={i}
                      data-tick
                      x1={r2(50 + Math.cos(a) * 34)}
                      y1={r2(50 + Math.sin(a) * 34)}
                      x2={r2(50 + Math.cos(a) * 46)}
                      y2={r2(50 + Math.sin(a) * 46)}
                      stroke={i % 6 === 0 ? "var(--color-signal-500)" : "var(--color-blue-400)"}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
              <span className="font-display text-[3rem] font-semibold leading-none tracking-[-0.05em]">24/7</span>
            </div>
            <p className="mt-auto pt-6 text-mist-300">Help desk and network monitoring, every hour of every day.</p>
          </article>

          {/* Since 1998 timeline */}
          <article className={card}>
            <p className="t-label text-mist-400">Experience</p>
            <p className="mt-6 font-display text-[3rem] font-semibold leading-none tracking-[-0.05em]">
              <CountUp value={String(years)} /> <span className="text-[1.25rem] tracking-[-0.02em] text-mist-400">years</span>
            </p>
            <div className="mt-6">
              <div className="h-1.5 overflow-hidden rounded-full bg-ink-700">
                <div data-timeline className="h-full origin-left rounded-full bg-blue-500" />
              </div>
              <div className="mt-2 flex justify-between text-[0.8rem] font-semibold text-mist-400">
                <span>{company.founded}</span>
                <span>Today</span>
              </div>
            </div>
            <p className="mt-auto pt-5 text-mist-300">Supporting Bay Area networks since {company.founded}.</p>
          </article>

          {/* 5–200 computers */}
          <article className={card}>
            <p className="t-label text-mist-400">Right-sized</p>
            <div className="mt-6 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-[3px]" aria-hidden="true">
              {Array.from({ length: 200 }, (_, i) => (
                <span key={i} data-dot className={cx("aspect-square rounded-full", i < 5 ? "bg-signal-500" : "bg-blue-400")} />
              ))}
            </div>
            <p className="mt-auto pt-5 text-mist-300">
              <span className="font-semibold text-bone-50">5 to ~200 computers</span>: the network sizes our flat-fee plans cover.
            </p>
          </article>

          {/* Team + offices */}
          <article className={card}>
            <p className="t-label text-mist-400">People & places</p>
            <div className="mt-6 flex items-end gap-6">
              <p className="font-display text-[3rem] font-semibold leading-none tracking-[-0.05em]">
                12<span className="text-signal-500">+</span>
              </p>
            </div>
            <p className="mt-auto pt-5 text-mist-300">
              Experienced engineers, across <span className="font-semibold text-bone-50">4 Bay Area offices</span>.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
