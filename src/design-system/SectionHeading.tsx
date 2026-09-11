import type { ReactNode } from "react";
import clsx from "clsx";
import { MaskedReveal } from "./MaskedReveal";

export type SectionHeadingLevel = "h1" | "h2" | "h3";

export interface SectionHeadingProps {
  /** Small uppercase label above the heading (e.g. a section kicker). */
  eyebrow?: ReactNode;
  /** Heading text — split and masked-revealed via MaskedReveal. */
  heading: string;
  description?: ReactNode;
  align?: "left" | "center";
  level?: SectionHeadingLevel;
  headingClassName?: string;
  className?: string;
  /**
   * Set to `false` to render the heading fully visible immediately instead of
   * waiting on MaskedReveal's own scroll-entry trigger — useful above the
   * fold, or anywhere a static render is preferable (e.g. the style guide).
   */
  reveal?: boolean;
}

const HEADING_SIZE: Record<SectionHeadingLevel, string> = {
  h1: "text-display-xl",
  h2: "text-display-lg",
  h3: "text-display-md",
};

/**
 * Eyebrow + oversized heading + optional description, the recurring section
 * intro pattern across the redesign's pages. Presentational only — takes
 * content via props, never reaches into src/content/**.
 */
export function SectionHeading({
  eyebrow,
  heading,
  description,
  align = "left",
  level = "h2",
  headingClassName,
  className,
  reveal = true,
}: SectionHeadingProps) {
  const Heading = level;

  return (
    <div className={clsx("flex flex-col gap-4", align === "center" && "items-center text-center", className)}>
      {eyebrow ? (
        <p className="font-body text-sm font-medium uppercase tracking-[0.3em] text-champagne">{eyebrow}</p>
      ) : null}
      <Heading className={clsx("font-display font-medium", HEADING_SIZE[level], headingClassName)}>
        <MaskedReveal mode="word" active={reveal ? undefined : true}>
          {heading}
        </MaskedReveal>
      </Heading>
      {description ? <div className="max-w-2xl font-body text-lg text-current/70">{description}</div> : null}
    </div>
  );
}
