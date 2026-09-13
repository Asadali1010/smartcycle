import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

/**
 * Shared surface tones for page sections (v3, Huly system). `dark` is the
 * obsidian-canvas/snow surface, `light` is the white/linen surface;
 * individual pages decide which sections read dark vs light so no page reads
 * as monotone.
 */
export type SurfaceTone = "dark" | "light";

/**
 * Color intensity, independent of tone. "quiet" (default) is the flat
 * dark/light surface used for docs/forms/overview content. "vivid" adds a
 * single low-opacity `bg-radial-sunburst` corner glow (src/index.css) on top
 * of that same quiet surface — reserved for feature-highlight sections —
 * hero, stats, showcase, timeline, ROI, final CTAs — per the redesign's
 * section-intensity split. Per design.md, an aurora/sunburst effect should
 * never become a full-bleed wash; only the hero gets the true full aurora
 * beam (`bg-aurora-hero`), applied directly by that component, not here.
 */
export type SurfaceIntensity = "quiet" | "vivid";

export interface PageSectionProps {
  tone?: SurfaceTone;
  intensity?: SurfaceIntensity;
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}

const SURFACE_STYLES: Record<SurfaceTone, Record<SurfaceIntensity, string>> = {
  dark: {
    quiet: "bg-obsidian-canvas text-snow",
    vivid: "bg-obsidian-canvas text-snow bg-radial-sunburst",
  },
  light: {
    quiet: "bg-white text-void",
    vivid: "bg-linen text-void bg-radial-sunburst",
  },
};

/**
 * Generic full-bleed section wrapper: sets the surface tone/intensity,
 * generous vertical rhythm, a centered max-width container with the shared
 * horizontal gutter, and a continuous scroll-scrubbed fade as the section
 * crosses the viewport (motion-safe gated). Every page composes its
 * sections from this rather than hand-rolling spacing/surface/motion
 * classes per page — it's what gives ordinary content sections a
 * consistent secondary motion language alongside the hero/scroll-story's 3D
 * choreography.
 *
 * The fade is driven by ScrollTrigger `scrub` (tied to Lenis via
 * useLenis's `lenis.on("scroll", ScrollTrigger.update)`) rather than a
 * one-shot IntersectionObserver reveal: the section eases in — opacity,
 * lift and a soft blur-to-focus — as it arrives, holds while centered, then
 * eases back out as it's overtaken by the next one. Scrubbing to the exact
 * scroll position (instead of a toggled play/reverse) is what reads as a
 * deliberate, high-production transition rather than a generic on-scroll
 * reveal.
 */
export function PageSection({
  tone = "dark",
  intensity = "quiet",
  id,
  className,
  containerClassName,
  children,
}: PageSectionProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // One timeline spanning the section's full transit (its top hitting the
      // viewport's bottom, through its bottom leaving the viewport's top)
      // rather than two independent enter/exit ScrollTriggers — a fixed
      // viewport-percentage pair for each would overlap and fight over
      // `opacity` on any section shorter than the overlap window. Scrubbing
      // one timeline's playhead against total transit distance instead scales
      // cleanly to any section height: short sections cycle through the fade
      // quickly, tall ones hold at full opacity for longer.
      gsap
        .timeline({ scrollTrigger: { trigger: container, start: "top bottom", end: "bottom top", scrub: 0.5 } })
        .fromTo(
          container,
          { opacity: 0, y: 36, scale: 0.975, filter: "blur(10px)" },
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", ease: "none", duration: 0.25 },
        )
        .to(container, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", ease: "none", duration: 0.5 })
        .to(container, { opacity: 0, y: -32, scale: 0.975, filter: "blur(8px)", ease: "none", duration: 0.25 });
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id={id} className={clsx("w-full py-section-sm md:py-section-md", SURFACE_STYLES[tone][intensity], className)}>
      <div
        ref={containerRef}
        className={clsx("mx-auto flex w-full max-w-6xl flex-col gap-12 px-gutter", containerClassName)}
      >
        {children}
      </div>
    </section>
  );
}
