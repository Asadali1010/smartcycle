import type { ReactNode } from "react";
import clsx from "clsx";

/**
 * Shared surface tones for page sections. Obsidian/ivory dominate per the
 * palette constraints in CLAUDE.md; individual pages decide which sections
 * read dark vs light so no page reads as monotone.
 */
export type SurfaceTone = "obsidian" | "ivory";

export interface PageSectionProps {
  tone?: SurfaceTone;
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}

const TONE_STYLES: Record<SurfaceTone, string> = {
  obsidian: "bg-obsidian text-ivory",
  ivory: "bg-ivory text-obsidian",
};

/**
 * Generic full-bleed section wrapper: sets the surface tone, generous
 * vertical rhythm, and a centered max-width container with the shared
 * horizontal gutter. Every page composes its sections from this rather than
 * hand-rolling spacing/surface classes per page.
 */
export function PageSection({ tone = "obsidian", id, className, containerClassName, children }: PageSectionProps) {
  return (
    <section id={id} className={clsx("w-full py-section-sm md:py-section-md", TONE_STYLES[tone], className)}>
      <div className={clsx("mx-auto flex w-full max-w-6xl flex-col gap-12 px-gutter", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
