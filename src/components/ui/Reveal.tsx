"use client";

import { useRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap, gsap, prefersReducedMotion } from "@/lib/motion";

type RevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  /** Animate direct children one after another instead of the wrapper as a whole. */
  stagger?: number;
  delay?: number;
  y?: number;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/**
 * Fades and lifts content into view on scroll. Content is fully visible without JavaScript;
 * the hidden starting state is applied only once GSAP is running.
 */
export function Reveal<T extends ElementType = "div">({
  as,
  children,
  stagger,
  delay = 0,
  y = 28,
  className,
  ...rest
}: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el) return;
      const targets = stagger ? Array.from(el.children) : [el];
      const reduced = prefersReducedMotion();
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: reduced ? 0 : y },
        {
          autoAlpha: 1,
          y: 0,
          duration: reduced ? 0.4 : 1.1,
          delay,
          stagger: stagger ?? 0,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

type SplitHeadingProps = {
  as?: "h1" | "h2" | "h3" | "p";
  /** Each entry renders as one masked line. Use `*word*` to set an accent (serif italic) word. */
  lines: string[];
  className?: string;
  delay?: number;
  /** Animate immediately on mount rather than when scrolled into view. */
  immediate?: boolean;
  id?: string;
};

function renderAccent(line: string) {
  const parts = line.split(/(\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) =>
    part.startsWith("*") ? (
      <em key={i} className="t-accent">
        {part.slice(1, -1)}
      </em>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/** Headline whose lines slide up from behind a mask. Screen readers get the plain sentence. */
export function SplitHeading({ as = "h2", lines, className, delay = 0, immediate, id }: SplitHeadingProps) {
  const Tag = as;
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el) return;
      const inner = el.querySelectorAll(".reveal-line > span");
      if (prefersReducedMotion()) {
        gsap.fromTo(inner, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, delay });
        return;
      }
      gsap.fromTo(
        inner,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.25,
          ease: "expo.out",
          stagger: 0.08,
          delay,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 90%", once: true },
        },
      );
    },
    { scope: ref },
  );

  const plain = lines.join(" ").replace(/\*/g, "");

  return (
    <Tag ref={ref} id={id} className={className} aria-label={plain}>
      {lines.map((line, i) => (
        <span key={i} className="reveal-line" aria-hidden="true">
          <span>{renderAccent(line)}</span>
        </span>
      ))}
    </Tag>
  );
}
