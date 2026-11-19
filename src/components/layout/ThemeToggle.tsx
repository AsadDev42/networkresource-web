"use client";

import { setTheme, useTheme } from "@/lib/theme";
import { cx } from "@/components/ui/primitives";

/** Switches between the dark and light themes; the 3D scenes follow. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={cx(
        "relative grid size-10 place-items-center overflow-hidden rounded-full border border-bone-50/15 text-bone-50 transition-colors hover:border-bone-50/40",
        className,
      )}
    >
      {/* sun */}
      <svg
        viewBox="0 0 24 24"
        className={cx("absolute size-[18px] transition-[transform,opacity] duration-500", theme === "light" ? "rotate-0 opacity-100" : "rotate-90 opacity-0")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      {/* moon */}
      <svg
        viewBox="0 0 24 24"
        className={cx("absolute size-[17px] transition-[transform,opacity] duration-500", theme === "dark" ? "rotate-0 opacity-100" : "-rotate-90 opacity-0")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
