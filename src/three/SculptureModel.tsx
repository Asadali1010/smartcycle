/**
 * Original geometry (no Trionn assets) representing the Build → Govern →
 * Deploy application lifecycle as a small set of architectural "module"
 * meshes orbiting an obsidian core:
 *  - Build (stage ~0): modules sit apart, unassembled, loosely scattered.
 *  - Govern (stage ~0.5): modules pull into an aligned ring; faint champagne
 *    governance rings fade in around each module.
 *  - Deploy (stage ~1): modules push outward into satellite positions,
 *    connected to the core by illuminated coral lines.
 *
 * Position/rotation/scale come from the shared, pure `getModuleTransform` —
 * this component never computes placement itself, so scroll-choreography can
 * reuse the exact same math later. `explode` is an *additive* radial offset
 * layered on top of that base transform, driven by the hero's
 * explode/reassemble interaction — it never mutates transforms.ts itself.
 *
 * Each module also answers pointer hover directly (`onPointerOver`/-`Out`):
 * its champagne edge brightens and it lifts slightly outward, so the
 * sculpture reads as a tangible, inspectable object rather than a passive
 * background animation. This is a mouse/trackpad-only enhancement layered on
 * top of the hero's existing keyboard-accessible explode control, which
 * remains the keyboard-operable equivalent.
 */
import { useMemo, useState } from "react";
import * as THREE from "three";
import { Edges, Line, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { MODULE_COUNT, getModuleTransform } from "./transforms";
import {
  PALETTE,
  createCoralAccentMaterial,
  createGlassModulePreset,
  createGovernanceRingMaterial,
  createObsidianCoreMaterial,
} from "./materials";

export interface SculptureModelProps {
  /** 0 (Build) → 0.5 (Govern) → 1 (Deploy). The single driver of the story. */
  stage: number;
  /**
   * Additional outward radial push applied on top of each module's base
   * transform, 0 (none, at rest per `stage`) → 1 (fully exploded). Driven by
   * the hero's keyboard-accessible explode/reassemble interaction.
   */
  explode?: number;
}

const MODULE_ARGS: [number, number, number] = [1, 1.3, 0.55];
/** Per-module explode distance grows with index, per the brief. */
const EXPLODE_BASE_DISTANCE = 2.2;
const EXPLODE_PER_INDEX = 0.4;

function radialDirection(position: readonly [number, number, number]): [number, number, number] {
  const [x, y, z] = position;
  const length = Math.hypot(x, y, z);
  if (length < 1e-4) return [1, 0, 0];
  return [x / length, y / length, z / length];
}

export function SculptureModel({ stage, explode = 0 }: SculptureModelProps) {
  const clampedStage = Math.min(1, Math.max(0, stage));
  const clampedExplode = Math.min(1, Math.max(0, explode));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const glassPreset = useMemo(() => createGlassModulePreset(), []);
  const coreMaterial = useMemo(() => createObsidianCoreMaterial(), []);
  const edgeColor = useMemo(() => new THREE.Color(PALETTE.champagne), []);
  const ringMaterial = useMemo(() => createGovernanceRingMaterial(0.55), []);

  // Governance rings fade in across the Build→Govern transition and persist.
  const ringOpacity = Math.min(1, Math.max(0, (clampedStage - 0.1) / 0.35)) * 0.55;
  // Satellite connections illuminate mainly across the Govern→Deploy transition.
  const connectionGlow = Math.min(1, Math.max(0, (clampedStage - 0.4) / 0.6));
  const coralMaterial = useMemo(() => createCoralAccentMaterial(0.2), []);
  coralMaterial.emissiveIntensity = 0.15 + connectionGlow * 1.1;
  ringMaterial.opacity = ringOpacity;

  const modules = useMemo(
    () =>
      Array.from({ length: MODULE_COUNT }, (_, i) => {
        const base = getModuleTransform(clampedStage, i);
        const direction = radialDirection(base.position);
        const explodeDistance = (EXPLODE_BASE_DISTANCE + i * EXPLODE_PER_INDEX) * clampedExplode;
        const position: [number, number, number] = [
          base.position[0] + direction[0] * explodeDistance,
          base.position[1] + direction[1] * explodeDistance,
          base.position[2] + direction[2] * explodeDistance,
        ];
        return { index: i, base, position };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recompute per stage/explode
    [clampedStage, clampedExplode],
  );

  return (
    <group>
      {/* Obsidian core / platform hub */}
      <RoundedBox args={[0.9, 0.9, 0.9]} radius={0.12} smoothness={4} material={coreMaterial} />

      {modules.map(({ index, base, position }) => {
        const isHovered = hoveredIndex === index;
        const hoverScale = base.scale * (isHovered ? 1.08 : 1);
        return (
          <group
            key={index}
            position={position}
            rotation={base.rotation}
            scale={hoverScale}
            onPointerOver={(event) => {
              event.stopPropagation();
              setHoveredIndex(index);
            }}
            onPointerOut={(event) => {
              event.stopPropagation();
              setHoveredIndex((current) => (current === index ? null : current));
            }}
          >
            <RoundedBox args={MODULE_ARGS} radius={0.06} smoothness={3}>
              <MeshTransmissionMaterial {...glassPreset} />
              <Edges color={isHovered ? PALETTE.coral : edgeColor} lineWidth={isHovered ? 2 : 1.25} threshold={20} />
            </RoundedBox>
            {/* Governance ring frame around this module */}
            <mesh rotation={[Math.PI / 2, 0, 0]} material={ringMaterial}>
              <torusGeometry args={[0.95, 0.03, 12, 48]} />
            </mesh>
          </group>
        );
      })}

      {/* Illuminated connections from core to each deployed module */}
      {modules.map(({ index, position }) => (
        <Line
          key={index}
          points={[
            [0, 0, 0],
            position,
          ]}
          color={PALETTE.coral}
          lineWidth={1}
          transparent
          opacity={connectionGlow * 0.75}
        />
      ))}

      {/* satellite node markers at deploy connection endpoints, glow-driven */}
      {modules.map(({ index, position }) => (
        <mesh key={index} position={position} material={coralMaterial} scale={0.12 + connectionGlow * 0.06}>
          <sphereGeometry args={[1, 12, 12]} />
        </mesh>
      ))}
    </group>
  );
}
