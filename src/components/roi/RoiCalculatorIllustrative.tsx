import { useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Badge } from "@/design-system";
import { GapNote } from "@/components/common/GapNote";
import { roi } from "@/content";
import { computeIllustrativeRoi } from "./roiFormula";
import { useAnimatedNumber } from "./useAnimatedNumber";

const currencyCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}

function SliderField({ label, value, min, max, step, format, onChange }: SliderFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-inter text-xs uppercase tracking-widest text-current/50">{label}</span>
      <span className="font-inter text-xl font-medium text-electric-iris">{format(value)}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-electric-iris"
      />
    </label>
  );
}

function OutputStat({ label, value, qualifier }: { label: string; value: string; qualifier?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-edge p-4">
      <p className="font-inter text-xs uppercase tracking-widest text-current/50">{label}</p>
      <p className="font-inter text-2xl font-medium text-current">{value}</p>
      {qualifier ? <p className="font-inter text-xs text-smoke">{qualifier}</p> : null}
    </div>
  );
}

/**
 * Interactive ROI calculator — per gaps.ts `roi-calculator-dynamic`, the
 * real site's calculator's client-side JS formula could not be verified, so
 * this is explicitly and persistently labeled "Illustrative" (not just alt
 * text), documents its assumed formula visibly, and surfaces the gap via
 * the shared GapNote pattern. Starts at the real site's confirmed default
 * slider positions/outputs (roi.ts `roiCalculatorInputs` /
 * `roiCalculatorDefaultOutputs`); any other position is this component's
 * own interpolation, never presented as a verified SmartCycleAI figure.
 */
export function RoiCalculatorIllustrative() {
  const inputs = roi.roiCalculatorInputs;
  const defaults = roi.roiCalculatorDefaultOutputs;
  const prefersReducedMotion = useReducedMotion();

  const [orgSize, setOrgSize] = useState(inputs[0].default.value);
  const [buildSpend, setBuildSpend] = useState(inputs[1].default.value);
  const [activeProjects, setActiveProjects] = useState(inputs[2].default.value);

  const bounds = useMemo(
    () => ({
      orgSize: [inputs[0].min.value, inputs[0].max.value] as [number, number],
      buildSpend: [inputs[1].min.value, inputs[1].max.value] as [number, number],
      activeProjects: [inputs[2].min.value, inputs[2].max.value] as [number, number],
    }),
    [inputs],
  );

  const outputs = useMemo(
    () => computeIllustrativeRoi({ orgSize, buildSpend, activeProjects }, bounds),
    [orgSize, buildSpend, activeProjects, bounds],
  );

  const animatedSavings = useAnimatedNumber(outputs.projectedAnnualSavings, prefersReducedMotion);
  const animatedCostReduction = useAnimatedNumber(outputs.costReductionPct, prefersReducedMotion);
  const animatedFasterTime = useAnimatedNumber(outputs.fasterTimeToProductionPct, prefersReducedMotion);

  const isAtDefaults =
    orgSize === inputs[0].default.value &&
    buildSpend === inputs[1].default.value &&
    activeProjects === inputs[2].default.value;

  return (
    <div className="flex flex-col gap-8 rounded-xl border border-slate-edge bg-charcoal-card p-8 text-snow">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge label="Illustrative — not a verified SmartCycleAI figure" tone="solid" />
        <GapNote gapId="roi-calculator-dynamic" label="Why this is illustrative" />
      </div>

      <p className="max-w-2xl font-inter text-sm text-current/60">
        Illustrative model: this hand-built formula assumes cost reduction scales with your organization size,
        annual build spend, and active project count, tuned so its default slider position reproduces the real
        site's confirmed default outputs. Moving the sliders shows this component's own interpolation, not
        SmartCycleAI's verified methodology.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <SliderField
          label={inputs[0].label.value}
          value={orgSize}
          min={inputs[0].min.value}
          max={inputs[0].max.value}
          step={inputs[0].step.value}
          format={(v) => `${Math.round(v).toLocaleString()} employees`}
          onChange={setOrgSize}
        />
        <SliderField
          label={inputs[1].label.value}
          value={buildSpend}
          min={inputs[1].min.value}
          max={inputs[1].max.value}
          step={inputs[1].step.value}
          format={(v) => currencyCompact.format(v)}
          onChange={setBuildSpend}
        />
        <SliderField
          label={inputs[2].label.value}
          value={activeProjects}
          min={inputs[2].min.value}
          max={inputs[2].max.value}
          step={inputs[2].step.value}
          format={(v) => `${Math.round(v)} projects`}
          onChange={setActiveProjects}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <OutputStat
          label="Projected Annual Savings"
          value={currencyCompact.format(animatedSavings)}
          qualifier={isAtDefaults ? defaults.projectedAnnualSavings.qualifier : "Illustrative"}
        />
        <OutputStat
          label="Faster Time to Production"
          value={`${Math.round(animatedFasterTime)}%`}
          qualifier={isAtDefaults ? undefined : "Illustrative"}
        />
        <OutputStat
          label="Cost Reduction"
          value={`${Math.round(animatedCostReduction)}%`}
          qualifier={isAtDefaults ? undefined : "Illustrative"}
        />
        <OutputStat
          label="Vendor Consolidation"
          value={defaults.vendorConsolidation.value}
          qualifier="Illustrative default — not slider-dependent"
        />
      </div>

      <p className="font-inter text-xs text-current/40">
        Default position ({inputs[0].default.value.toLocaleString()} employees / {currencyCompact.format(
          inputs[1].default.value,
        )}{" "}
        / {inputs[2].default.value} projects) matches the real site's confirmed defaults exactly — source:{" "}
        {defaults.projectedAnnualSavings.sourceUrl}, verified {defaults.projectedAnnualSavings.lastVerified}. All
        other slider positions are this component's own illustrative interpolation.
      </p>
    </div>
  );
}
