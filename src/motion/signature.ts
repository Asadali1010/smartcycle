/**
 * Shared motion signature used by every animated section on the homepage
 * redesign (3D camera moves, DOM reveals, hover states) so independently
 * built sections still read as one designed system rather than nine
 * unrelated effects. One custom ease (an architectural "overshoot then
 * settle" — approaches slightly past its target before easing back,
 * instead of a generic monotonic power curve) plus one stagger rhythm,
 * exported in the three forms each consumer library needs.
 */

/** GSAP-native ease string (`back` ships with GSAP core, no plugin needed). */
export const SIGNATURE_EASE = "back.out(1.4)";

/** The same overshoot curve as a 4-number cubic-bezier, for Framer Motion. */
export const SIGNATURE_EASE_ARRAY: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

/** The same curve again, as a CSS `cubic-bezier()` string, for plain CSS transitions. */
export const SIGNATURE_EASE_CSS = `cubic-bezier(${SIGNATURE_EASE_ARRAY.join(", ")})`;

/** Base per-item stagger delay (seconds) used by every list/grid reveal. */
export const SIGNATURE_STAGGER = 0.08;

/** Stagger delay (seconds) for the nth item in a revealing list/grid. */
export function staggerDelay(index: number, base: number = SIGNATURE_STAGGER): number {
  return Math.max(0, index) * base;
}
