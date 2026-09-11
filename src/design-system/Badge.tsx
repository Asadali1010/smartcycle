import type { ReactNode } from "react";
import clsx from "clsx";

export type BadgeTone = "outline" | "solid" | "subtle";

export interface BadgeProps {
  /**
   * Exact label to render verbatim. Certification/trust-badge wording varies
   * per source page (e.g. "HIPAA" vs "HIPAA Aware", "SOC 2 Type II" vs
   * "SOC 2 Aligned" — see src/content/gaps.ts `certification-language-varies-by-page`),
   * so Badge never hardcodes or normalizes a certification name; the caller
   * supplies whatever string that page's sourced content states.
   */
  label: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const TONE_STYLES: Record<BadgeTone, string> = {
  outline: "border border-champagne/50 text-current",
  solid: "bg-champagne text-obsidian border border-transparent",
  subtle: "bg-current/5 text-current border border-current/15",
};

/**
 * Small pill used for trust/compliance badges (HIPAA, HITRUST, Epic-Safe,
 * SOC 2, etc.) and similar short label chips. Purely presentational — takes
 * whatever text it's given.
 */
export function Badge({ label, tone = "outline", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-4 py-1.5 font-body text-xs font-medium uppercase tracking-widest",
        TONE_STYLES[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
