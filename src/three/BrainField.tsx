/**
 * Hero's signature visual: ~8,000 particles forming a human brain that
 * continuously assembles, holds (rotating, jittering, pulsing, with
 * flickering synapse lines), and disassembles into dust on a seamless 12s
 * loop. One BufferGeometry + one Points object (plus one small LineSegments
 * object for synapses) — every particle's motion is computed in the vertex
 * shader from a single uTime uniform, never touched from JS per-frame.
 *
 * Interaction: dragging the canvas rotates the brain, the wheel dollies the
 * camera (zoom), and the cursor repels nearby particles. All three are
 * disabled under prefers-reduced-motion, which instead renders the
 * fully-formed, non-rotating brain with only a slow brightness pulse.
 */
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { generateBrainGeometry, generateSynapseLines } from "./brainGeometry";
import { BRAIN_FRAGMENT_SHADER, BRAIN_VERTEX_SHADER, SYNAPSE_FRAGMENT_SHADER, SYNAPSE_VERTEX_SHADER } from "./brainShaders";
import { PALETTE } from "./materials";

const PARTICLE_COUNT = 8000;
const LINE_COUNT = 150;
const LOOP_DURATION = 12;
const HOLD_START = 4;
const HOLD_END = 8;

const BASE_POINT_SIZE = 5.5;
const REPEL_RADIUS = 0.35;
const REPEL_STRENGTH = 0.12;
const AUTO_ROTATE_SPEED = 0.12;
const DRAG_YAW_SENSITIVITY = 0.006;
const DRAG_PITCH_SENSITIVITY = 0.006;
const PITCH_LIMIT = 0.6;
const ZOOM_MIN = -2.5;
const ZOOM_MAX = 3.5;
const ZOOM_SENSITIVITY = 0.0025;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export interface BrainFieldProps {
  /** Resting camera Z distance, owned by HeroScene (the single source of
   * truth for the scene's camera pose) — zoom is applied as an offset from
   * this rather than from whatever camera.position.z happens to be at
   * BrainField's own mount time, which can run before HeroScene's own
   * positioning effect and would otherwise capture a stale value. */
  baseCameraZ: number;
}

export function BrainField({ baseCameraZ }: BrainFieldProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { gl, camera } = useThree();

  const brain = useMemo(() => generateBrainGeometry(PARTICLE_COUNT), []);
  const synapses = useMemo(() => generateSynapseLines(brain, LINE_COUNT), [brain]);

  const pointsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(brain.positions, 3));
    geometry.setAttribute("aOrigin", new THREE.BufferAttribute(brain.origins, 3));
    geometry.setAttribute("aCurl", new THREE.BufferAttribute(brain.curls, 3));
    geometry.setAttribute("aParams", new THREE.BufferAttribute(brain.params, 4));
    geometry.setAttribute("aGradient", new THREE.BufferAttribute(brain.gradient, 1));
    return geometry;
  }, [brain]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(synapses.positions, 3));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(synapses.phases, 1));
    return geometry;
  }, [synapses]);

  const pointsMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: BRAIN_VERTEX_SHADER,
        fragmentShader: BRAIN_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uReduced: { value: prefersReducedMotion ? 1 : 0 },
          uPointer: { value: new THREE.Vector3(9999, 9999, 9999) },
          uRepelRadius: { value: REPEL_RADIUS },
          uRepelStrength: { value: REPEL_STRENGTH },
          uPixelRatio: { value: typeof window !== "undefined" ? window.devicePixelRatio : 1 },
          uBaseSize: { value: BASE_POINT_SIZE },
          uColorA: { value: new THREE.Color(PALETTE.champagne) },
          uColorB: { value: new THREE.Color(PALETTE.violet) },
        },
      }),
    [prefersReducedMotion],
  );

  const lineMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SYNAPSE_VERTEX_SHADER,
        fragmentShader: SYNAPSE_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(PALETTE.violetSoft) },
        },
      }),
    [],
  );

  useEffect(
    () => () => {
      pointsGeometry.dispose();
      lineGeometry.dispose();
      pointsMaterial.dispose();
      lineMaterial.dispose();
    },
    [pointsGeometry, lineGeometry, pointsMaterial, lineMaterial],
  );

  const groupRef = useRef<THREE.Group>(null);
  const autoRotationRef = useRef(0);
  const dragYawRef = useRef(0);
  const dragPitchRef = useRef(0);
  const zoomRef = useRef(0);
  const pointerLocalRef = useRef(new THREE.Vector3(9999, 9999, 9999));
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

  // Drag-to-rotate + scroll-to-zoom via native listeners on the canvas
  // element: dragging must keep working even when it starts over empty
  // space, where there's no mesh to hang onPointerDown/onWheel props off.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvasEl = gl.domElement;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      dragYawRef.current += dx * DRAG_YAW_SENSITIVITY;
      dragPitchRef.current = clamp(dragPitchRef.current + dy * DRAG_PITCH_SENSITIVITY, -PITCH_LIMIT, PITCH_LIMIT);
    };
    const onPointerUp = () => {
      dragging = false;
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoomRef.current = clamp(zoomRef.current + event.deltaY * ZOOM_SENSITIVITY, ZOOM_MIN, ZOOM_MAX);
    };

    canvasEl.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvasEl.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      canvasEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvasEl.removeEventListener("wheel", onWheel);
    };
  }, [gl, prefersReducedMotion]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime % LOOP_DURATION;
    pointsMaterial.uniforms.uTime.value = t;
    lineMaterial.uniforms.uTime.value = t;

    if (prefersReducedMotion) return;

    const inHold = t >= HOLD_START && t < HOLD_END;
    if (inHold) autoRotationRef.current += delta * AUTO_ROTATE_SPEED;

    if (groupRef.current) {
      groupRef.current.rotation.y = autoRotationRef.current + dragYawRef.current;
      groupRef.current.rotation.x = dragPitchRef.current;
      raycasterRef.current.setFromCamera(state.pointer, state.camera);
      const hit = raycasterRef.current.ray.intersectPlane(pointerPlaneRef.current, pointerLocalRef.current);
      if (hit) {
        groupRef.current.worldToLocal(pointerLocalRef.current);
        pointsMaterial.uniforms.uPointer.value.copy(pointerLocalRef.current);
      }
    }

    camera.position.z = baseCameraZ + zoomRef.current;
  });

  return (
    <group ref={groupRef}>
      <points geometry={pointsGeometry} material={pointsMaterial} />
      {!prefersReducedMotion ? <lineSegments geometry={lineGeometry} material={lineMaterial} /> : null}
    </group>
  );
}
