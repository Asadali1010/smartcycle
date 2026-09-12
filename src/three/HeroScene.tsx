/**
 * Contents mounted inside the hero's R3F <Canvas>: lighting rig, camera
 * settle animation, the SculptureModel itself, its opening choreography
 * (Build → Deploy assembly + connection illumination + camera settle over
 * ~2s), continuous ambient rotation, and pointer-responsive parallax.
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

export interface HeroSceneProps {
  /** Additive explode amount (0-1), driven externally by Hero.tsx's button. */
  explode?: number;
}

/** Ambient idle spin speed, radians/sec — slow enough to feel alive, not distracting. */
const AMBIENT_ROTATION_SPEED = 0.045;
/** Pointer parallax tilt cap, radians. */
const PARALLAX_MAX = 0.1;
/** How quickly the parallax group eases toward the pointer's target tilt. */
const PARALLAX_DAMPING = 3.2;

const CAMERA_START = { x: 0, y: 2.4, z: 15 };
const CAMERA_REST = { x: 0, y: 0.3, z: 10.5 };

export function HeroScene({ explode = 0 }: HeroSceneProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { camera } = useThree();
  const ambientGroupRef = useRef<Group>(null);
  const parallaxGroupRef = useRef<Group>(null);
  const [stage, setStage] = useState(prefersReducedMotion ? 1 : 0);
  const lightingRig = useSceneLightingRig();

  // Opening choreography: modules assemble Build -> Deploy, camera settles.
  useEffect(() => {
    camera.position.set(prefersReducedMotion ? CAMERA_REST.x : CAMERA_START.x, prefersReducedMotion ? CAMERA_REST.y : CAMERA_START.y, prefersReducedMotion ? CAMERA_REST.z : CAMERA_START.z);
    camera.lookAt(0, 0, 0);

    if (prefersReducedMotion) {
      // Reduced motion: skip the choreography, land directly on the same
      // assembled/deployed composition and resting camera position.
      setStage(1);
      return;
    }

    const timeline = gsap.timeline();
    const stageProxy = { value: 0 };
    timeline
      .to(
        stageProxy,
        {
          value: 1,
          duration: 2.2,
          ease: "power2.out",
          onUpdate: () => setStage(stageProxy.value),
        },
        0,
      )
      .to(
        camera.position,
        {
          x: CAMERA_REST.x,
          y: CAMERA_REST.y,
          z: CAMERA_REST.z,
          duration: 2.4,
          ease: "power3.out",
          onUpdate: () => camera.lookAt(0, 0, 0),
        },
        0,
      );

    return () => {
      timeline.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot mount choreography
  }, [prefersReducedMotion]);

  // Continuous ambient rotation (outer group) + pointer parallax (inner group).
  useFrame((state, delta) => {
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
          <SculptureModel stage={stage} explode={explode} />
        </group>
      </group>
    </>
  );
}
