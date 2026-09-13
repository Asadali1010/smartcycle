import type { ReactNode } from "react";
import clsx from "clsx";

export interface ComparisonRow {
  key: string;
  label: string;
  before: string;
  after: string;
}

export interface ComparisonRowsProps {
  rows: ComparisonRow[];
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  footnote?: ReactNode;
}

/** Static before/after comparison table (ROI comparison, execution-gap style rows). */
export function ComparisonRows({ rows, beforeLabel = "Before", afterLabel = "With SmartCycleAI", className, footnote }: ComparisonRowsProps) {
  return (
    <div className={clsx("flex flex-col gap-4", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-current/20">
              <th className="py-3 pr-4 font-inter text-xs font-medium uppercase tracking-[0.2em] text-current/60">
                &nbsp;
              </th>
              <th className="py-3 pr-4 font-inter text-xs font-medium uppercase tracking-[0.2em] text-current/60">
                {beforeLabel}
              </th>
              <th className="py-3 font-inter text-xs font-medium uppercase tracking-[0.2em] text-ember-pulse">
                {afterLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-current/10">
                <td className="py-4 pr-4 font-inter text-sm text-current/70">{row.label}</td>
                <td className="py-4 pr-4 font-inter text-lg font-semibold text-current/50 line-through decoration-current/30">
                  {row.before}
                </td>
                <td className="py-4 font-inter text-lg font-semibold text-ember-pulse">{row.after}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footnote}
    </div>
  );
}
