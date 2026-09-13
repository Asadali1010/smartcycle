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

/*
 * v3 (Huly Tag/Chip spec): most badges in this codebase are compliance/trust
 * labels (HIPAA, SOC 2, etc), not "primary action" chips, so the default
 * tones below stay on neutral ash/iron-veil grays rather than defaulting
 * every tag to Electric Iris. Callers that explicitly want an accent tone
 * (e.g. a "live" status chip) can still reach it via `className` — Badge
 * keeps that override path open rather than hardcoding every category color
 * design.md's Tag/Chip table lists.
 */
const TONE_STYLES: Record<BadgeTone, string> = {
  outline: "border border-ash/50 text-ash",
  solid: "bg-iron-veil/12 text-iron-veil border border-transparent",
  subtle: "bg-current/5 text-current border border-current/15",
};

/**
 * Small pill used for trust/compliance badges (HIPAA, HITRUST, Epic-Safe,
 * SOC 2, etc.) and similar short label chips. Purely presentational — takes
 * whatever text it's given. Matches design.md's Tag/Chip spec: 9999px
 * radius, 11px/500 label, background = tone color at ~12% opacity with the
 * same color at full saturation for the text.
 */
export function Badge({ label, tone = "outline", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 font-inter text-caption font-medium",
        TONE_STYLES[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
