"use client";

import { Component, type ReactNode } from "react";

/** Renders the fallback if WebGL fails to initialise or the scene throws. */
export class SceneGuard extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("3D scene disabled:", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Static backdrop shown before the 3D scene loads, and instead of it when WebGL is unavailable. */
export function ScenePoster() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-950" aria-hidden="true">
      
      <div className="absolute left-[55%] top-[52%] size-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(47,107,255,0.22),transparent_60%)]" />
      <div className="absolute left-[70%] top-[30%] size-[30vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(229,22,31,0.12),transparent_60%)]" />
    </div>
  );
}
