import { Vector3 } from "three";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Hermite smoothstep between edges a and b. */
export function smooth(a: number, b: number, v: number) {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
}

export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** A 0..1 window inside a 0..1 progress value. */
export const range = (v: number, start: number, end: number) => clamp01((v - start) / (end - start));

export const v3 = (x: number, y: number, z: number) => new Vector3(x, y, z);

/** Status codes shared by workstations and rack units. */
export const STATUS = { off: 0, ok: 1, alert: 2 } as const;
export type Status = (typeof STATUS)[keyof typeof STATUS];

export const palette = {
  ink950: "#07090d",
  ink900: "#0c1017",
  ink850: "#10151e",
  ink800: "#141a24",
  ink700: "#1d2430",
  ink600: "#2a3342",
  mist400: "#8a94a6",
  bone50: "#f3f1ec",
  bone200: "#dcd8cf",
  signal: "#e5161f", // brand red
  blue: "#2f6bff", // brand blue, lifted for dark
  blueGlow: "#7aa4ff",
  orbit: "#1e8cf0",
  pulse: "#5be3a6",
  amber: "#ffb547",
  screen: "#c9d6ea",
  crate: "#b9a27f",
};

/** Layout of one office floor (shared by the "current" and the "new" office). */
export const FLOOR = { width: 13, depth: 9 };
export const DESKS: Array<[number, number]> = [
  [-3.2, -0.6],
  [-1.0, -0.6],
  [1.2, -0.6],
  [3.4, -0.6],
  [-3.2, 2.1],
  [-1.0, 2.1],
  [1.2, 2.1],
  [3.4, 2.1],
];
export const RACK_POS: [number, number, number] = [-5.3, 0.1, -3.3];
export const DOOR_POS: [number, number, number] = [6.2, 0.1, 4.0];
export const FLOOR_B_OFFSET = 24;
/** Index of the workstation that raises an alert in the "Watched 24/7" chapter. */
export const ALERT_DESK = 6;
