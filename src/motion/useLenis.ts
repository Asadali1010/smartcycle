/**
 * Site-wide smooth scroll, wired to GSAP's ticker so ScrollTrigger instances
 * (DesktopShowcase, DeliveryTimeline, ScrollStoryPinned) stay in sync with
 * Lenis's eased scroll position rather than the raw scroll event. Skips
 * entirely under prefers-reduced-motion: smoothed/eased scrolling is itself
 * a persistent motion effect, so reduced-motion users get native instant
 * scroll instead, matching every other motion-safe gate in this codebase.
 */
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Module-level so route-change scroll reset (below) can reach the live
// instance without threading it through props/context.
let activeLenis: Lenis | null = null;

/**
 * Reset scroll to top, routed through Lenis when it's running. A raw
 * `window.scrollTo(0, 0)` gets fought and overridden the next tick, because
 * Lenis's rAF loop keeps animating toward its own last `targetScroll`
 * (whatever the user had scrolled to on the previous page) regardless of
 * what native scroll position we just set. Falls back to native scrollTo
 * under prefers-reduced-motion, where no Lenis instance is created.
 */
export function resetScroll() {
  if (activeLenis) {
    activeLenis.scrollTo(0, { immediate: true });
  } else if (typeof window !== "undefined") {
    window.scrollTo(0, 0);
  }
}

export function useLenis() {
  // Every pinned ScrollTrigger section (DesktopShowcase, DeliveryTimeline,
  // ScrollStoryPinned) measures its scroll distance from real DOM layout at
  // mount. This project's display/body fonts load via `display=swap`
  // (src/index.css) and swap in after that initial measurement, reflowing
  // text and — for anything sized off text width, like the showcase's
  // horizontal track — invalidating the pin's spacer height. Without a
  // refresh, the stale (too-short) spacer lets the next section's content
  // scroll up underneath the still-pinned one instead of after it. Runs
  // regardless of reduced-motion: harmless no-op when no pins exist (every
  // pinned section already skips its own ScrollTrigger under reduced
  // motion), necessary otherwise.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf2: number | undefined;
    // Two rAFs (not one): the first fires before the browser has painted the
    // layout every pinned section's mount effects just produced; the second
    // is guaranteed post-paint, so ScrollTrigger measures real, settled
    // pin-spacer heights instead of whatever was true mid-commit.
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    if ("fonts" in document) document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2 !== undefined) cancelAnimationFrame(raf2);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    activeLenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    // gsap.ticker reports time in seconds; Lenis's raf expects milliseconds.
    // Passing seconds through unconverted starves Lenis's internal easing of
    // real elapsed time, so it never catches up to the target scroll
    // position — this is GSAP's own documented Lenis integration recipe.
    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      if (activeLenis === lenis) activeLenis = null;
    };
  }, []);
}
