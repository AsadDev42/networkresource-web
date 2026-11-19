import { cx } from "./primitives";

/**
 * Page ground taken from the logo: the tilted orbital ring of the Network Resource mark,
 * drawn large and faint. Replaces a generic grid background.
 */
export function OrbitBackdrop({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMid slice"
      className={cx("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="orbit-fade" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-orbit)" stopOpacity="0" />
          <stop offset="0.55" stopColor="var(--color-orbit)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--color-orbit)" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <ellipse cx="760" cy="300" rx="430" ry="150" transform="rotate(-27 760 300)" fill="none" stroke="url(#orbit-fade)" strokeWidth="1.5" />
      <ellipse cx="760" cy="300" rx="330" ry="112" transform="rotate(-27 760 300)" fill="none" stroke="var(--color-bone-50)" strokeOpacity="0.05" />
      <circle cx="1078" cy="104" r="5" fill="var(--color-signal-500)" opacity="0.8" />
      <circle cx="455" cy="480" r="3" fill="var(--color-blue-400)" opacity="0.7" />
    </svg>
  );
}
