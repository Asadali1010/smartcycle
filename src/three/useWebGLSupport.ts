/**
 * Detects WebGL availability once (by attempting to create a real WebGL
 * context on a throwaway canvas) so HeroScene/CanvasFallback and any later
 * scroll-story scene can share one detection path instead of each rolling
 * their own.
 */
import { useState } from "react";

export type WebGLSupport = "supported" | "unsupported";

function detectWebGLSupport(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Detects WebGL support once via a lazy `useState` initializer (runs exactly
 * once, on first render, never in an effect) — stable for the component's
 * lifetime, since WebGL availability doesn't change mid-session. This is a
 * client-only SPA (no SSR), so there's no hydration-mismatch concern to
 * defer this behind an effect for.
 */
export function useWebGLSupport(): WebGLSupport {
  const [support] = useState<WebGLSupport>(() => (detectWebGLSupport() ? "supported" : "unsupported"));
  return support;
}
