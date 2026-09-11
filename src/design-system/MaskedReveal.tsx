import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import clsx from "clsx";

export type MaskedRevealMode = "word" | "line";

export interface MaskedRevealProps {
  /** A plain string (auto-split by the chosen `mode`) or a pre-split array of
   * lines/words when the caller wants to control the split itself. */
  children: string | ReactNode[];
  mode?: MaskedRevealMode;
  className?: string;
  /**
   * Explicit external trigger. Leave undefined for a self-contained,
   * independently-testable reveal driven by an internal IntersectionObserver
   * (fires once, the first time the element scrolls into view) — this is the
   * generic hook `scroll-choreography` will later drive by passing `active`
   * from its own scroll-trigger instead.
   */
  active?: boolean;
  /** Stagger delay between each split unit, in seconds. */
  staggerDelay?: number;
  /** Delay before the first unit animates, in seconds. */
  delay?: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.7;

/**
 * Masked line/word reveal-on-scroll-entry primitive. Renders each unit inside
 * an overflow-hidden mask and animates it up into view. Generic on purpose:
 * `scroll-choreography` wires real scroll triggers to it later via the
 * `active` prop; until then it works standalone via IntersectionObserver.
 */
export function MaskedReveal({
  children,
  mode = "word",
  className,
  active,
  staggerDelay = 0.05,
  delay = 0,
}: MaskedRevealProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [inView, setInView] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const isControlled = active !== undefined;
  const shouldReveal = isControlled ? active : inView;

  useEffect(() => {
    if (isControlled) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isControlled]);

  const units: ReactNode[] =
    typeof children === "string" ? (mode === "word" ? children.split(" ") : children.split("\n")) : children;

  return (
    <span ref={ref} className={clsx("inline-block", className)}>
      {units.map((unit, i) => {
        const isLast = i === units.length - 1;
        const transition = prefersReducedMotion
          ? { duration: 0 }
          : { duration: DURATION, ease: EASE, delay: delay + i * staggerDelay };
        return (
          <span
            key={i}
            className={clsx("relative overflow-hidden", mode === "line" ? "block" : "inline-block")}
          >
            <motion.span
              className="inline-block"
              initial={false}
              animate={
                prefersReducedMotion
                  ? { y: "0%", opacity: 1 }
                  : { y: shouldReveal ? "0%" : "100%", opacity: shouldReveal ? 1 : 0 }
              }
              transition={transition}
            >
              {unit}
              {mode === "word" && !isLast ? " " : ""}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
