/**
 * Pure math for the hero's one-shot boot/arrival sequence: each module's
 * coral trace-line draws in first, then the module itself grows into place
 * along that line, staggered by module index so they visibly cascade in
 * rather than popping together. Kept separate from transforms.ts (which
 * has no notion of "arrival," only steady-state placement) so
 * SculptureModel can compose the two independently, and separately
 * unit-testable from the R3F rendering code that consumes it.
 */

const BOOT_STAGGER_PER_MODULE = 0.12;
const BOOT_WINDOW = 0.4;

export interface ModuleBootWindow {
  /** 0 → trace line not started, 1 → trace line fully drawn to the module's target. */
  traceT: number;
  /** 0 → module not visible yet, 1 → module fully grown in. */
  growT: number;
}

/**
 * This module's local progress through the shared `bootProgress` (0-1)
 * timeline. `traceT` reaches 1 before `growT` starts moving, so the line
 * always visibly finishes drawing before its module begins growing.
 */
export function moduleBootWindow(bootProgress: number, index: number): ModuleBootWindow {
  const clampedBoot = Math.min(1, Math.max(0, bootProgress));
  const local = Math.min(1, Math.max(0, (clampedBoot - index * BOOT_STAGGER_PER_MODULE) / BOOT_WINDOW));
  return {
    traceT: Math.min(1, local / 0.6),
    growT: Math.min(1, Math.max(0, (local - 0.6) / 0.4)),
  };
}
