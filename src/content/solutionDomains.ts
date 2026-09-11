import { sourcedFact } from "./types.ts";
import type { FactOptions, SourcedFact } from "./types.ts";

const SRC = "https://smartcycle.ai/";
const V = "2026-09-12";

const fact = <T,>(value: T, qualifier?: string, opts?: FactOptions): SourcedFact<T> =>
  sourcedFact(value, SRC, V, qualifier !== undefined ? { qualifier, ...opts } : opts);

export const solutionDomainsSection = {
  eyebrow: fact("Solution Domains"),
  headingLines: fact(["Built for Every", "Healthcare Challenge"]),
  intro: fact("From revenue cycle to clinical workflows, SmartCycleAI powers 10+ enterprise solution domains."),
  /** Category filter chips shown above the domain grid on the homepage. */
  filters: [fact("All"), fact("Revenue"), fact("Clinical"), fact("Operations"), fact("Data")],
};

export interface SolutionDomain {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
  /** The 4-step workflow chips rendered under each domain card. */
  workflowSteps: SourcedFact<string>[];
}

/**
 * The homepage's 10 "Solution Domains". This is a DIFFERENT taxonomy from
 * /use-cases' 4-category / 16-item breakdown (useCases.ts) — see gaps.ts
 * `taxonomy-10-domains-vs-4-categories`. Cross-link, don't merge.
 */
export const solutionDomains: SolutionDomain[] = [
  {
    name: fact("Enterprise Intake & Orchestration"),
    description: fact(
      "AI-powered request scoring, prioritization, and lifecycle tracking across the portfolio.",
    ),
    workflowSteps: [fact("Request"), fact("AI Score"), fact("Route"), fact("Track")],
  },
  {
    name: fact("Analytics Scorecard Automation"),
    description: fact("Automated KPI dashboards and executive scorecards with real-time data from Snowflake."),
    workflowSteps: [fact("Ingest"), fact("Transform"), fact("Score"), fact("Report")],
  },
  {
    name: fact("Denial Management"),
    description: fact("Intelligent claim scrubbing, denial prediction, and automated appeal generation."),
    workflowSteps: [fact("Claim"), fact("Predict"), fact("Scrub"), fact("Appeal")],
  },
  {
    name: fact("Clinical Inbox Workflow"),
    description: fact("AI-triaged clinical messages with smart routing and response suggestions."),
    workflowSteps: [fact("Message"), fact("AI Triage"), fact("Route"), fact("Resolve")],
  },
  {
    name: fact("Intelligent Document Processing"),
    description: fact(
      "OCR, NLP extraction, and automated classification of clinical and administrative documents.",
    ),
    workflowSteps: [fact("Scan"), fact("Extract"), fact("Classify"), fact("Store")],
  },
  {
    name: fact("White Glove Conversion"),
    description: fact("Managed EHR migration with data validation, mapping, and go-live support."),
    workflowSteps: [fact("Assess"), fact("Map"), fact("Migrate"), fact("Validate")],
  },
  {
    name: fact("Population Health"),
    description: fact("Risk stratification, care gap identification, and cohort analytics at scale."),
    workflowSteps: [fact("Stratify"), fact("Identify"), fact("Alert"), fact("Act")],
  },
  {
    name: fact("Data Migration & Validation"),
    description: fact("Automated ETL pipelines with healthcare-specific validation and reconciliation."),
    workflowSteps: [fact("Extract"), fact("Transform"), fact("Validate"), fact("Load")],
  },
  {
    name: fact("Digital Medicine"),
    description: fact("Remote patient monitoring, digital therapeutics, and connected device integration."),
    workflowSteps: [fact("Monitor"), fact("Analyze"), fact("Intervene"), fact("Track")],
  },
  {
    name: fact("Financial Intelligence"),
    description: fact("Revenue forecasting, cost modeling, and financial analytics for healthcare operations."),
    workflowSteps: [fact("Collect"), fact("Model"), fact("Forecast"), fact("Optimize")],
  },
];

export const solutionDomainsGapRef = "taxonomy-10-domains-vs-4-categories";
