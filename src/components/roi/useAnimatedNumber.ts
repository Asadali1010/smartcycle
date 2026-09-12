import { useEffect, useRef, useState } from "react";

/**
 * Lightweight count-up: eases the displayed number from its previous value
 * to `value` over a short duration. Jumps straight to `value` under
 * `prefersReducedMotion` instead of animating.
 */
export function useAnimatedNumber(value: number, prefersReducedMotion: boolean | null | undefined): number {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(value);
      fromRef.current = value;
      return;
    }

    const from = fromRef.current;
    const to = value;
    const duration = 400;
    const start = performance.now();
    let raf = 0;

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, prefersReducedMotion]);

  return display;
}
