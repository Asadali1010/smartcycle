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

/** Boot timeline timing (seconds/position-offsets) — kept as named constants
 * so the "trace-lines finish drawing, then modules assemble, then camera
 * pulls back" relationship is enforced by naming rather than by
 * comment-and-hope. */
const BOOT_DURATION = 1.6;
const STAGE_START_OFFSET = 0.4;
const STAGE_DURATION = 1.6;
const CAMERA_START_OFFSET = 0.5;
const CAMERA_DURATION = 1.8;

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
        { value: 1, duration: BOOT_DURATION, ease: SIGNATURE_EASE, onUpdate: () => setBootProgress(bootProxy.value) },
        0,
      )
      // Deliberately not SIGNATURE_EASE — an overshoot on the modules' assembly position would read as jitter/pop-past, not the deliberate flourish it is on camera framing.
      .to(stageProxy, { value: 1, duration: STAGE_DURATION, ease: "power2.out", onUpdate: () => setStage(stageProxy.value) }, STAGE_START_OFFSET)
      .to(
        camera.position,
        {
          x: CAMERA_REST.x,
          y: CAMERA_REST.y,
          z: CAMERA_REST.z,
          duration: CAMERA_DURATION,
          ease: SIGNATURE_EASE,
          onUpdate: () => camera.lookAt(0, 0, 0),
        },
        CAMERA_START_OFFSET,
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
