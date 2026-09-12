# Homepage Motion Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every section of the homepage (`/`) a distinctive, futuristic animation appropriate to that section's content, all reading as one connected system via a shared motion signature and a shared 3D scene-state store, replacing the hero's generic auto-rotate/pointer-tilt with an intentional boot sequence.

**Architecture:** Two new shared primitives (`src/motion/signature.ts`, `src/motion/sceneStore.ts`) are built first and consumed by every later task. Four WebGL sections (Hero, ScrollStory, Showcase, Timeline) each keep their own lightweight `<Canvas>` (existing per-section convention) and hand state off via the shared store instead of one global canvas. Five 2D sections (Execution Gap, Platform, How It Works, Integrations, ROI) get section-tuned Framer Motion/GSAP treatments built from the same signature ease/stagger, with zero new WebGL.

**Tech Stack:** React 18 + TypeScript, React Three Fiber + drei + `@react-three/postprocessing`, GSAP + ScrollTrigger, Framer Motion (`motion/react`), Zustand, Vitest + Testing Library (existing project setup).

**Testing approach for this plan:** Every new *pure* module (`signature.ts`, `sceneStore.ts`, `boot.ts`) gets real Vitest unit tests written first, TDD-style — these are the parts with actual logic to get wrong. The codebase has no unit tests for animation *components* themselves (Hero, ScrollStory, etc. — confirmed: zero `*.test.tsx` files exist for any of them today); those are verified by `npm run build` (type-safety) plus a manual checklist (reduced-motion end-state, keyboard operability, no console errors), matching this project's own established verification pattern for GSAP/R3F work. Each task says which kind it is.

---

## Task 1: Shared motion signature (`design-system` phase)

**Files:**
- Create: `src/motion/signature.ts`
- Test: `src/motion/signature.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/motion/signature.test.ts
import { describe, expect, it } from "vitest";
import { SIGNATURE_EASE, SIGNATURE_EASE_ARRAY, SIGNATURE_EASE_CSS, SIGNATURE_STAGGER, staggerDelay } from "./signature";

describe("signature ease constants", () => {
  it("exposes a GSAP-native overshoot-then-settle ease", () => {
    expect(SIGNATURE_EASE).toBe("back.out(1.4)");
  });

  it("exposes a 4-number bezier array for Framer Motion consumers", () => {
    expect(SIGNATURE_EASE_ARRAY).toEqual([0.34, 1.56, 0.64, 1]);
  });

  it("derives a matching CSS cubic-bezier string from the same array", () => {
    expect(SIGNATURE_EASE_CSS).toBe("cubic-bezier(0.34, 1.56, 0.64, 1)");
  });
});

describe("staggerDelay", () => {
  it("returns zero delay for the first item", () => {
    expect(staggerDelay(0)).toBe(0);
  });

  it("scales linearly with index using the signature stagger constant", () => {
    expect(staggerDelay(3)).toBeCloseTo(3 * SIGNATURE_STAGGER);
  });

  it("accepts a custom base delay", () => {
    expect(staggerDelay(2, 0.1)).toBeCloseTo(0.2);
  });

  it("clamps negative indices to zero delay", () => {
    expect(staggerDelay(-5)).toBe(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/motion/signature.test.ts`
Expected: FAIL — `Cannot find module './signature'` (file doesn't exist yet).

- [ ] **Step 3: Write the implementation**

```ts
// src/motion/signature.ts
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/motion/signature.test.ts`
Expected: PASS — 7 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/motion/signature.ts src/motion/signature.test.ts
git commit -m "$(cat <<'EOF'
Add shared motion signature (ease + stagger constants)

One overshoot-then-settle ease and one stagger rhythm, exported for
GSAP/Framer Motion/CSS consumers, so every later homepage motion task
builds from the same designed curve instead of ad hoc easing.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Shared scene store (`design-system` phase)

**Files:**
- Create: `src/motion/sceneStore.ts`
- Test: `src/motion/sceneStore.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/motion/sceneStore.test.ts
import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_CAMERA_POSE, useSceneStore } from "./sceneStore";

describe("useSceneStore", () => {
  beforeEach(() => {
    useSceneStore.setState({
      activeStage: 0,
      lastCameraPose: DEFAULT_CAMERA_POSE,
      hoveredModuleIndex: null,
      accentPulse: 0,
    });
  });

  it("clamps activeStage to [0, 1]", () => {
    useSceneStore.getState().setActiveStage(1.4);
    expect(useSceneStore.getState().activeStage).toBe(1);
    useSceneStore.getState().setActiveStage(-0.2);
    expect(useSceneStore.getState().activeStage).toBe(0);
  });

  it("stores the last camera pose verbatim", () => {
    const pose = { position: [1, 2, 3] as [number, number, number], lookAt: [0, 0, 0] as [number, number, number] };
    useSceneStore.getState().setLastCameraPose(pose);
    expect(useSceneStore.getState().lastCameraPose).toEqual(pose);
  });

  it("clamps accentPulse to [0, 1]", () => {
    useSceneStore.getState().setAccentPulse(2);
    expect(useSceneStore.getState().accentPulse).toBe(1);
    useSceneStore.getState().setAccentPulse(-1);
    expect(useSceneStore.getState().accentPulse).toBe(0);
  });

  it("tracks hoveredModuleIndex including null", () => {
    useSceneStore.getState().setHoveredModuleIndex(2);
    expect(useSceneStore.getState().hoveredModuleIndex).toBe(2);
    useSceneStore.getState().setHoveredModuleIndex(null);
    expect(useSceneStore.getState().hoveredModuleIndex).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/motion/sceneStore.test.ts`
Expected: FAIL — `Cannot find module './sceneStore'`.

- [ ] **Step 3: Write the implementation**

```ts
// src/motion/sceneStore.ts
/**
 * Shared Zustand store that lets the homepage's WebGL sections (Hero,
 * ScrollStory, Showcase, Timeline) hand the sculpture's state off to each
 * other across separate <Canvas> mounts, so scrolling from one WebGL
 * section to the next feels like one continuous object rather than
 * independent scenes resetting to a cold start every time. Deliberately
 * NOT a single shared canvas spanning the page — see
 * docs/superpowers/specs/2026-09-12-homepage-motion-redesign-design.md for
 * why that approach was considered and rejected. Each section keeps its
 * own lightweight Canvas (existing `useCanvasFrameloop` pattern) and
 * reads/writes this store instead.
 */
import { create } from "zustand";

export interface CameraPoseState {
  position: [number, number, number];
  lookAt: [number, number, number];
}

export interface SceneState {
  activeStage: number;
  lastCameraPose: CameraPoseState;
  hoveredModuleIndex: number | null;
  accentPulse: number;
  setActiveStage: (stage: number) => void;
  setLastCameraPose: (pose: CameraPoseState) => void;
  setHoveredModuleIndex: (index: number | null) => void;
  setAccentPulse: (pulse: number) => void;
}

/** Matches HeroScene's own resting camera pose, so a section that mounts
 * before Hero ever writes to the store still gets a sensible starting pose. */
export const DEFAULT_CAMERA_POSE: CameraPoseState = {
  position: [0, 0.3, 10.5],
  lookAt: [0, 0, 0],
};

export const useSceneStore = create<SceneState>((set) => ({
  activeStage: 0,
  lastCameraPose: DEFAULT_CAMERA_POSE,
  hoveredModuleIndex: null,
  accentPulse: 0,
  setActiveStage: (stage) => set({ activeStage: Math.min(1, Math.max(0, stage)) }),
  setLastCameraPose: (pose) => set({ lastCameraPose: pose }),
  setHoveredModuleIndex: (index) => set({ hoveredModuleIndex: index }),
  setAccentPulse: (pulse) => set({ accentPulse: Math.min(1, Math.max(0, pulse)) }),
}));
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/motion/sceneStore.test.ts`
Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/motion/sceneStore.ts src/motion/sceneStore.test.ts
git commit -m "$(cat <<'EOF'
Add shared scene store for cross-section sculpture handoff

Zustand store holding the sculpture's last stage/camera-pose/glow
state, read and written by Hero/ScrollStory/Showcase/Timeline so the
object appears to persist across their separate Canvas mounts.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Boot-sequence math + `SculptureModel` arrival support (`three-d-hero` phase)

**Files:**
- Create: `src/three/boot.ts`
- Test: `src/three/boot.test.ts`
- Modify: `src/three/SculptureModel.tsx`

- [ ] **Step 1: Write the failing test for the pure boot math**

```ts
// src/three/boot.test.ts
import { describe, expect, it } from "vitest";
import { moduleBootWindow } from "./boot";

describe("moduleBootWindow", () => {
  it("keeps the first module (index 0) fully hidden before boot starts", () => {
    const window = moduleBootWindow(0, 0);
    expect(window.traceT).toBe(0);
    expect(window.growT).toBe(0);
  });

  it("fully grows every module once bootProgress reaches 1", () => {
    for (let i = 0; i < 5; i++) {
      const window = moduleBootWindow(1, i);
      expect(window.traceT).toBe(1);
      expect(window.growT).toBe(1);
    }
  });

  it("staggers later modules behind earlier ones at the same bootProgress", () => {
    const first = moduleBootWindow(0.5, 0);
    const last = moduleBootWindow(0.5, 4);
    expect(last.growT).toBeLessThanOrEqual(first.growT);
    expect(last.traceT).toBeLessThanOrEqual(first.traceT);
  });

  it("draws the trace line before the module starts growing", () => {
    const window = moduleBootWindow(0.15, 0);
    expect(window.traceT).toBeGreaterThan(0);
    expect(window.growT).toBe(0);
  });

  it("clamps bootProgress outside [0, 1]", () => {
    expect(moduleBootWindow(-1, 0)).toEqual(moduleBootWindow(0, 0));
    expect(moduleBootWindow(2, 0)).toEqual(moduleBootWindow(1, 0));
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/three/boot.test.ts`
Expected: FAIL — `Cannot find module './boot'`.

- [ ] **Step 3: Write the implementation**

```ts
// src/three/boot.ts
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
    growT: Math.min(1, Math.max(0, (local - 0.4) / 0.6)),
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/three/boot.test.ts`
Expected: PASS — 5 tests passing.

- [ ] **Step 5: Modify `SculptureModel.tsx` to consume it**

Replace the full contents of `src/three/SculptureModel.tsx` with:

```tsx
/**
 * Original geometry (no Trionn assets) representing the Build → Govern →
 * Deploy application lifecycle as a small set of architectural "module"
 * meshes orbiting an obsidian core:
 *  - Build (stage ~0): modules sit apart, unassembled, loosely scattered.
 *  - Govern (stage ~0.5): modules pull into an aligned ring; faint champagne
 *    governance rings fade in around each module.
 *  - Deploy (stage ~1): modules push outward into satellite positions,
 *    connected to the core by illuminated coral lines.
 *
 * Position/rotation/scale come from the shared, pure `getModuleTransform` —
 * this component never computes placement itself, so scroll-choreography
 * reuses the exact same math. `explode` is an *additive* radial offset
 * layered on top of that base transform, driven by the hero's
 * explode/reassemble interaction.
 *
 * Two optional props drive the hero's boot sequence only (ScrollStory never
 * passes them, so it always renders fully arrived / non-breathing):
 * `bootProgress` gates a one-shot trace-line + grow-in arrival per module
 * (math in ./boot.ts), and `breathing` pulses the core's scale slightly
 * instead of sitting perfectly still.
 *
 * Each module also answers pointer hover directly (`onPointerOver`/-`Out`):
 * its champagne edge brightens and it lifts slightly outward, so the
 * sculpture reads as a tangible, inspectable object rather than a passive
 * background animation.
 */
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { Edges, Line, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { MODULE_COUNT, getModuleTransform } from "./transforms";
import { moduleBootWindow } from "./boot";
import {
  PALETTE,
  createCoralAccentMaterial,
  createGlassModulePreset,
  createGovernanceRingMaterial,
  createObsidianCoreMaterial,
} from "./materials";

export interface SculptureModelProps {
  /** 0 (Build) → 0.5 (Govern) → 1 (Deploy). The single driver of the story. */
  stage: number;
  /**
   * Additional outward radial push applied on top of each module's base
   * transform, 0 (none, at rest per `stage`) → 1 (fully exploded). Driven by
   * the hero's keyboard-accessible explode/reassemble interaction.
   */
  explode?: number;
  /**
   * 0 → nothing has arrived yet, 1 (default) → fully arrived / normal
   * rendering. Drives the hero's one-shot boot sequence only.
   */
  bootProgress?: number;
  /** When true, the obsidian core pulses with a slow, near-imperceptible
   * breathing scale. Off by default. */
  breathing?: boolean;
}

const MODULE_ARGS: [number, number, number] = [1, 1.3, 0.55];
/** Per-module explode distance grows with index, per the brief. */
const EXPLODE_BASE_DISTANCE = 2.2;
const EXPLODE_PER_INDEX = 0.4;
const BREATHING_SPEED = 0.6;
const BREATHING_AMPLITUDE = 0.015;

function radialDirection(position: readonly [number, number, number]): [number, number, number] {
  const [x, y, z] = position;
  const length = Math.hypot(x, y, z);
  if (length < 1e-4) return [1, 0, 0];
  return [x / length, y / length, z / length];
}

export function SculptureModel({ stage, explode = 0, bootProgress = 1, breathing = false }: SculptureModelProps) {
  const clampedStage = Math.min(1, Math.max(0, stage));
  const clampedExplode = Math.min(1, Math.max(0, explode));
  const clampedBoot = Math.min(1, Math.max(0, bootProgress));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const coreRef = useRef<Mesh>(null);

  const glassPreset = useMemo(() => createGlassModulePreset(), []);
  const coreMaterial = useMemo(() => createObsidianCoreMaterial(), []);
  const edgeColor = useMemo(() => new THREE.Color(PALETTE.champagne), []);
  const ringMaterial = useMemo(() => createGovernanceRingMaterial(0.55), []);

  useFrame((state) => {
    const core = coreRef.current;
    if (!core || !breathing) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * BREATHING_SPEED) * BREATHING_AMPLITUDE;
    core.scale.setScalar(pulse);
  });

  // Governance rings fade in across the Build→Govern transition and persist.
  const ringOpacity = Math.min(1, Math.max(0, (clampedStage - 0.1) / 0.35)) * 0.55;
  // Satellite connections illuminate mainly across the Govern→Deploy transition.
  const connectionGlow = Math.min(1, Math.max(0, (clampedStage - 0.4) / 0.6));
  const coralMaterial = useMemo(() => createCoralAccentMaterial(0.2), []);
  coralMaterial.emissiveIntensity = 0.15 + connectionGlow * 1.1;
  ringMaterial.opacity = ringOpacity;

  const modules = useMemo(
    () =>
      Array.from({ length: MODULE_COUNT }, (_, i) => {
        const base = getModuleTransform(clampedStage, i);
        const direction = radialDirection(base.position);
        const explodeDistance = (EXPLODE_BASE_DISTANCE + i * EXPLODE_PER_INDEX) * clampedExplode;
        const position: [number, number, number] = [
          base.position[0] + direction[0] * explodeDistance,
          base.position[1] + direction[1] * explodeDistance,
          base.position[2] + direction[2] * explodeDistance,
        ];
        return { index: i, base, position };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recompute per stage/explode
    [clampedStage, clampedExplode],
  );

  return (
    <group>
      {/* Obsidian core / platform hub */}
      <RoundedBox ref={coreRef} args={[0.9, 0.9, 0.9]} radius={0.12} smoothness={4} material={coreMaterial} />

      {modules.map(({ index, base, position }) => {
        const isHovered = hoveredIndex === index;
        const { growT } = moduleBootWindow(clampedBoot, index);
        const hoverScale = base.scale * (isHovered ? 1.08 : 1) * Math.max(0.001, growT);
        return (
          <group
            key={index}
            position={position}
            rotation={base.rotation}
            scale={hoverScale}
            onPointerOver={(event) => {
              event.stopPropagation();
              setHoveredIndex(index);
            }}
            onPointerOut={(event) => {
              event.stopPropagation();
              setHoveredIndex((current) => (current === index ? null : current));
            }}
          >
            <RoundedBox args={MODULE_ARGS} radius={0.06} smoothness={3}>
              <MeshTransmissionMaterial {...glassPreset} />
              <Edges color={isHovered ? PALETTE.coral : edgeColor} lineWidth={isHovered ? 2 : 1.25} threshold={20} />
            </RoundedBox>
            {/* Governance ring frame around this module */}
            <mesh rotation={[Math.PI / 2, 0, 0]} material={ringMaterial}>
              <torusGeometry args={[0.95, 0.03, 12, 48]} />
            </mesh>
          </group>
        );
      })}

      {/* Illuminated connections from core to each deployed module */}
      {modules.map(({ index, position }) => (
        <Line
          key={index}
          points={[
            [0, 0, 0],
            position,
          ]}
          color={PALETTE.coral}
          lineWidth={1}
          transparent
          opacity={connectionGlow * 0.75}
        />
      ))}

      {/* satellite node markers at deploy connection endpoints, glow-driven */}
      {modules.map(({ index, position }) => (
        <mesh key={index} position={position} material={coralMaterial} scale={0.12 + connectionGlow * 0.06}>
          <sphereGeometry args={[1, 12, 12]} />
        </mesh>
      ))}

      {/* Boot-only: coral trace-lines each module travels in along, drawn by
          lerping the line's far endpoint from the core out to the module's
          target position as that module's local boot window progresses. */}
      {clampedBoot < 1
        ? modules.map(({ index, position }) => {
            const { traceT } = moduleBootWindow(clampedBoot, index);
            if (traceT <= 0) return null;
            const endpoint: [number, number, number] = [
              position[0] * traceT,
              position[1] * traceT,
              position[2] * traceT,
            ];
            return (
              <Line
                key={`trace-${index}`}
                points={[
                  [0, 0, 0],
                  endpoint,
                ]}
                color={PALETTE.coral}
                lineWidth={1.5}
                transparent
                opacity={0.9}
              />
            );
          })
        : null}
    </group>
  );
}
```

- [ ] **Step 6: Verify the full test suite and build still pass**

Run: `npx vitest run src/three/boot.test.ts && npx tsc -b --noEmit`
Expected: vitest PASS (5 tests); tsc reports no errors.

- [ ] **Step 7: Commit**

```bash
git add src/three/boot.ts src/three/boot.test.ts src/three/SculptureModel.tsx
git commit -m "$(cat <<'EOF'
Add boot-sequence arrival math and wire it into SculptureModel

New pure moduleBootWindow() (unit tested) staggers each module's
coral trace-line draw-in and grow-in by index. SculptureModel gains
optional bootProgress/breathing props, both defaulted off so
ScrollStory's existing reuse of this component is unaffected.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Hero boot-sequence choreography (`three-d-hero` phase)

Replaces the hero's ambient-auto-rotate + wide-open camera with a close-up boot sequence, writes the resolved end state to the shared scene store, and tightens pointer parallax. This is a visual/choreography change — verified via build + manual dev-server check (documented codebase convention; no unit tests exist for HeroScene today).

**Files:**
- Modify: `src/three/HeroScene.tsx`

- [ ] **Step 1: Replace the full contents of `src/three/HeroScene.tsx`**

```tsx
/**
 * Contents mounted inside the hero's R3F <Canvas>: lighting rig, the boot
 * sequence (camera opens on an extreme close-up of the core, holds
 * briefly, then modules arrive along coral trace-lines while the camera
 * pulls back to its resting framing), a slow breathing idle on the core
 * (replacing the previous continuous auto-rotate, which read as generic
 * rather than deliberate), and pointer-responsive parallax.
 *
 * Deliberately does NOT own the explode/reassemble button — that's a real
 * DOM <button> in Hero.tsx (focusable, keyboard-operable outside the
 * canvas); this component only receives the resulting `explode` value as a
 * prop and forwards it to SculptureModel.
 */
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { SculptureModel } from "./SculptureModel";
import { useSceneLightingRig } from "./lighting";
import { SceneEffects } from "./SceneEffects";
import { useSceneStore } from "@/motion/sceneStore";
import { SIGNATURE_EASE } from "@/motion/signature";

export interface HeroSceneProps {
  /** Additive explode amount (0-1), driven externally by Hero.tsx's button. */
  explode?: number;
}

/** Pointer parallax tilt cap, radians — tightened from the previous 0.1 so
 * the sculpture reads as steady/engineered rather than loosely wobbling. */
const PARALLAX_MAX = 0.06;
/** How quickly the parallax group eases toward the pointer's target tilt. */
const PARALLAX_DAMPING = 3.2;

const CAMERA_CLOSE = { x: 0, y: 0.05, z: 2.3 };
const CAMERA_REST = { x: 0, y: 0.3, z: 10.5 };

export function HeroScene({ explode = 0 }: HeroSceneProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { camera } = useThree();
  const parallaxGroupRef = useRef<Group>(null);
  const [stage, setStage] = useState(prefersReducedMotion ? 1 : 0);
  const [bootProgress, setBootProgress] = useState(prefersReducedMotion ? 1 : 0);
  const lightingRig = useSceneLightingRig();
  const setActiveStage = useSceneStore((state) => state.setActiveStage);
  const setLastCameraPose = useSceneStore((state) => state.setLastCameraPose);

  // Boot sequence: camera opens close on the core, modules trace-line their
  // way in staggered by index, camera pulls back to its resting framing.
  useEffect(() => {
    if (prefersReducedMotion) {
      camera.position.set(CAMERA_REST.x, CAMERA_REST.y, CAMERA_REST.z);
      camera.lookAt(0, 0, 0);
      setStage(1);
      setBootProgress(1);
      setActiveStage(1);
      setLastCameraPose({ position: [CAMERA_REST.x, CAMERA_REST.y, CAMERA_REST.z], lookAt: [0, 0, 0] });
      return;
    }

    camera.position.set(CAMERA_CLOSE.x, CAMERA_CLOSE.y, CAMERA_CLOSE.z);
    camera.lookAt(0, 0, 0);

    const bootProxy = { value: 0 };
    const stageProxy = { value: 0 };

    const timeline = gsap.timeline({
      onComplete: () => {
        setActiveStage(1);
        setLastCameraPose({ position: [CAMERA_REST.x, CAMERA_REST.y, CAMERA_REST.z], lookAt: [0, 0, 0] });
      },
    });
    timeline
      .to(
        bootProxy,
        { value: 1, duration: 1.6, ease: SIGNATURE_EASE, onUpdate: () => setBootProgress(bootProxy.value) },
        0,
      )
      .to(stageProxy, { value: 1, duration: 1.6, ease: "power2.out", onUpdate: () => setStage(stageProxy.value) }, 0.4)
      .to(
        camera.position,
        {
          x: CAMERA_REST.x,
          y: CAMERA_REST.y,
          z: CAMERA_REST.z,
          duration: 1.8,
          ease: SIGNATURE_EASE,
          onUpdate: () => camera.lookAt(0, 0, 0),
        },
        0.5,
      );

    return () => {
      timeline.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot mount choreography
  }, [prefersReducedMotion]);

  // Pointer parallax only — the previous continuous auto-rotate is gone;
  // SculptureModel's own `breathing` prop now carries the idle "alive" feel.
  useFrame((state, delta) => {
    const parallaxGroup = parallaxGroupRef.current;
    if (!parallaxGroup) return;
    const targetX = prefersReducedMotion ? 0 : -state.pointer.y * PARALLAX_MAX;
    const targetZ = prefersReducedMotion ? 0 : state.pointer.x * PARALLAX_MAX;
    const damp = Math.min(1, delta * PARALLAX_DAMPING);
    parallaxGroup.rotation.x += (targetX - parallaxGroup.rotation.x) * damp;
    parallaxGroup.rotation.z += (targetZ - parallaxGroup.rotation.z) * damp;
  });

  return (
    <>
      {lightingRig.map((light) =>
        light.type === "ambient" ? (
          <ambientLight key={light.role} color={light.color} intensity={light.intensity} />
        ) : light.type === "directional" ? (
          <directionalLight key={light.role} color={light.color} intensity={light.intensity} position={light.position} />
        ) : (
          <pointLight key={light.role} color={light.color} intensity={light.intensity} position={light.position} />
        ),
      )}

      <group ref={parallaxGroupRef}>
        <SculptureModel stage={stage} explode={explode} bootProgress={bootProgress} breathing={!prefersReducedMotion} />
      </group>

      <SceneEffects />
    </>
  );
}
```

- [ ] **Step 2: Build check**

Run: `npx tsc -b --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual verification (dev server)**

Run: `npm run dev`, open `/`, and confirm:
- The hero opens close on the core, then modules visibly trace in and the camera pulls back (no full-object spin at any point).
- With OS/browser "reduce motion" enabled, the hero renders instantly at its resting, fully-assembled state — no animation plays.
- Tab to "See it come apart" — it still explodes/reassembles correctly (unchanged behavior).
- No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/three/HeroScene.tsx
git commit -m "$(cat <<'EOF'
Replace hero auto-rotate with a close-up boot sequence

Camera now opens tight on the core and pulls back as modules trace
in, instead of the previous wide shot + continuous auto-rotate.
Writes the resolved end state to the shared scene store for
ScrollStory to hand off from; pointer parallax tightened.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: ScrollStory camera handoff + signature easing (`scroll-choreography` phase)

**Files:**
- Modify: `src/three/ScrollStoryScene.tsx`
- Modify: `src/components/scroll-story/ScrollStoryPinned.tsx`

- [ ] **Step 1: Replace the full contents of `src/three/ScrollStoryScene.tsx`**

```tsx
/**
 * R3F scene content for the homepage's scroll-story sequence. Unlike
 * HeroScene (which owns a one-shot mount choreography), this scene is a
 * pure function of an externally-driven `stage` (0-1, set from GSAP
 * ScrollTrigger progress in ScrollStoryPinned.tsx). On mount it blends from
 * wherever Hero left the camera (read from the shared scene store) into its
 * own scroll-driven pose over a short handoff window, so cutting from
 * Hero's Canvas to this one doesn't read as a hard jump.
 */
import { useEffect, useRef } from "react";
import type { Group } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { SculptureModel } from "./SculptureModel";
import { useSceneLightingRig } from "./lighting";
import { SceneEffects } from "./SceneEffects";
import { getCameraPose } from "./cameraPath";
import { useSceneStore } from "@/motion/sceneStore";

export interface ScrollStorySceneProps {
  stage: number;
}

const AMBIENT_ROTATION_SPEED = 0.03;
const PARALLAX_MAX = 0.08;
const PARALLAX_DAMPING = 3.2;
/** How long (seconds) the camera blends from Hero's handed-off pose into
 * this scene's own scroll-driven pose. */
const HANDOFF_DURATION = 0.6;

export function ScrollStoryScene({ stage }: ScrollStorySceneProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { camera } = useThree();
  const ambientGroupRef = useRef<Group>(null);
  const parallaxGroupRef = useRef<Group>(null);
  const lightingRig = useSceneLightingRig(0.9);
  const handoffPose = useRef(useSceneStore.getState().lastCameraPose);
  const lastPoseRef = useRef(handoffPose.current);
  const mountTime = useRef<number | null>(null);
  const setActiveStage = useSceneStore((state) => state.setActiveStage);
  const setLastCameraPose = useSceneStore((state) => state.setLastCameraPose);

  useEffect(() => {
    setActiveStage(stage);
  }, [stage, setActiveStage]);

  useEffect(() => {
    return () => {
      setLastCameraPose(lastPoseRef.current);
    };
  }, [setLastCameraPose]);

  useFrame((state, delta) => {
    if (mountTime.current === null) mountTime.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - mountTime.current;
    const target = getCameraPose(stage);
    const blend = prefersReducedMotion ? 1 : Math.min(1, elapsed / HANDOFF_DURATION);
    const from = handoffPose.current;

    const position: [number, number, number] = [
      from.position[0] + (target.position[0] - from.position[0]) * blend,
      from.position[1] + (target.position[1] - from.position[1]) * blend,
      from.position[2] + (target.position[2] - from.position[2]) * blend,
    ];
    const lookAt: [number, number, number] = [
      from.lookAt[0] + (target.lookAt[0] - from.lookAt[0]) * blend,
      from.lookAt[1] + (target.lookAt[1] - from.lookAt[1]) * blend,
      from.lookAt[2] + (target.lookAt[2] - from.lookAt[2]) * blend,
    ];
    camera.position.set(...position);
    camera.lookAt(...lookAt);
    lastPoseRef.current = { position, lookAt };

    if (!prefersReducedMotion && ambientGroupRef.current) {
      ambientGroupRef.current.rotation.y += AMBIENT_ROTATION_SPEED * delta;
    }
    const parallaxGroup = parallaxGroupRef.current;
    if (parallaxGroup) {
      const targetX = prefersReducedMotion ? 0 : -state.pointer.y * PARALLAX_MAX;
      const targetZ = prefersReducedMotion ? 0 : state.pointer.x * PARALLAX_MAX;
      const damp = Math.min(1, delta * PARALLAX_DAMPING);
      parallaxGroup.rotation.x += (targetX - parallaxGroup.rotation.x) * damp;
      parallaxGroup.rotation.z += (targetZ - parallaxGroup.rotation.z) * damp;
    }
  });

  return (
    <>
      {lightingRig.map((light) =>
        light.type === "ambient" ? (
          <ambientLight key={light.role} color={light.color} intensity={light.intensity} />
        ) : light.type === "directional" ? (
          <directionalLight key={light.role} color={light.color} intensity={light.intensity} position={light.position} />
        ) : (
          <pointLight key={light.role} color={light.color} intensity={light.intensity} position={light.position} />
        ),
      )}

      <group ref={ambientGroupRef}>
        <group ref={parallaxGroupRef}>
          <SculptureModel stage={stage} />
        </group>
      </group>

      <SceneEffects />
    </>
  );
}
```

- [ ] **Step 2: Swap the panel transition to the shared signature ease**

In `src/components/scroll-story/ScrollStoryPinned.tsx`, add the import:

```tsx
import { SIGNATURE_EASE_ARRAY } from "@/motion/signature";
```

alongside the existing imports at the top of the file, then replace:

```tsx
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
```

with:

```tsx
              transition={{ duration: 0.35, ease: SIGNATURE_EASE_ARRAY }}
```

- [ ] **Step 3: Build check**

Run: `npx tsc -b --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual verification (dev server)**

Run: `npm run dev`, scroll from the hero into the scroll-story section, and confirm:
- The camera does not visibly snap/jump at the boundary between Hero's canvas and ScrollStory's.
- Scroll-scrubbing through Build → Govern → Deploy still works smoothly in both directions.
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/three/ScrollStoryScene.tsx src/components/scroll-story/ScrollStoryPinned.tsx
git commit -m "$(cat <<'EOF'
Blend ScrollStory's camera in from Hero's handed-off pose

Reads the shared scene store's last camera pose on mount and blends
into its own scroll-driven pose over 0.6s instead of starting cold,
so the cut between Hero's and ScrollStory's separate Canvas mounts
reads as one continuous camera move. Panel transition now uses the
shared motion signature ease.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: `StepList` traced variant (`scroll-choreography` phase)

**Files:**
- Modify: `src/components/common/StepList.tsx`

- [ ] **Step 1: Replace the full contents of `src/components/common/StepList.tsx`**

```tsx
import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import clsx from "clsx";
import { SIGNATURE_EASE, staggerDelay } from "@/motion/signature";

gsap.registerPlugin(ScrollTrigger);

export interface StepListItem {
  key: string;
  name: string;
  description?: string | null;
}

export interface StepListProps {
  steps: StepListItem[];
  className?: string;
  footnote?: ReactNode;
  /**
   * When true, each step's left border and numeral light up coral in
   * sequence as the list scrolls into view (a PCB-trace-style "process
   * executing" reveal) instead of rendering statically. Defaults to false
   * so existing callers (platform how-it-works, delivery timeline, contact
   * process) are unaffected.
   */
  traced?: boolean;
}

/**
 * Plain numbered process list (used for the homepage's 4-step and
 * /platform's 5-step "How It Works", the delivery-model phases, and the
 * contact process), with an opt-in `traced` reveal for sections that want
 * it to read as a process actively executing rather than a static list.
 */
export function StepList({ steps, className, footnote, traced = false }: StepListProps) {
  const listRef = useRef<HTMLOListElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!traced || !list || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      itemRefs.current.forEach((item, i) => {
        if (!item) return;
        const numeral = item.querySelector<HTMLElement>("[data-trace-numeral]");
        gsap.set(item, { borderColor: "rgba(216, 190, 151, 0.4)" });
        if (numeral) gsap.set(numeral, { scale: 0.85, opacity: 0.5 });

        const scrollTrigger = { trigger: item, start: "top 85%", toggleActions: "play none none reverse" } as const;
        gsap.to(item, {
          borderColor: "#ff654f",
          duration: 0.5,
          ease: SIGNATURE_EASE,
          delay: staggerDelay(i, 0.06),
          scrollTrigger,
        });
        if (numeral) {
          gsap.to(numeral, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: SIGNATURE_EASE,
            delay: staggerDelay(i, 0.06),
            scrollTrigger,
          });
        }
      });
    }, list);

    return () => ctx.revert();
  }, [traced, prefersReducedMotion]);

  return (
    <div className={clsx("flex flex-col gap-8", className)}>
      <ol ref={listRef} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li
            key={step.key}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="flex flex-col gap-3 border-l-2 border-champagne/40 pl-5"
          >
            <span data-trace-numeral className="font-display text-3xl text-coral">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-lg">{step.name}</h3>
            {step.description ? (
              <p className="font-body text-sm leading-relaxed text-current/70">{step.description}</p>
            ) : null}
          </li>
        ))}
      </ol>
      {footnote}
    </div>
  );
}
```

- [ ] **Step 2: Build check**

Run: `npx tsc -b --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/common/StepList.tsx
git commit -m "$(cat <<'EOF'
Add opt-in traced reveal to StepList

Each step's border and numeral light up coral in sequence as the
list scrolls into view when traced=true. Off by default so the
platform/delivery-model/contact callers of this shared component are
unaffected; HomePage's two How It Works lists opt in in Task 9.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: `ExecutionGapPair` — correction-line reveal (`scroll-choreography` phase)

**Files:**
- Create: `src/components/scroll-story/ExecutionGapPair.tsx`

- [ ] **Step 1: Write the component**

```tsx
// src/components/scroll-story/ExecutionGapPair.tsx
/**
 * One problem/solution pair from the homepage's "Execution Gap" section,
 * rendered so the correction reads as happening live: the problem stat gets
 * struck through by a coral line that draws itself in (SVG
 * stroke-dashoffset), then the solution block wipes in beneath it
 * (clip-path). Matches the section's own problem→solution framing instead
 * of a generic fade-in.
 */
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { SIGNATURE_EASE } from "@/motion/signature";

gsap.registerPlugin(ScrollTrigger);

export interface ExecutionGapPairProps {
  problemLabel: string;
  problemStat: string;
  problemDescription: string;
  solutionLabel: string;
  solutionStat: string;
  solutionQualifier?: string;
  solutionDescription: string;
}

export function ExecutionGapPair({
  problemLabel,
  problemStat,
  problemDescription,
  solutionLabel,
  solutionStat,
  solutionQualifier,
  solutionDescription,
}: ExecutionGapPairProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const strikeRef = useRef<SVGLineElement | null>(null);
  const solutionRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useLayoutEffect(() => {
    const root = rootRef.current;
    const strike = strikeRef.current;
    const solution = solutionRef.current;
    if (!root || !strike || !solution || prefersReducedMotion) return;

    const length = strike.getTotalLength();
    gsap.set(strike, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(solution, { clipPath: "inset(0 100% 0 0)" });

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: "top 75%", toggleActions: "play none none reverse" } })
        .to(strike, { strokeDashoffset: 0, duration: 0.5, ease: SIGNATURE_EASE })
        .to(solution, { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: SIGNATURE_EASE }, "-=0.15");
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={rootRef} className="flex flex-col gap-4 rounded-lg border border-current/15 p-6">
      <div>
        <p className="font-body text-xs uppercase tracking-widest text-current/50">{problemLabel}</p>
        <p className="relative inline-block font-display text-xl text-current/60">
          {problemStat}
          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <line x1="0" y1="50%" x2="100%" y2="50%" ref={strikeRef} stroke="currentColor" strokeWidth="2" className="text-coral" />
          </svg>
        </p>
        <p className="mt-1 font-body text-sm text-current/60">{problemDescription}</p>
      </div>
      <div ref={solutionRef} className="border-t border-current/10 pt-4">
        <p className="font-body text-xs uppercase tracking-widest text-coral">{solutionLabel}</p>
        <p className="font-display text-xl text-coral">
          {solutionQualifier ? `${solutionQualifier} ` : ""}
          {solutionStat}
        </p>
        <p className="mt-1 font-body text-sm text-current/70">{solutionDescription}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build check**

Run: `npx tsc -b --noEmit`
Expected: no errors (this component isn't wired into HomePage yet, but must still type-check standalone).

- [ ] **Step 3: Commit**

```bash
git add src/components/scroll-story/ExecutionGapPair.tsx
git commit -m "$(cat <<'EOF'
Add ExecutionGapPair correction-line reveal component

Problem stat gets struck through via an SVG line that draws itself
in on scroll, then the solution wipes in beneath it — matches the
Execution Gap section's own problem-to-solution framing. Wired into
HomePage in Task 9.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: `PlatformFeatureRail` and `IntegrationNetwork` (`scroll-choreography` phase)

**Files:**
- Create: `src/components/scroll-story/PlatformFeatureRail.tsx`
- Create: `src/components/scroll-story/IntegrationNetwork.tsx`

- [ ] **Step 1: Write `PlatformFeatureRail.tsx`**

```tsx
// src/components/scroll-story/PlatformFeatureRail.tsx
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
          <p className="font-body text-sm text-current/70">{feature.description}</p>
        </motion.li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Write `IntegrationNetwork.tsx`**

```tsx
// src/components/scroll-story/IntegrationNetwork.tsx
/**
 * Integration Ecosystem grid: cards enter staggered, and hovering a card
 * draws thin coral connection lines to the other cards sharing its real
 * content `category` (not a fabricated relationship) — reinforcing the
 * "ecosystem" framing already in the copy.
 */
import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Badge } from "@/design-system";
import { SIGNATURE_EASE_ARRAY, staggerDelay } from "@/motion/signature";

export interface IntegrationNetworkItem {
  name: string;
  category: string;
  description: string;
  tags: string[];
}

export interface IntegrationNetworkProps {
  items: IntegrationNetworkItem[];
}

interface ConnectionLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function IntegrationNetwork({ items }: IntegrationNetworkProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [lines, setLines] = useState<ConnectionLine[]>([]);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useLayoutEffect(() => {
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
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (hovered === null || !container || prefersReducedMotion) {
      setLines([]);
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const source = cardRefs.current[hovered];
    if (!source) {
      setLines([]);
      return;
    }
    const sourceRect = source.getBoundingClientRect();
    const sourceCenter = {
      x: sourceRect.left + sourceRect.width / 2 - containerRect.left,
      y: sourceRect.top + sourceRect.height / 2 - containerRect.top,
    };
    const relatedIndexes = items
      .map((item, i) => i)
      .filter((i) => i !== hovered && items[i].category === items[hovered].category);

    setLines(
      relatedIndexes
        .map((i) => cardRefs.current[i])
        .filter((el): el is HTMLDivElement => Boolean(el))
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            x1: sourceCenter.x,
            y1: sourceCenter.y,
            x2: rect.left + rect.width / 2 - containerRect.left,
            y2: rect.top + rect.height / 2 - containerRect.top,
          };
        }),
    );
  }, [hovered, items, prefersReducedMotion]);

  return (
    <div ref={containerRef} className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-coral" aria-hidden="true">
        {lines.map((line, i) => (
          <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        ))}
      </svg>
      {items.map((item, i) => (
        <motion.div
          key={item.name}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
          animate={active || prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: SIGNATURE_EASE_ARRAY, delay: staggerDelay(i) }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered((current) => (current === i ? null : current))}
          className="flex flex-col gap-2 rounded-lg border border-current/15 p-6 transition-colors hover:border-coral/40"
        >
          <p className="font-body text-xs uppercase tracking-widest text-champagne">{item.category}</p>
          <h3 className="font-display text-xl">{item.name}</h3>
          <p className="font-body text-sm text-current/70">{item.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} label={tag} tone="subtle" />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Build check**

Run: `npx tsc -b --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/scroll-story/PlatformFeatureRail.tsx src/components/scroll-story/IntegrationNetwork.tsx
git commit -m "$(cat <<'EOF'
Add PlatformFeatureRail and IntegrationNetwork components

Platform features enter as sliding chip glyphs with masked-reveal
names; integration cards enter staggered and draw coral connection
lines on hover between cards that share a real content category.
Wired into HomePage in Task 9.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Wire the four 2D sections into `HomePage.tsx` (`scroll-choreography` phase)

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Update imports**

`Badge` stays imported — it's still used by the Solution Domains filter chips (`domains.filters.map`) further down this file, which this task doesn't touch. Replace:

```tsx
import { Badge, SectionHeading } from "@/design-system";
```

with:

```tsx
import { Badge, SectionHeading } from "@/design-system";
import { ExecutionGapPair } from "@/components/scroll-story/ExecutionGapPair";
import { PlatformFeatureRail } from "@/components/scroll-story/PlatformFeatureRail";
import { IntegrationNetwork } from "@/components/scroll-story/IntegrationNetwork";
```

- [ ] **Step 2: Replace the Execution Gap pairs grid**

Replace:

```tsx
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {gap.pairs.map((pair) => (
            <div key={pair.problemStat.value} className="flex flex-col gap-4 rounded-lg border border-current/15 p-6">
              <div>
                <p className="font-body text-xs uppercase tracking-widest text-current/50">{pair.problemLabel.value}</p>
                <p className="font-display text-xl text-current/60 line-through decoration-current/30">{pair.problemStat.value}</p>
                <p className="mt-1 font-body text-sm text-current/60">{pair.problemDescription.value}</p>
              </div>
              <div className="border-t border-current/10 pt-4">
                <p className="font-body text-xs uppercase tracking-widest text-coral">{pair.solutionLabel.value}</p>
                <p className="font-display text-xl text-coral">
                  {pair.solutionStat.qualifier ? `${pair.solutionStat.qualifier} ` : ""}
                  {pair.solutionStat.value}
                </p>
                <p className="mt-1 font-body text-sm text-current/70">{pair.solutionDescription.value}</p>
              </div>
            </div>
          ))}
        </div>
```

with:

```tsx
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {gap.pairs.map((pair) => (
            <ExecutionGapPair
              key={pair.problemStat.value}
              problemLabel={pair.problemLabel.value}
              problemStat={pair.problemStat.value}
              problemDescription={pair.problemDescription.value}
              solutionLabel={pair.solutionLabel.value}
              solutionStat={pair.solutionStat.value}
              solutionQualifier={pair.solutionStat.qualifier}
              solutionDescription={pair.solutionDescription.value}
            />
          ))}
        </div>
```

- [ ] **Step 3: Replace the Platform overview feature lists**

Replace:

```tsx
              <ul className="flex flex-col gap-3">
                {product.features.map((f) => (
                  <li key={f.name.value} className="border-l-2 border-current/15 pl-4">
                    <p className="font-medium">{f.name.value}</p>
                    <p className="font-body text-sm text-current/70">{f.description.value}</p>
                  </li>
                ))}
              </ul>
```

with:

```tsx
              <PlatformFeatureRail
                features={product.features.map((f) => ({ name: f.name.value, description: f.description.value }))}
              />
```

- [ ] **Step 4: Mark both How It Works step lists as `traced`**

Replace:

```tsx
          <StepList
            steps={howItWorksHome.steps.map((s) => ({ key: s.name.value, name: s.name.value, description: s.description?.value ?? null }))}
          />
```

with:

```tsx
          <StepList
            steps={howItWorksHome.steps.map((s) => ({ key: s.name.value, name: s.name.value, description: s.description?.value ?? null }))}
            traced
          />
```

and replace:

```tsx
          <StepList
            steps={howItWorksPlatform.steps.map((s) => ({ key: s.name.value, name: s.name.value, description: s.description.value }))}
          />
```

with:

```tsx
          <StepList
            steps={howItWorksPlatform.steps.map((s) => ({ key: s.name.value, name: s.name.value, description: s.description.value }))}
            traced
          />
```

- [ ] **Step 5: Replace the Integration Ecosystem grid**

Replace:

```tsx
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.items.map((item) => (
            <div key={item.name.value} className="flex flex-col gap-2 rounded-lg border border-current/15 p-6">
              <p className="font-body text-xs uppercase tracking-widest text-champagne">{item.category.value}</p>
              <h3 className="font-display text-xl">{item.name.value}</h3>
              <p className="font-body text-sm text-current/70">{item.description.value}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag.value} label={tag.value} tone="subtle" />
                ))}
              </div>
            </div>
          ))}
        </div>
```

with:

```tsx
        <IntegrationNetwork
          items={integrations.items.map((item) => ({
            name: item.name.value,
            category: item.category.value,
            description: item.description.value,
            tags: item.tags.map((tag) => tag.value),
          }))}
        />
```

- [ ] **Step 6: Build check**

Run: `npx tsc -b --noEmit`
Expected: no errors.

- [ ] **Step 7: Manual verification (dev server)**

Run: `npm run dev`, open `/`, and confirm:
- Execution Gap: each problem stat strikes through and the solution wipes in as you scroll to it.
- Platform: features slide in with their names masked-revealing.
- Both How It Works lists: borders/numerals light up coral in sequence.
- Integrations: cards stagger in; hovering one draws lines to same-category cards.
- With reduced motion on, all four sections render fully visible immediately, no animation.
- No console errors.

- [ ] **Step 8: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "$(cat <<'EOF'
Wire the four 2D motion sections into HomePage

Execution Gap, Platform, How It Works, and Integrations now use the
new ExecutionGapPair/PlatformFeatureRail/IntegrationNetwork/traced
StepList components instead of static markup.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Showcase drifting-module WebGL backdrop (`showcase-and-timeline` phase)

**Files:**
- Create: `src/three/ShowcaseModuleBackdrop.tsx`
- Create: `src/components/showcase/ShowcaseSculptureBackdrop.tsx`
- Modify: `src/components/showcase/DesktopShowcase.tsx`

- [ ] **Step 1: Write the R3F scene**

```tsx
// src/three/ShowcaseModuleBackdrop.tsx
/**
 * Lightweight WebGL companion for the Showcase section: a single drifting
 * glass module (not the full multi-module sculpture) whose champagne edge
 * glow intensity tracks sceneStore.accentPulse — driven by how far through
 * the showcase the viewer has scrolled — so it reads as "the same
 * sculpture, glimpsed differently" without the cost of re-rendering the
 * full assembly.
 */
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { useFrame } from "@react-three/fiber";
import { Edges, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { PALETTE, createGlassModulePreset } from "./materials";
import { useSceneLightingRig } from "./lighting";
import { useSceneStore } from "@/motion/sceneStore";

const MODULE_ARGS: [number, number, number] = [1.1, 1.4, 0.6];
const DRIFT_SPEED = 0.25;
const DRIFT_RADIUS = 0.6;

export function ShowcaseModuleBackdropScene() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const groupRef = useRef<Group>(null);
  const accentPulse = useSceneStore((state) => state.accentPulse);
  const lightingRig = useSceneLightingRig(0.75);
  const glassPreset = useMemo(() => createGlassModulePreset(), []);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group || prefersReducedMotion) return;
    const t = state.clock.elapsedTime * DRIFT_SPEED;
    group.position.x = Math.sin(t) * DRIFT_RADIUS;
    group.position.y = Math.cos(t * 0.7) * DRIFT_RADIUS * 0.5;
    group.rotation.y = t * 0.4;
    group.rotation.x = Math.sin(t * 0.5) * 0.15;
  });

  return (
    <>
      {lightingRig.map((light) =>
        light.type === "ambient" ? (
          <ambientLight key={light.role} color={light.color} intensity={light.intensity} />
        ) : light.type === "directional" ? (
          <directionalLight key={light.role} color={light.color} intensity={light.intensity} position={light.position} />
        ) : (
          <pointLight key={light.role} color={light.color} intensity={light.intensity} position={light.position} />
        ),
      )}
      <group ref={groupRef}>
        <RoundedBox args={MODULE_ARGS} radius={0.08} smoothness={3}>
          <MeshTransmissionMaterial {...glassPreset} />
          <Edges color={PALETTE.coral} lineWidth={1 + accentPulse * 1.5} threshold={20} />
        </RoundedBox>
      </group>
    </>
  );
}
```

- [ ] **Step 2: Write the Canvas wrapper**

```tsx
// src/components/showcase/ShowcaseSculptureBackdrop.tsx
/**
 * Purely decorative WebGL enhancement behind DesktopShowcase's scroll
 * track. Renders nothing when WebGL is unavailable — unlike Hero, the
 * showcase's real content (cards, taxonomy, detail modal) is already fully
 * functional without this layer, so there's no informational fallback to
 * provide, only an omission.
 */
import { Canvas } from "@react-three/fiber";
import { ShowcaseModuleBackdropScene } from "@/three/ShowcaseModuleBackdrop";
import { useWebGLSupport } from "@/three/useWebGLSupport";
import { useCanvasFrameloop } from "@/three/useCanvasFrameloop";

export function ShowcaseSculptureBackdrop() {
  const webglSupport = useWebGLSupport();
  const { containerRef, frameloop } = useCanvasFrameloop();

  if (webglSupport !== "supported") return null;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 opacity-60">
      <Canvas frameloop={frameloop} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 6], fov: 40 }}>
        <ShowcaseModuleBackdropScene />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: Wire it into `DesktopShowcase.tsx`**

Add the import alongside the existing ones at the top of `src/components/showcase/DesktopShowcase.tsx`:

```tsx
import { ShowcaseSculptureBackdrop } from "./ShowcaseSculptureBackdrop";
import { useSceneStore } from "@/motion/sceneStore";
```

In the `onUpdate` callback inside the `gsap.to(track, {...})` call, add a scene-store write alongside the existing `setProgress`/`applyOrbitMotion` calls:

```tsx
          onUpdate: (self) => {
            setProgress(self.progress);
            applyOrbitMotion(self.progress * lastIndex);
            useSceneStore.getState().setAccentPulse(self.progress);
          },
```

Add the backdrop as the first child inside the root `<div ref={sectionRef} ...>`, immediately before the existing `<div className="absolute inset-x-0 top-0 z-10 ...">` header block:

```tsx
      <ShowcaseSculptureBackdrop />
```

- [ ] **Step 4: Build check**

Run: `npx tsc -b --noEmit`
Expected: no errors.

- [ ] **Step 5: Manual verification (dev server)**

Run: `npm run dev`, scroll to the Use-Case Showcase section, and confirm:
- A single drifting glass module is visible behind the scroll track, glowing brighter as you scroll further through the showcase.
- The horizontal scroll/pin/orbit interaction still works exactly as before.
- With reduced motion on, the backdrop does not render (the section shows only its existing 2D content).
- No console errors.

- [ ] **Step 6: Commit**

```bash
git add src/three/ShowcaseModuleBackdrop.tsx src/components/showcase/ShowcaseSculptureBackdrop.tsx src/components/showcase/DesktopShowcase.tsx
git commit -m "$(cat <<'EOF'
Add drifting-module WebGL backdrop to the Showcase section

A single lightweight glass module (not the full sculpture) drifts
behind the scroll track, glowing brighter as scroll progress
advances via the shared scene store's accentPulse. Renders nothing
under reduced motion or when WebGL is unavailable.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Timeline build-path WebGL backdrop (`showcase-and-timeline` phase)

**Files:**
- Create: `src/three/TimelineBuildPath.tsx`
- Create: `src/components/timeline/TimelineSculptureBackdrop.tsx`
- Modify: `src/components/timeline/DeliveryTimeline.tsx`

- [ ] **Step 1: Write the R3F scene**

```tsx
// src/three/TimelineBuildPath.tsx
/**
 * Lightweight WebGL companion for the Delivery Timeline: a single extruded
 * "build path" tube with one coral marker per delivery phase that lights up
 * as `progress` advances past it, echoing the sculpture's coral
 * connection-line language at a much smaller GPU cost than the full
 * multi-module assembly. Camera drifts slowly along the path as progress
 * advances.
 */
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { PALETTE } from "./materials";
import { useSceneLightingRig } from "./lighting";

export interface TimelineBuildPathProps {
  /** 0-1 scroll progress through the delivery timeline section. */
  progress: number;
  /** Number of milestone markers along the path (one per delivery phase). */
  markerCount: number;
}

const PATH_POINTS = [
  new THREE.Vector3(-4, -0.6, 0),
  new THREE.Vector3(-1.5, 0.5, -1),
  new THREE.Vector3(1.5, -0.4, 0.5),
  new THREE.Vector3(4, 0.6, 0),
];

export function TimelineBuildPath({ progress, markerCount }: TimelineBuildPathProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const lightingRig = useSceneLightingRig(0.7);
  const markerRefs = useRef<Array<Mesh | null>>([]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(PATH_POINTS), []);
  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 64, 0.02, 8, false), [curve]);
  const markers = useMemo(
    () => Array.from({ length: markerCount }, (_, i) => curve.getPointAt(i / Math.max(markerCount - 1, 1))),
    [curve, markerCount],
  );

  useFrame(({ camera }) => {
    if (prefersReducedMotion) return;
    const t = Math.min(0.98, Math.max(0.02, progress));
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    camera.position.lerp(point.clone().add(new THREE.Vector3(0, 0.4, 2.2)), 0.08);
    camera.lookAt(point.clone().add(tangent));

    markerRefs.current.forEach((marker, i) => {
      if (!marker) return;
      const lit = i / Math.max(markerCount - 1, 1) <= progress;
      const material = marker.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = lit ? 1.1 : 0.15;
      marker.scale.setScalar(lit ? 1 : 0.7);
    });
  });

  return (
    <>
      {lightingRig.map((light) =>
        light.type === "ambient" ? (
          <ambientLight key={light.role} color={light.color} intensity={light.intensity} />
        ) : light.type === "directional" ? (
          <directionalLight key={light.role} color={light.color} intensity={light.intensity} position={light.position} />
        ) : (
          <pointLight key={light.role} color={light.color} intensity={light.intensity} position={light.position} />
        ),
      )}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial color={PALETTE.champagne} emissive={PALETTE.champagne} emissiveIntensity={0.2} metalness={0.6} roughness={0.3} />
      </mesh>
      {markers.map((point, i) => (
        <mesh
          key={i}
          position={point}
          ref={(el) => {
            markerRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color={PALETTE.coral} emissive={PALETTE.coral} emissiveIntensity={0.15} />
        </mesh>
      ))}
    </>
  );
}
```

- [ ] **Step 2: Write the Canvas wrapper**

```tsx
// src/components/timeline/TimelineSculptureBackdrop.tsx
/**
 * Purely decorative WebGL enhancement behind the Delivery Timeline's phase
 * grid. Renders nothing under reduced motion (matching this file's own
 * existing fill-bar behavior, which already skips its scroll animation and
 * shows a fully-filled static bar under reduced motion) or when WebGL is
 * unavailable — the phase grid itself is always real markup regardless.
 */
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { TimelineBuildPath } from "@/three/TimelineBuildPath";
import { useWebGLSupport } from "@/three/useWebGLSupport";
import { useCanvasFrameloop } from "@/three/useCanvasFrameloop";

export interface TimelineSculptureBackdropProps {
  progress: number;
  markerCount: number;
}

export function TimelineSculptureBackdrop({ progress, markerCount }: TimelineSculptureBackdropProps) {
  const webglSupport = useWebGLSupport();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { containerRef, frameloop } = useCanvasFrameloop();

  if (webglSupport !== "supported" || prefersReducedMotion) return null;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 -z-10 opacity-50">
      <Canvas frameloop={frameloop} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} camera={{ fov: 45 }}>
        <TimelineBuildPath progress={progress} markerCount={markerCount} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: Wire it into `DeliveryTimeline.tsx`**

Add the import alongside the existing ones:

```tsx
import { TimelineSculptureBackdrop } from "./TimelineSculptureBackdrop";
```

Add a `progress` state next to the existing refs:

```tsx
  const [progress, setProgress] = useState(0);
```

(This requires `useState` to already be imported from `"react"` — it is, alongside `useEffect`/`useLayoutEffect`/`useRef`.)

In the existing `scrollTrigger` config passed to the fill-bar tween, add an `onUpdate`:

```tsx
      gsap.to(fill, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
          end: "bottom 60%",
          scrub: 0.6,
          onUpdate: (self) => setProgress(self.progress),
        },
      });
```

Give the root element a positioning context and render the backdrop, replacing:

```tsx
  return (
    <div ref={containerRef} className="flex flex-col gap-10">
```

with:

```tsx
  return (
    <div ref={containerRef} className="relative flex flex-col gap-10">
      <TimelineSculptureBackdrop progress={progress} markerCount={phases.length} />
```

- [ ] **Step 4: Build check**

Run: `npx tsc -b --noEmit`
Expected: no errors.

- [ ] **Step 5: Manual verification (dev server)**

Run: `npm run dev`, scroll to the Delivery Timeline section, and confirm:
- A faint 3D build-path with coral markers is visible behind the phase grid, and markers light up in sequence as you scroll.
- The existing fill-bar and phase-card reveal still work.
- With reduced motion on, no 3D backdrop renders (matches the existing static fill-bar behavior).
- No console errors.

- [ ] **Step 6: Commit**

```bash
git add src/three/TimelineBuildPath.tsx src/components/timeline/TimelineSculptureBackdrop.tsx src/components/timeline/DeliveryTimeline.tsx
git commit -m "$(cat <<'EOF'
Add build-path WebGL backdrop to the Delivery Timeline section

A thin extruded path with one coral marker per delivery phase lights
up as scroll progress advances, with the camera drifting along it —
reuses the coral connection-line language from the sculpture at a
much smaller GPU cost. Renders nothing under reduced motion or
without WebGL.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: ROI radial gauge (`showcase-and-timeline` phase)

**Files:**
- Create: `src/components/roi/RoiGauge.tsx`
- Modify: `src/components/roi/RoiCalculatorIllustrative.tsx`

- [ ] **Step 1: Write `RoiGauge.tsx`**

```tsx
// src/components/roi/RoiGauge.tsx
/**
 * Radial coral gauge for one ROI output stat, replacing the plain
 * OutputStat card for the three genuinely slider-dependent outputs. On
 * value change it plays a brief "recalculating" flicker before settling —
 * motion driven by the data changing, not ambient decoration. Vendor
 * Consolidation stays a plain OutputStat card (see RoiCalculatorIllustrative)
 * since it isn't slider-dependent — a gauge would imply a dynamism it
 * doesn't have.
 */
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import clsx from "clsx";
import { SIGNATURE_EASE_CSS } from "@/motion/signature";

export interface RoiGaugeProps {
  label: string;
  value: number;
  displayValue: string;
  /** Gauge fill fraction, 0-1. */
  fraction: number;
  qualifier?: string;
}

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function RoiGauge({ label, value, displayValue, fraction, qualifier }: RoiGaugeProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [flicker, setFlicker] = useState(false);
  const previousValue = useRef(value);

  useEffect(() => {
    if (prefersReducedMotion || value === previousValue.current) {
      previousValue.current = value;
      return;
    }
    previousValue.current = value;
    setFlicker(true);
    const timeout = setTimeout(() => setFlicker(false), 220);
    return () => clearTimeout(timeout);
  }, [value, prefersReducedMotion]);

  const clampedFraction = Math.min(1, Math.max(0, fraction));
  const offset = CIRCUMFERENCE * (1 - clampedFraction);

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-current/10 p-4 text-center">
      <div className={clsx("relative h-28 w-28", flicker && "animate-pulse")}>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="#ff654f"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={prefersReducedMotion ? undefined : { transition: `stroke-dashoffset 0.5s ${SIGNATURE_EASE_CSS}` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-lg text-current">{displayValue}</span>
        </div>
      </div>
      <p className="font-body text-xs uppercase tracking-widest text-current/50">{label}</p>
      {qualifier ? <p className="font-body text-xs text-champagne">{qualifier}</p> : null}
    </div>
  );
}
```

- [ ] **Step 2: Wire it into `RoiCalculatorIllustrative.tsx`**

Add the import:

```tsx
import { RoiGauge } from "./RoiGauge";
```

Replace the four-stat grid:

```tsx
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <OutputStat
          label="Projected Annual Savings"
          value={currencyCompact.format(animatedSavings)}
          qualifier={isAtDefaults ? defaults.projectedAnnualSavings.qualifier : "Illustrative"}
        />
        <OutputStat
          label="Faster Time to Production"
          value={`${Math.round(animatedFasterTime)}%`}
          qualifier={isAtDefaults ? undefined : "Illustrative"}
        />
        <OutputStat
          label="Cost Reduction"
          value={`${Math.round(animatedCostReduction)}%`}
          qualifier={isAtDefaults ? undefined : "Illustrative"}
        />
        <OutputStat
          label="Vendor Consolidation"
          value={defaults.vendorConsolidation.value}
          qualifier="Illustrative default — not slider-dependent"
        />
      </div>
```

with:

```tsx
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <RoiGauge
          label="Projected Annual Savings"
          value={outputs.projectedAnnualSavings}
          displayValue={currencyCompact.format(animatedSavings)}
          fraction={buildSpend > 0 ? outputs.projectedAnnualSavings / buildSpend : 0}
          qualifier={isAtDefaults ? defaults.projectedAnnualSavings.qualifier : "Illustrative"}
        />
        <RoiGauge
          label="Faster Time to Production"
          value={outputs.fasterTimeToProductionPct}
          displayValue={`${Math.round(animatedFasterTime)}%`}
          fraction={outputs.fasterTimeToProductionPct / 100}
          qualifier={isAtDefaults ? undefined : "Illustrative"}
        />
        <RoiGauge
          label="Cost Reduction"
          value={outputs.costReductionPct}
          displayValue={`${Math.round(animatedCostReduction)}%`}
          fraction={outputs.costReductionPct / 100}
          qualifier={isAtDefaults ? undefined : "Illustrative"}
        />
        <OutputStat
          label="Vendor Consolidation"
          value={defaults.vendorConsolidation.value}
          qualifier="Illustrative default — not slider-dependent"
        />
      </div>
```

- [ ] **Step 3: Build check**

Run: `npx tsc -b --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual verification (dev server)**

Run: `npm run dev`, open `/`, scroll to the ROI calculator, and confirm:
- The three dynamic outputs render as radial gauges that fill proportionally.
- Moving a slider briefly flickers the changed gauge(s) before the ring settles at its new fill.
- Vendor Consolidation remains a plain static card.
- With reduced motion on, gauges render at their correct fill immediately with no flicker/transition.
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/roi/RoiGauge.tsx src/components/roi/RoiCalculatorIllustrative.tsx
git commit -m "$(cat <<'EOF'
Add radial gauge treatment to the ROI calculator's dynamic outputs

Projected Annual Savings, Faster Time to Production, and Cost
Reduction now render as coral radial gauges with a brief
recalculating flicker on change. Vendor Consolidation stays a plain
static card since it isn't slider-dependent.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Full-feature verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full automated suite**

Run: `npx vitest run && npx tsc -b --noEmit && npm run lint`
Expected: all vitest suites pass (including the pre-existing chatbot suite and this plan's new `signature`/`sceneStore`/`boot` tests), `tsc` reports no errors, `oxlint` reports no errors.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds with no errors (warnings about chunk size are pre-existing and acceptable per prior verification notes; do not introduce new errors).

- [ ] **Step 3: Manual homepage pass (dev server)**

Run: `npm run dev`, open `/`, and walk the whole page top to bottom confirming:
- Hero boot sequence plays once, no full-object auto-rotate, explode/reassemble still works via keyboard.
- ScrollStory camera hand-off from Hero has no visible jump cut.
- Execution Gap / Platform / How It Works / Integrations all show their new motion on scroll.
- Showcase's drifting module and Timeline's build-path backdrops render, glow/light up as described, and the existing pinned-scroll/fill-bar mechanics are unaffected.
- ROI gauges fill/flicker correctly.
- No console errors or warnings anywhere on the page.

- [ ] **Step 4: Reduced-motion pass**

Enable "prefers-reduced-motion: reduce" (OS setting or browser devtools emulation), reload `/`, and confirm every section above renders its complete final content immediately with no animation, no layout shift, nothing stuck mid-transition (e.g. no half-drawn strike-through lines, no modules stuck mid-grow).

- [ ] **Step 5: Keyboard pass**

Tab through the entire homepage and confirm: hero explode button remains reachable and operable, ROI sliders remain reachable and operable via arrow keys, showcase prev/next buttons remain reachable and operable, all existing focus-visible outlines are unchanged.

- [ ] **Step 6: WebGL-unavailable pass**

Force WebGL off (e.g. browser flag or devtools) and reload `/`. Confirm Hero shows its existing `CanvasFallback` illustration, and Showcase/Timeline simply omit their backdrops with no console errors and no broken layout.

- [ ] **Step 7: Commit (if any fixes were needed during verification)**

If steps 1-6 required any fixes, stage and commit them individually with a message describing the specific fix. If everything passed as implemented, no commit is needed for this task.

---

## Notes for the executing agent

- Tasks 1-2 must run before any other task (every later task imports `src/motion/signature.ts` and/or `src/motion/sceneStore.ts`).
- Task 3 must run before Task 4 (`HeroScene.tsx` passes `bootProgress`/`breathing` props that Task 3 adds to `SculptureModel`).
- Task 9 must run after Tasks 6, 7, and 8 (it imports the components/prop those tasks create).
- Tasks 10, 11, and 12 are independent of each other and of Tasks 5-9 — they can run in parallel once Tasks 1-2 are done.
- Per `docs/superpowers/specs/2026-09-12-homepage-motion-redesign-design.md`, this plan is scoped to the homepage only. Do not extend any of this to `/platform`, `/use-cases`, or other inner pages as part of this plan.
