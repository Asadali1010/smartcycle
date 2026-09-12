/**
 * Shared key/fill/rim lighting rig config for the sculpture scene. Exported
 * as plain config (not JSX, since a light rig authored purely for one .tsx
 * component would defeat the point of sharing it) so both HeroScene and the
 * later scroll-story scene render the exact same rig by mapping this array
 * to <directionalLight>/<pointLight> elements.
 */
import { PALETTE } from "./materials";

export type LightRole = "key" | "fill" | "rim" | "ambient";

export interface LightConfig {
  role: LightRole;
  type: "directional" | "point" | "ambient";
  color: string;
  intensity: number;
  position?: [number, number, number];
}

/**
 * Default rig: warm champagne key light from upper-front-right, cool-neutral
 * ivory fill from the left to soften shadows, a coral rim light from behind
 * to separate the sculpture from the obsidian background, plus a low ambient
 * so unlit facets never go fully black.
 */
export function createSceneLightingRig(intensityMultiplier = 1): LightConfig[] {
  return [
    {
      role: "key",
      type: "directional",
      color: PALETTE.champagne,
      intensity: 1.4 * intensityMultiplier,
      position: [4, 5, 4],
    },
    {
      role: "fill",
      type: "point",
      color: PALETTE.ivory,
      intensity: 0.5 * intensityMultiplier,
      position: [-5, 1, 2],
    },
    {
      role: "rim",
      type: "point",
      color: PALETTE.coral,
      intensity: 0.6 * intensityMultiplier,
      position: [0, -2, -5],
    },
    {
      role: "ambient",
      type: "ambient",
      color: PALETTE.ivory,
      intensity: 0.22 * intensityMultiplier,
    },
  ];
}

/** Hook-style accessor kept alongside the factory for parity with materials.ts/transforms.ts conventions. */
export function useSceneLightingRig(intensityMultiplier = 1): LightConfig[] {
  return createSceneLightingRig(intensityMultiplier);
}
