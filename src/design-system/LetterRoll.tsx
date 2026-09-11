import { useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import clsx from "clsx";

export interface LetterRollProps {
  /** Visible text to split into animated characters. */
  children: string;
  className?: string;
  /**
   * Controls the roll externally (e.g. a parent nav link driving it from its
   * own hover state). When omitted, LetterRoll manages its own hover/focus
   * state, so it works standalone with zero wiring — this is how Button uses it.
   */
  active?: boolean;
  as?: "span" | "div";
}

const EASE = [0.65, 0, 0.35, 1] as const;
const DURATION = 0.4;
const STAGGER = 0.015;

/**
 * Reusable hover/focus "letter roll" text effect: each character sits in a
 * 1-line-tall mask with a duplicate stacked directly beneath it; activating
 * the roll slides both up so the duplicate takes the original's place.
 *
 * Framer Motion drives the transform (this is a hover/interaction effect, not
 * scroll-driven motion, so it's in-bounds per the project's GSAP-for-scroll /
 * Framer-for-interaction split). `useReducedMotion` is read directly so the
 * animation is skipped programmatically under prefers-reduced-motion, since a
 * Framer Motion inline transition can otherwise bypass the CSS-only
 * reduced-motion override in index.css.
 */
export function LetterRoll({ children, className, active, as = "span" }: LetterRollProps) {
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const isControlled = active !== undefined;
  const isActive = isControlled ? active : hovered;
  const Wrapper = as;

  const characters = Array.from(children);

  const hoverHandlers = isControlled
    ? {}
    : {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        onFocus: () => setHovered(true),
        onBlur: () => setHovered(false),
      };

  return (
    <Wrapper
      className={clsx("relative inline-flex overflow-hidden align-baseline", className)}
      aria-label={children}
      {...hoverHandlers}
    >
      <span aria-hidden="true" className="inline-flex">
        {characters.map((char, i) => {
          const glyph: ReactNode = char === " " ? " " : char;
          const transition = prefersReducedMotion
            ? { duration: 0 }
            : { duration: DURATION, ease: EASE, delay: i * STAGGER };
          const y = prefersReducedMotion ? "0%" : isActive ? "-100%" : "0%";
          return (
            <span key={i} className="relative inline-block overflow-hidden leading-none">
              <motion.span className="inline-block" animate={{ y }} transition={transition}>
                {glyph}
              </motion.span>
              <motion.span
                className="absolute left-0 top-full inline-block"
                animate={{ y }}
                transition={transition}
              >
                {glyph}
              </motion.span>
            </span>
          );
        })}
      </span>
    </Wrapper>
  );
}
