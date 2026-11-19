import { LogoMark } from "@/components/layout/Logo";
import { cx } from "./primitives";

// One tilted ellipse, shared by the visible ring and the motion path, so dots stay exactly on the orbit.
const ORBIT = "M 15 200 a 185 70 0 1 0 370 0 a 185 70 0 1 0 -370 0";
const INNER = "M 70 200 a 130 50 0 1 0 260 0 a 130 50 0 1 0 -260 0";

/**
 * The logo mark inside its orbit. The orbit keeps the logo's tilt; data points travel
 * along it. Motion stops when reduced motion is requested.
 */
export function OrbitMark({ className }: { className?: string }) {
  return (
    <div className={cx("relative aspect-square", className)} aria-hidden="true">
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full overflow-visible">
        <g transform="rotate(-27 200 200)">
          <path d={ORBIT} fill="none" stroke="var(--color-orbit)" strokeOpacity="0.45" strokeWidth="1.5" />
          <path d={INNER} fill="none" stroke="var(--color-bone-50)" strokeOpacity="0.08" strokeDasharray="2 7" />
          <circle r="6" fill="#bfe4ff" className="motion-reduce:hidden">
            <animateMotion dur="9s" repeatCount="indefinite" path={ORBIT} />
          </circle>
          <circle r="4" fill="var(--color-signal-500)" className="motion-reduce:hidden">
            <animateMotion dur="9s" begin="-4.5s" repeatCount="indefinite" path={ORBIT} />
          </circle>
          <circle r="3" fill="var(--color-blue-400)" className="motion-reduce:hidden">
            <animateMotion dur="14s" begin="-3s" repeatCount="indefinite" path={INNER} />
          </circle>
          {/* static points when motion is reduced */}
          <circle cx="385" cy="200" r="6" fill="#bfe4ff" className="hidden motion-reduce:block" />
          <circle cx="15" cy="200" r="4" fill="var(--color-signal-500)" className="hidden motion-reduce:block" />
        </g>
      </svg>
      <div className="absolute left-1/2 top-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2">
        <LogoMark idPrefix="cta" className="w-full" />
      </div>
    </div>
  );
}
