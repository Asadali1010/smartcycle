/**
 * Shared Zustand store that lets the homepage's WebGL sections (Hero,
 * ScrollStory, Showcase, Timeline) hand the sculpture's state off to each
 * other across separate <Canvas> mounts, so scrolling from one WebGL
 * section to the next feels like one continuous object rather than
 * independent scenes resetting to a cold start every time. Deliberately
 * NOT a single shared canvas spanning the page. Each section keeps its own
 * lightweight Canvas (existing `useCanvasFrameloop` pattern) and
 * reads/writes this store instead.
 */
import { create } from "zustand";

export interface CameraPoseState {
  position: [number, number, number];
  lookAt: [number, number, number];
}

export interface SceneState {
  activeStage: number;
  lastCameraPose: CameraPoseState;
  hoveredModuleIndex: number | null;
  accentPulse: number;
  setActiveStage: (stage: number) => void;
  setLastCameraPose: (pose: CameraPoseState) => void;
  setHoveredModuleIndex: (index: number | null) => void;
  setAccentPulse: (pulse: number) => void;
}

/** Matches HeroScene's own resting camera pose, so a section that mounts
 * before Hero ever writes to the store still gets a sensible starting pose. */
export const DEFAULT_CAMERA_POSE: CameraPoseState = {
  position: [0, 0.3, 10.5],
  lookAt: [0, 0, 0],
};

export const useSceneStore = create<SceneState>((set) => ({
  activeStage: 0,
  lastCameraPose: DEFAULT_CAMERA_POSE,
  hoveredModuleIndex: null,
  accentPulse: 0,
  setActiveStage: (stage) => set({ activeStage: Math.min(1, Math.max(0, stage)) }),
  setLastCameraPose: (pose) => set({ lastCameraPose: pose }),
  setHoveredModuleIndex: (index) => set({ hoveredModuleIndex: index }),
  setAccentPulse: (pulse) => set({ accentPulse: Math.min(1, Math.max(0, pulse)) }),
}));
