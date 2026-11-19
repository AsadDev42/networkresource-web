"use client";

import { useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { cx } from "@/components/ui/primitives";

const SERVICES = [
  "Free network assessment",
  "NR Remote plan",
  "NR Complete plan",
  "Network services / project",
  "Network relocation",
  "Advisory consulting",
  "IT distribution (hardware / software)",
  "Partial client list",
  "Something else",
];

const TOPIC_MAP: Record<string, string> = {
  "client-list": "Partial client list",
  remote: "NR Remote plan",
  complete: "NR Complete plan",
  relocation: "Network relocation",
};

type Status = { state: "idle" | "sending" | "sent" | "error"; message?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SALES = "sales@networkresource.com";
/** Optional form service that accepts JSON (Formspree, Basin, a CRM webhook). Set at build time. */
const ENDPOINT = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT;
const noSubscribe = () => () => {};
const clip = (v: FormDataEntryValue | undefined, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  error,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  textarea?: boolean;
}) {
  const id = useId();
  const errId = `${id}-err`;
  const common = {
    id,
    name,
    required,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errId : undefined,
    className: cx(
      "peer w-full rounded-[10px] border bg-ink-950/60 px-4 pb-2.5 pt-6 text-[1rem] text-bone-50 outline-none transition-[border-color,background-color] placeholder:text-transparent focus:border-blue-400 focus:bg-ink-950",
      error ? "border-signal-500" : "border-bone-50/12 hover:border-bone-50/30",
    ),
    placeholder: label,
  };
  return (
    <div className="relative">
      {textarea ? <textarea rows={5} {...common} className={cx(common.className, "resize-y")} /> : <input type={type} {...common} />}
      <label htmlFor={id} className="pointer-events-none absolute left-4 top-2 text-[0.72rem] uppercase tracking-[0.1em] text-mist-400">
        {label}
        {required && <span className="text-signal-400"> *</span>}
      </label>
      {error && (
        <p id={errId} className="mt-1.5 text-[0.85rem] text-signal-400">
          {error}
        </p>
      )}
    </div>
  );
}

/** Links such as /request-a-quote?topic=client-list preselect the service. */
export function QuoteForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // The site is static, so ?topic= is read from the address in the browser (empty while prerendering).
  const search = useSyncExternalStore(noSubscribe, () => window.location.search, () => "");
  const topic = new URLSearchParams(search).get("topic");
  const [picked, setService] = useState<string | null>(null);
  const service = picked ?? (topic ? TOPIC_MAP[topic] : undefined) ?? SERVICES[0];
  const serviceId = useId();
  const resultRef = useRef<HTMLDivElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const focusResult = () => requestAnimationFrame(() => resultRef.current?.focus());

    // Bots fill the hidden field: pretend success and drop it.
    if (clip(raw.website, 200)) {
      setStatus({ state: "sent", message: "Thank you, your request is in." });
      return;
    }
    const data = {
      name: clip(raw.name, 120),
      company: clip(raw.company, 160),
      email: clip(raw.email, 200),
      phone: clip(raw.phone, 40),
      service: clip(raw.service, 80),
      message: clip(raw.message, 4000),
    };
    const found: Record<string, string> = {};
    if (!data.name) found.name = "Please enter your name.";
    if (!EMAIL.test(data.email)) found.email = "Please enter a valid email address.";
    if (data.phone.replace(/\D/g, "").length < 7) found.phone = "Please enter a phone number we can reach you on.";
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus({ state: "error", message: "Please check the highlighted fields." });
      focusResult();
      return;
    }

    if (!ENDPOINT) {
      // No form service yet: hand the request to the visitor's email app, addressed to sales.
      const lines = [`Name: ${data.name}`];
      if (data.company) lines.push(`Company: ${data.company}`);
      lines.push(`Email: ${data.email}`, `Phone: ${data.phone}`, `Interested in: ${data.service}`);
      if (data.message) lines.push("", data.message);
      const body = lines.join("\n");
      window.location.href = `mailto:${SALES}?subject=${encodeURIComponent(`Quote request: ${data.service}`)}&body=${encodeURIComponent(body)}`;
      setStatus({
        state: "sent",
        message: `Your email app has opened with the request filled in. Press send to deliver it to ${SALES}. Nothing opened? Email ${SALES} or call 800.553.7800.`,
      });
      focusResult();
      return;
    }

    setStatus({ state: "sending" });
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ ...data, source: "request-a-quote" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus({ state: "sent", message: "Thank you, your request is in. A Network Resource representative will contact you shortly." });
    } catch {
      setStatus({ state: "error", message: `The request could not be sent. Please email ${SALES} or call 800.553.7800.` });
    }
    focusResult();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4" aria-describedby="form-note">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required autoComplete="name" error={errors.name} />
        <Field label="Company" name="company" autoComplete="organization" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
        <Field label="Phone" name="phone" type="tel" required autoComplete="tel" error={errors.phone} />
      </div>
      <div className="relative">
        <select
          id={serviceId}
          name="service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full appearance-none rounded-[10px] border border-bone-50/12 bg-ink-950/60 px-4 pb-2.5 pt-6 text-[1rem] text-bone-50 outline-none transition-colors hover:border-bone-50/30 focus:border-blue-400"
        >
          {SERVICES.map((s) => (
            <option key={s} value={s} className="bg-ink-900">
              {s}
            </option>
          ))}
        </select>
        <label htmlFor={serviceId} className="pointer-events-none absolute left-4 top-2 text-[0.72rem] uppercase tracking-[0.1em] text-mist-400">
          I&apos;m interested in
        </label>
        <svg viewBox="0 0 10 6" className="pointer-events-none absolute right-4 top-1/2 w-2.5 -translate-y-1/2 text-mist-400" aria-hidden="true">
          <path d="m1 1 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </div>
      <Field label="Message" name="message" textarea />
      {/* honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <p id="form-note" className="text-[0.85rem] text-mist-500">
          Fields marked * are required. We only use your details to respond to this request.
        </p>
        <button
          type="submit"
          disabled={status.state === "sending"}
          className="inline-flex min-h-12 items-center gap-3 rounded-full bg-signal-500 px-7 font-medium text-white transition-colors hover:bg-signal-600 disabled:opacity-60"
        >
          {status.state === "sending" ? "Sending…" : "Send request"}
        </button>
      </div>
      <div ref={resultRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        {status.message && (
          <p
            className={cx(
              "rounded-[10px] border px-4 py-3 text-[0.95rem]",
              status.state === "sent" ? "border-pulse-400/40 bg-pulse-400/10 text-bone-50" : "border-signal-500/40 bg-signal-500/10 text-bone-50",
            )}
          >
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
