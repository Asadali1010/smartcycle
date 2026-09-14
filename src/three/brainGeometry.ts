/**
 * Pure, seeded procedural generator for the hero's particle-brain target
 * shape. No mesh/scene concerns here — BrainField.tsx turns this into
 * BufferGeometry attributes. Kept separate (mirrors transforms.ts/boot.ts)
 * so the math is unit-testable and independent of React/Three.
 *
 * Approach: sample random directions on a unit sphere, scale to an ellipsoid,
 * and modulate the radius per-direction with layered noise (fBm) to carve
 * gyri folds — this keeps every point exactly on/near the surface shell by
 * construction rather than filling the volume. Hemisphere points are forced
 * away from x=0 (deeper near the crown) for the central fissure, then
 * mirrored. A small fraction of points form a lower-back brainstem +
 * cerebellum cluster.
 */

export interface BrainGeometryData {
  /** Assembled ("target") position, xyz per point. */
  positions: Float32Array;
  /** Random point in a large sphere — the assemble source / disassemble destination. */
  origins: Float32Array;
  /** Per-point curve control offset, for the assemble/disassemble bezier path. */
  curls: Float32Array;
  /** vec4 per point: [delay(0-1.5), seedPhase(0-1), side(0-1, angle around Y), surface(0-1, shell depth)]. */
  params: Float32Array;
  /** 0-1 color-mix factor (mapped from height) for the champagne->violet gradient. */
  gradient: Float32Array;
  count: number;
}

/** Per-hemisphere ellipsoid radii (each hemisphere is generated as its own
 * shape at this size, then translated out to HEMISPHERE_CENTER_X). */
const RADII = { x: 0.5, y: 0.72, z: 1.0 };
/** Distance from the midline to each hemisphere's center — with RADII.x
 * above, this leaves a real ~0.16-unit medial gap (the central fissure). */
const HEMISPHERE_CENTER_X = 0.58;
const CEREBELLUM_CENTER_X = 0.14;
const FOLD_STRENGTH = 0.22;
const FOLD_FREQ = 2.6;
const SHELL_THICKNESS = 0.08;
const ORIGIN_SPHERE_RADIUS = 4.5;
const BRAINSTEM_RATIO = 0.1;

function mulberry32(seed: number): () => number {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash3(x: number, y: number, z: number): number {
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
  return h - Math.floor(h);
}

function valueNoise3D(x: number, y: number, z: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const w = zf * zf * (3 - 2 * zf);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const x00 = lerp(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), u);
  const x10 = lerp(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), u);
  const x01 = lerp(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), u);
  const x11 = lerp(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), u);
  const y0 = lerp(x00, x10, v);
  const y1 = lerp(x01, x11, v);
  return lerp(y0, y1, w) * 2 - 1;
}

function fbm3D(x: number, y: number, z: number, octaves: number): number {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += valueNoise3D(x * freq, y * freq, z * freq) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.1;
  }
  return sum / norm;
}

function randomUnitVector(rng: () => number): [number, number, number] {
  const u = rng();
  const v = rng();
  const theta = 2 * Math.PI * u;
  const z = 2 * v - 1;
  const r = Math.sqrt(Math.max(0, 1 - z * z));
  return [r * Math.cos(theta), r * Math.sin(theta), z];
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function generateBrainGeometry(count: number, seed = 1337): BrainGeometryData {
  const rng = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const origins = new Float32Array(count * 3);
  const curls = new Float32Array(count * 3);
  const params = new Float32Array(count * 4);
  const gradient = new Float32Array(count);

  const brainstemCount = Math.floor(count * BRAINSTEM_RATIO);
  const hemisphereCount = count - brainstemCount;

  for (let i = 0; i < count; i++) {
    let px: number;
    let py: number;
    let pz: number;
    let surface: number;

    if (i < hemisphereCount) {
      // Each hemisphere is its own clean, undistorted ellipsoid-with-folds,
      // translated away from the midline — NOT a shared sphere folded via
      // abs(x), which would crease/pile points onto a flat medial wall
      // instead of leaving a true gap between two curved surfaces.
      const [dx, dy, dz] = randomUnitVector(rng);
      const fold = fbm3D(dx * FOLD_FREQ, dy * FOLD_FREQ, dz * FOLD_FREQ, 4);
      const radiusMul = 1 + fold * FOLD_STRENGTH;
      const shellPull = 1 - rng() * SHELL_THICKNESS;
      surface = shellPull;

      const side = rng() < 0.5 ? -1 : 1;
      px = side * (HEMISPHERE_CENTER_X + dx * RADII.x * radiusMul * shellPull);
      py = dy * RADII.y * radiusMul * shellPull;
      pz = dz * RADII.z * radiusMul * shellPull;
    } else {
      const j = i - hemisphereCount;
      const clusterT = j / Math.max(1, brainstemCount - 1);
      if (clusterT < 0.45) {
        // Cerebellum: small mirrored ellipsoid pair, lower-back of the brain.
        const [dx, dy, dz] = randomUnitVector(rng);
        const side = rng() < 0.5 ? -1 : 1;
        px = side * (CEREBELLUM_CENTER_X + dx * 0.24);
        py = dy * 0.2 - RADII.y * 0.62;
        pz = dz * 0.28 - RADII.z * 0.78;
        surface = 1 - rng() * SHELL_THICKNESS;
      } else {
        // Brainstem: a thin, gently tapering column beneath the cerebellum.
        const t = rng();
        const taper = 1 - t * 0.4;
        const [dx, , dz] = randomUnitVector(rng);
        const radius = 0.09 * taper;
        px = dx * radius;
        py = -RADII.y * 0.62 - t * 0.42;
        pz = dz * radius - RADII.z * 0.55;
        surface = 1 - rng() * SHELL_THICKNESS * 0.5;
      }
    }

    positions[i * 3] = px;
    positions[i * 3 + 1] = py;
    positions[i * 3 + 2] = pz;

    const [ox, oy, oz] = randomUnitVector(rng);
    const originRadius = ORIGIN_SPHERE_RADIUS * (0.6 + rng() * 0.4);
    origins[i * 3] = ox * originRadius;
    origins[i * 3 + 1] = oy * originRadius;
    origins[i * 3 + 2] = oz * originRadius;

    const [ccx, ccy, ccz] = randomUnitVector(rng);
    const curlMag = 0.6 + rng() * 0.8;
    curls[i * 3] = ccx * curlMag;
    curls[i * 3 + 1] = ccy * curlMag;
    curls[i * 3 + 2] = ccz * curlMag;

    params[i * 4] = rng() * 1.5;
    params[i * 4 + 1] = rng();
    params[i * 4 + 2] = (Math.atan2(pz, px) / Math.PI + 1) * 0.5;
    params[i * 4 + 3] = surface;

    gradient[i] = clamp01((py / RADII.y + 1) * 0.5);
  }

  return { positions, origins, curls, params, gradient, count };
}

export interface SynapseLineData {
  /** Two endpoints per line, xyz each: [x0,y0,z0, x1,y1,z1, ...]. */
  positions: Float32Array;
  /** Same flicker phase repeated for both endpoints of a line. */
  phases: Float32Array;
  count: number;
}

const SYNAPSE_MIN_DIST = 0.05;
const SYNAPSE_MAX_DIST = 0.22;

/**
 * Picks random point pairs from an already-generated brain that fall within
 * a plausible "nearby" distance band, for the HOLD phase's flickering
 * synapse lines. A brute-force random-pair search (rather than a proper
 * nearest-neighbor structure) is enough at this line count — it's O(1) per
 * attempt and the search terminates once `lineCount` pairs are found or the
 * attempt budget runs out.
 */
export function generateSynapseLines(brain: BrainGeometryData, lineCount: number, seed = 4242): SynapseLineData {
  const rng = mulberry32(seed);
  const positions = new Float32Array(lineCount * 6);
  const phases = new Float32Array(lineCount * 2);
  const minDistSq = SYNAPSE_MIN_DIST * SYNAPSE_MIN_DIST;
  const maxDistSq = SYNAPSE_MAX_DIST * SYNAPSE_MAX_DIST;
  const maxAttempts = lineCount * 60;

  let written = 0;
  let attempts = 0;
  while (written < lineCount && attempts < maxAttempts) {
    attempts++;
    const i = Math.floor(rng() * brain.count);
    const j = Math.floor(rng() * brain.count);
    if (i === j) continue;

    const ix = brain.positions[i * 3];
    const iy = brain.positions[i * 3 + 1];
    const iz = brain.positions[i * 3 + 2];
    const jx = brain.positions[j * 3];
    const jy = brain.positions[j * 3 + 1];
    const jz = brain.positions[j * 3 + 2];
    const dx = ix - jx;
    const dy = iy - jy;
    const dz = iz - jz;
    const distSq = dx * dx + dy * dy + dz * dz;
    if (distSq < minDistSq || distSq > maxDistSq) continue;

    const phase = rng();
    positions[written * 6] = ix;
    positions[written * 6 + 1] = iy;
    positions[written * 6 + 2] = iz;
    positions[written * 6 + 3] = jx;
    positions[written * 6 + 4] = jy;
    positions[written * 6 + 5] = jz;
    phases[written * 2] = phase;
    phases[written * 2 + 1] = phase;
    written++;
  }

  return {
    positions: positions.slice(0, written * 6),
    phases: phases.slice(0, written * 2),
    count: written,
  };
}
