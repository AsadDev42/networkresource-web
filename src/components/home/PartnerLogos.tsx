import { siApple, siCisco, siDell, siSonicwall, siVonage } from "simple-icons";

type Partner = { name: string; role: string; hex: string; path?: string; custom?: "microsoft" };

/** Partners listed on Network Resource's original site, with the relationship stated there. */
const PARTNERS: Partner[] = [
  { name: "Microsoft", role: "Microsoft Certified Partner", hex: "00A4EF", custom: "microsoft" },
  { name: "Apple", role: "Authorized Business Agent", hex: siApple.hex, path: siApple.path },
  { name: "Cisco", role: "Certified services", hex: siCisco.hex, path: siCisco.path },
  { name: "SonicWALL", role: "Certified · Internet security", hex: siSonicwall.hex, path: siSonicwall.path },
  { name: "Dell", role: "Hardware partner", hex: siDell.hex, path: siDell.path },
  { name: "Vonage", role: "Internet telephony", hex: siVonage.hex, path: siVonage.path },
];

function Mark({ p }: { p: Partner }) {
  if (p.custom === "microsoft") {
    // The four-square Microsoft mark.
    return (
      <svg viewBox="0 0 24 24" className="size-9" aria-hidden="true">
        <rect x="1" y="1" width="10.5" height="10.5" fill="#F25022" />
        <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7FBA00" />
        <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00A4EF" />
        <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900" />
      </svg>
    );
  }
  const brand = p.hex === "000000" ? "currentColor" : `#${p.hex}`;
  return (
    <svg viewBox="0 0 24 24" className="size-9" aria-hidden="true">
      <path d={p.path} fill={brand} />
    </svg>
  );
}

export function PartnerLogos() {
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-bone-50/10 bg-bone-50/10 sm:grid-cols-3 lg:grid-cols-6">
      {PARTNERS.map((p) => (
        <li key={p.name} className="group flex flex-col items-start gap-6 bg-ink-900 p-6 transition-colors duration-300 hover:bg-ink-850 md:p-7">
          <span className="grid size-14 place-items-center rounded-2xl border border-bone-50/10 bg-ink-950 text-bone-50">
            <Mark p={p} />
          </span>
          <span>
            <span className="block font-display text-[1.15rem] font-semibold tracking-[-0.02em] text-bone-50">{p.name}</span>
            <span className="mt-1 block text-[0.85rem] leading-snug text-mist-400">{p.role}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
