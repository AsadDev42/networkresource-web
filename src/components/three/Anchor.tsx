"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, type Group } from "three";

/**
 * Labels for the 3D scenes are ordinary DOM elements rendered in an overlay next to the canvas
 * (see SceneLabels). Each <Anchor> sits in the 3D graph, projects its world position to screen
 * space every frame and moves the matching DOM element there.
 * This replaces drei's <Html>, which mounts a React root per label and breaks on unmount.
 */
const registry = new Map<string, HTMLElement>();

export function registerLabel(id: string) {
  return (el: HTMLElement | null) => {
    if (el) registry.set(id, el);
    else if (registry.get(id)) registry.delete(id);
  };
}

export const getLabel = (id: string) => registry.get(id);

const world = new Vector3();

export function Anchor({
  id,
  position = [0, 0, 0],
  visible,
}: {
  id: string;
  position?: [number, number, number];
  /** 0..1 opacity, read every frame. */
  visible: () => number;
}) {
  const ref = useRef<Group>(null);
  const { camera, size } = useThree();
  const last = useMemo(() => ({ o: -1, x: 0, y: 0 }), []);

  useFrame(() => {
    const el = registry.get(id);
    const g = ref.current;
    if (!el || !g) return;
    let o = visible();
    if (o > 0.01) {
      g.getWorldPosition(world);
      world.project(camera);
      if (world.z > 1 || Math.abs(world.x) > 1.3 || Math.abs(world.y) > 1.3) o = 0;
      const x = Math.round(((world.x + 1) / 2) * size.width);
      const y = Math.round(((1 - world.y) / 2) * size.height);
      if (x !== last.x || y !== last.y) {
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        last.x = x;
        last.y = y;
      }
    }
    if (Math.abs(o - last.o) > 0.005) {
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o > 0.03 ? "visible" : "hidden";
      last.o = o;
    }
  });

  return <group ref={ref} position={position} />;
}
