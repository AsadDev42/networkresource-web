/**
 * Mutable state shared between the DOM scroll timeline and the WebGL scene.
 * Written by ScrollTrigger / pointer / resize listeners, read every frame inside useFrame.
 * Kept outside React state on purpose: it changes every frame and must not re-render.
 */

/** A rectangle of the viewport in 0..1 units (x0,y0 = top-left). */
export type Region = { x0: number; y0: number; x1: number; y1: number };

/** Defaults until the real text blocks are measured: text left → free space right, etc. */
const RIGHT: Region = { x0: 0.48, y0: 0.1, x1: 0.96, y1: 0.97 };
const LEFT: Region = { x0: 0.03, y0: 0.1, x1: 0.52, y1: 0.97 };

export const storyState = {
  /** Continuous chapter position: 0 = hero … 5 = Bay Area, fractional part = progress inside a chapter. */
  chapter: 0,
  /** chapter, eased every frame by the scene, so 3D motion stays smooth even when the scroll jumps. */
  smooth: 0,
  smoothReady: false,
  pointerX: 0,
  pointerY: 0,
  /** Per chapter: the part of the screen NOT covered by that chapter's text. The camera fits the 3D inside it. */
  regions: [RIGHT, LEFT, RIGHT, LEFT, RIGHT, RIGHT] as Region[],
};

export const CHAPTERS = [
  { id: "hero", label: "Overview" },
  { id: "closet", label: "Network services" },
  { id: "noc", label: "Watched 24/7" },
  { id: "onsite", label: "People on site" },
  { id: "relocation", label: "Moving offices" },
  { id: "bay", label: "Bay Area" },
] as const;

/** Local progress at which a chapter's own animation is "settled" (used for reduced motion). */
export const SETTLED = [0, 0.45, 0.6, 0.7, 0.84, 0.7];
/** Local progress at which the camera starts travelling to the next chapter. */
export const TRAVEL_START = [0.45, 0.68, 0.68, 0.68, 0.84, 1];
