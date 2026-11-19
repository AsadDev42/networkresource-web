"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Texture, type Material, type Mesh, type Object3D } from "three";

const TEXTURE_KEYS = ["map", "emissiveMap", "normalMap", "roughnessMap", "metalnessMap", "aoMap", "alphaMap"] as const;

/**
 * Compiles every shader and uploads every texture ahead of time, including objects that stay hidden
 * until later chapters (the engineer, crates, Bay Area map, loaded models). Without this, each one
 * compiles the first time it appears, which shows up as a jerk in the middle of a scroll.
 * Runs a few times, because models finish loading at different moments.
 */
export function Prewarm() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    const run = () => {
      const hidden: Object3D[] = [];
      scene.traverse((o) => {
        if (!o.visible) {
          hidden.push(o);
          o.visible = true;
        }
      });
      try {
        gl.compile(scene, camera);
        scene.traverse((o) => {
          const mat = (o as Mesh).material as Material | Material[] | undefined;
          if (!mat) return;
          for (const m of Array.isArray(mat) ? mat : [mat]) {
            for (const key of TEXTURE_KEYS) {
              const t = (m as unknown as Record<string, unknown>)[key];
              if (t instanceof Texture) gl.initTexture(t);
            }
          }
        });
      } finally {
        // Restore before the next frame renders; per-frame code sets the real visibility again anyway.
        hidden.forEach((o) => (o.visible = false));
      }
    };
    const timers = [400, 2500, 6000, 12000].map((ms) => window.setTimeout(run, ms));
    return () => timers.forEach(clearTimeout);
  }, [gl, scene, camera]);
  return null;
}
