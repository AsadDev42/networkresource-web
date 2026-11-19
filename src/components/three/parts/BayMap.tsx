"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Anchor } from "../Anchor";
import { useScenePalette } from "../sceneTheme";
import {
  AdditiveBlending,
  NormalBlending,
  BufferGeometry,
  Float32BufferAttribute,
  MeshBasicMaterial as BasicMat,
  QuadraticBezierCurve3,
  TubeGeometry,
  Vector3,
  type Mesh,
  Vector2,
  type Group,
  type MeshBasicMaterial,
  type PointsMaterial,
} from "three";
import { company } from "@/content/site";
import { palette } from "../math";

// Simple equirectangular projection, centred on the Palo Alto (Peninsula) office,
// which is where the office diorama sits in the scene.
const ORIGIN = { lat: 37.445, lon: -122.13 };
const K = 500;
const KX = K * Math.cos((ORIGIN.lat * Math.PI) / 180);
export const project = (lat: number, lon: number) => new Vector2((lon - ORIGIN.lon) * KX, -(lat - ORIGIN.lat) * K);

/** Simplified outline of San Francisco Bay (lat, lon). Stylised, not survey-accurate. */
const BAY: Array<[number, number]> = [
  [37.808, -122.475],
  [37.86, -122.46],
  [37.905, -122.43],
  [37.955, -122.44],
  [38.02, -122.37],
  [38.06, -122.27],
  [38.03, -122.2],
  [37.97, -122.3],
  [37.92, -122.33],
  [37.87, -122.305],
  [37.8, -122.29],
  [37.72, -122.2],
  [37.63, -122.15],
  [37.53, -122.06],
  [37.465, -121.975],
  [37.44, -122.02],
  [37.47, -122.11],
  [37.52, -122.2],
  [37.6, -122.33],
  [37.7, -122.375],
  [37.78, -122.385],
  [37.81, -122.41],
];

/** Pacific coastline, west edge of the Peninsula and Marin. */
const COAST: Array<[number, number]> = [
  [38.1, -122.95],
  [37.99, -122.82],
  [37.9, -122.68],
  [37.82, -122.53],
  [37.79, -122.51],
  [37.7, -122.5],
  [37.6, -122.5],
  [37.5, -122.47],
  [37.4, -122.42],
  [37.25, -122.41],
  [37.1, -122.32],
];

const OFFICE_COORDS: Record<string, [number, number]> = {
  Peninsula: [37.445, -122.13],
  "North Bay": [37.767, -122.426],
  "South Bay": [37.404, -121.9],
  "East Bay": [37.856, -122.258],
};

function inPolygon(p: Vector2, poly: Vector2[]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

function westOfCoast(p: Vector2, coast: Vector2[]) {
  // Coast runs north → south; find the segment spanning p.y and compare x.
  for (let i = 0; i < coast.length - 1; i++) {
    const a = coast[i];
    const b = coast[i + 1];
    if ((p.y - a.y) * (p.y - b.y) <= 0) {
      const x = a.x + ((p.y - a.y) / (b.y - a.y)) * (b.x - a.x);
      return p.x < x;
    }
  }
  return false;
}

export function BayMap({ reveal, lowPower = false }: { reveal: () => number; lowPower?: boolean }) {
  const root = useRef<Group>(null);
  const sp = useScenePalette();
  const dots = useRef<PointsMaterial>(null);
  const beacons = useRef<Array<Group | null>>([]);
  const beaconVis = useRef<number[]>([0, 0, 0, 0]);
  const pulses = useRef<Array<Mesh | null>>([]);

  const bay = useMemo(() => BAY.map(([la, lo]) => project(la, lo)), []);
  const coast = useMemo(() => COAST.map(([la, lo]) => project(la, lo)), []);

  // Dot-matrix land: the bay and the ocean are simply where there are no dots.
  const landGeo = useMemo(() => {
    const step = lowPower ? 5 : 3.4;
    const pts: number[] = [];
    for (let x = -230; x <= 200; x += step) {
      for (let z = -330; z <= 140; z += step) {
        const p = new Vector2(x, z);
        if (inPolygon(p, bay) || westOfCoast(p, coast)) continue;
        pts.push(x, 0, z);
      }
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pts, 3));
    return geo;
  }, [bay, coast, lowPower]);

  const offices = useMemo(
    () =>
      company.offices.map((o) => {
        const [lat, lon] = OFFICE_COORDS[o.region];
        return { ...o, pos: project(lat, lon) };
      }),
    [],
  );

  // Arcs from the Peninsula office to the other three: tubes, so they keep a visible width on any background.
  const arcs = useMemo(() => {
    const hq = offices[0].pos;
    return offices.slice(1).map((o) => {
      const a = new Vector3(hq.x, 1, hq.y);
      const b = new Vector3(o.pos.x, 1, o.pos.y);
      const mid = a.clone().lerp(b, 0.5);
      mid.y = a.distanceTo(b) * 0.35;
      const curve = new QuadraticBezierCurve3(a, mid, b);
      const geo = new TubeGeometry(curve, 96, sp.additive ? 0.45 : 0.6, 8, false);
      const mat = new BasicMat({ color: sp.arc, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
      return { curve, geo, mat, count: geo.index ? geo.index.count : 0 };
    });
  }, [offices, sp.arc]);
  useEffect(
    () => () =>
      arcs.forEach(({ geo, mat }) => {
        geo.dispose();
        mat.dispose();
      }),
    [arcs],
  );
  const p = useMemo(() => new Vector3(), []);

  useFrame(({ clock }) => {
    const r = reveal();
    if (root.current) root.current.visible = r > 0.001;
    if (dots.current) dots.current.opacity = r * 0.95;
    arcs.forEach(({ curve, geo, mat, count }, i) => {
      const k = Math.min(1, Math.max(0, (r - 0.45 - i * 0.1) / 0.3));
      // Tube indices run along the curve, so a growing draw range draws the arc from end to end.
      geo.setDrawRange(0, Math.floor((k * count) / 6) * 6);
      mat.opacity = k * (sp.additive ? 0.85 : 0.95);
      const pulse = pulses.current[i];
      if (pulse) {
        pulse.visible = k > 0.98;
        curve.getPoint((clock.elapsedTime * 0.35 + i * 0.33) % 1, p);
        pulse.position.copy(p);
      }
    });
    beacons.current.forEach((b, i) => {
      if (!b) return;
      const k = Math.min(1, Math.max(0, (r - 0.35 - i * 0.12) / 0.25));
      b.visible = k > 0.01;
      b.scale.set(1, Math.max(0.0001, k), 1);
      const ring = b.children[1];
      if (ring) {
        const pulseT = (clock.elapsedTime * 0.5 + i * 0.25) % 1;
        ring.scale.setScalar(1 + pulseT * 3);
        ((ring as unknown as { material: MeshBasicMaterial }).material).opacity = (1 - pulseT) * 0.6 * k;
      }
      beaconVis.current[i] = k;
    });
  });

  return (
    <group ref={root} position={[0, -0.25, 0]} visible={false}>
      <points geometry={landGeo}>
        <pointsMaterial ref={dots} color={sp.dots} size={sp.additive ? 1.7 : 2.4} sizeAttenuation transparent opacity={0} depthWrite={false} />
      </points>
      {arcs.map(({ geo, mat }, i) => (
        <mesh key={i} geometry={geo} material={mat} />
      ))}
      {arcs.map((_, i) => (
        <mesh key={`p${i}`} ref={(el) => void (pulses.current[i] = el)} visible={false}>
          <sphereGeometry args={[1.6, 12, 12]} />
          {sp.additive ? <meshBasicMaterial color={[2.4, 3, 4.5]} toneMapped={false} /> : <meshBasicMaterial color={sp.arc} toneMapped={false} />}
        </mesh>
      ))}
      {offices.map((o, i) => (
        <group key={o.region} position={[o.pos.x, 0, o.pos.y]}>
          <group ref={(el) => void (beacons.current[i] = el)} visible={false}>
            <mesh position={[0, 18, 0]}>
              <cylinderGeometry args={[sp.additive ? 0.5 : 0.7, sp.additive ? 0.5 : 0.7, 36, 12, 1, true]} />
              <meshBasicMaterial color={sp.additive ? [3, 0.4, 0.45] : "#e5161f"} transparent opacity={sp.additive ? 0.7 : 0.85} blending={sp.additive ? AdditiveBlending : NormalBlending} depthWrite={false} toneMapped={false} />
            </mesh>
            <mesh rotation-x={-Math.PI / 2} position={[0, 0.3, 0]}>
              <ringGeometry args={[2.4, 3.2, 48]} />
              <meshBasicMaterial color={palette.signal} transparent opacity={0.6} depthWrite={false} toneMapped={false} />
            </mesh>
          </group>
          <Anchor id={`bay-${i}`} position={[0, 40, 0]} visible={() => beaconVis.current[i] ?? 0} />
        </group>
      ))}
    </group>
  );
}
