import { cx } from "@/components/ui/primitives";

/**
 * Network Resource logo — vector rebuild of the "Orbital Network" mark:
 * four blue nodes, three red nodes, connecting rods and the blue orbital swoosh,
 * with the two-colour "networkresource" wordmark and the "Connect • Manage • Grow" line.
 *
 * variant="color"    → original colours, for light surfaces
 * variant="reversed" → "network" set in bone so the wordmark stays readable on dark surfaces
 */
export function LogoMark({ className, idPrefix = "nr" }: { className?: string; idPrefix?: string }) {
  // Gradient ids; identical definitions, so repeated instances on one page are harmless.
  const id = `${idPrefix}-logo`;
  const blue = `${id}-b`;
  const red = `${id}-r`;
  const swoosh = `${id}-s`;
  const rod = `${id}-rod`;

  const blues: Array<[number, number, number]> = [
    [255, 78, 56],
    [86, 232, 58],
    [442, 232, 57],
    [364, 414, 56],
  ];
  const reds: Array<[number, number, number]> = [
    [260, 190, 31],
    [195, 291, 31],
    [346, 320, 31],
  ];
  const rods: Array<[number, number, number, number]> = [
    [255, 78, 86, 232],
    [255, 78, 442, 232],
    [255, 78, 260, 190],
    [86, 232, 260, 190],
    [86, 232, 195, 291],
    [86, 232, 160, 360],
    [160, 360, 364, 414],
    [260, 190, 195, 291],
    [260, 190, 346, 320],
    [195, 291, 346, 320],
    [195, 291, 160, 360],
    [442, 232, 364, 414],
    [346, 320, 364, 414],
  ];

  return (
    <svg viewBox="0 0 500 480" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={blue} cx="0.36" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#9cc0ff" />
          <stop offset="0.18" stopColor="#3f73ff" />
          <stop offset="0.65" stopColor="#1438b8" />
          <stop offset="1" stopColor="#081d6b" />
        </radialGradient>
        <radialGradient id={red} cx="0.36" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#ffb3b3" />
          <stop offset="0.2" stopColor="#ff2a2a" />
          <stop offset="0.7" stopColor="#c70a0a" />
          <stop offset="1" stopColor="#7d0404" />
        </radialGradient>
        <linearGradient id={swoosh} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0a3fd0" />
          <stop offset="0.55" stopColor="#1e8cf0" />
          <stop offset="1" stopColor="#36b4ff" />
        </linearGradient>
        <linearGradient id={rod} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e9edf3" />
          <stop offset="1" stopColor="#9aa3b0" />
        </linearGradient>
      </defs>

      {/* the orbit: one continuous ring behind the nodes */}
      <ellipse
        cx="252"
        cy="246"
        rx="252"
        ry="88"
        transform="rotate(-27 252 246)"
        fill="none"
        stroke={`url(#${swoosh})`}
        strokeWidth="9"
        opacity="0.9"
      />

      {rods.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#${rod})`} strokeWidth="11" strokeLinecap="round" />
      ))}

      {reds.map(([cx, cy, r], i) => (
        <circle key={`r${i}`} cx={cx} cy={cy} r={r} fill={`url(#${red})`} />
      ))}
      {blues.map(([cx, cy, r], i) => (
        <circle key={`b${i}`} cx={cx} cy={cy} r={r} fill={`url(#${blue})`} />
      ))}

      {/* front half of the same ring, thicker, passing in front of the nodes */}
      <ellipse
        cx="252"
        cy="246"
        rx="252"
        ry="88"
        transform="rotate(-27 252 246)"
        fill="none"
        stroke={`url(#${swoosh})`}
        strokeWidth="17"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="46 54"
        strokeDashoffset="-2"
      />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  variant?: "color" | "reversed";
  tagline?: boolean;
  size?: "sm" | "lg";
};

export function Logo({ className, variant = "reversed", tagline = false, size = "sm" }: LogoProps) {
  const reversed = variant === "reversed";
  return (
    <span className={cx("inline-flex items-center", size === "sm" ? "gap-2.5" : "gap-4", className)}>
      <LogoMark className={size === "sm" ? "h-9 w-auto" : "h-16 w-auto sm:h-20"} />
      <span className="flex flex-col">
        <span
          className={cx(
            "font-[family-name:var(--font-wordmark)] font-semibold leading-none tracking-[-0.025em]",
            size === "sm" ? "text-[1.32rem]" : "text-[2.1rem] sm:text-[2.8rem]",
          )}
        >
          <span className={reversed ? "text-[var(--logo-network)]" : "text-brand-blue"}>network</span>
          <span className="text-brand-red">resource</span>
        </span>
        {tagline && (
          <span
            className={cx(
              "mt-1.5 flex items-center gap-2 font-semibold uppercase leading-none",
              size === "sm" ? "text-[0.5rem] tracking-[0.32em]" : "text-[0.62rem] tracking-[0.34em] sm:text-[0.78rem]",
              reversed ? "text-mist-300" : "text-[#3a3a3a]",
            )}
          >
            <span className={cx("h-px flex-1", reversed ? "bg-mist-400/60" : "bg-[#3a3a3a]")} aria-hidden="true" />
            Connect • Manage • Grow
            <span className={cx("h-px flex-1", reversed ? "bg-mist-400/60" : "bg-[#3a3a3a]")} aria-hidden="true" />
          </span>
        )}
      </span>
    </span>
  );
}
