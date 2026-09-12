import { describe, expect, it } from "vitest";
import { moduleBootWindow } from "./boot";

describe("moduleBootWindow", () => {
  it("keeps the first module (index 0) fully hidden before boot starts", () => {
    const window = moduleBootWindow(0, 0);
    expect(window.traceT).toBe(0);
    expect(window.growT).toBe(0);
  });

  it("fully grows every module once bootProgress reaches 1", () => {
    for (let i = 0; i < 5; i++) {
      const window = moduleBootWindow(1, i);
      expect(window.traceT).toBe(1);
      expect(window.growT).toBe(1);
    }
  });

  it("staggers later modules behind earlier ones at the same bootProgress", () => {
    const first = moduleBootWindow(0.5, 0);
    const last = moduleBootWindow(0.5, 4);
    expect(last.growT).toBeLessThanOrEqual(first.growT);
    expect(last.traceT).toBeLessThanOrEqual(first.traceT);
  });

  it("draws the trace line before the module starts growing", () => {
    const window = moduleBootWindow(0.15, 0);
    expect(window.traceT).toBeGreaterThan(0);
    expect(window.growT).toBe(0);
  });

  it("never starts growing before its trace line has fully drawn", () => {
    for (let boot = 0; boot <= 1; boot += 0.02) {
      for (let index = 0; index < 5; index++) {
        const window = moduleBootWindow(boot, index);
        if (window.growT > 0) {
          expect(window.traceT).toBe(1);
        }
      }
    }
  });

  it("clamps bootProgress outside [0, 1]", () => {
    expect(moduleBootWindow(-1, 0)).toEqual(moduleBootWindow(0, 0));
    expect(moduleBootWindow(2, 0)).toEqual(moduleBootWindow(1, 0));
  });
});
