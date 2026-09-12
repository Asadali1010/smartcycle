/**
 * Shared perf helper: returns an R3F `frameloop` value ("always"/"never")
 * driven by whether the given container is on/near screen, plus a ref
 * callback to attach to that container. Used by every canvas-owning section
 * (hero, scroll-story) so an offscreen WebGL context never keeps rendering.
 *
 * Also pauses on any in-flight route navigation. React Router's data router
 * commits navigations inside `startTransition`, so it renders the next
 * route's chunk in the background at low priority while keeping the current
 * tree (this canvas included) mounted and interactive. A continuously
 * rendering WebGL loop competes with that low-priority work for main-thread
 * time every frame, which can delay the transition by several seconds on
 * slower/virtualized GPUs — from the user's perspective, clicking a nav link
 * does nothing for a long stretch. Pausing here removes that contention.
 */
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "react-router-dom";

export function useCanvasFrameloop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [intersecting, setIntersecting] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin: "200px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const frameloop: "always" | "never" = intersecting && navigation.state === "idle" ? "always" : "never";
  return { containerRef, frameloop };
}
