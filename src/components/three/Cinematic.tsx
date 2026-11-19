"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshReflectorMaterial } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { CanvasTexture, type Group, type Mesh } from "three";
import { FLOOR, FLOOR_B_OFFSET } from "./math";
import { palette } from "./math";
import { SCENE, useScenePalette, type SceneTheme } from "./sceneTheme";

/**
 * Procedural studio lighting for reflections — no HDR download.
 * A soft key panel above, a brand-blue wall on one side and a brand-red rim on the other.
 */
export function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={2.2} color="#dfe7ff" scale={[18, 6, 1]} position={[0, 14, 2]} rotation-x={Math.PI / 2} />
      <Lightformer form="rect" intensity={3} color={palette.blue} scale={[10, 4, 1]} position={[-14, 4, -4]} rotation-y={Math.PI / 2} />
      <Lightformer form="rect" intensity={2.4} color={palette.signal} scale={[8, 3, 1]} position={[14, 3, 6]} rotation-y={-Math.PI / 2} />
      <Lightformer form="ring" intensity={1.6} color="#ffffff" scale={4} position={[0, 6, 14]} />
    </Environment>
  );
}

/** A large dark, glossy ground that reflects the glowing network — hidden when `visible` returns false. */
export function ReflectiveGround({ visible }: { visible?: () => boolean }) {
  const ref = useRef<Mesh>(null);
  const p = useScenePalette();
  useFrame(() => {
    if (ref.current && visible) ref.current.visible = visible();
  });
  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position={[10, -0.22, 0]}>
      <planeGeometry args={[160, 120]} />
      <MeshReflectorMaterial
        blur={[400, 120]}
        resolution={512}
        mixBlur={1}
        mixStrength={3.2}
        roughness={0.85}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color={p.ground}
        metalness={0.6}
        mirror={p.groundMirror}
      />
    </mesh>
  );
}

/** Light theme ground: a clean matte floor with soft contact shadows under the office (no reflections). */
const SHADOW_PAD = 2.2;
let shadowTex: CanvasTexture | null = null;
/** A soft, baked shadow under an office slab: a blurred rounded rectangle, drawn once. */
function floorShadow() {
  if (shadowTex) return shadowTex;
  const ppu = 40;
  const w = (FLOOR.width + SHADOW_PAD * 2) * ppu;
  const h = (FLOOR.depth + SHADOW_PAD * 2) * ppu;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  // Draw the slab off-canvas and keep only its blurred shadow (shadowBlur works in every browser).
  g.shadowColor = "rgba(20, 28, 42, 0.42)";
  g.shadowBlur = 46;
  g.shadowOffsetX = w;
  g.shadowOffsetY = 10;
  g.fillStyle = "#000";
  g.beginPath();
  g.roundRect(SHADOW_PAD * ppu - w + 6, SHADOW_PAD * ppu + 6, FLOOR.width * ppu - 12, FLOOR.depth * ppu - 12, 20);
  g.fill();
  shadowTex = new CanvasTexture(c);
  return shadowTex;
}

export function StudioGround({ visible }: { visible?: () => boolean }) {
  const ref = useRef<Group>(null);
  const p = useScenePalette();
  useFrame(() => {
    if (ref.current && visible) ref.current.visible = visible();
  });
  return (
    <group ref={ref}>
      <mesh rotation-x={-Math.PI / 2} position={[10, -0.22, 0]} receiveShadow>
        <planeGeometry args={[400, 300]} />
        <meshStandardMaterial color={p.ground} roughness={1} metalness={0} />
      </mesh>
      {[0, FLOOR_B_OFFSET].map((x) => (
        <mesh key={x} rotation-x={-Math.PI / 2} position={[x, -0.215, 0]}>
          <planeGeometry args={[FLOOR.width + SHADOW_PAD * 2, FLOOR.depth + SHADOW_PAD * 2]} />
          <meshBasicMaterial map={floorShadow()} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Bloom on emissive light (LEDs, screens, data, the NOC), filmic tone mapping, vignette and fine grain. */
export function CinematicEffects({ theme = "dark" }: { theme?: SceneTheme }) {
  const p = SCENE[theme];
  return (
    <EffectComposer multisampling={4}>
      {/* Ambient occlusion: soft contact darkening where objects meet — the biggest realism win */}
      <N8AO aoRadius={1.1} distanceFalloff={0.8} intensity={theme === "light" ? 2.4 : 2.2} />
      <Bloom mipmapBlur luminanceThreshold={p.bloomThreshold} luminanceSmoothing={0.25} intensity={p.bloom} radius={0.72} />
      <Vignette offset={0.28} darkness={p.vignette} />
      {/* ACES gives dark scenes their filmic contrast but greys out a white background; neutral keeps whites white. */}
      <ToneMapping mode={theme === "light" ? ToneMappingMode.NEUTRAL : ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
