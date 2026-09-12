import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_CAMERA_POSE, useSceneStore } from "./sceneStore";

describe("useSceneStore", () => {
  beforeEach(() => {
    useSceneStore.setState({
      activeStage: 0,
      lastCameraPose: DEFAULT_CAMERA_POSE,
      hoveredModuleIndex: null,
      accentPulse: 0,
    });
  });

  it("clamps activeStage to [0, 1]", () => {
    useSceneStore.getState().setActiveStage(1.4);
    expect(useSceneStore.getState().activeStage).toBe(1);
    useSceneStore.getState().setActiveStage(-0.2);
    expect(useSceneStore.getState().activeStage).toBe(0);
  });

  it("stores the last camera pose verbatim", () => {
    const pose = { position: [1, 2, 3] as [number, number, number], lookAt: [0, 0, 0] as [number, number, number] };
    useSceneStore.getState().setLastCameraPose(pose);
    expect(useSceneStore.getState().lastCameraPose).toEqual(pose);
  });

  it("clamps accentPulse to [0, 1]", () => {
    useSceneStore.getState().setAccentPulse(2);
    expect(useSceneStore.getState().accentPulse).toBe(1);
    useSceneStore.getState().setAccentPulse(-1);
    expect(useSceneStore.getState().accentPulse).toBe(0);
  });

  it("tracks hoveredModuleIndex including null", () => {
    useSceneStore.getState().setHoveredModuleIndex(2);
    expect(useSceneStore.getState().hoveredModuleIndex).toBe(2);
    useSceneStore.getState().setHoveredModuleIndex(null);
    expect(useSceneStore.getState().hoveredModuleIndex).toBeNull();
  });
});
