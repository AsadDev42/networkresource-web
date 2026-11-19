"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Anchor } from "../Anchor";
import { RoundedBox } from "@react-three/drei";
import { CanvasTexture, MathUtils, SRGBColorSpace, type Group, type MeshStandardMaterial } from "three";
import { RACK_POS, palette } from "../math";
import { useScenePalette } from "../sceneTheme";

export const RACK_UNITS = [
  { name: "Firewall & VPN", detail: "Cisco · SonicWALL", led: palette.signal, face: "ports8" },
  { name: "Core switch", detail: "Bandwidth · PoE · SNMP", led: palette.blue, face: "ports24" },
  { name: "Windows server", detail: "Exchange · SQL · IIS", led: palette.blue, face: "bays4" },
  { name: "Mac & Linux servers", detail: "macOS Server · Red Hat", led: palette.blue, face: "bays4" },
  { name: "Storage & backup", detail: "RAID · SAN · monitored daily", led: palette.pulse, face: "bays6" },
  { name: "UPS & power", detail: "Runtime analysis · HA", led: palette.amber, face: "ups" },
] as const;

const UNIT_W = 0.92;
const UNIT_H = 0.28;
const UNIT_D = 0.82;
const GAP = 0.06;

export type RackDrivers = {
  /** 0..1 exploded view. */
  explode?: () => number;
  /** 0..1 label visibility. */
  labels?: () => number;
  /** 0..1 power to the LEDs. */
  power?: () => number;
};

type Panel = "light" | "dark";
const faceCache = new Map<string, CanvasTexture>();

/**
 * The front panel of one rack unit, drawn once into a canvas texture: drive bays, network ports,
 * vents or a UPS display, so every unit reads as real equipment at a glance. The status strip on
 * the right is a separate emissive mesh so it can blink and bloom.
 */
function faceTexture(face: (typeof RACK_UNITS)[number]["face"], panel: Panel) {
  const key = face + panel;
  const hit = faceCache.get(key);
  if (hit) return hit;
  const W = 368;
  const H = 112;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  const light = panel === "light";
  const bezel = light ? "#3b4250" : "#10151d";
  const hole = light ? "#161b23" : "#04060a";
  const bay = light ? "#566070" : "#1b2330";
  const handle = light ? "#a7b0bd" : "#3d4859";
  const vent = light ? "#2c323d" : "#0a0e14";

  g.fillStyle = bezel;
  g.fillRect(0, 0, W, H);
  // subtle top highlight and bottom shade give the bezel some depth
  g.fillStyle = light ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.04)";
  g.fillRect(0, 0, W, 4);
  g.fillStyle = "rgba(0,0,0,0.25)";
  g.fillRect(0, H - 4, W, 4);

  const x0 = 18;
  const x1 = 238; // the status strip sits to the right of this
  if (face === "ports8" || face === "ports24") {
    const cols = face === "ports8" ? 4 : 12;
    const rows = 2;
    const pw = face === "ports8" ? 26 : 13;
    const ph = 18;
    const gap = face === "ports8" ? 12 : 4;
    const total = cols * pw + (cols - 1) * gap;
    const sx = face === "ports8" ? x0 + 70 : x0 + (x1 - x0 - total) / 2;
    for (let r = 0; r < rows; r++)
      for (let k = 0; k < cols; k++) {
        const px = sx + k * (pw + gap);
        const py = 30 + r * (ph + 12);
        g.fillStyle = hole;
        g.fillRect(px, py, pw, ph);
        g.fillStyle = (k + r) % 3 === 0 ? "#5be3a6" : "#2f6bff";
        g.fillRect(px + 2, py + 2, 3, 3);
      }
    if (face === "ports8") {
      // console and USB ports on the left
      g.fillStyle = hole;
      g.fillRect(x0 + 6, 36, 34, 14);
      g.fillRect(x0 + 6, 62, 16, 12);
      g.fillRect(x0 + 26, 62, 16, 12);
    }
  } else if (face === "bays4" || face === "bays6") {
    const n = face === "bays4" ? 4 : 6;
    const gap = 6;
    const bw = (x1 - x0 - gap * (n - 1)) / n;
    for (let k = 0; k < n; k++) {
      const bx = x0 + k * (bw + gap);
      g.fillStyle = bay;
      g.fillRect(bx, 18, bw, H - 36);
      g.fillStyle = vent;
      for (let y = 26; y < H - 30; y += 7) g.fillRect(bx + 6, y, bw - 12, 3);
      g.fillStyle = handle;
      g.fillRect(bx + 4, H - 30, bw - 8, 6);
      g.fillStyle = k % 2 ? "#5be3a6" : "#2f6bff";
      g.fillRect(bx + bw - 10, 22, 4, 4);
    }
  } else {
    // UPS: a small display, buttons and vent slats
    g.fillStyle = hole;
    g.fillRect(x0, 24, 92, 46);
    g.fillStyle = "#ffb547";
    g.font = "600 22px monospace";
    g.fillText("100%", x0 + 12, 55);
    g.fillStyle = handle;
    [0, 1, 2].forEach((k) => {
      g.beginPath();
      g.arc(x0 + 20 + k * 30, 88, 8, 0, Math.PI * 2);
      g.fill();
    });
    g.fillStyle = vent;
    for (let y = 22; y < H - 18; y += 8) g.fillRect(x0 + 112, y, x1 - x0 - 112, 4);
  }

  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  faceCache.set(key, tex);
  return tex;
}

function Unit({ index, drivers }: { index: number; drivers: RackDrivers }) {
  const group = useRef<Group>(null);
  const leds = useRef<MeshStandardMaterial>(null);
  const sp = useScenePalette();
  const unit = RACK_UNITS[index];
  const labelRight = index % 2 === 0;
  const face = faceTexture(unit.face, sp.rackPanel);
  // Units are listed top to bottom.
  const baseY = 0.22 + (RACK_UNITS.length - 1 - index) * (UNIT_H + GAP) + UNIT_H / 2;

  useFrame(({ clock }) => {
    const e = drivers.explode?.() ?? 0;
    const g = group.current;
    if (g) {
      const order = RACK_UNITS.length - 1 - index;
      const stagger = MathUtils.clamp(e * 1.6 - order * 0.1, 0, 1);
      g.position.z = stagger * 1.55;
      // Spread upward only, lifted clear of the floor, with room between units. Units zigzag away
      // from their label (labels alternate right and left), so neighbouring labels never crowd.
      g.position.y = baseY + e * (0.3 + order * 0.34);
      g.position.x = e * (labelRight ? -0.2 : 0.2);
      g.rotation.y = stagger * -0.18;
    }
    if (leds.current) {
      const power = drivers.power?.() ?? 1;
      const blink = 0.65 + 0.35 * Math.sin(clock.elapsedTime * (3 + index) + index);
      leds.current.emissiveIntensity = power * (1.4 + blink);
    }
  });

  return (
    <group ref={group} position={[0, baseY, 0]}>
      {/* chassis: satin metal, so its form reads on a light background as well as a dark one */}
      <RoundedBox args={[UNIT_W, UNIT_H, UNIT_D]} radius={0.018} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color={sp.rackBody} roughness={0.42} metalness={0.35} />
      </RoundedBox>
      {/* front panel */}
      <mesh position={[0, 0, UNIT_D / 2 + 0.002]}>
        <planeGeometry args={[UNIT_W - 0.08, UNIT_H - 0.03]} />
        <meshStandardMaterial map={face} roughness={0.55} metalness={0.2} />
      </mesh>
      {/* rack ears */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (UNIT_W / 2 - 0.015), 0, UNIT_D / 2 + 0.008]} castShadow>
          <boxGeometry args={[0.05, UNIT_H - 0.01, 0.02]} />
          <meshStandardMaterial color={sp.rackFrame} roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
      {/* status strip */}
      <mesh position={[0.3, 0, UNIT_D / 2 + 0.004]}>
        <planeGeometry args={[0.2, 0.026]} />
        <meshStandardMaterial ref={leds} color="#000" emissive={unit.led} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <Anchor id={`rack-${index}`} position={[labelRight ? 0.62 : -0.62, 0, 0.42]} visible={() => drivers.labels?.() ?? 0} />
    </group>
  );
}

/** The network closet: a rack whose units can separate into a labelled, exploded view. */
export function Rack({ drivers = {}, position = RACK_POS }: { drivers?: RackDrivers; position?: [number, number, number] }) {
  const sp = useScenePalette();
  const H = 0.22 + RACK_UNITS.length * (UNIT_H + GAP) + 0.12;
  return (
    <group position={position}>
      {/* frame posts */}
      {[
        [-0.5, -0.44],
        [0.5, -0.44],
        [-0.5, 0.44],
        [0.5, 0.44],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, H / 2, z]} castShadow>
          <boxGeometry args={[0.05, H, 0.05]} />
          <meshStandardMaterial color={sp.rackFrame} metalness={0.65} roughness={0.32} />
        </mesh>
      ))}
      {[0.04, H].map((y) => (
        <RoundedBox key={y} args={[1.1, 0.06, 0.98]} radius={0.02} smoothness={2} position={[0, y, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={sp.rackBody} metalness={0.4} roughness={0.4} />
        </RoundedBox>
      ))}
      {RACK_UNITS.map((_, i) => (
        <Unit key={i} index={i} drivers={drivers} />
      ))}
    </group>
  );
}
