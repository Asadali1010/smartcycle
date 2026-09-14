# Hero: procedural brain particle field

## Goal

Replace the hero's BUILD → GOVERN → DEPLOY glass sculpture with a single
`Points`-based particle brain that continuously assembles and disassembles on
a seamless ~12s loop, per the user's spec. `ScrollStoryScene` keeps the
original glass sculpture unchanged — this change is scoped to the hero's
opening view only.

## Component: `src/three/BrainField.tsx`

**Geometry** (built once via seeded RNG in `useMemo`, ~8000 points):

1. Ellipsoid base, points biased toward the surface shell (not volume-filled).
2. Layered 3D simplex noise (3-4 octaves) displaces each point along its
   normal to carve gyri folds.
3. Central fissure: thin the point density in a band around `x ≈ 0`.
4. Mirror across X for hemisphere symmetry.
5. Add a brainstem/cerebellum cluster at lower-back (negative Z, negative Y).

Per-point buffer attributes baked in at generation time:

- `aOrigin` — random start position in a large sphere (ASSEMBLE source).
- `aDelay` — 0-1.5s random stagger.
- `aCurl` — a control-point offset so the assemble path is a curved
  (quadratic bezier), not a straight line.
- `aSeed` — phase offset for jitter/pulse/disassemble-order.
- `aSurface` — 0-1 proximity to the shell; drives brightness/size and color
  mix.

**Material**: one custom `ShaderMaterial`, additive blending, depth-write
off. All motion is a pure function of a single `uTime` uniform (mod 12s) —
no per-frame CPU writes to positions.

- 0-4s (ASSEMBLE): ease-out-cubic lerp `aOrigin` → target along the curved
  path, offset by `aDelay`.
- 4-8s (HOLD): settled at target + low-amplitude noise jitter + brightness
  pulse (`sin(uTime * freq + aSeed)`); a uniform Y-rotation spins the group.
- 8-12s (DISASSEMBLE): drift outward along the surface normal, opacity → 0,
  staggered by angle around Y so the shape dissolves from one side first.
  Loops back to ASSEMBLE.

Fragment shader: soft round sprite via `smoothstep` falloff on
`gl_PointCoord`, color mix **champagne (`#D8BE97`) → violet (`#6D3FA6`,
soft tint `#9B6FC9`)** keyed by `aSurface` (replaces the spec's cyan, which
conflicts with the project's no-cyan/blue rule — user confirmed this
substitution). Size/brightness attenuate with camera distance for the
depth-of-field feel.

**Synapse flicker**: a second small draw call, `LineSegments` over ~150
precomputed nearest-neighbor point pairs, opacity flickering per-line via a
sine + random phase, visible only during HOLD.

**Interaction**:

- Drag rotates the group (manual pointer-down/move delta, not OrbitControls
  — avoids unwanted pan).
- Wheel/scroll dollies the camera in/out (clamped range).
- Cursor repel: a `uPointer` uniform (raycast onto a plane at the brain's
  depth) pushes nearby vertex positions outward in the vertex shader.

**Accessibility**: `prefers-reduced-motion` skips the assemble/disassemble
cycle — renders the fully-formed, non-rotating brain with only a slow
brightness pulse, no drag/repel motion beyond a static hover highlight.

## Integration changes

- `src/three/HeroScene.tsx`: mount `<BrainField>` in place of
  `<SculptureModel>`; drop the boot camera choreography that was staged
  around the sculpture's assembly (the brain's own loop is the reveal).
- `src/components/hero/Hero.tsx`: remove the "See it come apart" explode
  button and its GSAP timeline/state — it drove the sculpture's explode
  uniform, which no longer exists in the hero.
- Untouched: `SculptureModel.tsx`, `cameraPath.ts`, `materials.ts`,
  `lighting.ts`, `boot.ts`, `ScrollStoryScene.tsx`, `CanvasFallback.tsx`.

## Out of scope

- No standalone CDN-only HTML file — this ships directly as an R3F
  component per the user's chosen integration path.
- No changes to the scroll-story pinned sculpture sections.
