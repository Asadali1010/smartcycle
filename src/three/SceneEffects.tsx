/**
 * Shared post-processing stack for every sculpture-rendering canvas (hero,
 * scroll-story). A restrained bloom is the one new-dependency addition this
 * redesign pass makes (`@react-three/postprocessing`) — it's what turns the
 * coral connection lines / violet governance rings / champagne edges from
 * flat-lit accents into the glowing, premium-feeling highlights the brief
 * calls for, without hand-rolling a shader. Kept to a single low-threshold
 * bloom pass (no chromatic aberration/vignette/DoF) to stay cheap.
 */
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export function SceneEffects() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.75}
        luminanceThreshold={0.22}
        luminanceSmoothing={0.25}
        mipmapBlur
        radius={0.6}
      />
    </EffectComposer>
  );
}
