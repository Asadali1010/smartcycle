import type { ReactNode } from "react";
import clsx from "clsx";

export interface StepListItem {
  key: string;
  name: string;
  description?: string | null;
}

export interface StepListProps {
  steps: StepListItem[];
  className?: string;
  footnote?: ReactNode;
}

/**
 * Plain numbered process list (used for the homepage's 4-step and
 * /platform's 5-step "How It Works", the delivery-model phases, and the
 * contact process). No connecting-line animation yet — this is the
 * content-complete early pass; a later motion pass may choreograph it.
 */
export function StepList({ steps, className, footnote }: StepListProps) {
  return (
    <div className={clsx("flex flex-col gap-8", className)}>
      <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.key} className="flex flex-col gap-3 border-l-2 border-champagne/40 pl-5">
            <span className="font-display text-3xl text-coral">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="font-display text-lg">{step.name}</h3>
            {step.description ? (
              <p className="font-body text-sm leading-relaxed text-current/70">{step.description}</p>
            ) : null}
          </li>
        ))}
      </ol>
      {footnote}
    </div>
  );
}
