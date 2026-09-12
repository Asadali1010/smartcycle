/**
 * Shared material presets for the sculpture (SculptureModel + HeroScene, and
 * later the scroll-choreography scene that reuses the same module). Built as
 * factory functions rather than inlined JSX/material literals so every scene
 * that renders the sculpture draws from the same look. Colors mirror the
 * redesign's palette tokens in src/index.css (kept in sync manually since
 * three.js materials can't read CSS custom properties directly).
 */
import * as THREE from "three";
import type { MeshTransmissionMaterialProps } from "@react-three/drei";

export const PALETTE = {
  obsidian: "#141215",
  ivory: "#f7f2ea",
  coral: "#ff654f",
  champagne: "#d8be97",
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
    roughness: 0.1,
    transmission: 1,
    ior: 1.15,
    chromaticAberration: 0.015,
    anisotropy: 0.1,
    // Perf: MeshTransmissionMaterial captures a full-scene render-to-texture
    // per instance every frame — with several modules on screen at once this
    // gets expensive fast (observed: 5 instances at defaults dropped frame
    // rate enough that GSAP's lag-smoothing made animations run ~5x slower
    // than their authored duration). backside:false avoids a second render
    // pass per instance; low resolution/samples keep the remaining pass cheap
    // — the modules are small on screen so the softer refraction is not
    // visually noticeable at this scale.
    backside: false,
    resolution: 128,
    samples: 2,
    color: PALETTE.ivory,
    distortion: 0.08,
    distortionScale: 0.3,
    temporalDistortion: 0.03,
    ...overrides,
  };
}

/** Champagne metallic edge/outline treatment wrapped around each module. */
export function createChampagneEdgeMaterial(overrides: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color: PALETTE.champagne,
    metalness: 0.9,
    roughness: 0.22,
    emissive: new THREE.Color(PALETTE.champagne),
    emissiveIntensity: 0.08,
    ...overrides,
  });
}

/** Plain line-basic variant of the champagne edge treatment (for <Edges>/<Line>). */
export function createChampagneLineMaterial(overrides: Partial<THREE.LineBasicMaterialParameters> = {}) {
  return new THREE.LineBasicMaterial({
    color: PALETTE.champagne,
    transparent: true,
    opacity: 0.85,
    ...overrides,
  });
}

/** Coral accent material for the connection/illumination elements, emissive-driven by stage. */
export function createCoralAccentMaterial(emissiveIntensity = 0.4, overrides: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color: PALETTE.coral,
    metalness: 0.3,
    roughness: 0.4,
    emissive: new THREE.Color(PALETTE.coral),
    emissiveIntensity,
    ...overrides,
  });
}

/** Obsidian core/hub material — the central "platform" mass the modules orbit. */
export function createObsidianCoreMaterial(overrides: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color: PALETTE.obsidian,
    metalness: 0.55,
    roughness: 0.45,
    ...overrides,
  });
}

/** Faint champagne governance-ring material (torus frames that appear mid-stage). */
export function createGovernanceRingMaterial(opacity = 0.5, overrides: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color: PALETTE.champagne,
    metalness: 0.7,
    roughness: 0.3,
    transparent: true,
    opacity,
    emissive: new THREE.Color(PALETTE.champagne),
    emissiveIntensity: 0.15,
    ...overrides,
  });
}
