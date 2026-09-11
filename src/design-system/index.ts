/**
 * Design-system primitives. Every component here is presentational — it
 * takes content/props and never imports from src/content/**. Later phases
 * (three-d-hero, scroll-choreography, showcase-and-timeline, forms-and-pages)
 * build on these rather than hand-rolling their own buttons/badges/reveals.
 */
export { Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button";

export { Badge } from "./Badge";
export type { BadgeProps, BadgeTone } from "./Badge";

export { SectionHeading } from "./SectionHeading";
export type { SectionHeadingProps, SectionHeadingLevel } from "./SectionHeading";

export { MaskedReveal } from "./MaskedReveal";
export type { MaskedRevealProps, MaskedRevealMode } from "./MaskedReveal";

export { LetterRoll } from "./LetterRoll";
export type { LetterRollProps } from "./LetterRoll";

export { Marquee } from "./Marquee";
export type { MarqueeProps, MarqueeSpeed } from "./Marquee";
