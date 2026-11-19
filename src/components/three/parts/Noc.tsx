"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Anchor } from "../Anchor";
import { AdditiveBlending, NormalBlending, Color, Quaternion, Vector3, type Group, type Mesh, type MeshBasicMaterial } from "three";
import { palette, RACK_POS } from "../math";
import { useScenePalette } from "../sceneTheme";

/**
 * The Network Operations Center, drawn as a 3D version of the Network Resource logo:
 * four blue nodes, three red nodes, connecting rods and the orbital ring.
 */
const BLUE: Array<[number, number, number]> = [
  [-0.05, 1.67, 0],
  [-1.74, 0.13, -0.2],
  [1.82, 0.13, -0.15],
  [1.04, -1.69, 0.1],
];
const RED: Array<[number, number, number]> = [
  [0, 0.55, 0.45],
  [-0.65, -0.46, 0.5],
  [0.86, -0.75, 0.4],
];
const ROD_PAIRS: Array<[[number, number, number], [number, number, number]]> = [
  [BLUE[0], BLUE[1]],
  [BLUE[0], BLUE[2]],
  [BLUE[0], RED[0]],
  [BLUE[1], RED[0]],
  [BLUE[1], RED[1]],
  [BLUE[1], BLUE[3]],
  [RED[0], RED[1]],
  [RED[0], RED[2]],
  [RED[1], RED[2]],
  [BLUE[2], BLUE[3]],
  [RED[2], BLUE[3]],
  [RED[1], BLUE[3]],
];

const up = new Vector3(0, 1, 0);

function Rod({ a, b }: { a: [number, number, number]; b: [number, number, number] }) {
  const { position, quaternion, length } = useMemo(() => {
    const va = new Vector3(...a);
    const vb = new Vector3(...b);
    const dir = vb.clone().sub(va);
    return {
      position: va.clone().add(vb).multiplyScalar(0.5),
      quaternion: new Quaternion().setFromUnitVectors(up, dir.clone().normalize()),
      length: dir.length(),
    };
  }, [a, b]);
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.05, 0.05, length, 10]} />
      <meshStandardMaterial color="#c9d0db" metalness={0.9} roughness={0.25} />
    </mesh>
  );
}

export type NocDrivers = {
  /** 0..1 how far the NOC has risen into view. */
  rise?: () => number;
  /** 0..1 intensity of the uplink from the office to the NOC. */
  uplink?: () => number;
  /** Beam to a workstation: target position and 0..1 intensity, colour 0 = amber (alert), 1 = green (resolved). */
  beam?: () => { target: Vector3; intensity: number; resolved: number };
  /** 0..1 label visibility. */
  label?: () => number;
};

export const NOC_POS = new Vector3(0, 7.4, -0.5);

export function Noc({ drivers = {}, reducedMotion = false }: { drivers?: NocDrivers; reducedMotion?: boolean }) {
  const root = useRef<Group>(null);
  const cluster = useRef<Group>(null);
  const orbit = useRef<Group>(null);
  const uplink = useRef<Mesh>(null);
  // Glow (additive) lines vanish on a white background, so light mode draws them solid.
  const sp = useScenePalette();
  const scan = useRef<Mesh>(null);
  const beam = useRef<Mesh>(null);
  const amber = useMemo(() => new Color(palette.amber), []);
  const green = useMemo(() => new Color(palette.pulse), []);
  const tmpDir = useMemo(() => new Vector3(), []);

  useFrame(({ clock }, dt) => {
    const t = reducedMotion ? 0 : clock.elapsedTime;
    const rise = drivers.rise?.() ?? 1;
    const r = root.current;
    if (r) {
      r.visible = rise > 0.01;
      r.position.set(NOC_POS.x, NOC_POS.y + (1 - rise) * 6 + Math.sin(t * 0.8) * 0.12, NOC_POS.z);
      r.scale.setScalar(0.55 + rise * 0.45);
    }
    if (cluster.current) cluster.current.rotation.y = t * 0.25;
    if (orbit.current) orbit.current.rotation.y += reducedMotion ? 0 : dt * 0.6;

    const up = (drivers.uplink?.() ?? 0) * rise;
    if (uplink.current) {
      (uplink.current.material as MeshBasicMaterial).opacity = up * (sp.additive ? 0.22 + 0.08 * Math.sin(t * 4) : 0.75 + 0.15 * Math.sin(t * 4));
      uplink.current.visible = up > 0.01;
    }
    if (scan.current) {
      scan.current.rotation.y = t * 0.9;
      (scan.current.material as MeshBasicMaterial).opacity = rise * 0.025;
    }

    const b = drivers.beam?.();
    if (beam.current && b && r) {
      const from = r.position;
      tmpDir.copy(b.target).sub(from);
      const len = tmpDir.length();
      beam.current.position.copy(from).addScaledVector(tmpDir, 0.5);
      beam.current.quaternion.setFromUnitVectors(up3, tmpDir.normalize());
      beam.current.scale.set(1, len, 1);
      const mat = beam.current.material as MeshBasicMaterial;
      mat.opacity = b.intensity * (sp.additive ? 0.85 : 1);
      mat.color.copy(amber).lerp(green, b.resolved);
      beam.current.visible = b.intensity > 0.01;
    }
  });

  return (
    <>
      <group ref={root} position={NOC_POS}>
        <group ref={cluster} scale={0.62}>
          {ROD_PAIRS.map(([a, b], i) => (
            <Rod key={i} a={a} b={b} />
          ))}
          {BLUE.map((p, i) => (
            <mesh key={`b${i}`} position={p}>
              <sphereGeometry args={[0.42, 32, 32]} />
              <meshPhysicalMaterial color="#1846e0" emissive="#0a2aa8" emissiveIntensity={0.55} metalness={0.15} roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} />
            </mesh>
          ))}
          {RED.map((p, i) => (
            <mesh key={`r${i}`} position={p}>
              <sphereGeometry args={[0.24, 28, 28]} />
              <meshPhysicalMaterial color="#f0141e" emissive="#c0000a" emissiveIntensity={1.4} metalness={0.15} roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} toneMapped={false} />
            </mesh>
          ))}
        </group>
        {/* orbital ring */}
        <group rotation={[0.42, 0, -0.47]}>
          <group ref={orbit}>
            <mesh rotation-x={Math.PI / 2}>
              <torusGeometry args={[2.05, 0.045, 12, 120]} />
              <meshBasicMaterial color={[0.22, 0.85, 1.9]} toneMapped={false} />
            </mesh>
            <mesh position={[2.05, 0, 0]}>
              <sphereGeometry args={[0.09, 12, 12]} />
              <meshBasicMaterial color={[2.5, 3.2, 4]} toneMapped={false} />
            </mesh>
          </group>
        </group>
        {/* scan cone sweeping the office */}
        <mesh ref={scan} position={[0, -3.6, 0]}>
          <coneGeometry args={[6.5, 7, 48, 1, true, 0, Math.PI / 3]} />
          <meshBasicMaterial color={palette.blue} transparent opacity={0.025} side={2} depthWrite={false} blending={AdditiveBlending} />
        </mesh>
        <Anchor id="noc" position={[2.6, 1.2, 0]} visible={() => drivers.label?.() ?? 0} />
      </group>

      {/* uplink from the network closet to the NOC */}
      <mesh ref={uplink} position={uplinkGeo.position} quaternion={uplinkGeo.quaternion} visible={false}>
        <cylinderGeometry args={[sp.additive ? 0.03 : 0.04, sp.additive ? 0.03 : 0.04, uplinkGeo.length, 8]} />
        <meshBasicMaterial color={sp.additive ? palette.blueGlow : palette.blue} transparent opacity={0} depthWrite={false} blending={sp.additive ? AdditiveBlending : NormalBlending} toneMapped={false} />
      </mesh>

      {/* remote-fix beam to a workstation */}
      <mesh ref={beam} visible={false}>
        <cylinderGeometry args={[0.035, 0.035, 1, 8]} />
        <meshBasicMaterial color={sp.additive ? palette.amber : "#d98a00"} transparent opacity={0} depthWrite={false} blending={sp.additive ? AdditiveBlending : NormalBlending} toneMapped={false} />
      </mesh>
    </>
  );
}

const up3 = new Vector3(0, 1, 0);

const uplinkGeo = (() => {
  const from = new Vector3(RACK_POS[0], 2.45, RACK_POS[2]);
  const dir = NOC_POS.clone().sub(from);
  return {
    position: from.clone().addScaledVector(dir, 0.5),
    quaternion: new Quaternion().setFromUnitVectors(up3, dir.clone().normalize()),
    length: dir.length(),
  };
})();
