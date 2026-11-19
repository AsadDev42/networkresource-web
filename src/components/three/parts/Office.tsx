"use client";

import { useEffect, useMemo, useRef } from "react";
import { useScenePalette } from "../sceneTheme";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import {
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  Group,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
  RepeatWrapping,
  SRGBColorSpace,
  Vector3,
  type Mesh,
} from "three";
import { DESKS, FLOOR, RACK_POS, palette, STATUS, type Status } from "../math";
import { MODELS, Prop } from "./Props";

export type OfficeDrivers = {
  /** 0..1 scale of each workstation (0 = packed away). */
  deskScale?: (i: number) => number;
  /** Status light for each workstation. */
  deskStatus?: (i: number) => Status;
  /** 0..1 overall power: screens, cables and packets. */
  power?: () => number;
  /** 0..1 floor-edge highlight. */
  highlight?: () => number;
};

const tmp = new Object3D();
const UP = new Vector3(0, 1, 0);
const statusColors: Record<Status, Color> = {
  [STATUS.off]: new Color(palette.ink600),
  [STATUS.ok]: new Color(palette.pulse),
  [STATUS.alert]: new Color(palette.amber),
};

/* ───────────── Monitor content: small dashboards drawn once into canvas textures ───────────── */
const screenCache: CanvasTexture[] = [];
function screenTexture(variant: number) {
  if (screenCache[variant]) return screenCache[variant];
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 160;
  const g = c.getContext("2d")!;
  g.fillStyle = "#081120";
  g.fillRect(0, 0, 256, 160);
  g.fillStyle = "#12203a";
  g.fillRect(0, 0, 256, 18);
  ["#e5161f", "#ffb547", "#5be3a6"].forEach((col, i) => {
    g.fillStyle = col;
    g.beginPath();
    g.arc(10 + i * 10, 9, 3, 0, Math.PI * 2);
    g.fill();
  });
  g.fillStyle = "#1a2c4d";
  g.fillRect(8, 26, 60, 126);
  for (let i = 0; i < 7; i++) {
    g.fillStyle = i === variant % 7 ? "#2f6bff" : "#24385e";
    g.fillRect(14, 34 + i * 16, 48, 8);
  }
  // chart
  g.strokeStyle = variant % 2 ? "#5be3a6" : "#5c8bff";
  g.lineWidth = 2.5;
  g.beginPath();
  for (let x = 0; x <= 170; x += 10) {
    const y = 90 - Math.sin(x / 22 + variant) * 22 - (x / 170) * 18;
    if (x === 0) g.moveTo(78 + x, y);
    else g.lineTo(78 + x, y);
  }
  g.stroke();
  // bars
  for (let i = 0; i < 9; i++) {
    const h = 14 + ((i * 37 + variant * 11) % 34);
    g.fillStyle = i % 4 === 0 ? "#e5161f" : "#2f6bff";
    g.fillRect(80 + i * 19, 150 - h, 11, h);
  }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  screenCache[variant] = tex;
  return tex;
}

/* ───────────── Procedural surface textures: wood grain and carpet tiles, drawn once per theme ───────────── */
const texCache = new Map<string, CanvasTexture>();

/** Rand that is stable between renders, so textures look the same on every load. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function woodTexture(kind: "oak" | "walnut") {
  const key = "wood" + kind;
  const hit = texCache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 256;
  const g = c.getContext("2d")!;
  const rnd = seeded(kind === "oak" ? 7 : 11);
  const base = kind === "oak" ? [205, 172, 128] : [92, 64, 46];
  g.fillStyle = `rgb(${base.join(",")})`;
  g.fillRect(0, 0, c.width, c.height);
  // long grain lines that drift slowly, with darker late-wood bands
  for (let i = 0; i < 140; i++) {
    const y0 = rnd() * c.height;
    const amp = 2 + rnd() * 6;
    const freq = 0.002 + rnd() * 0.006;
    const phase = rnd() * Math.PI * 2;
    const dark = rnd() < 0.35;
    const a = dark ? 0.1 + rnd() * 0.12 : 0.04 + rnd() * 0.06;
    g.strokeStyle = dark ? `rgba(60,36,20,${a})` : `rgba(255,240,215,${a})`;
    g.lineWidth = dark ? 1 + rnd() * 2.5 : 0.6 + rnd();
    g.beginPath();
    for (let x = 0; x <= c.width; x += 16) {
      const y = y0 + Math.sin(x * freq + phase) * amp;
      if (x === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
  }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  texCache.set(key, tex);
  return tex;
}

function carpetTexture(color: string, seam: string) {
  const key = "carpet" + color;
  const hit = texCache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d")!;
  const rnd = seeded(3);
  g.fillStyle = color;
  g.fillRect(0, 0, 512, 512);
  // fibre noise
  const img = g.getImageData(0, 0, 512, 512);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rnd() - 0.5) * 18;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  // 4 × 4 carpet tiles, each laid at 90° to its neighbour (subtle stripe direction change)
  for (let ty = 0; ty < 4; ty++)
    for (let tx = 0; tx < 4; tx++) {
      const x = tx * 128;
      const y = ty * 128;
      g.strokeStyle = "rgba(0,0,0,0.035)";
      g.lineWidth = 1;
      for (let k = 6; k < 128; k += 6) {
        g.beginPath();
        if ((tx + ty) % 2) {
          g.moveTo(x + k, y);
          g.lineTo(x + k, y + 128);
        } else {
          g.moveTo(x, y + k);
          g.lineTo(x + 128, y + k);
        }
        g.stroke();
      }
      g.strokeStyle = seam;
      g.lineWidth = 2;
      g.strokeRect(x + 1, y + 1, 126, 126);
    }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.anisotropy = 8;
  texCache.set(key, tex);
  return tex;
}

/** Width of the glowing border strip around each office floor. */
const EDGE = 0.06;

const deskMat = new MeshStandardMaterial({ color: "#ffffff", roughness: 0.48, metalness: 0 });
const darkMat = new MeshStandardMaterial({ color: "#10151d", roughness: 0.5, metalness: 0.5 });
const metalMat = new MeshStandardMaterial({ color: "#8b95a6", roughness: 0.25, metalness: 0.95 });
const fabricMat = new MeshStandardMaterial({ color: "#1d2533", roughness: 0.95, metalness: 0 });

/** Task chair: cushioned seat and back, armrests, gas lift and a five-star base on casters. */
function Chair() {
  return (
    <group position={[0, 0, 0.78]} rotation-y={Math.PI}>
      <RoundedBox args={[0.52, 0.1, 0.5]} radius={0.045} smoothness={4} position={[0, 0.49, 0]} material={fabricMat} castShadow />
      <RoundedBox args={[0.48, 0.58, 0.08]} radius={0.05} smoothness={4} position={[0, 0.86, -0.24]} rotation-x={-0.14} material={fabricMat} castShadow />
      {/* back support */}
      <mesh position={[0, 0.62, -0.25]} rotation-x={-0.1} material={darkMat}>
        <boxGeometry args={[0.06, 0.26, 0.03]} />
      </mesh>
      {/* armrests */}
      {[-0.28, 0.28].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.6, -0.02]} material={darkMat}>
            <boxGeometry args={[0.03, 0.2, 0.03]} />
          </mesh>
          <RoundedBox args={[0.06, 0.03, 0.26]} radius={0.012} smoothness={2} position={[x, 0.71, 0.0]} material={darkMat} castShadow />
        </group>
      ))}
      {/* gas lift */}
      <mesh position={[0, 0.3, 0]} material={metalMat}>
        <cylinderGeometry args={[0.024, 0.03, 0.38, 14]} />
      </mesh>
      <mesh position={[0, 0.1, 0]} material={darkMat}>
        <cylinderGeometry args={[0.05, 0.06, 0.05, 14]} />
      </mesh>
      {/* five-star base with casters */}
      {[0, 1, 2, 3, 4].map((k) => {
        const a = (k / 5) * Math.PI * 2;
        return (
          <group key={k} rotation-y={-a}>
            <mesh position={[0.16, 0.075, 0]} rotation-z={0.08} material={darkMat}>
              <boxGeometry args={[0.3, 0.03, 0.045]} />
            </mesh>
            <mesh position={[0.3, 0.03, 0]} material={darkMat}>
              <sphereGeometry args={[0.03, 10, 10]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Workstation({ index, position, drivers }: { index: number; position: [number, number]; drivers: OfficeDrivers }) {
  const group = useRef<Group>(null);
  const screen = useRef<MeshStandardMaterial>(null);
  const led = useRef<MeshStandardMaterial>(null);
  const current = useRef(new Color(palette.pulse));
  const tex = useMemo(() => screenTexture(index), [index]);
  const amber = useMemo(() => new Color(palette.amber), []);
  const white = useMemo(() => new Color("#ffffff"), []);

  useFrame((_, dt) => {
    const s = drivers.deskScale?.(index) ?? 1;
    const g = group.current;
    if (g) {
      g.scale.setScalar(Math.max(0.0001, s));
      g.visible = s > 0.002;
    }
    const power = drivers.power?.() ?? 1;
    const status = drivers.deskStatus?.(index) ?? STATUS.ok;
    current.current.lerp(statusColors[power < 0.05 ? STATUS.off : status], 1 - Math.exp(-dt * 8));
    if (led.current) {
      led.current.emissive.copy(current.current);
      led.current.emissiveIntensity = 4 * power + 0.1;
    }
    if (screen.current) {
      const alert = status === STATUS.alert;
      screen.current.emissive.copy(alert ? amber : white);
      screen.current.emissiveIntensity = (alert ? 1.6 : 1.05) * power + 0.02;
    }
  });

  const [x, z] = position;
  return (
    <group ref={group} position={[x, 0.1, z]}>
      <RoundedBox args={[1.72, 0.06, 0.86]} radius={0.025} smoothness={3} position={[0, 0.73, 0]} material={deskMat} castShadow receiveShadow />
      {/* slim metal frame */}
      {[-0.78, 0.78].map((lx) => (
        <group key={lx}>
          <mesh position={[lx, 0.36, 0]} material={metalMat} castShadow>
            <boxGeometry args={[0.04, 0.72, 0.04]} />
          </mesh>
          <mesh position={[lx, 0.03, 0]} material={metalMat}>
            <boxGeometry args={[0.06, 0.03, 0.7]} />
          </mesh>
        </group>
      ))}
      {/* monitor */}
      <group position={[0, 1.13, -0.27]} rotation-x={-0.05}>
        <RoundedBox args={[0.84, 0.5, 0.035]} radius={0.015} smoothness={2} material={darkMat} castShadow />
        <mesh position={[0, 0.01, 0.019]}>
          <planeGeometry args={[0.79, 0.44]} />
          <meshStandardMaterial ref={screen} color="#000" emissive="#ffffff" emissiveMap={tex} emissiveIntensity={1} toneMapped={false} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} />
        </mesh>
        <mesh position={[0, -0.33, -0.03]} material={metalMat}>
          <boxGeometry args={[0.05, 0.22, 0.03]} />
        </mesh>
        <mesh position={[0, -0.44, -0.02]} material={metalMat}>
          <boxGeometry args={[0.26, 0.012, 0.16]} />
        </mesh>
      </group>
      {/* keyboard + mouse */}
      <RoundedBox args={[0.5, 0.018, 0.15]} radius={0.006} smoothness={2} position={[-0.05, 0.77, 0.14]} material={darkMat} />
      <RoundedBox args={[0.06, 0.02, 0.1]} radius={0.01} smoothness={2} position={[0.32, 0.77, 0.15]} material={darkMat} />
      {/* status light */}
      <mesh position={[0.66, 0.775, 0.3]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial ref={led} color="#000" emissive={palette.pulse} emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <Chair />
    </group>
  );
}

const leafGreen = new MeshStandardMaterial({ color: "#2f7a52", roughness: 0.55 });
const leafDark = new MeshStandardMaterial({ color: "#225e40", roughness: 0.6 });
const potMat = new MeshStandardMaterial({ color: "#e4e0d8", roughness: 0.5 });
const soilMat = new MeshStandardMaterial({ color: "#3a2e25", roughness: 1 });

/** Potted plant: a ceramic pot with a rim and soil, and long leaves fanning out from the centre. */
function Plant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: 13 }, (_, i) => {
        const a = i * 2.4; // golden-angle spread, so leaves never line up
        const tilt = 0.25 + (i % 4) * 0.13;
        const len = 0.42 + ((i * 7) % 5) * 0.05;
        return { a, tilt, len, dark: i % 3 === 0 };
      }),
    [],
  );
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.19, 0]} material={potMat} castShadow receiveShadow>
        <cylinderGeometry args={[0.17, 0.13, 0.38, 28]} />
      </mesh>
      <mesh position={[0, 0.38, 0]} material={potMat} castShadow>
        <torusGeometry args={[0.165, 0.018, 8, 28]} />
      </mesh>
      <mesh position={[0, 0.37, 0]} rotation-x={-Math.PI / 2} material={soilMat}>
        <circleGeometry args={[0.155, 24]} />
      </mesh>
      {leaves.map((l, i) => (
        <group key={i} position={[0, 0.38, 0]} rotation={[0, l.a, 0]}>
          <group rotation-z={-l.tilt}>
            <mesh position={[0, l.len / 2, 0]} scale={[0.055, l.len / 2, 0.012]} material={l.dark ? leafDark : leafGreen} castShadow>
              <sphereGeometry args={[1, 12, 10]} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

/** Builds the cable route from each desk to the network closet. */
export function useCableCurves() {
  return useMemo(
    () =>
      DESKS.map(([x, z]) => {
        const lane = z < 0.5 ? -1.55 : 1.0;
        return new CatmullRomCurve3(
          [
            new Vector3(x + 0.6, 0.13, z),
            new Vector3(x + 0.6, 0.13, lane),
            new Vector3(RACK_POS[0] + 1.2, 0.13, lane),
            new Vector3(RACK_POS[0] + 0.9, 0.13, RACK_POS[2] + 0.9),
            new Vector3(RACK_POS[0], 0.35, RACK_POS[2] + 0.2),
          ],
          false,
          "catmullrom",
          0.05,
        );
      }),
    [],
  );
}

const PACKET_IN = new Color(0.55, 0.85, 3.2); // HDR blue → blooms
const PACKET_OUT = new Color(3.0, 0.45, 0.4); // HDR brand red → blooms

/** Structured cabling with glowing data streaks travelling to and from the network closet. */
function Cables({ drivers, packetsPerCable }: { drivers: OfficeDrivers; packetsPerCable: number }) {
  const curves = useCableCurves();
  const packets = useRef<InstancedMesh>(null);
  const cableMat = useMemo(
    () => new MeshStandardMaterial({ color: "#0d1422", emissive: palette.blue, emissiveIntensity: 0.6, roughness: 0.4, toneMapped: false }),
    [],
  );
  const count = curves.length * packetsPerCable;
  const point = useMemo(() => new Vector3(), []);
  const tangent = useMemo(() => new Vector3(), []);
  const q = useMemo(() => new Quaternion(), []);

  // Colours are set once: even packets flow in (blue), odd flow out (red).
  const colored = useRef(false);

  useFrame(({ clock }) => {
    const power = drivers.power?.() ?? 1;
    cableMat.emissiveIntensity = 0.15 + power * 0.75;
    const mesh = packets.current;
    if (!mesh) return;
    if (!colored.current) {
      for (let n = 0; n < count; n++) mesh.setColorAt(n, n % 2 ? PACKET_OUT : PACKET_IN);
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      colored.current = true;
    }
    const time = clock.elapsedTime;
    let n = 0;
    curves.forEach((curve, ci) => {
      const deskVisible = (drivers.deskScale?.(ci) ?? 1) > 0.5;
      for (let k = 0; k < packetsPerCable; k++) {
        const dir = k % 2 === 0 ? 1 : -1;
        const raw = (time * 0.26 + k / packetsPerCable + ci * 0.137) % 1;
        const t = dir > 0 ? raw : 1 - raw;
        curve.getPointAt(t, point);
        curve.getTangentAt(t, tangent);
        q.setFromUnitVectors(UP, tangent.normalize());
        tmp.position.copy(point);
        tmp.quaternion.copy(q);
        const s = power > 0.05 && deskVisible ? 1 : 0.0001;
        tmp.scale.set(s, s, s);
        tmp.updateMatrix();
        mesh.setMatrixAt(n++, tmp.matrix);
      }
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {curves.map((curve, i) => (
        <mesh key={i} material={cableMat}>
          <tubeGeometry args={[curve, 48, 0.016, 6, false]} />
        </mesh>
      ))}
      <instancedMesh ref={packets} args={[undefined, undefined, count]} frustumCulled={false}>
        <capsuleGeometry args={[0.03, 0.34, 4, 8]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

const glassMat = new MeshStandardMaterial({ color: "#a9c2ff", transparent: true, opacity: 0.1, roughness: 0.05, metalness: 0.2, depthWrite: false });
const trimMat = new MeshStandardMaterial({ color: "#000", emissive: palette.blue, emissiveIntensity: 2.2, toneMapped: false });

function MeetingRoom({ detailed }: { detailed: boolean }) {
  return (
    <group position={[4.65, 0.1, -3.2]}>
      {[
        { p: [0, 0.85, 1.05], s: [3.3, 1.7, 0.02] },
        { p: [-1.65, 0.85, 0], s: [0.02, 1.7, 2.1] },
      ].map((w, i) => (
        <group key={i}>
          <mesh position={w.p as [number, number, number]} material={glassMat}>
            <boxGeometry args={w.s as [number, number, number]} />
          </mesh>
          <mesh position={[w.p[0], 1.71, w.p[2]]} material={trimMat}>
            <boxGeometry args={[Math.max(w.s[0], 0.03), 0.025, Math.max(w.s[2], 0.03)]} />
          </mesh>
        </group>
      ))}
      <RoundedBox args={[2.1, 0.06, 1.0]} radius={0.03} smoothness={3} position={[0.1, 0.66, 0]} material={deskMat} castShadow receiveShadow />
      <mesh position={[0.1, 0.33, 0]} material={metalMat}>
        <cylinderGeometry args={[0.08, 0.2, 0.64, 16]} />
      </mesh>
      {detailed
        ? [-0.45, 0.65].map((cx) =>
            [-0.88, 0.88].map((cz) => (
              <Prop key={`${cx}${cz}`} url={MODELS.armChair} height={0.78} position={[cx, 0, cz]} rotation={cz < 0 ? 0 : Math.PI} />
            )),
          )
        : [-0.6, 0.1, 0.8].map((cx) =>
            [-0.75, 0.75].map((cz) => (
              <RoundedBox key={`${cx}${cz}`} args={[0.42, 0.5, 0.42]} radius={0.06} smoothness={3} position={[cx, 0.25, cz]} material={fabricMat} castShadow />
            )),
          )}
      {/* wall display */}
      <mesh position={[1.62, 1.0, 0]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[1.3, 0.72]} />
        <meshStandardMaterial color="#000" emissive="#ffffff" emissiveMap={screenTexture(3)} emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** One client office floor: slab, workstations, meeting room, plants, structured cabling and live traffic. */
export function Office({
  drivers = {},
  showCables = true,
  packetsPerCable = 3,
  furnished = true,
  detailed = false,
}: {
  drivers?: OfficeDrivers;
  showCables?: boolean;
  packetsPerCable?: number;
  furnished?: boolean;
  /** Use the real 3D models (plants, armchairs, lounge). Off on phones and low-power devices. */
  detailed?: boolean;
}) {
  const edgeMat = useMemo(
    () => new MeshStandardMaterial({ color: "#000", emissive: palette.blue, emissiveIntensity: 1.2, toneMapped: false }),
    [],
  );
  useEffect(() => () => edgeMat.dispose(), [edgeMat]);
  const p = useScenePalette();
  useEffect(() => {
    deskMat.map = woodTexture(p.wood);
    deskMat.needsUpdate = true;
    darkMat.color.set(p.equipment);
    fabricMat.color.set(p.fabric);
  }, [p]);
  const carpet = useMemo(() => {
    const t = carpetTexture(p.carpet, p.carpetSeam).clone();
    t.repeat.set((FLOOR.width - 0.12) / 2.4, (FLOOR.depth - 0.12) / 2.4); // 0.6 m tiles
    t.needsUpdate = true;
    return t;
  }, [p.carpet, p.carpetSeam]);
  useFrame(() => {
    const h = drivers.highlight?.() ?? 0;
    edgeMat.emissiveIntensity = p.edge + h * 3;
  });

  return (
    <group>
      {/* floor slab */}
      <RoundedBox args={[FLOOR.width, 0.3, FLOOR.depth]} radius={0.08} smoothness={3} position={[0, -0.05, 0]} receiveShadow>
        <meshStandardMaterial color={p.slab} roughness={0.85} metalness={0} />
      </RoundedBox>
      {/* glowing edge: four thin strips around the border only. A full-size box here sat 2 mm under
          the carpet and z-fought with it from far away (blue speckle on the floor). */}
      {[
        [0, (FLOOR.depth - EDGE) / 2, FLOOR.width, EDGE],
        [0, -(FLOOR.depth - EDGE) / 2, FLOOR.width, EDGE],
        [(FLOOR.width - EDGE) / 2, 0, EDGE, FLOOR.depth - EDGE * 2],
        [-(FLOOR.width - EDGE) / 2, 0, EDGE, FLOOR.depth - EDGE * 2],
      ].map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, 0.108, z]} material={edgeMat}>
          <boxGeometry args={[w, 0.016, d]} />
        </mesh>
      ))}
      <mesh position={[0, 0.112, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[FLOOR.width - EDGE * 2, FLOOR.depth - EDGE * 2]} />
        {/* polygon offset keeps the carpet in front of the slab top at any camera distance */}
        <meshStandardMaterial map={carpet} roughness={0.95} metalness={0} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} />
      </mesh>

      {furnished && (
        <>
          {DESKS.map((pos, i) => (
            <Workstation key={i} index={i} position={pos} drivers={drivers} />
          ))}
          <MeetingRoom detailed={detailed} />
          {detailed ? (
            <>
              <Prop url={MODELS.plantSmall} height={0.7} position={[2.6, 0.11, -3.9]} />
            </>
          ) : (
            <>
              <Plant position={[5.9, 0.1, 3.7]} scale={1.15} />
              <Plant position={[-6.0, 0.1, 3.7]} />
              <Plant position={[2.6, 0.1, -3.9]} scale={0.9} />
            </>
          )}
        </>
      )}
      {showCables && <Cables drivers={drivers} packetsPerCable={packetsPerCable} />}
    </group>
  );
}
