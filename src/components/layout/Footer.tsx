import Link from "next/link";
import { company, navigation } from "@/content/site";
import { Logo } from "./Logo";
import { ArrowIcon } from "@/components/ui/primitives";

export function Footer() {
  const phones = Object.values(company.phones);
  return (
    <footer className="relative border-t border-bone-50/[0.07] bg-ink-950 pt-20 text-bone-50">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tagline />
            <p className="mt-6 max-w-sm text-mist-400">
              The outsourced IT department for Bay Area businesses since {company.founded}. Flat-fee support, 24/7.
            </p>
            <Link
              href="/request-a-quote"
              className="group mt-8 inline-flex items-center gap-3 text-[1.05rem] font-medium text-bone-50"
            >
              <span className="underline decoration-signal-500 decoration-1 underline-offset-[6px]">Book a free network assessment</span>
              <ArrowIcon className="text-signal-500 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5">
            {navigation
              .filter((g) => g.children)
              .map((group) => (
                <div key={group.label}>
                  <p className="t-label text-mist-500">{group.label}</p>
                  <ul className="mt-4 grid gap-2.5 text-[0.95rem]">
                    {group.children!.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="text-mist-300 transition-colors hover:text-bone-50">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            <div>
              <p className="t-label text-mist-500">Company</p>
              <ul className="mt-4 grid gap-2.5 text-[0.95rem]">
                {[
                  ["Partners", "/partners"],
                  ["Contact", "/contact"],
                  ["Request form", "/request-a-quote"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-mist-300 transition-colors hover:text-bone-50">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="lg:col-span-3">
            <p className="t-label text-mist-500">Call us</p>
            <ul className="mt-4 grid gap-2 font-mono text-[0.85rem]">
              {phones.map((p) => (
                <li key={p.label} className="flex justify-between gap-4 border-b border-bone-50/[0.06] pb-2">
                  <span className="text-mist-500">{p.label}</span>
                  {p.label === "Fax" ? (
                    <span className="text-mist-300">{p.display}</span>
                  ) : (
                    <a href={`tel:${p.tel}`} className="text-mist-300 hover:text-bone-50">
                      {p.display}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <a href="mailto:sales@networkresource.com" className="mt-5 block text-[0.95rem] text-mist-300 hover:text-bone-50">
              sales@networkresource.com
            </a>
          </div>
        </div>

        <ul className="mt-20 grid gap-8 border-t border-bone-50/[0.07] py-10 sm:grid-cols-2 lg:grid-cols-4">
          {company.offices.map((o) => (
            <li key={o.region}>
              <p className="t-label text-signal-500">{o.region}</p>
              <address className="mt-2 text-[0.92rem] not-italic leading-relaxed text-mist-400">
                {o.street}
                <br />
                {o.city}, {o.state} {o.zip}
              </address>
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-hidden border-t border-bone-50/[0.07]">
        <p
          aria-hidden="true"
          className="container-x select-none whitespace-nowrap pt-6 text-[clamp(3.5rem,13.5vw,13rem)] font-medium leading-[0.8] tracking-[-0.06em] text-bone-50/[0.05]"
        >
          Network Resource
        </p>
      </div>
      <div className="container-x flex flex-col justify-between gap-3 border-t border-bone-50/[0.07] py-6 text-[0.8rem] text-mist-500 sm:flex-row">
        <p>© {new Date().getFullYear()} Network Resource. All rights reserved.</p>
        <p>Mailing: {company.mailing}</p>
      </div>
    </footer>
  );
}
