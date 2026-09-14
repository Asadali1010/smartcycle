/**
 * Contents mounted inside the hero's R3F <Canvas>: the procedural particle
 * brain (BrainField) plus the shared bloom post-processing stack. BrainField
 * owns its own drag/zoom/repel interaction and reduced-motion handling
 * directly, so this component just sets the camera's resting pose once and
 * gets out of the way — there's no boot choreography to stage here (the
 * brain's own 12s assemble/hold/disassemble loop is the reveal). CAMERA_REST
 * is this scene's single source of truth for camera distance — BrainField
 * reads it as a prop rather than capturing camera.position.z itself, since
 * its own mount/ref-init runs before this component's effect below.
 */
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { BrainField } from "./BrainField";
import { SceneEffects } from "./SceneEffects";

/** Tuned for the brain's bounding size (~1.7 units tall) rather than the
 * old sculpture's (which spanned several units with orbiting modules). */
const CAMERA_REST = { x: 0, y: 0.15, z: 3.4 };

export function HeroScene() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(CAMERA_REST.x, CAMERA_REST.y, CAMERA_REST.z);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <BrainField baseCameraZ={CAMERA_REST.z} />
      <SceneEffects />
    </>
  );
}
