/**
 * Single source of truth for where each "application module" mesh sits at a
 * given point in the Build → Govern → Deploy story. Pure and deterministic —
 * no THREE/R3F imports, no randomness, no side effects — so it can be called
 * from SculptureModel, from the hero's explode/reassemble interaction, and
 * later reused as-is by scroll-choreography for scroll-scrubbed placement.
 */

export interface ModuleTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

/** Number of application-module meshes the sculpture renders. */
export const MODULE_COUNT = 5;

const TWO_PI = Math.PI * 2;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Smooth ease (0 at t<=0, 1 at t>=1) used to blend between keyframes. */
function smoothstep(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

interface Keyframe {
  /** Orbital radius around the sculpture's center. */
  radius: number;
  /** Vertical offset from the center plane. */
  height: number;
  /** Uniform scale multiplier. */
  scale: number;
  /** Extra rotation (radians) applied to every module's orbital angle. */
  spin: number;
  /** 0 = perfectly aligned/assembled, 1 = fully scattered/unassembled. */
  disorder: number;
}

/** Build: modules sit apart, unassembled, loosely scattered close to origin. */
const BUILD: Keyframe = { radius: 1.5, height: 0, scale: 0.72, spin: 0, disorder: 1 };
/** Govern: modules pull into a tighter, aligned ring — governance frames wrap them. */
const GOVERN: Keyframe = { radius: 2.35, height: 0.1, scale: 1, spin: 0.35, disorder: 0.22 };
/** Deploy: modules push outward into connected satellite positions. */
const DEPLOY: Keyframe = { radius: 4.1, height: 0, scale: 1.05, spin: 0.85, disorder: 0 };

/**
 * Deterministic per-module jitter seeds (fixed values, not Math.random())
 * so the Build-stage "unassembled" scatter is stable across renders/reloads.
 */
const SCATTER_SEEDS = [0.31, 0.74, 0.12, 0.88, 0.53, 0.19, 0.63, 0.41];

function seedFor(moduleIndex: number): number {
  return SCATTER_SEEDS[Math.abs(moduleIndex) % SCATTER_SEEDS.length];
}

function interpolateKeyframe(stage: number): Keyframe {
  const clamped = Math.min(1, Math.max(0, stage));
  const [from, to, localT] =
    clamped <= 0.5 ? [BUILD, GOVERN, clamped / 0.5] : [GOVERN, DEPLOY, (clamped - 0.5) / 0.5];
  const t = smoothstep(localT);
  return {
    radius: lerp(from.radius, to.radius, t),
    height: lerp(from.height, to.height, t),
    scale: lerp(from.scale, to.scale, t),
    spin: lerp(from.spin, to.spin, t),
    disorder: lerp(from.disorder, to.disorder, t),
  };
}

/**
 * Computes a module's transform at a given point in the Build(0) → Govern
 * (0.5) → Deploy(1) story. `stage` is clamped to [0, 1]; values outside that
 * range saturate at the nearest end rather than extrapolating.
 */
export function getModuleTransform(stage: number, moduleIndex: number): ModuleTransform {
  const kf = interpolateKeyframe(stage);
  const seed = seedFor(moduleIndex);
  const seedB = seedFor(moduleIndex + 3);
  const baseAngle = (moduleIndex / MODULE_COUNT) * TWO_PI;

  const jitterAngle = (seed - 0.5) * TWO_PI * 0.55 * kf.disorder;
  const jitterHeight = (seedB - 0.5) * 1.7 * kf.disorder;
  const angle = baseAngle + kf.spin + jitterAngle;

  const x = Math.cos(angle) * kf.radius;
  const z = Math.sin(angle) * kf.radius;
  const y = kf.height + jitterHeight;

  const rotY = angle + Math.PI / 2;
  const rotX = (seed - 0.5) * 0.7 * kf.disorder;
  const rotZ = (seedB - 0.5) * 0.45 * kf.disorder;

  return {
    position: [x, y, z],
    rotation: [rotX, rotY, rotZ],
    scale: kf.scale,
  };
}
