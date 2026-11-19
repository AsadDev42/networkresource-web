import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ArrowIcon({ className, direction = "right" }: { className?: string; direction?: "right" | "up-right" | "down" }) {
  const rotate = direction === "up-right" ? "-rotate-45" : direction === "down" ? "rotate-90" : "";
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={cx("size-4 shrink-0", rotate, className)}>
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type ButtonVariant = "primary" | "ghost" | "light" | "dark";

const buttonBase =
  "group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-full px-6 text-[0.9375rem] font-medium tracking-[-0.01em] transition-[background-color,color,border-color,transform] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.98]";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-signal-500 text-white hover:bg-signal-600",
  ghost: "border border-bone-50/20 text-bone-50 hover:border-bone-50/60 hover:bg-bone-50/5",
  light: "bg-bone-50 text-ink-950 hover:bg-bone-200",
  dark: "bg-ink-950 text-bone-50 hover:bg-ink-800",
};

type ButtonProps = {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
  arrow?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;

export function Button({ href, variant = "primary", children, arrow = variant === "primary", className, ...rest }: ButtonProps) {
  const isExternal = /^(https?:|mailto:|tel:)/.test(href);
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowIcon className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
      )}
    </>
  );
  const classes = cx(buttonBase, buttonVariants[variant], className);
  if (isExternal) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}

export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cx(
        "group inline-flex items-center gap-2 font-medium underline decoration-current/25 decoration-1 underline-offset-[6px] transition-[text-decoration-color] hover:decoration-current",
        className,
      )}
    >
      {children}
      <ArrowIcon className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
    </Link>
  );
}

