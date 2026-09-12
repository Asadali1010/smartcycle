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
