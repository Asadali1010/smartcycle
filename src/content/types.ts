/**
 * Shared typed primitives for src/content/**.
 *
 * Every claim-bearing value pulled from https://smartcycle.ai/ is wrapped in
 * `SourcedFact<T>` so consuming components can render an attribution/gap
 * affordance instead of presenting scraped marketing copy as ground truth.
 *
 * Content in this directory is pure data: no JSX, no components, no styling.
 */

/**
 * A single fact (a quote, a number, a label, a list) traced back to the
 * live page it was verified against.
 *
 * - `value` — the fact itself, exactly as stated on the source page. Never
 *   rounded, strengthened, or silently reconciled with a conflicting fact
 *   found elsewhere on the site.
 * - `sourceUrl` — the exact page the fact was confirmed on.
 * - `lastVerified` — ISO date (YYYY-MM-DD) this value was last re-fetched
 *   and confirmed against the live site.
 * - `qualifier` — a hedge word/phrase the source itself uses next to the
 *   value ("Up to", "Projected", "avg.") — preserved separately so a
 *   consumer can style it distinctly but must still surface it.
 * - `gapRef` — id of a `GapEntry` in gaps.ts when this fact conflicts with,
 *   or is entangled with, another fact elsewhere on the site.
 */
export interface SourcedFact<T> {
  value: T;
  sourceUrl: string;
  lastVerified: string;
  qualifier?: string;
  gapRef?: string;
}

/** Severity of a tracked content gap/discrepancy. Informational only — none
 * of these block a build; they exist so the UI can surface honest caveats. */
export type GapSeverity = "info" | "low" | "medium" | "high";

export interface GapEntry {
  id: string;
  title: string;
  /** Plain-language description of the discrepancy/uncertainty and, where
   * relevant, both conflicting values (never silently reconciled). */
  description: string;
  sourceUrls: string[];
  severity: GapSeverity;
  /** ISO date this gap was last confirmed still present on the live site. */
  lastVerified: string;
}

export interface NavItem {
  label: string;
  path: string;
}

/** Base metadata every routed page's content module exposes. */
export interface ContentPage {
  path: string;
  /** Document <title> as rendered by the live site, e.g. "Platform | SmartCycleAI". */
  title: SourcedFact<string>;
  sourceUrl: string;
}

/** Optional extras a fact can carry beyond value/sourceUrl/lastVerified. */
export interface FactOptions {
  qualifier?: string;
  gapRef?: string;
}

/**
 * Builds a `SourcedFact<T>`. Content modules create a page-scoped partial
 * application (`const fact = (value, opts?) => sourcedFact(value, SRC, V, opts)`)
 * to avoid re-typing the source URL/verification date on every field.
 */
export function sourcedFact<T>(
  value: T,
  sourceUrl: string,
  lastVerified: string,
  opts?: FactOptions,
): SourcedFact<T> {
  return {
    value,
    sourceUrl,
    lastVerified,
    ...(opts?.qualifier !== undefined ? { qualifier: opts.qualifier } : {}),
    ...(opts?.gapRef !== undefined ? { gapRef: opts.gapRef } : {}),
  };
}
