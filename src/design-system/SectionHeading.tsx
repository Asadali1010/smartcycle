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
  h1: "text-display",
  h2: "text-display-sm",
  h3: "text-heading",
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
        <p className="font-inter text-sm font-medium uppercase tracking-[0.3em] text-ash">{eyebrow}</p>
      ) : null}
      <Heading
        className={clsx(
          // h3 renders at 24px, and design.md bans the Esbuild/Sora display
          // face below 28px — so h3 gets Inter/medium instead of the shared
          // font-esbuild class the two larger display levels use.
          level === "h3" ? "font-inter font-medium" : "font-esbuild font-medium",
          HEADING_SIZE[level],
          headingClassName,
        )}
      >
        <MaskedReveal mode="word" active={reveal ? undefined : true}>
          {heading}
        </MaskedReveal>
      </Heading>
      {description ? <div className="max-w-2xl font-inter text-lg text-current/70">{description}</div> : null}
    </div>
  );
}
