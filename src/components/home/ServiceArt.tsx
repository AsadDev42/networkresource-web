/** Line illustrations for each service, drawn in the brand palette. Animated with CSS on hover of the parent `.group`. */

const stroke = { fill: "none", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function RackArt() {
  return (
    <svg viewBox="0 0 240 200" className="h-full w-full" aria-hidden="true">
      <rect x="70" y="20" width="100" height="160" rx="8" stroke="var(--color-mist-500)" {...stroke} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} className="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-[var(--dx)]" style={{ ["--dx" as string]: `${(i % 2 ? 1 : -1) * (6 + i * 2)}px` }}>
          <rect x="78" y={30 + i * 24} width="84" height="18" rx="3" fill="var(--color-ink-900)" stroke="var(--color-ink-600)" strokeWidth="1.2" />
          <rect x="128" y={37 + i * 24} width="24" height="3" rx="1.5" fill={i === 0 ? "var(--color-signal-500)" : i === 4 ? "var(--color-pulse-400)" : "var(--color-blue-400)"} />
          <circle cx="88" cy={39 + i * 24} r="2" fill="var(--color-blue-300)" />
        </g>
      ))}
      <path d="M20 170 H70 M170 60 H220" stroke="var(--color-blue-500)" {...stroke} strokeDasharray="4 6" />
    </svg>
  );
}

export function MoveArt() {
  return (
    <svg viewBox="0 0 240 200" className="h-full w-full" aria-hidden="true">
      <path d="M20 150 l50 -25 l50 25 l-50 25 z" stroke="var(--color-mist-500)" {...stroke} />
      <path d="M120 150 l50 -25 l50 25 l-50 25 z" stroke="var(--color-blue-400)" {...stroke} />
      <path d="M70 130 C 95 40, 145 40, 170 130" stroke="var(--color-signal-500)" {...stroke} strokeDasharray="5 6" />
      <g className="transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:translate-x-[100px]">
        <rect x="58" y="96" width="24" height="18" rx="2" fill="#b9a27f" />
        <path d="M58 103 h24" stroke="#8c7757" strokeWidth="2" />
      </g>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={150 + i * 14} cy={148 + (i % 2) * 6} r="3" fill="var(--color-pulse-400)" />
      ))}
    </svg>
  );
}

export function AdviseArt() {
  return (
    <svg viewBox="0 0 240 200" className="h-full w-full" aria-hidden="true">
      <circle cx="120" cy="100" r="62" stroke="var(--color-ink-600)" {...stroke} />
      <circle cx="120" cy="100" r="62" stroke="var(--color-blue-500)" {...stroke} strokeDasharray="90 300" />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        return <circle key={i} cx={120 + Math.cos(a) * 62} cy={100 + Math.sin(a) * 62} r="6" fill="var(--color-ink-950)" stroke="var(--color-blue-300)" strokeWidth="1.5" />;
      })}
      <circle cx="120" cy="100" r="16" fill="var(--color-signal-500)" />
    </svg>
  );
}

export function SupplyArt() {
  return (
    <svg viewBox="0 0 240 200" className="h-full w-full" aria-hidden="true">
      {[
        [60, 120],
        [120, 120],
        [90, 72],
      ].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x} ${y} l30 -14 l30 14 l-30 14 z`} fill="var(--color-ink-800)" stroke="var(--color-blue-400)" strokeWidth="1.3" />
          <path d={`M${x} ${y} v34 l30 14 v-34 z`} fill="var(--color-ink-900)" stroke="var(--color-blue-400)" strokeWidth="1.3" />
          <path d={`M${x + 60} ${y} v34 l-30 14 v-34 z`} fill="var(--color-ink-850,#10151e)" stroke="var(--color-blue-400)" strokeWidth="1.3" />
        </g>
      ))}
      <circle cx="190" cy="50" r="5" fill="var(--color-signal-500)" />
    </svg>
  );
}
