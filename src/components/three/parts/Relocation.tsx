"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Anchor, getLabel } from "../Anchor";
import {
  BufferGeometry,
  Line as ThreeLine,
  LineDashedMaterial,
  QuadraticBezierCurve3,
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
} from "three";
import { DESKS, FLOOR, FLOOR_B_OFFSET, RACK_POS, palette, range, smooth, STATUS, type Status } from "../math";
import { MODELS, Prop } from "./Props";

/** The five published steps of a Network Resource relocation, as 0..1 windows of the sequence. */
export const RELOCATION_PHASES = [
  { name: "Analysis", start: 0, end: 0.16 },
  { name: "Planning", start: 0.16, end: 0.32 },
  { name: "Moving", start: 0.32, end: 0.64 },
  { name: "Testing", start: 0.64, end: 0.82 },
  { name: "Going live", start: 0.82, end: 1 },
] as const;

export function relocationPhase(t: number) {
  const i = RELOCATION_PHASES.findIndex((p) => t < p.end);
  return i === -1 ? RELOCATION_PHASES.length - 1 : i;
}

/** Item 0..7 are workstations, item 8 is the rack. */
const ITEMS = DESKS.length + 1;

/** Per item: when it packs (desk folds away, crate drops in), lifts off, and lands in the new office. */
function itemWindow(i: number) {
  const pack = 0.3 + i * 0.018;
  const depart = pack + 0.07;
  const land = depart + 0.13;
  return { pack, depart, land };
}

/** Ease-out with a small overshoot, so a crate settles instead of popping. */
const backOut = (x: number) => {
  const c = 1.6;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};

/** Pure function of relocation progress: what each office shows. */
export function relocationState(t: number) {
  return {
    deskScaleA: (i: number) => 1 - smooth(itemWindow(i).pack, itemWindow(i).pack + 0.06, t),
    deskScaleB: (i: number) => smooth(itemWindow(i).land, itemWindow(i).land + 0.06, t),
    statusB: (i: number): Status => {
      const tested = 0.66 + (i / ITEMS) * 0.14;
      if (t < itemWindow(i).land + 0.04) return STATUS.off;
      return t < tested ? STATUS.alert : STATUS.ok;
    },
    powerA: () => 1 - smooth(0.3, 0.36, t),
    powerB: () => smooth(0.64, 0.7, t) * 0.6 + smooth(0.82, 0.9, t) * 0.4,
    highlightA: () => (t > 0 && t < 0.16 ? 1 - Math.abs(range(t, 0, 0.16) - 0.5) * 2 : 0),
    highlightB: () => smooth(0.82, 0.9, t) * (1 - smooth(0.97, 1, t) * 0.5),
  };
}

function itemPosition(i: number, offsetX: number) {
  if (i === DESKS.length) return new Vector3(RACK_POS[0] + offsetX, 0.6, RACK_POS[2]);
  const [x, z] = DESKS[i];
  return new Vector3(x + offsetX, 0.55, z);
}

/** Crates, scanner and the planned route between the current and the new office. */
export function RelocationRig({ progress, labels = true, detailed = false }: { progress: () => number; labels?: boolean; detailed?: boolean }) {
  const crates = useRef<Array<Group | null>>([]);
  const scanner = useRef<Mesh>(null);
  const routeMat = useMemo(
    () => new LineDashedMaterial({ color: palette.signal, dashSize: 0.35, gapSize: 0.22, transparent: true, opacity: 0.9 }),
    [],
  );
  const phaseVis = useRef(0);

  const curves = useMemo(
    () =>
      Array.from({ length: ITEMS }, (_, i) => {
        const a = itemPosition(i, 0);
        const b = itemPosition(i, FLOOR_B_OFFSET);
        const mid = a.clone().lerp(b, 0.5);
        mid.y = 5.5 + (i % 3) * 0.6;
        return new QuadraticBezierCurve3(a, mid, b);
      }),
    [],
  );

  const route = useMemo(() => {
    const curve = new QuadraticBezierCurve3(new Vector3(0, 0.3, 4.9), new Vector3(FLOOR_B_OFFSET / 2, 4, 6.5), new Vector3(FLOOR_B_OFFSET, 0.3, 4.9));
    const geo = new BufferGeometry().setFromPoints(curve.getPoints(120));
    const line = new ThreeLine(geo, routeMat);
    line.computeLineDistances();
    return line;
  }, [routeMat]);

  const pos = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const t = progress();
    const phase = relocationPhase(t);

    // Analysis: a scanning plane passes over both floors.
    if (scanner.current) {
      const s = range(t, 0.02, 0.16);
      scanner.current.visible = t > 0.02 && t < 0.16;
      const x = -FLOOR.width / 2 + s * (FLOOR_B_OFFSET + FLOOR.width);
      scanner.current.position.set(x, 1.4, 0);
      (scanner.current.material as MeshBasicMaterial).opacity = 0.16 * Math.sin(s * Math.PI);
    }

    // Planning: the route is drawn.
    const draw = range(t, 0.17, 0.3);
    route.geometry.setDrawRange(0, Math.floor(draw * 121));
    routeMat.opacity = 0.85 * (1 - smooth(0.66, 0.74, t));
    route.visible = draw > 0;

    // Moving: crates appear, fly the arc and land.
    crates.current.forEach((c, i) => {
      if (!c) return;
      const w = itemWindow(i);
      // The crate drops in as the desk folds away, then shrinks into the new desk as it unfolds.
      const appear = range(t, w.pack + 0.02, w.pack + 0.07);
      const gone = smooth(w.land, w.land + 0.06, t);
      const s = (appear > 0 ? backOut(appear) : 0) * (1 - gone);
      c.visible = s > 0.01;
      c.scale.setScalar(Math.max(0.0001, s));
      const travel = smooth(w.depart, w.land, t);
      curves[i].getPoint(travel, pos);
      c.position.copy(pos);
      c.position.y += (1 - smooth(0, 1, appear)) * 0.9;
      c.rotation.y = travel * Math.PI * 0.5;
      c.rotation.z = Math.sin(travel * Math.PI) * 0.12;
    });

    phaseVis.current = t > 0.005 && t < 0.995 ? 1 : 0;
    const text = getLabel("reloc-phase")?.querySelector<HTMLElement>("[data-text]");
    const value = `${String(phase + 1).padStart(2, "0")} · ${RELOCATION_PHASES[phase].name}`;
    if (text && text.textContent !== value) text.textContent = value;
  });

  return (
    <group>
      <mesh ref={scanner} visible={false}>
        <boxGeometry args={[0.08, 2.8, FLOOR.depth + 0.6]} />
        <meshBasicMaterial color={palette.blueGlow} transparent opacity={0.15} depthWrite={false} toneMapped={false} />
      </mesh>
      <primitive object={route} />
      {curves.map((_, i) => (
        <group key={i} ref={(el) => void (crates.current[i] = el)} visible={false}>
          {detailed ? (
            // model stands on y = 0; the crate's pivot is its centre
            <Prop url={MODELS.box} size={i === DESKS.length ? [0.9, 1.1, 0.9] : [0.8, 0.6, 0.6]} position={[0, i === DESKS.length ? -0.55 : -0.3, 0]} />
          ) : (
            <>
              <mesh castShadow>
                <boxGeometry args={i === DESKS.length ? [0.9, 1.1, 0.9] : [0.8, 0.6, 0.6]} />
                <meshStandardMaterial color={palette.crate} roughness={0.85} />
              </mesh>
              <mesh>
                <boxGeometry args={i === DESKS.length ? [0.92, 0.08, 0.92] : [0.82, 0.06, 0.62]} />
                <meshStandardMaterial color="#8c7757" roughness={0.9} />
              </mesh>
            </>
          )}
        </group>
      ))}
      {labels && <Anchor id="reloc-phase" position={[FLOOR_B_OFFSET / 2, 4.6, 6.5]} visible={() => phaseVis.current} />}
    </group>
  );
}
