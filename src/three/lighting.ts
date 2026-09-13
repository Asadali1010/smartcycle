/**
 * Shared key/fill/rim lighting rig config for the sculpture scene. Exported
 * as plain config (not JSX, since a light rig authored purely for one .tsx
 * component would defeat the point of sharing it) so both HeroScene and the
 * later scroll-story scene render the exact same rig by mapping this array
 * to <directionalLight>/<pointLight> elements.
 */
import { PALETTE } from "./materials";

export type LightRole = "key" | "fill" | "rim" | "ambient" | "accent";

export interface LightConfig {
  role: LightRole;
  type: "directional" | "point" | "ambient";
  color: string;
  intensity: number;
  position?: [number, number, number];
}

/**
 * Default rig: a neutral white key light from upper-front-right (so the
 * neutral chassis materials read true-to-color rather than tinted — the v3
 * palette reserves champagne's old "warm accent" role for nothing, since Huly
 * only allows two accents total), a neutral white fill from the left to
 * soften shadows, an Ember Pulse rim light from behind to separate the
 * sculpture from the background, a low Electric Iris accent from
 * below-front to catch the governance rings without tinting the whole scene,
 * plus a low neutral white ambient so unlit facets never go fully black.
 *
 * Intensities are pushed well above "physically plausible" for a glass
 * (MeshTransmissionMaterial) subject sitting against a near-black void
 * background (#090a0c): with no environment map feeding it reflections, a
 * low-roughness transmissive material reads as a nearly invisible dark smudge
 * unless direct lights are strong enough to throw real specular highlights
 * and the ember/iris accents are bright enough to survive both the DOM
 * legibility scrim layered over the canvas and SceneEffects' bloom threshold.
 */
export function createSceneLightingRig(intensityMultiplier = 1): LightConfig[] {
  return [
    {
      role: "key",
      type: "directional",
      color: "#ffffff",
      intensity: 3.6 * intensityMultiplier,
      position: [4, 5, 4],
    },
    {
      role: "fill",
      type: "point",
      color: "#ffffff",
      intensity: 1.6 * intensityMultiplier,
      position: [-5, 1, 2],
    },
    {
      role: "rim",
      type: "point",
      color: PALETTE.emberPulse,
      intensity: 2.8 * intensityMultiplier,
      position: [0, -2, -5],
    },
    {
      role: "accent",
      type: "point",
      color: PALETTE.electricIris,
      intensity: 2 * intensityMultiplier,
      position: [1.5, -1.5, 3],
    },
    {
      role: "ambient",
      type: "ambient",
      color: "#ffffff",
      intensity: 0.55 * intensityMultiplier,
    },
  ];
}

/** Hook-style accessor kept alongside the factory for parity with materials.ts/transforms.ts conventions. */
export function useSceneLightingRig(intensityMultiplier = 1): LightConfig[] {
  return createSceneLightingRig(intensityMultiplier);
}
