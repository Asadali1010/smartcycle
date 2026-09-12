import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
/**
 * Below this width the pinned horizontal-scroll experience doesn't have
 * enough room to read comfortably, so the vertical/mobile renderer takes
 * over regardless of the reduced-motion setting.
 */
const NARROW_VIEWPORT_QUERY = "(max-width: 900px)";

function computeIsCompact(): boolean {
  if (typeof window === "undefined") return true;
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  const narrow = window.matchMedia(NARROW_VIEWPORT_QUERY).matches || window.innerWidth < 900;
  return reducedMotion || narrow;
}

/**
 * Decides between the pinned GSAP ScrollTrigger showcase (desktop, motion
 * allowed) and the plain accessible vertical fallback. Checks the real
 * `prefers-reduced-motion` media query (not just a viewport heuristic) and
 * re-evaluates on resize and on a live change to the reduced-motion setting,
 * so a mid-session preference change or window resize is honored without a
 * reload.
 */
export function useShowcaseMode(): boolean {
  const [isCompact, setIsCompact] = useState(computeIsCompact);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reducedQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const narrowQuery = window.matchMedia(NARROW_VIEWPORT_QUERY);
    const update = () => setIsCompact(computeIsCompact());

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

  return isCompact;
}
