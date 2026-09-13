/**
 * Platform overview's feature list: each feature enters as a small
 * chip/module glyph sliding into place (echoing the sculpture's module
 * silhouette at 2D scale), with its name revealed via the existing
 * MaskedReveal primitive. Self-contained IntersectionObserver trigger, no
 * GSAP needed — this is a one-shot enter, not a scroll-scrubbed sequence.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MaskedReveal } from "@/design-system";
import { SIGNATURE_EASE_ARRAY, staggerDelay } from "@/motion/signature";

export interface PlatformFeatureRailItem {
  name: string;
  description: string;
}

export interface PlatformFeatureRailProps {
  features: PlatformFeatureRailItem[];
}

export function PlatformFeatureRail({ features }: PlatformFeatureRailProps) {
  const containerRef = useRef<HTMLUListElement | null>(null);
  const [active, setActive] = useState(false);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={containerRef} className="flex flex-col gap-3">
      {features.map((feature, i) => (
        <motion.li
          key={feature.name}
          initial={prefersReducedMotion ? false : { opacity: 0, x: -16, scale: 0.94 }}
          animate={active || prefersReducedMotion ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 0.45, ease: SIGNATURE_EASE_ARRAY, delay: staggerDelay(i) }}
          className="border-l-2 border-current/15 pl-4"
        >
          <p className="font-medium">
            <MaskedReveal active={active || Boolean(prefersReducedMotion)} delay={staggerDelay(i, 0.05)} mode="word">
              {feature.name}
            </MaskedReveal>
          </p>
          <p className="font-inter text-body text-current/70">{feature.description}</p>
        </motion.li>
      ))}
    </ul>
  );
}
