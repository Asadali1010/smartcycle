/**
 * Shared perf helper: returns an R3F `frameloop` value ("always"/"never")
 * driven by whether the given container is on/near screen, plus a ref
 * callback to attach to that container. Used by every canvas-owning section
 * (hero, scroll-story) so an offscreen WebGL context never keeps rendering.
 */
import { useEffect, useRef, useState } from "react";

export function useCanvasFrameloop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setFrameloop(entry.isIntersecting ? "always" : "never"),
      { rootMargin: "200px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { containerRef, frameloop };
}
