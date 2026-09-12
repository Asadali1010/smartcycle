/**
 * Pure camera pose (position + lookAt) as a function of the Build(0) ->
 * Govern(0.5) -> Deploy(1) story stage, mirroring transforms.ts's own
 * two-segment smoothstep blend so the camera settles in step with the
 * module transforms it's framing. Used by the scroll-story scene, which
 * drives `stage` directly off scroll progress rather than a mount timeline.
 */

export interface CameraPose {
  position: [number, number, number];
  lookAt: [number, number, number];
}

const BUILD_CAM: CameraPose = { position: [3.4, 1.5, 9.2], lookAt: [0, 0, 0] };
const GOVERN_CAM: CameraPose = { position: [0, 2.8, 6.8], lookAt: [0, 0.2, 0] };
const DEPLOY_CAM: CameraPose = { position: [-3.6, 0.3, 11.5], lookAt: [0, 0, 0] };

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

function lerpPose(from: CameraPose, to: CameraPose, t: number): CameraPose {
  return {
    position: [
      lerp(from.position[0], to.position[0], t),
      lerp(from.position[1], to.position[1], t),
      lerp(from.position[2], to.position[2], t),
    ],
    lookAt: [
      lerp(from.lookAt[0], to.lookAt[0], t),
      lerp(from.lookAt[1], to.lookAt[1], t),
      lerp(from.lookAt[2], to.lookAt[2], t),
    ],
  };
}

export function getCameraPose(stage: number): CameraPose {
  const clamped = Math.min(1, Math.max(0, stage));
  const [from, to, localT] =
    clamped <= 0.5 ? ([BUILD_CAM, GOVERN_CAM, clamped / 0.5] as const) : ([GOVERN_CAM, DEPLOY_CAM, (clamped - 0.5) / 0.5] as const);
  return lerpPose(from, to, smoothstep(localT));
}
