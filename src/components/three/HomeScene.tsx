"use client";

import { Suspense, memo, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Anchor } from "./Anchor";
import { SCENE, SceneThemeContext, type SceneTheme } from "./sceneTheme";
import { ThemeFill, ThemeSync } from "./ThemeSync";
import { CinematicEffects, ReflectiveGround, StudioEnvironment, StudioGround } from "./Cinematic";
import { Fog, MathUtils, Vector3, type DirectionalLight, type Group, type PerspectiveCamera } from "three";
import { Office } from "./parts/Office";
import { Rack } from "./parts/Rack";
import { Noc, NOC_POS } from "./parts/Noc";
import { OnSite } from "./parts/OnSite";
import { RelocationRig, relocationState } from "./parts/Relocation";
import { BayMap } from "./parts/BayMap";
import { storyState, SETTLED, TRAVEL_START, type Region } from "./storyState";
import { ALERT_DESK, DESKS, FLOOR_B_OFFSET, RACK_POS, STATUS, easeInOutCubic, palette, range, smooth } from "./math";

const UP3 = new Vector3(0, 1, 0);

/**
 * Camera framing per chapter. Instead of fixed camera positions, each chapter names its SUBJECT
 * (a bounding sphere) and a VIEW DIRECTION. Every frame the rig fits that sphere into the free part
 * of the screen — the rectangle the chapter's text does not cover, measured from the DOM
 * (storyState.regions). So the 3D can never sit under the text, on any screen size.
 */
type Shot = { center: Vector3; radius: number; dir: Vector3; fov: number };
const shot = (c: [number, number, number], radius: number, from: [number, number, number], fov: number): Shot => {
  const center = new Vector3(...c);
  return { center, radius, dir: new Vector3(...from).sub(center).normalize(), fov };
};

const SHOTS: Shot[] = [
  shot([0, 3.2, 0], 6.3, [13.6, 10.6, 16.8], 34), // hero: whole office + NOC
  shot([-4.85, 2.6, -1.9], 3.15, [-1.4, 4.3, 6.4], 30), // network closet: exploded rack + labels
  shot([0, 4.6, -0.2], 5.0, [12.5, 16.5, 19], 34), // NOC above the office
  shot([3.5, 1.25, 3.5], 2.7, [9.8, 5.2, 14.2], 32), // on site: engineer + portal, close
  shot([0.6, 1, 0.4], 6.7, [6.2, 13.5, 21], 33), // relocation: follows the move, see relocationShot()
  shot([-12, 0, -92], 118, [-12, 560, 260], 30), // Bay Area map
];

/**
 * The relocation camera follows the move instead of framing both floors from far away:
 * it starts on the current office, dollies along with the crates and settles on the new office.
 */
const RELOC_BASE = SHOTS[4].center.clone();
function relocationShot(chapter: number) {
  const k = smooth(0.34, 0.66, range(chapter, 4.0, 4.82));
  const s = SHOTS[4];
  s.center.set(RELOC_BASE.x + FLOOR_B_OFFSET * k, RELOC_BASE.y, RELOC_BASE.z);
  // Widen a little mid-flight so the crates in the air stay in frame.
  s.radius = 6.7 + Math.sin(k * Math.PI) * 3.4;
}

/** Reads scroll position and returns the effective chapter value (snapped when motion is reduced). */
function effectiveChapter(reduced: boolean) {
  const c = Math.min(5.999, Math.max(0, reduced ? storyState.chapter : storyState.smooth));
  if (!reduced) return c;
  const idx = Math.floor(c);
  return idx + SETTLED[idx];
}

type Fit = { pos: Vector3; target: Vector3; sx: number; sy: number; dist: number };

/** Camera position and screen offset that fit a shot's sphere inside a free screen region. */
function fitShot(s: Shot, region: Region, aspect: number, out: Fit) {
  const fx = Math.max(0.2, region.x1 - region.x0);
  const fy = Math.max(0.2, region.y1 - region.y0);
  const t = Math.tan(MathUtils.degToRad(s.fov) / 2);
  const halfV = Math.atan(t * fy);
  const halfH = Math.atan(t * aspect * fx);
  // Subjects are flatter than spheres, so a tangent fit (not sine) frames them snugly without clipping.
  const dist = s.radius / Math.tan(Math.min(halfV, halfH));
  out.target.copy(s.center);
  out.pos.copy(s.center).addScaledVector(s.dir, dist);
  out.sx = (region.x0 + region.x1) / 2 - 0.5;
  out.sy = 0.5 - (region.y0 + region.y1) / 2;
  out.dist = dist;
  return out;
}

const newFit = (): Fit => ({ pos: new Vector3(), target: new Vector3(), sx: 0, sy: 0, dist: 1 });

/**
 * Eases the scroll position before anything reads it. Mounted first in the canvas, so every other
 * frame callback sees this frame's eased value. Large jumps (scrollbar drags, chapter links) glide.
 */
function ChapterSmoother() {
  useFrame((_, dt) => {
    const target = Math.min(5.999, Math.max(0, storyState.chapter));
    if (!storyState.smoothReady) {
      storyState.smooth = target;
      storyState.smoothReady = true;
      return;
    }
    storyState.smooth = MathUtils.damp(storyState.smooth, target, 5.5, Math.min(dt, 0.05));
  });
  return null;
}

function CameraRig({ reduced }: { reduced: boolean }) {
  const { camera, size, scene } = useThree();
  const a = useMemo(() => newFit(), []);
  const b = useMemo(() => newFit(), []);
  const pos = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);
  const lookAt = useMemo(() => SHOTS[0].center.clone(), []);
  const offset = useMemo(() => new Vector3(), []);
  const shiftNow = useRef({ x: 0, y: 0, ready: false });
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    scene.fog = new Fog(palette.ink950, 26, 95);
  }, [scene]);

  useFrame(({ clock }, dt) => {
    const cf = effectiveChapter(reduced);
    const idx = Math.floor(cf);
    const local = cf - idx;
    const next = Math.min(idx + 1, SHOTS.length - 1);
    const travel = reduced ? 0 : easeInOutCubic(range(local, TRAVEL_START[idx], 1));
    const aspect = size.width / size.height;

    relocationShot(idx >= 4 ? cf : 4);
    fitShot(SHOTS[idx], storyState.regions[idx], aspect, a);
    fitShot(SHOTS[next], storyState.regions[next], aspect, b);
    pos.lerpVectors(a.pos, b.pos, travel);
    target.lerpVectors(a.target, b.target, travel);
    const dist = MathUtils.lerp(a.dist, b.dist, travel);

    if (!reduced) {
      // The camera never sits still: a slow turntable in the hero, a gentle breathing sway elsewhere.
      const t = clock.elapsedTime;
      const idle = idx === 0 ? Math.sin(t * 0.08) * 0.08 * (1 - travel) : Math.sin(t * 0.13 + idx) * 0.03;
      // Mouse-follow: the view turns a few degrees toward the pointer, eased so it feels weighted.
      pointer.current.x = MathUtils.damp(pointer.current.x, storyState.pointerX, 2.5, dt);
      pointer.current.y = MathUtils.damp(pointer.current.y, storyState.pointerY, 2.5, dt);
      const yaw = idle + pointer.current.x * 0.07;
      offset.copy(pos).sub(target).applyAxisAngle(UP3, yaw);
      pos.copy(target).add(offset);
      pos.y += pointer.current.y * dist * 0.03 + Math.sin(t * 0.21 + idx) * dist * 0.004;
    }

    // Screen offset: move the fitted subject into the centre of the free region.
    const persp = camera as PerspectiveCamera;
    persp.fov = MathUtils.damp(persp.fov, MathUtils.lerp(SHOTS[idx].fov, SHOTS[next].fov, travel), 3, dt);
    const sx = MathUtils.lerp(a.sx, b.sx, travel);
    const sy = MathUtils.lerp(a.sy, b.sy, travel);
    const lambda = reduced || !shiftNow.current.ready ? 1000 : 3.4;
    shiftNow.current.x = MathUtils.damp(shiftNow.current.x, sx, lambda, dt);
    shiftNow.current.y = MathUtils.damp(shiftNow.current.y, sy, lambda, dt);
    // Depth range fitted to the current shot instead of a fixed 0.1–2000: depth precision depends on
    // near/far, and a tight range stops surfaces that sit close together from flickering (z-fighting)
    // in the far shots. Beyond `far` the fog has already faded everything into the background colour.
    {
      const d = camera.position.distanceTo(lookAt);
      const r = MathUtils.lerp(SHOTS[idx].radius, SHOTS[next].radius, travel);
      persp.near = Math.max(0.1, d * 0.04);
      persp.far = d + r * 9 + 40;
    }
    persp.setViewOffset(size.width, size.height, -shiftNow.current.x * size.width, shiftNow.current.y * size.height, size.width, size.height);

    if (!shiftNow.current.ready) {
      camera.position.copy(pos);
      lookAt.copy(target);
      shiftNow.current.ready = true;
    }
    camera.position.x = MathUtils.damp(camera.position.x, pos.x, lambda, dt);
    camera.position.y = MathUtils.damp(camera.position.y, pos.y, lambda, dt);
    camera.position.z = MathUtils.damp(camera.position.z, pos.z, lambda, dt);
    lookAt.x = MathUtils.damp(lookAt.x, target.x, lambda, dt);
    lookAt.y = MathUtils.damp(lookAt.y, target.y, lambda, dt);
    lookAt.z = MathUtils.damp(lookAt.z, target.z, lambda, dt);
    camera.lookAt(lookAt);
    // A touch of roll while travelling between chapters, settling to level on arrival.
    if (!reduced) camera.rotateZ(Math.sin(travel * Math.PI) * 0.025 * (idx % 2 ? -1 : 1));

    // Fog follows the camera distance so far shots (relocation, Bay Area) stay clear.
    const fog = scene.fog as Fog | null;
    if (fog) {
      // Fog starts behind the subject, so only the far floor fades into the background.
      const r = MathUtils.lerp(SHOTS[idx].radius, SHOTS[next].radius, travel);
      fog.near = dist + r * 1.5;
      fog.far = dist + r * 7;
    }
  });
  return null;
}

/** Smooth-scrolls the page to a story chapter. */
function goToChapter(id: string) {
  const el = document.getElementById(`chapter-${id}`);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.6, offset: 2 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/**
 * Makes part of the scene interactive: it lifts slightly toward the viewer on hover (scaled around
 * its own pivot, eased), shows a pointer cursor, and a click jumps to its chapter.
 */
function Hoverable({ pivot, chapter, children }: { pivot: [number, number, number]; chapter: string; children: ReactNode }) {
  const g = useRef<Group>(null);
  const hover = useRef(false);
  useFrame((_, dt) => {
    const el = g.current;
    if (!el) return;
    const s = MathUtils.damp(el.scale.x, hover.current ? 1.06 : 1, 9, dt);
    el.scale.setScalar(s);
    el.position.y = MathUtils.damp(el.position.y, hover.current ? 0.12 : 0, 9, dt);
  });
  const neg: [number, number, number] = [-pivot[0], -pivot[1], -pivot[2]];
  return (
    <group position={pivot}>
      <group
        ref={g}
        onPointerOver={(e) => {
          e.stopPropagation();
          hover.current = true;
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          hover.current = false;
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          goToChapter(chapter);
        }}
      >
        <group position={neg}>{children}</group>
      </group>
    </group>
  );
}

function Story({ reduced, lowPower }: { reduced: boolean; lowPower: boolean }) {
  const rackA = useRef<Group>(null);
  const rackB = useRef<Group>(null);
  const alertTarget = useMemo(() => {
    const [x, z] = DESKS[ALERT_DESK];
    return new Vector3(x, 1.1, z - 0.28);
  }, []);
  const beamState = useMemo(() => ({ target: alertTarget, intensity: 0, resolved: 0 }), [alertTarget]);

  const cf = () => effectiveChapter(reduced);
  const reloc = () => relocationState(range(cf(), 4.0, 4.82));
  const ch2 = () => {
    const c = cf();
    return c >= 2 && c < 3 ? c - 2 : c >= 3 ? 1 : 0;
  };

  useFrame(() => {
    const r = reloc();
    const a = r.deskScaleA(DESKS.length);
    const b = r.deskScaleB(DESKS.length);
    if (rackA.current) {
      rackA.current.scale.setScalar(Math.max(0.0001, a));
      rackA.current.visible = a > 0.002;
    }
    if (rackB.current) {
      rackB.current.scale.setScalar(Math.max(0.0001, b));
      rackB.current.visible = b > 0.002;
    }
  });

  const explode = () => {
    const c = cf();
    if (c < 1 || c >= 2) return 0;
    const l = c - 1;
    return smooth(0.02, 0.4, l) * (1 - smooth(0.74, 0.95, l));
  };

  const offices = useRef<Group>(null);
  useFrame(() => {
    if (offices.current) offices.current.visible = cf() < 4.95;
  });

  return (
    <>
      <group ref={offices}>
      {/* Current office (Palo Alto) */}
      <Office
        detailed={!lowPower}
        packetsPerCable={lowPower ? 2 : 3}
        drivers={{
          deskScale: (i) => reloc().deskScaleA(i),
          power: () => reloc().powerA(),
          highlight: () => reloc().highlightA(),
          deskStatus: (i) => {
            if (i !== ALERT_DESK) return STATUS.ok;
            const l = ch2();
            return l > 0.16 && l < 0.47 ? STATUS.alert : STATUS.ok;
          },
        }}
      />
      <Hoverable pivot={[RACK_POS[0], 0, RACK_POS[2]]} chapter="closet">
      <group ref={rackA}>
        <Rack
          drivers={{
            explode,
            labels: () => smooth(0.55, 0.9, explode()),
            power: () => reloc().powerA(),
          }}
        />
      </group>
      </Hoverable>

      {/* New office */}
      <group position={[FLOOR_B_OFFSET, 0, 0]}>
        <Office
          detailed={!lowPower}
          packetsPerCable={lowPower ? 1 : 2}
          drivers={{
            deskScale: (i) => reloc().deskScaleB(i),
            deskStatus: (i) => reloc().statusB(i),
            power: () => reloc().powerB(),
            highlight: () => reloc().highlightB(),
          }}
        />
        <group ref={rackB} position={[0, 0, 0]}>
          <Rack drivers={{ power: () => reloc().powerB() }} />
        </group>
      </group>
      <RelocationRig progress={() => range(cf(), 4.0, 4.82)} detailed={!lowPower} />

      <Hoverable pivot={[NOC_POS.x, NOC_POS.y, NOC_POS.z]} chapter="noc">
      <Noc
        reducedMotion={reduced}
        drivers={{
          rise: () => {
            const c = cf();
            const hero = 1 - smooth(0.5, 0.95, c);
            const watch = smooth(1.72, 2.15, c) * (1 - smooth(3.75, 4.05, c));
            return Math.max(hero, watch);
          },
          uplink: () => {
            const c = cf();
            return Math.max(0.5 * (1 - smooth(0.4, 0.8, c)), smooth(1.8, 2.2, c) * (1 - smooth(3.7, 4.0, c)));
          },
          beam: () => {
            const l = ch2();
            beamState.intensity = smooth(0.28, 0.34, l) * (1 - smooth(0.56, 0.64, l));
            beamState.resolved = smooth(0.42, 0.5, l);
            return beamState;
          },
          label: () => {
            const c = cf();
            return smooth(1.9, 2.1, c) * (1 - smooth(2.7, 2.9, c));
          },
        }}
      />

      </Hoverable>

      <OnSite
        reducedMotion={reduced}
        drivers={{
          visible: () => {
            const c = cf();
            return smooth(2.72, 2.9, c) * (1 - smooth(3.8, 3.95, c));
          },
          walk: () => range(cf(), 3.0, 3.4),
          portal: () => {
            const c = cf();
            return range(c, 3.12, 3.42) * (1 - smooth(3.8, 3.95, c));
          },
        }}
      />

      </group>

      <BayMap reveal={() => smooth(4.8, 5.4, cf())} lowPower={lowPower} />

      {/* Hero hotspots: jump to the matching chapter */}
      <Anchor id="hot-closet" position={[RACK_POS[0], 2.9, RACK_POS[2]]} visible={() => 1 - smooth(0.15, 0.45, cf())} />
      <Anchor id="hot-noc" position={[NOC_POS.x + 1.6, NOC_POS.y + 1.4, NOC_POS.z]} visible={() => 1 - smooth(0.15, 0.45, cf())} />
      <Anchor id="hot-team" position={[DESKS[7][0], 1.7, DESKS[7][1]]} visible={() => 1 - smooth(0.15, 0.45, cf())} />
    </>
  );
}

/** X position of the office the story is looking at: the current office, then the new one during the move. */
function focusX(chapter: number) {
  return chapter < 4 ? 0 : FLOOR_B_OFFSET * smooth(0.34, 0.66, range(chapter, 4.0, 4.82));
}

/**
 * Key light with a soft shadow map. It travels with the story's focus, so the shadow camera stays
 * tight around whichever office is on screen (sharp shadows) instead of stretching over both.
 */
function KeyLight({ shadows, theme, reduced }: { shadows: boolean; theme: SceneTheme; reduced: boolean }) {
  const light = useRef<DirectionalLight>(null);
  useFrame(() => {
    const l = light.current;
    if (!l) return;
    const x = focusX(effectiveChapter(reduced));
    l.position.set(x + 9, 16, 10);
    l.target.position.set(x, 0, 0);
    l.target.updateMatrixWorld();
  });
  return (
    <directionalLight
      ref={light}
      position={[9, 16, 10]}
      intensity={SCENE[theme].key}
      color="#f4efe6"
      castShadow={shadows}
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-9}
      shadow-camera-right={9}
      shadow-camera-top={9}
      shadow-camera-bottom={-9}
      shadow-camera-near={0.5}
      shadow-camera-far={45}
      shadow-bias={-0.0001}
      shadow-normalBias={0.02}
      shadow-radius={4}
    />
  );
}

function Lights({ shadows, theme, reduced }: { shadows: boolean; theme: SceneTheme; reduced: boolean }) {
  return (
    <>
      <ThemeFill theme={theme} />
      <KeyLight shadows={shadows} theme={theme} reduced={reduced} />
      <pointLight position={[RACK_POS[0] + 1, 1.8, RACK_POS[2] + 2]} intensity={6} distance={7} color={palette.blue} />
      <pointLight position={[NOC_POS.x, NOC_POS.y + 2.5, NOC_POS.z + 2]} intensity={14} distance={10} color="#ffffff" />
      <pointLight position={[-8, 3, 6]} intensity={5} distance={18} color={palette.signal} />
    </>
  );
}

// Memoised: the page re-renders on chapter changes, which must not re-render the WebGL tree.
export default memo(HomeScene);

function HomeScene({ active, reduced, lowPower, theme = "light" }: { active: boolean; reduced: boolean; lowPower: boolean; theme?: SceneTheme }) {
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      storyState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      storyState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      shadows={lowPower ? false : "percentage"}
      dpr={[1, lowPower ? 1.25 : 1.75]}
      camera={{ fov: 34, near: 0.1, far: 2000, position: [13.6, 10.6, 16.8] }}
      flat={!lowPower}
      gl={{ antialias: lowPower, powerPreference: "high-performance", alpha: false }}
      onCreated={({ gl }) => gl.setClearColor(SCENE[theme].bg)}
    >
      <SceneThemeContext.Provider value={theme}>
      <ChapterSmoother />
      <ThemeSync theme={theme} />
      <Lights shadows={!lowPower} theme={theme} reduced={reduced} />
      <StudioEnvironment />
      <CameraRig reduced={reduced} />
      <Suspense fallback={null}>
        <Story reduced={reduced} lowPower={lowPower} />
      </Suspense>
      {!lowPower && theme === "dark" && <ReflectiveGround visible={() => effectiveChapter(reduced) < 4.85} />}
      {theme === "light" && <StudioGround visible={() => effectiveChapter(reduced) < 4.85} />}
      {!lowPower && <CinematicEffects theme={theme} />}
      </SceneThemeContext.Provider>
    </Canvas>
  );
}
