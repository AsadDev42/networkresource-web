"use client";

import { memo, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Fog, MathUtils, Vector3 } from "three";
import { Rack } from "./parts/Rack";
import { Office } from "./parts/Office";
import { RelocationRig, relocationState } from "./parts/Relocation";
import { FLOOR_B_OFFSET, RACK_POS, palette, range, smooth } from "./math";
import { CinematicEffects, StudioEnvironment } from "./Cinematic";
import { Prewarm } from "./Prewarm";
import { SCENE, SceneThemeContext, type SceneTheme } from "./sceneTheme";
import { ThemeFill, ThemeSync } from "./ThemeSync";

export type Progress = { value: number };
export type InnerVariant = "rack" | "relocation";

function Rig({ progress, variant, reduced }: { progress: Progress; variant: InnerVariant; reduced: boolean }) {
  const { camera, scene, size } = useThree();
  const pos = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);

  useEffect(() => {
    scene.fog = new Fog(palette.ink950, variant === "rack" ? 12 : 48, variant === "rack" ? 40 : 160);
  }, [scene, variant]);

  useFrame(({ clock }, dt) => {
    const p = progress.value;
    const idle = reduced ? 0 : Math.sin(clock.elapsedTime * 0.25);
    if (variant === "rack") {
      const [x, , z] = RACK_POS;
      const orbit = -0.55 + p * 0.5 + idle * 0.04;
      const dist = 5.6 - smooth(0, 0.5, p) * 0.4;
      pos.set(x + Math.sin(orbit) * dist, 2.2 + p * 0.6, z + Math.cos(orbit) * dist);
      target.set(x + 0.4, 1.35, z + 0.9);
    } else {
      const drift = (range(p, 0.1, 0.9) - 0.5) * 10;
      pos.set(12 + drift, 17, 30);
      target.set(12 + drift, 0.5, 0);
    }
    if (size.width / size.height < 1) pos.sub(target).multiplyScalar(1.45).add(target);
    const lambda = reduced ? 1000 : 4;
    camera.position.x = MathUtils.damp(camera.position.x, pos.x, lambda, dt);
    camera.position.y = MathUtils.damp(camera.position.y, pos.y, lambda, dt);
    camera.position.z = MathUtils.damp(camera.position.z, pos.z, lambda, dt);
    look.lerp(target, reduced ? 1 : 1 - Math.exp(-dt * 4));
    camera.lookAt(look);
  });
  return null;
}

function RackContent({ progress }: { progress: Progress }) {
  const explode = () => smooth(0.05, 0.55, progress.value);
  return (
    <>
      <Office drivers={{ highlight: () => 0.2 }} packetsPerCable={2} />
      <Rack drivers={{ explode, labels: () => smooth(0.45, 0.65, explode()) }} />
    </>
  );
}

function RelocationContent({ progress }: { progress: Progress }) {
  const st = () => relocationState(progress.value);
  return (
    <>
      <Office drivers={{ deskScale: (i) => st().deskScaleA(i), power: () => st().powerA(), highlight: () => st().highlightA() }} packetsPerCable={2} />
      <group position={[0, 0, 0]} scale={1}>
        <RackScaled get={() => st().deskScaleA(8)} power={() => st().powerA()} />
      </group>
      <group position={[FLOOR_B_OFFSET, 0, 0]}>
        <Office
          drivers={{
            deskScale: (i) => st().deskScaleB(i),
            deskStatus: (i) => st().statusB(i),
            power: () => st().powerB(),
            highlight: () => st().highlightB(),
          }}
          packetsPerCable={2}
        />
        <RackScaled get={() => st().deskScaleB(8)} power={() => st().powerB()} />
      </group>
      <RelocationRig progress={() => progress.value} />
    </>
  );
}

function RackScaled({ get, power }: { get: () => number; power: () => number }) {
  const ref = useMemo(() => ({ current: null as null | import("three").Group }), []);
  useFrame(() => {
    const s = get();
    if (ref.current) {
      ref.current.scale.setScalar(Math.max(0.0001, s));
      ref.current.visible = s > 0.002;
    }
  });
  return (
    <group ref={(g) => void (ref.current = g)}>
      <Rack drivers={{ power }} />
    </group>
  );
}

function InnerScene({ variant, progress, reduced, active, theme = "light" }: { variant: InnerVariant; progress: Progress; reduced: boolean; active: boolean; theme?: SceneTheme }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      shadows="percentage"
      dpr={[1, 1.5]}
      resize={{ scroll: false, debounce: { scroll: 0, resize: 150 } }}
      camera={{ fov: 34, near: 0.1, far: 300, position: variant === "rack" ? [-2, 3, 3] : [12, 17, 30] }}
      flat
      gl={{ antialias: false, alpha: false }}
      onCreated={({ gl }) => gl.setClearColor(SCENE[theme].bg)}
    >
      <SceneThemeContext.Provider value={theme}>
      <ThemeSync theme={theme} />
      <ThemeFill theme={theme} />
      <StudioEnvironment />
      <CinematicEffects theme={theme} />
      <Prewarm />
      <directionalLight position={[9, 16, 10]} intensity={2} color="#f4efe6" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} />
      <pointLight position={[RACK_POS[0] + 1.5, 2, RACK_POS[2] + 2.5]} intensity={8} distance={8} color={palette.blue} />
      <pointLight position={[-8, 3, 6]} intensity={5} distance={18} color={palette.signal} />
      <Rig progress={progress} variant={variant} reduced={reduced} />
      {variant === "rack" ? <RackContent progress={progress} /> : <RelocationContent progress={progress} />}
      </SceneThemeContext.Provider>
    </Canvas>
  );
}

export default memo(InnerScene);
