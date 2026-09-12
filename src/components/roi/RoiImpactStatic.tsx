import { motion, useReducedMotion } from "motion/react";
import { roi } from "@/content";

/**
 * Renders roi.ts's own static before/after comparison strip
 * (`roiComparisonTable`) as a richer card grid with a scroll-entry reveal —
 * distinct from HomePage's current placeholder use of the plain
 * `ComparisonRows` table for the same data, and distinct from home.ts's
 * separate `executionGap` content (the "Up to 73% Cost Reduction" figure).
 * Every value is rendered exactly as captured in roi.ts — no rounding, no
 * invented figures.
 */
export function RoiImpactStatic() {
  const rows = roi.roiComparisonTable;
  const prefersReducedMotion = useReducedMotion();
  const attribution = rows[0]?.label;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row, i) => (
          <motion.div
            key={row.label.value}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : i * 0.05 }}
            className="flex flex-col gap-3 rounded-xl border border-current/15 p-6"
          >
            <p className="font-body text-xs font-medium uppercase tracking-[0.2em] text-current/50">
              {row.label.value}
            </p>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-display text-lg text-current/40 line-through decoration-current/30">
                {row.before.value}
              </span>
              <span aria-hidden="true" className="text-current/30">
                →
              </span>
              <span className="font-display text-2xl text-coral">{row.after.value}</span>
            </div>
          </motion.div>
        ))}
      </div>
      {attribution ? (
        <p className="font-body text-xs text-current/40">
          Source: {attribution.sourceUrl} · verified {attribution.lastVerified}
        </p>
      ) : null}
    </div>
  );
}
