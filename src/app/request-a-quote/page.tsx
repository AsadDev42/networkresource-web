import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/sections/shared";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { SplitHeading } from "@/components/ui/Reveal";
import { company } from "@/content/site";

export const metadata: Metadata = {
  title: "Request a Walkthrough or Proposal",
  description:
    "Request a free network assessment, walkthrough or proposal from Network Resource. A sales representative will contact you.",
  alternates: { canonical: "/request-a-quote" },
};

export default function QuotePage() {
  return (
    <section className="relative overflow-hidden pb-24 pt-[calc(var(--header-h)+3.5rem)] md:pt-[calc(var(--header-h)+5rem)]">
      <div className="container-x relative">
        <Breadcrumbs items={[{ label: "Request a quote" }]} />
        <div className="mt-14 grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SplitHeading as="h1" immediate lines={["Request a", "walkthrough or", "*proposal*"]} className="t-h1" />
            <p className="t-lead mt-8 text-mist-300">
              We&apos;re always interested in hearing from clients and new clients who need technology services. Tell us a
              little about your organization and a sales representative will contact you.
            </p>
            <dl className="mt-12 grid gap-5 border-t border-bone-50/[0.08] pt-8">
              <div>
                <dt className="t-label text-mist-500">Prefer to call?</dt>
                <dd className="mt-1">
                  <a href={`tel:${company.phones.tollFree.tel}`} className="text-[1.5rem] font-medium tracking-[-0.03em] hover:text-blue-300">
                    {company.phones.tollFree.display}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="t-label text-mist-500">Or email sales</dt>
                <dd className="mt-1">
                  <a href="mailto:sales@networkresource.com" className="text-mist-300 underline decoration-bone-50/20 underline-offset-4 hover:text-bone-50">
                    sales@networkresource.com
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-[var(--radius-card)] border border-bone-50/10 bg-ink-900/80 p-6 backdrop-blur md:p-9">
              <QuoteForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
