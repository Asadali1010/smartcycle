import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";

/** The `--marquee-duration` custom property consumed by the `animate-marquee`
 * utility in index.css; CSSProperties doesn't know about custom properties by
 * name, hence the narrow cast below. */
type MarqueeStyle = CSSProperties & { "--marquee-duration"?: string };

export type MarqueeSpeed = "slow" | "normal" | "fast";

export interface MarqueeProps {
  /** Content repeated across the row (e.g. later, "BUILD · GOVERN · DEPLOY" —
   * this component never hardcodes that string, it just renders whatever it's given). */
  children: ReactNode;
  speed?: MarqueeSpeed;
  direction?: "left" | "right";
  className?: string;
}

const DURATIONS: Record<MarqueeSpeed, string> = {
  slow: "48s",
  normal: "30s",
  fast: "18s",
};

/**
 * Oversized horizontal moving-type row. Pure CSS keyframe animation (see the
 * `animate-marquee` utility + `@keyframes marquee` in index.css) rather than
 * a JS-driven scroll loop — cheaper, and it means the global
 * `prefers-reduced-motion` rule in index.css (which collapses animation
 * durations) already neutralizes it for free. `motion-safe:` additionally
 * skips assigning the animation at all under reduced motion, so the row
 * renders as a static single line instead of a frozen mid-loop frame.
 */
export function Marquee({ children, speed = "normal", direction = "left", className }: MarqueeProps) {
  const track = (
    <span className="flex shrink-0 items-center gap-[1em] whitespace-nowrap pr-[1em]">{children}</span>
  );

  return (
    <div className={clsx("relative flex w-full overflow-hidden", className)}>
      <div
        className={clsx(
          "flex w-max shrink-0 items-center motion-safe:animate-marquee",
          direction === "right" && "[animation-direction:reverse]",
        )}
        style={{ "--marquee-duration": DURATIONS[speed] } as MarqueeStyle}
      >
        {track}
        {/* Duplicate copy fills the loop seamlessly; hidden from assistive tech
            since the first copy already carries the accessible content. */}
        <span aria-hidden="true" className="flex shrink-0 items-center gap-[1em] whitespace-nowrap pr-[1em]">
          {children}
        </span>
      </div>
    </div>
  );
}
