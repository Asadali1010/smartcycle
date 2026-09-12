import { describe, expect, it } from "vitest";
import { SIGNATURE_EASE, SIGNATURE_EASE_ARRAY, SIGNATURE_EASE_CSS, SIGNATURE_STAGGER, staggerDelay } from "./signature";

describe("signature ease constants", () => {
  it("exposes a GSAP-native overshoot-then-settle ease", () => {
    expect(SIGNATURE_EASE).toBe("back.out(1.4)");
  });

  it("exposes a 4-number bezier array for Framer Motion consumers", () => {
    expect(SIGNATURE_EASE_ARRAY).toEqual([0.34, 1.56, 0.64, 1]);
  });

  it("derives a matching CSS cubic-bezier string from the same array", () => {
    expect(SIGNATURE_EASE_CSS).toBe("cubic-bezier(0.34, 1.56, 0.64, 1)");
  });
});

describe("staggerDelay", () => {
  it("returns zero delay for the first item", () => {
    expect(staggerDelay(0)).toBe(0);
  });

  it("scales linearly with index using the signature stagger constant", () => {
    expect(staggerDelay(3)).toBeCloseTo(3 * SIGNATURE_STAGGER);
  });

  it("accepts a custom base delay", () => {
    expect(staggerDelay(2, 0.1)).toBeCloseTo(0.2);
  });

  it("clamps negative indices to zero delay", () => {
    expect(staggerDelay(-5)).toBe(0);
  });
});
