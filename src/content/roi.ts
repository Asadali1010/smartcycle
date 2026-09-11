import { sourcedFact } from "./types.ts";
import type { FactOptions, SourcedFact } from "./types.ts";

const SRC = "https://smartcycle.ai/";
const V = "2026-09-12";

const fact = <T,>(value: T, qualifier?: string, opts?: FactOptions): SourcedFact<T> =>
  sourcedFact(value, SRC, V, qualifier !== undefined ? { qualifier, ...opts } : opts);

export const roiSection = {
  eyebrow: fact("ROI Impact"),
  headingLines: fact(["Quantifiable Impact.", "Real Results."]),
  intro: fact("See what SmartCycleAI can deliver for your organization."),
};

export interface RoiSliderInput {
  label: SourcedFact<string>;
  min: SourcedFact<number>;
  max: SourcedFact<number>;
  step: SourcedFact<number>;
  default: SourcedFact<number>;
}

/**
 * The ROI Impact section on the live homepage is an INTERACTIVE calculator
 * (three range sliders driving computed outputs client-side), not a block
 * of fixed marketing stats. The exact calculation formula runs in
 * client-side JS and is not present in the server-rendered markup, so it
 * could not be verified/reproduced here — see gaps.ts `roi-calculator-dynamic`.
 * The values below are the calculator's DEFAULT-position inputs and the
 * outputs it renders at that default, confirmed from the live page's
 * initial HTML (not just a summarized description).
 */
export const roiCalculatorInputs: RoiSliderInput[] = [
  {
    label: fact("Organization Size (employees)"),
    min: fact(500),
    max: fact(50000),
    step: fact(500),
    default: fact(5000),
  },
  {
    label: fact("Annual IT Build Spend"),
    min: fact(500000),
    max: fact(20000000),
    step: fact(250000),
    default: fact(3000000, "$3.0M as displayed"),
  },
  {
    label: fact("Active Projects / Initiatives"),
    min: fact(5),
    max: fact(100),
    step: fact(5),
    default: fact(20),
  },
];

export const roiCalculatorDefaultOutputs = {
  projectedAnnualSavings: fact("$1.7M", "Projected", { gapRef: "roi-calculator-dynamic" }),
  fasterTimeToProduction: fact("68%", undefined, { gapRef: "roi-calculator-dynamic" }),
  costReduction: fact("57%", undefined, {
    gapRef: "cost-reduction-73-vs-57",
  }),
  timeSaved: fact("68%"),
  vendorConsolidation: fact("5 → 1"),
  gapRef: "roi-calculator-dynamic",
};

export interface RoiComparisonRow {
  label: SourcedFact<string>;
  before: SourcedFact<string>;
  after: SourcedFact<string>;
}

/**
 * The static "before / after" comparison strip beneath the calculator.
 * Unlike the calculator above, these six rows are fixed, non-interactive
 * values embedded directly in the server-rendered HTML.
 */
export const roiComparisonTable: RoiComparisonRow[] = [
  { label: fact("Time to Deploy"), before: fact("18 months"), after: fact("6 weeks") },
  { label: fact("Average Build Cost"), before: fact("$2.4M"), after: fact("$380K") },
  { label: fact("Vendor Consolidation"), before: fact("5+ vendors"), after: fact("1 platform") },
  { label: fact("Compliance Monitoring"), before: fact("Manual"), after: fact("Continuous") },
  { label: fact("IP Ownership"), before: fact("Vendor-owned"), after: fact("Fully owned") },
  { label: fact("Audit Evidence"), before: fact("Point-in-time"), after: fact("Real-time") },
];
