export interface RoiCalculatorState {
  orgSize: number;
  buildSpend: number;
  activeProjects: number;
}

export interface RoiCalculatorBounds {
  orgSize: [number, number];
  buildSpend: [number, number];
  activeProjects: [number, number];
}

export interface RoiCalculatorOutputs {
  costReductionPct: number;
  fasterTimeToProductionPct: number;
  projectedAnnualSavings: number;
  timeSavedPct: number;
}

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return Math.min(Math.max((value - min) / (max - min), 0), 1);
}

/**
 * ILLUSTRATIVE ONLY — not SmartCycleAI's verified calculation.
 *
 * Per gaps.ts `roi-calculator-dynamic`: the live site's ROI Impact section
 * is an interactive calculator whose real formula runs in client-side JS
 * and isn't present in server-rendered HTML, so it could not be recovered.
 * This is a hand-authored substitute, deliberately tuned so its output at
 * the confirmed DEFAULT slider position (5,000 employees / $3.0M annual
 * build spend / 20 active projects) reproduces the real site's confirmed
 * DEFAULT outputs from roi.ts `roiCalculatorDefaultOutputs` (57% cost
 * reduction, 68% faster time-to-production, ~$1.7M projected annual
 * savings). Any other slider position is this component's own
 * illustrative interpolation, never a verified SmartCycleAI figure.
 *
 *   costReduction%            = 50 + 10·orgSizeNorm + 20·buildSpendNorm + 20·activeProjectsNorm  (capped at 90)
 *   fasterTimeToProduction%   = 60 + 11·orgSizeNorm + 27·buildSpendNorm + 20·activeProjectsNorm  (capped at 95)
 *   projectedAnnualSavings    = (costReduction% / 100) × annualBuildSpend
 *
 * where each `*Norm` is that slider's current position normalized 0–1
 * across its own min/max range.
 */
export function computeIllustrativeRoi(
  state: RoiCalculatorState,
  bounds: RoiCalculatorBounds,
): RoiCalculatorOutputs {
  const orgNorm = normalize(state.orgSize, bounds.orgSize[0], bounds.orgSize[1]);
  const spendNorm = normalize(state.buildSpend, bounds.buildSpend[0], bounds.buildSpend[1]);
  const projectsNorm = normalize(state.activeProjects, bounds.activeProjects[0], bounds.activeProjects[1]);

  const costReductionPct = Math.min(50 + 10 * orgNorm + 20 * spendNorm + 20 * projectsNorm, 90);
  const fasterTimeToProductionPct = Math.min(60 + 11 * orgNorm + 27 * spendNorm + 20 * projectsNorm, 95);
  const projectedAnnualSavings = (costReductionPct / 100) * state.buildSpend;

  return {
    costReductionPct,
    fasterTimeToProductionPct,
    projectedAnnualSavings,
    timeSavedPct: fasterTimeToProductionPct,
  };
}
