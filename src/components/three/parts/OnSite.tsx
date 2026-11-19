"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Anchor } from "../Anchor";
import { CanvasTexture, CatmullRomCurve3, SRGBColorSpace, Vector3, type Group, type Mesh, type MeshBasicMaterial } from "three";
import { DOOR_POS, palette } from "../math";
import { useScenePalette, type ScenePalette } from "../sceneTheme";

export type OnSiteDrivers = {
  /** 0..1 visibility of the engineer. */
  visible?: () => number;
  /** 0..1 progress along the walking path. */
  walk?: () => number;
  /** 0..1 portal cards rising. */
  portal?: () => number;
};

/** The three parts of the NR Complete client portal, as published on the service plan page. */
const PORTAL_ITEMS = [
  { title: "Service requests", sub: "Open a new request", icon: "plus", tint: "#2f6bff" },
  { title: "Request status", sub: "Follow open requests", icon: "clock", tint: "#d99a1e" },
  { title: "Knowledge base", sub: "Guides and answers", icon: "book", tint: "#1f9d6b" },
] as const;

// Small cards in the scene; the canvas keeps a fixed pixel size so the text stays sharp.
const CARD_W = 0.8;
const CARD_H = 0.26;
/** The cards start above the desks and monitors, rise CARD_RISE more, and sit in one row. */
const CARD_BASE = 2.2;
const CARD_RISE = 0.85;
const CARD_GAP = 0.08;
/** Turned toward the on-site camera. */
const CARD_YAW = 0.52;
const CANVAS_W = 544;
const CANVAS_H = 176;

/** Draws one portal card (icon, title, one line of detail) into a canvas texture. */
function drawCard(tex: CanvasTexture, item: (typeof PORTAL_ITEMS)[number], sp: ScenePalette) {
  const c = tex.image as HTMLCanvasElement;
  const g = c.getContext("2d")!;
  const w = c.width;
  const h = c.height;
  const dark = sp.card !== "#ffffff";
  const font = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";
  g.clearRect(0, 0, w, h);

  const r = 36;
  g.beginPath();
  g.roundRect(2, 2, w - 4, h - 4, r);
  g.fillStyle = dark ? "#121822" : "#ffffff";
  g.fill();
  g.lineWidth = 3;
  g.strokeStyle = dark ? "rgba(255,255,255,0.10)" : "rgba(16,22,34,0.10)";
  g.stroke();

  // icon tile
  const s = 84;
  const ix = 36;
  const iy = (h - s) / 2;
  g.beginPath();
  g.roundRect(ix, iy, s, s, 22);
  g.fillStyle = item.tint + (dark ? "33" : "1f");
  g.fill();
  g.strokeStyle = item.tint;
  g.fillStyle = item.tint;
  g.lineWidth = 7;
  g.lineCap = "round";
  g.lineJoin = "round";
  const cx = ix + s / 2;
  const cy = iy + s / 2;
  g.beginPath();
  if (item.icon === "plus") {
    g.moveTo(cx - 16, cy);
    g.lineTo(cx + 16, cy);
    g.moveTo(cx, cy - 16);
    g.lineTo(cx, cy + 16);
  } else if (item.icon === "clock") {
    g.arc(cx, cy, 20, 0, Math.PI * 2);
    g.moveTo(cx, cy - 11);
    g.lineTo(cx, cy);
    g.lineTo(cx + 9, cy + 6);
  } else {
    g.moveTo(cx - 20, cy - 14);
    g.lineTo(cx - 20, cy + 16);
    g.lineTo(cx + 20, cy + 16);
    g.lineTo(cx + 20, cy - 14);
    g.closePath();
    g.moveTo(cx - 10, cy - 3);
    g.lineTo(cx + 10, cy - 3);
    g.moveTo(cx - 10, cy + 6);
    g.lineTo(cx + 4, cy + 6);
  }
  g.stroke();

  const tx = ix + s + 30;
  g.textBaseline = "alphabetic";
  g.fillStyle = dark ? "#f3f1ec" : "#121722";
  g.font = `600 44px ${font}`;
  g.fillText(item.title, tx, h / 2 - 4);
  g.fillStyle = dark ? "#9aa3b2" : "#5d6678";
  g.font = `500 32px ${font}`;
  g.fillText(item.sub, tx, h / 2 + 40);
  tex.needsUpdate = true;
}

const SKIN = "#c99a78";
const HAIR = "#2b2420";
const SHIRT = "#22314f";
const TROUSERS = "#2c3340";
const SHOES = "#171b22";

/** NR Complete: a dedicated engineer walking in on a scheduled visit, and the client portal. */
export function OnSite({ drivers = {}, reducedMotion = false }: { drivers?: OnSiteDrivers; reducedMotion?: boolean }) {
  const engineer = useRef<Group>(null);
  const body = useRef<Group>(null);
  const legL = useRef<Group>(null);
  const legR = useRef<Group>(null);
  const armL = useRef<Group>(null);
  const armR = useRef<Group>(null);
  const cards = useRef<Array<Group | null>>([]);
  const sp = useScenePalette();

  const textures = useMemo(
    () =>
      PORTAL_ITEMS.map(() => {
        const c = document.createElement("canvas");
        c.width = CANVAS_W;
        c.height = CANVAS_H;
        const t = new CanvasTexture(c);
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = 8;
        return t;
      }),
    [],
  );

  // Redraw when the theme changes, and once the web fonts have loaded.
  useEffect(() => {
    const draw = () => PORTAL_ITEMS.forEach((item, i) => drawCard(textures[i], item, sp));
    draw();
    document.fonts?.ready.then(draw).catch(() => {});
  }, [sp, textures]);
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  const path = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(DOOR_POS[0] + 0.4, 0.1, DOOR_POS[2]),
        new Vector3(5.0, 0.1, 3.6),
        new Vector3(3.2, 0.1, 3.55),
        new Vector3(1.6, 0.1, 3.35),
      ]),
    [],
  );
  const p = useMemo(() => new Vector3(), []);
  const ahead = useMemo(() => new Vector3(), []);

  useFrame(({ clock }) => {
    const v = drivers.visible?.() ?? 0;
    const w = drivers.walk?.() ?? 0;
    const g = engineer.current;
    if (g) {
      g.visible = v > 0.01;
      path.getPointAt(Math.min(w, 0.999), p);
      path.getPointAt(Math.min(w + 0.01, 1), ahead);
      g.position.copy(p);
      if (w < 0.995) g.lookAt(ahead.x, p.y, ahead.z);
      g.scale.setScalar(Math.max(0.0001, v));
    }
    const walking = w > 0.01 && w < 0.99 && !reducedMotion;
    const phase = clock.elapsedTime * 7;
    const swing = walking ? Math.sin(phase) * 0.45 : 0;
    if (body.current) body.current.position.y = walking ? Math.abs(Math.cos(phase)) * 0.03 : 0;
    if (legL.current) legL.current.rotation.x = swing;
    if (legR.current) legR.current.rotation.x = -swing;
    if (armL.current) armL.current.rotation.x = -swing * 0.7;
    if (armR.current) armR.current.rotation.x = swing * 0.35;

    const portal = drivers.portal?.() ?? 0;
    cards.current.forEach((c, i) => {
      if (!c) return;
      const k = Math.min(1, Math.max(0, portal * 1.6 - i * 0.25));
      c.visible = k > 0.01;
      // The cards rise one after another into the open space above the desks and settle in a row,
      // side by side along the direction they face the camera.
      const off = (i - 1) * (CARD_W + CARD_GAP);
      c.position.set(off * Math.cos(CARD_YAW), CARD_BASE + k * CARD_RISE, -off * Math.sin(CARD_YAW));
      c.scale.setScalar(Math.max(0.0001, 0.6 + k * 0.4));
      ((c.children[0] as Mesh).material as MeshBasicMaterial).opacity = k * 0.12;
      ((c.children[1] as Mesh).material as MeshBasicMaterial).opacity = k;
    });
  });

  return (
    <>
      <group ref={engineer} visible={false}>
        <group ref={body}>
          {/* legs swing from the hip */}
          {[
            [legL, -0.085],
            [legR, 0.085],
          ].map(([ref, x]) => (
            <group key={String(x)} ref={ref as RefObject<Group>} position={[x as number, 0.8, 0]}>
              <mesh position={[0, -0.36, 0]} castShadow>
                <capsuleGeometry args={[0.068, 0.58, 6, 14]} />
                <meshStandardMaterial color={TROUSERS} roughness={0.85} />
              </mesh>
              <mesh position={[0, -0.75, 0.045]} castShadow>
                <boxGeometry args={[0.12, 0.07, 0.24]} />
                <meshStandardMaterial color={SHOES} roughness={0.5} />
              </mesh>
            </group>
          ))}
          {/* torso and belt */}
          <mesh position={[0, 0.84, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.15, 0.08, 20]} />
            <meshStandardMaterial color={SHOES} roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.1, 0]} scale={[1, 1, 0.72]} castShadow>
            <capsuleGeometry args={[0.175, 0.36, 8, 20]} />
            <meshStandardMaterial color={SHIRT} roughness={0.75} />
          </mesh>
          {/* lanyard badge */}
          <mesh position={[0, 1.05, 0.13]}>
            <boxGeometry args={[0.09, 0.12, 0.012]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.075, 0.137]}>
            <boxGeometry args={[0.07, 0.025, 0.004]} />
            <meshStandardMaterial color={palette.signal} />
          </mesh>
          {/* arms swing from the shoulder */}
          {[
            [armL, -0.235],
            [armR, 0.235],
          ].map(([ref, x]) => (
            <group key={String(x)} ref={ref as RefObject<Group>} position={[x as number, 1.3, 0]}>
              <mesh position={[0, -0.24, 0]} castShadow>
                <capsuleGeometry args={[0.055, 0.42, 6, 12]} />
                <meshStandardMaterial color={SHIRT} roughness={0.75} />
              </mesh>
              <mesh position={[0, -0.52, 0]} castShadow>
                <sphereGeometry args={[0.055, 14, 14]} />
                <meshStandardMaterial color={SKIN} roughness={0.6} />
              </mesh>
              {(x as number) > 0 && (
                // laptop bag in the right hand
                <group position={[0.02, -0.66, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.07, 0.26, 0.34]} />
                    <meshStandardMaterial color="#1b2029" roughness={0.7} />
                  </mesh>
                  <mesh position={[0, 0.15, 0]}>
                    <torusGeometry args={[0.05, 0.01, 6, 16, Math.PI]} />
                    <meshStandardMaterial color="#1b2029" />
                  </mesh>
                </group>
              )}
            </group>
          ))}
          {/* neck, head, hair */}
          <mesh position={[0, 1.42, 0]}>
            <cylinderGeometry args={[0.05, 0.055, 0.08, 12]} />
            <meshStandardMaterial color={SKIN} roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.55, 0]} castShadow>
            <sphereGeometry args={[0.125, 24, 24]} />
            <meshStandardMaterial color={SKIN} roughness={0.55} />
          </mesh>
          <mesh position={[0, 1.575, -0.012]} rotation-x={-0.25}>
            <sphereGeometry args={[0.132, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
            <meshStandardMaterial color={HAIR} roughness={0.8} />
          </mesh>
        </group>
        {/* soft contact shadow */}
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.015, 0]}>
          <circleGeometry args={[0.3, 32]} />
          <meshBasicMaterial color="#0b0f16" transparent opacity={0.18} depthWrite={false} />
        </mesh>
        <Anchor id="engineer" position={[0, 1.95, 0]} visible={() => drivers.visible?.() ?? 0} />
      </group>

      {/* client portal: a slim base with the three portal cards rising from it */}
      <group position={[4.1, 0, 3.9]}>
        <mesh position={[0, 0.13, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.46, 0.06, 48]} />
          <meshStandardMaterial color={sp.desk} roughness={0.35} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.162, 0]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.3, 0.33, 48]} />
          <meshBasicMaterial color={palette.blue} toneMapped={false} />
        </mesh>
        {PORTAL_ITEMS.map((item, i) => (
          <group key={item.title} ref={(el) => void (cards.current[i] = el)} visible={false} rotation={[-0.08, CARD_YAW, 0]}>
            {/* shadow plate behind the card for depth */}
            <mesh position={[0.015, -0.02, -0.012]}>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshBasicMaterial color="#0b0f16" transparent opacity={0.12} depthWrite={false} />
            </mesh>
            <mesh>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshBasicMaterial map={textures[i]} transparent toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}
