/**
 * R3F scene content for the homepage's scroll-story sequence. Unlike
 * HeroScene (which owns a one-shot mount choreography), this scene is a pure
 * function of an externally-driven `stage` (0-1, set from GSAP ScrollTrigger
 * progress in ScrollStory.tsx): the sculpture and camera both resolve
 * straight from `stage` every render, plus a continuous idle rotation and
 * pointer parallax layered on top for the same tangible feel as the hero.
 */
import { useRef } from "react";
import type { Group } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { SculptureModel } from "./SculptureModel";
import { useSceneLightingRig } from "./lighting";
import { SceneEffects } from "./SceneEffects";
import { getCameraPose } from "./cameraPath";

export interface ScrollStorySceneProps {
  stage: number;
}

const AMBIENT_ROTATION_SPEED = 0.03;
const PARALLAX_MAX = 0.08;
const PARALLAX_DAMPING = 3.2;

export function ScrollStoryScene({ stage }: ScrollStorySceneProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { camera } = useThree();
  const ambientGroupRef = useRef<Group>(null);
  const parallaxGroupRef = useRef<Group>(null);
  const lightingRig = useSceneLightingRig(0.9);

  useFrame((state, delta) => {
    const pose = getCameraPose(stage);
    camera.position.set(...pose.position);
    camera.lookAt(...pose.lookAt);

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
