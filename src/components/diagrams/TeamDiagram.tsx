/** NR Complete: the dedicated team arranged around the client. */
const ROLES = [
  { label: "Primary engineer", sub: "Scheduled on-site visits", angle: -90, tone: "var(--color-signal-500)" },
  { label: "Secondary engineer", sub: "Redundancy and backup", angle: -18, tone: "var(--color-signal-400)" },
  { label: "24x7 help desk", sub: "Remote fixes, any hour", angle: 54, tone: "var(--color-blue-400)" },
  { label: "Network Operations Center", sub: "Monitoring and patching", angle: 126, tone: "var(--color-blue-400)" },
  { label: "Account manager", sub: "Your single point of contact", angle: 198, tone: "var(--color-pulse-400)" },
];

export function TeamDiagram() {
  const C = 210;
  const R = 150;
  return (
    <figure className="rounded-[var(--radius-card)] border border-bone-50/10 bg-ink-900/70 p-4 backdrop-blur">
      <svg viewBox="0 0 420 420" className="h-auto w-full" role="img" aria-labelledby="team-title">
        <title id="team-title">
          Your NR Complete team: a primary engineer, a secondary engineer, the 24x7 help desk, the Network Operations
          Center and an account manager, all connected to your business.
        </title>
        <circle cx={C} cy={C} r={R} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 7" />
        <circle cx={C} cy={C} r={R} fill="none" stroke="var(--color-blue-500)" strokeOpacity="0.5" strokeDasharray="40 902" />
        {ROLES.map((r) => {
          const a = (r.angle * Math.PI) / 180;
          const x = C + Math.cos(a) * R;
          const y = C + Math.sin(a) * R;
          const right = Math.cos(a) >= -0.1;
          return (
            <g key={r.label}>
              <line x1={C} y1={C} x2={x} y2={y} stroke="currentColor" strokeOpacity="0.12" />
              <circle cx={x} cy={y} r="8" fill="var(--color-ink-950)" stroke={r.tone} strokeWidth="2" />
              <text x={x + (right ? 16 : -16)} y={y - 2} textAnchor={right ? "start" : "end"} className="fill-current text-[12.5px] font-medium">
                {r.label}
              </text>
              <text x={x + (right ? 16 : -16)} y={y + 14} textAnchor={right ? "start" : "end"} className="fill-[var(--color-mist-400)] text-[10.5px]">
                {r.sub}
              </text>
            </g>
          );
        })}
        <circle cx={C} cy={C} r="46" fill="var(--color-ink-950)" stroke="currentColor" strokeOpacity="0.2" />
        <text x={C} y={C - 2} textAnchor="middle" className="fill-current text-[13px] font-medium">
          Your business
        </text>
        <text x={C} y={C + 15} textAnchor="middle" className="fill-[var(--color-mist-400)] font-mono text-[9px] uppercase tracking-[0.14em]">
          Client portal
        </text>
      </svg>
    </figure>
  );
}
