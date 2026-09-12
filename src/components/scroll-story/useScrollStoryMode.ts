import { useEffect, useState } from "react";
import { useWebGLSupport } from "@/three/useWebGLSupport";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
/** Below this width there isn't room to pin a full-viewport 3D scene comfortably. */
const NARROW_VIEWPORT_QUERY = "(max-width: 900px)";

function computeReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function computeNarrow(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia(NARROW_VIEWPORT_QUERY).matches || window.innerWidth < 900;
}

/**
 * Decides between the pinned GSAP scroll-scrubbed 3D sequence and the plain
 * stacked fallback. Compact mode triggers on real `prefers-reduced-motion`,
 * missing WebGL, or a narrow viewport (mirrors useShowcaseMode's reasoning:
 * a pinned full-bleed 3D pin doesn't have room to read on small screens
 * regardless of motion preference).
 */
export function useScrollStoryMode(): { isCompact: boolean } {
  const webglSupport = useWebGLSupport();
  const [isCompact, setIsCompact] = useState(() => computeReducedMotion() || computeNarrow());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reducedQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const narrowQuery = window.matchMedia(NARROW_VIEWPORT_QUERY);
    const update = () => setIsCompact(computeReducedMotion() || computeNarrow());

    update();
    reducedQuery.addEventListener("change", update);
    narrowQuery.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      reducedQuery.removeEventListener("change", update);
      narrowQuery.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { isCompact: isCompact || webglSupport !== "supported" };
}
