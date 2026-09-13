/**
 * Shared material presets for the sculpture (SculptureModel + HeroScene, and
 * later the scroll-choreography scene that reuses the same module). Built as
 * factory functions rather than inlined JSX/material literals so every scene
 * that renders the sculpture draws from the same look. Colors mirror the
 * redesign's v3 (Huly system) palette tokens in src/index.css (kept in sync
 * manually since three.js materials can't read CSS custom properties
 * directly).
 */
import * as THREE from "three";
import type { MeshTransmissionMaterialProps } from "@react-three/drei";

export const PALETTE = {
  obsidianCanvas: "#303236",
  voidColor: "#090a0c",
  charcoalCard: "#111111",
  slateEdge: "#4a4b50",
  ironVeil: "#6b6c6d",
  smoke: "#95979e",
  electricIris: "#5683da",
  emberPulse: "#ff8964",
  molasses: "#5a250a",
} as const;

/**
 * Props for drei's <MeshTransmissionMaterial>, used on the translucent
 * "application module" glass panels. Returned as a plain props object (spread
 * onto the JSX element) rather than a THREE.Material instance, since
 * MeshTransmissionMaterial is itself a component with imperative internals.
 */
export function createGlassModulePreset(
  overrides: Partial<MeshTransmissionMaterialProps> = {},
): MeshTransmissionMaterialProps {
  return {
    thickness: 0.55,
    roughness: 0.06,
    transmission: 0.92,
    ior: 1.2,
    // A touch of reflectivity/clearcoat gives the glass a real specular
    // "edge" independent of transmission — without an environment map behind
    // it, a purely transmissive material at low roughness reads as a nearly
    // invisible dark smudge against the void background, since it has
    // nothing bright to refract or reflect. These let the light rig's
    // key/rim highlights actually catch on the surface.
    reflectivity: 0.35,
    clearcoat: 0.25,
    clearcoatRoughness: 0.15,
    chromaticAberration: 0.02,
    anisotropy: 0.1,
    // The scene's own background is deliberately transparent (Hero/ScrollStory
    // canvases use alpha:true with no <color attach="background">, so the
    // page's colorful gradient shows through around the sculpture) — but
    // MeshTransmissionMaterial refracts whatever's behind it, and an actually-
    // transparent backdrop reads as flat black glass. `background` gives it a
    // private backdrop to refract against instead, independent of what the
    // real scene/DOM behind the canvas looks like — slate-edge rather than
    // the darker obsidian-canvas so the refracted core doesn't read as
    // near-black-on-black against the void.
    background: new THREE.Color(PALETTE.slateEdge),
    // Perf: MeshTransmissionMaterial captures a full-scene render-to-texture
    // per instance every frame — with several modules on screen at once this
    // gets expensive fast (observed: 5 instances at defaults dropped frame
    // rate enough that GSAP's lag-smoothing made animations run ~5x slower
    // than their authored duration). backside:false avoids a second render
    // pass per instance; low resolution/samples keep the remaining pass cheap
    // — the modules are small on screen so the softer refraction is not
    // visually noticeable at this scale.
    backside: false,
    resolution: 192,
    samples: 4,
    // Neutral slate/iron metal tint for the module glass — the old champagne
    // metallic chassis has no equivalent in Huly's canvas+iris+ember
    // vocabulary, so this reads as a quiet metal/glass surface rather than
    // inventing an unlisted third accent color.
    color: PALETTE.ironVeil,
    distortion: 0.08,
    distortionScale: 0.3,
    temporalDistortion: 0.03,
    ...overrides,
  };
}

/**
 * Chassis edge/outline treatment wrapped around each module — neutral slate
 * metal with a subtle Electric Iris emissive tint (replaces the old solid
 * champagne-metallic look without introducing a new accent color).
 */
export function createChassisEdgeMaterial(overrides: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color: PALETTE.slateEdge,
    metalness: 0.9,
    roughness: 0.22,
    emissive: new THREE.Color(PALETTE.electricIris),
    emissiveIntensity: 0.08,
    ...overrides,
  });
}

/** Plain line-basic variant of the chassis edge treatment (for <Edges>/<Line>). */
export function createChassisLineMaterial(overrides: Partial<THREE.LineBasicMaterialParameters> = {}) {
  return new THREE.LineBasicMaterial({
    color: PALETTE.slateEdge,
    transparent: true,
    opacity: 0.85,
    ...overrides,
  });
}

/** Ember Pulse accent material for the connection/illumination elements, emissive-driven by stage. */
export function createEmberAccentMaterial(emissiveIntensity = 0.4, overrides: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color: PALETTE.emberPulse,
    metalness: 0.3,
    roughness: 0.4,
    emissive: new THREE.Color(PALETTE.emberPulse),
    emissiveIntensity,
    ...overrides,
  });
}

/** Obsidian core/hub material — the central "platform" mass the modules orbit. */
export function createObsidianCoreMaterial(overrides: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color: PALETTE.obsidianCanvas,
    metalness: 0.55,
    roughness: 0.45,
    ...overrides,
  });
}

/**
 * Electric Iris governance-ring material (torus frames that fade in mid-stage).
 * Iris is the v3 palette's sole cool anchor and carries the "governance/trust"
 * role the old palette assigned to violet — chassis trim now stays neutral
 * slate/iron metal so each color still carries exactly one meaning.
 */
export function createGovernanceRingMaterial(opacity = 0.5, overrides: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color: PALETTE.electricIris,
    metalness: 0.5,
    roughness: 0.25,
    transparent: true,
    opacity,
    emissive: new THREE.Color(PALETTE.electricIris),
    emissiveIntensity: 0.7,
    ...overrides,
  });
}
