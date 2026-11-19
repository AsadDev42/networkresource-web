"use client";

import { createContext, useContext } from "react";

export type SceneTheme = "dark" | "light";

/** Colours and effect strengths for the 3D scenes in each site theme. */
export const SCENE = {
  dark: {
    bg: "#07090d",
    slab: "#0b0f16",
    floorTop: "#121821",
    gridA: "#1f2a3b",
    gridB: "#161d29",
    desk: "#1b222e",
    equipment: "#10151d",
    fabric: "#1d2533",
    ground: "#05070b",
    groundMirror: 0.35,
    dots: "#9aa8c2",
    hemiSky: "#c4d1ea",
    hemiGround: "#1a2029",
    hemi: 0.85,
    ambient: 0.2,
    key: 2.5,
    edge: 1.0,
    bloom: 0.75,
    bloomThreshold: 0.95,
    vignette: 0.5,
    noise: 0.35,
    card: "#0c1017",
    cardGlow: 0.18,
    arc: "#7aa4ff",
    additive: true,
    rackBody: "#1f2632",
    rackFront: "#0f141c",
    rackFrame: "#2c3544",
    rackPanel: "dark",
    wood: "walnut",
    carpet: "#3d4553",
    carpetSeam: "#2a303b",
  },
  light: {
    bg: "#eff2f6",
    slab: "#f9fafc",
    floorTop: "#eef1f6",
    gridA: "#d3d9e3",
    gridB: "#e2e7ee",
    desk: "#ffffff",
    equipment: "#2a3140",
    fabric: "#5a6476",
    ground: "#e8ecf1",
    groundMirror: 0.15,
    dots: "#3e4a5f",
    hemiSky: "#ffffff",
    hemiGround: "#c9d1de",
    hemi: 1.1,
    ambient: 0.35,
    key: 2.8,
    edge: 0.55,
    bloom: 0.45,
    bloomThreshold: 1,
    vignette: 0.12,
    noise: 0.12,
    card: "#ffffff",
    cardGlow: 0.04,
    arc: "#1d4fd8",
    additive: false,
    rackBody: "#525a68",
    rackFront: "#363d4a",
    rackFrame: "#a3abb8",
    rackPanel: "light",
    wood: "oak",
    carpet: "#d8dce2",
    carpetSeam: "#c5cad2",
  },
} as const;

export type ScenePalette = (typeof SCENE)[SceneTheme];

export const SceneThemeContext = createContext<SceneTheme>("dark");

export function useScenePalette(): ScenePalette {
  return SCENE[useContext(SceneThemeContext)];
}
