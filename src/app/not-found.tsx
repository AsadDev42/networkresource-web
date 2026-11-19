import Link from "next/link";
import { OrbitBackdrop } from "@/components/ui/OrbitBackdrop";
import { Button } from "@/components/ui/primitives";
import { navigation } from "@/content/site";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-[var(--header-h)]">
      <OrbitBackdrop />
      <div className="container-x relative">
        <p className="t-label flex items-center gap-3 text-amber-400">
          <span className="size-1.5 rounded-full bg-amber-400" aria-hidden="true" /> 404 · Node unreachable
        </p>
        <h1 className="t-h1 mt-6 max-w-[48rem]">
          This page isn&apos;t on <em className="t-accent text-blue-300">the network.</em>
        </h1>
        <p className="t-lead mt-6 max-w-[34rem] text-mist-300">
          It may have moved when we rebuilt the site. Try one of these instead.
        </p>
        <ul className="mt-10 flex flex-wrap gap-2">
          {navigation.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="inline-flex rounded-full border border-bone-50/15 px-4 py-2 text-mist-300 hover:border-bone-50/50 hover:text-bone-50">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Button href="/">Back to home</Button>
        </div>
      </div>
    </section>
  );
}
