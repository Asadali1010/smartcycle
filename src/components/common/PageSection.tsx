import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import clsx from "clsx";

/**
 * Shared surface tones for page sections. Obsidian/ivory dominate per the
 * palette constraints in CLAUDE.md; individual pages decide which sections
 * read dark vs light so no page reads as monotone.
 */
export type SurfaceTone = "obsidian" | "ivory";

/**
 * Color intensity, independent of tone. "quiet" (default) is the flat
 * obsidian/ivory surface used for docs/forms/overview content. "vivid" swaps
 * in the coral/violet/champagne radial-gradient surface (src/index.css)
 * reserved for feature-highlight sections — hero, stats, showcase, timeline,
 * ROI, final CTAs — per the redesign's section-intensity split.
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
  obsidian: { quiet: "bg-obsidian text-ivory", vivid: "bg-surface-vivid-dark text-ivory" },
  ivory: { quiet: "bg-ivory text-obsidian", vivid: "bg-surface-vivid-light text-obsidian" },
};

const REVEAL_HIDDEN = { opacity: 0, y: 28 };
const REVEAL_VISIBLE = { opacity: 1, y: 0 };

/**
 * Generic full-bleed section wrapper: sets the surface tone/intensity,
 * generous vertical rhythm, a centered max-width container with the shared
 * horizontal gutter, and a single fade/rise reveal as the section scrolls
 * into view (motion-safe gated). Every page composes its sections from this
 * rather than hand-rolling spacing/surface/motion classes per page — it's
 * what gives ordinary content sections a consistent secondary motion
 * language alongside the hero/scroll-story's 3D choreography.
 */
export function PageSection({
  tone = "obsidian",
  intensity = "quiet",
  id,
  className,
  containerClassName,
  children,
}: PageSectionProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  return (
    <section id={id} className={clsx("w-full py-section-sm md:py-section-md", SURFACE_STYLES[tone][intensity], className)}>
      <motion.div
        className={clsx("mx-auto flex w-full max-w-6xl flex-col gap-12 px-gutter", containerClassName)}
        initial={prefersReducedMotion ? REVEAL_VISIBLE : REVEAL_HIDDEN}
        whileInView={REVEAL_VISIBLE}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}
