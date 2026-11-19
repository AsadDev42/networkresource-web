"use client";

import { Suspense, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3, type Mesh, type Object3D } from "three";
import { asset } from "@/lib/asset";

/**
 * Real 3D models (CC0, from Poly Haven: polyhaven.com) stored in /public/models at 1k texture size.
 * They replace simple code-built shapes on capable devices; phones keep the lighter shapes.
 */
export const MODELS = {
  plantSmall: asset("/models/potted_plant_04/potted_plant_04.gltf"),
  armChair: asset("/models/modern_arm_chair_01/modern_arm_chair_01.gltf"),
  box: asset("/models/cardboard_box_01/cardboard_box_01.gltf"),
} as const;

type V3 = [number, number, number];

/**
 * Loads a model, then fits it: either to a target height (uniform scale) or to an exact box size
 * (per-axis scale). The result stands on y = 0 and is centred on x/z, so placement is in plain metres.
 */
function Fitted({ url, height, size }: { url: string; height?: number; size?: V3 }) {
  const { scene } = useGLTF(url);
  const object = useMemo(() => {
    const c: Object3D = scene.clone(true);
    c.traverse((o) => {
      const m = o as Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    const box = new Box3().setFromObject(c);
    const dims = box.getSize(new Vector3());
    if (size) c.scale.set(size[0] / dims.x, size[1] / dims.y, size[2] / dims.z);
    else c.scale.setScalar((height ?? 1) / dims.y);
    box.setFromObject(c);
    const center = box.getCenter(new Vector3());
    c.position.set(-center.x, -box.min.y, -center.z);
    return c;
  }, [scene, height, size]);
  return <primitive object={object} />;
}

/** One placed model. Each has its own loading boundary, so the scene never waits on a download. */
export function Prop({
  url,
  height,
  size,
  position = [0, 0, 0],
  rotation = 0,
}: {
  url: string;
  height?: number;
  size?: V3;
  position?: V3;
  /** Rotation around the vertical axis, in radians. */
  rotation?: number;
}) {
  return (
    <group position={position} rotation-y={rotation}>
      <Suspense fallback={null}>
        <Fitted url={url} height={height} size={size} />
      </Suspense>
    </group>
  );
}
