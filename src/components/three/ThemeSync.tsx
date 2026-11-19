"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, type Fog } from "three";
import { SCENE, type SceneTheme } from "./sceneTheme";

/**
 * Keeps the renderer's clear colour and the fog colour in step with the site theme.
 * The colour eases to the new theme over about half a second (the Bay Area map switches the scene
 * to dark mid-scroll), and is applied every frame because the camera rigs create the fog themselves.
 */
export function ThemeSync({ theme }: { theme: SceneTheme }) {
  const { gl } = useThree();
  const target = useMemo(() => new Color(SCENE[theme].bg), [theme]);
  const current = useRef<Color | null>(null);
  useFrame(({ scene }, dt) => {
    if (!current.current) current.current = target.clone();
    const c = current.current;
    if (!c.equals(target)) {
      c.lerp(target, 1 - Math.exp(-dt * 6));
      if (Math.abs(c.r - target.r) + Math.abs(c.g - target.g) + Math.abs(c.b - target.b) < 0.003) c.copy(target);
    }
    gl.setClearColor(c);
    const fog = scene.fog as Fog | null;
    if (fog) fog.color.copy(c);
  });
  return null;
}

/** Hemisphere + ambient fill for the current theme. */
export function ThemeFill({ theme }: { theme: SceneTheme }) {
  const p = SCENE[theme];
  return (
    <>
      <hemisphereLight args={[p.hemiSky, p.hemiGround, p.hemi]} />
      <ambientLight intensity={p.ambient} />
    </>
  );
}
