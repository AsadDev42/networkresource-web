import Image from "next/image";
import Link from "next/link";
import heroPhoto from "@/assets/hero-support.jpg";
import { company, coreServices } from "@/content/site";
import { ArrowIcon, Button } from "@/components/ui/primitives";

const ICONS: Record<(typeof coreServices)[number]["key"], React.ReactNode> = {
  managed: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4M8.5 10l2.5 2.5 4.5-4.5" />
    </>
  ),
  security: <path d="M12 3 5 6v5.5c0 4.2 2.9 7.9 7 9.5 4.1-1.6 7-5.3 7-9.5V6l-7-3Zm-3 9 2 2 4-4" />,
  network: (
    <>
      <rect x="9" y="3" width="6" height="5" rx="1" />
      <rect x="3" y="16" width="6" height="5" rx="1" />
      <rect x="15" y="16" width="6" height="5" rx="1" />
      <path d="M12 8v4M6 16v-4h12v4" />
    </>
  ),
  relocation: (
    <>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  property: (
    <>
      <path d="M4 21V6l8-3v18M12 9l8 3v9M2 21h20" />
      <path d="M7.5 9h1M7.5 12.5h1M7.5 16h1M15.5 14h1M15.5 17.5h1" />
    </>
  ),
};

const REGIONS = company.offices.map((o) => o.city);

/** Homepage opening: headline and Bay Area positioning on the left, a photo of our people on the right,
 *  and the five core services as large buttons underneath. */
export function HomeHero() {
  return (
    <section className="relative bg-ink-950 pb-16 pt-[calc(var(--header-h)+2.5rem)] md:pb-20 lg:pt-[calc(var(--header-h)+3.5rem)]" aria-labelledby="hero-heading">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="flex items-center gap-3 text-[0.95rem] font-semibold text-bone-50">
            <span className="h-5 w-1 rounded-full bg-signal-500" aria-hidden="true" />
            San Francisco Bay Area IT partner since {company.founded}
          </p>
          <h1
            id="hero-heading"
            className="mt-6 font-display text-[clamp(2.6rem,7vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-bone-50 lg:text-[clamp(2.9rem,4.6vw,4.7rem)]"
          >
            <span className="sm:whitespace-nowrap">Business IT Support.</span>
            <br />
            Simplified<span className="text-signal-500">.</span>
          </h1>
          <p className="mt-7 max-w-[34rem] text-[1.15rem] leading-relaxed text-mist-300">
            Practical, responsive IT support, cybersecurity and network engineering for small and midsize businesses and
            property management teams across the San Francisco Bay Area.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button href="/request-a-quote">Request a consultation</Button>
            <a
              href={`tel:${company.phones.tollFree.tel}`}
              className="inline-flex items-center gap-2 font-semibold text-bone-50 underline decoration-current/25 underline-offset-[6px] transition-[text-decoration-color] hover:decoration-current"
            >
              Call {company.phones.tollFree.display}
            </a>
          </div>
          <p className="mt-10 text-[0.95rem] text-mist-400">
            <span className="font-semibold text-bone-50">Offices in </span>
            {REGIONS.slice(0, -1).join(", ")} and {REGIONS[REGIONS.length - 1]}
          </p>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative overflow-hidden rounded-[24px] bg-ink-800">
            <Image
              src={heroPhoto}
              alt="An IT engineer and a client working through an issue together at an office desk"
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="aspect-[4/3] h-auto w-full object-cover object-[35%_center] lg:aspect-[5/4.4]"
            />
          </div>
          <div className="absolute -bottom-6 left-4 flex gap-6 rounded-2xl border border-bone-50/10 bg-ink-900 px-5 py-4 shadow-[0_18px_40px_-20px_rgba(10,16,32,0.35)] sm:left-6">
            <div>
              <p className="font-display text-[1.6rem] font-semibold leading-none tracking-[-0.03em] text-bone-50">{company.retention}</p>
              <p className="mt-1.5 text-[0.8rem] text-mist-400">client retention</p>
            </div>
            <span className="w-px bg-bone-50/10" aria-hidden="true" />
            <div>
              <p className="font-display text-[1.6rem] font-semibold leading-none tracking-[-0.03em] text-bone-50">{company.offices.length}</p>
              <p className="mt-1.5 text-[0.8rem] text-mist-400">Bay Area offices</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x mt-20 md:mt-24">
        <h2 className="sr-only">Our services</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {coreServices.map((s) => (
            <li key={s.key}>
              <Link
                href={s.href}
                className="group flex h-full items-center gap-4 rounded-[18px] border border-bone-50/10 bg-ink-900 p-4 shadow-[0_1px_2px_rgba(10,16,32,0.04)] transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-blue-400/60 hover:shadow-[0_18px_36px_-22px_rgba(18,58,156,0.45)] focus-visible:-translate-y-1 sm:flex-col sm:items-stretch sm:gap-0 sm:p-5"
              >
                <span className="flex shrink-0 items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-[#123a9c] text-white transition-colors duration-300 group-hover:bg-signal-500">
                    <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {ICONS[s.key]}
                    </svg>
                  </span>
                  <ArrowIcon className="hidden text-mist-500 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-signal-500 sm:block" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col sm:mt-6">
                  <span className="font-display text-[1.05rem] font-semibold leading-snug tracking-[-0.02em] text-bone-50 sm:text-[1.12rem]">{s.title}</span>
                  <span className="mt-1 text-[0.88rem] leading-snug text-mist-400 sm:mt-1.5 sm:text-[0.9rem]">{s.line}</span>
                </span>
                <ArrowIcon className="shrink-0 text-mist-500 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-signal-500 sm:hidden" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[0.95rem] text-mist-400">
          Also available:{" "}
          <Link href="/services/advisory-consulting" className="font-semibold text-bone-50 underline decoration-current/25 underline-offset-4 hover:decoration-current">
            advisory consulting
          </Link>{" "}
          and{" "}
          <Link href="/it-distribution" className="font-semibold text-bone-50 underline decoration-current/25 underline-offset-4 hover:decoration-current">
            IT distribution
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
