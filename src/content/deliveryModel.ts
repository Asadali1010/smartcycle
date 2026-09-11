import { sourcedFact } from "./types.ts";
import type { FactOptions, SourcedFact } from "./types.ts";

const SRC = "https://smartcycle.ai/";
const V = "2026-09-12";

const fact = <T,>(value: T, qualifier?: string, opts?: FactOptions): SourcedFact<T> =>
  sourcedFact(value, SRC, V, qualifier !== undefined ? { qualifier, ...opts } : opts);

export const deliveryModelSection = {
  eyebrow: fact("Delivery Model"),
  headingLines: fact(["From Partnership", "to Independence"]),
  intro: fact(
    "A 12-month institutionalization roadmap that transfers full platform ownership to your team — not a perpetual consulting engagement.",
  ),
  axisLabels: {
    capabilityLow: fact("Lower Institutional Capability"),
    capabilityHigh: fact("Higher Institutional Capability"),
    increasingCapability: fact("Increasing Client Capability"),
    decreasingDependency: fact("Decreasing External Dependency"),
  },
  /** The 4 macro-stage labels shown along the top of the timeline. */
  macroStages: [fact("Foundation"), fact("Automation"), fact("Expansion"), fact("Institutionalization")],
};

export interface DeliveryPhase {
  name: SourcedFact<string>;
  monthRange: SourcedFact<string>;
  description: SourcedFact<string>;
  milestones: SourcedFact<string>[];
  /** The two-lane "who does what" labels shown per phase. */
  lanes: {
    smartCycleAI: SourcedFact<string>;
    yourTeam: SourcedFact<string>;
  };
}

export const deliveryPhases: DeliveryPhase[] = [
  {
    name: fact("SmartCycle-Led"),
    monthRange: fact("Months 1–3"),
    description: fact(
      "SmartCycleAI leads delivery end-to-end. Your team observes, learns the platform, and validates outputs.",
    ),
    milestones: [
      fact("Platform onboarding & configuration"),
      fact("First applications deployed to production"),
      fact("Team shadowing & learning"),
      fact("Baseline metrics established"),
    ],
    lanes: {
      smartCycleAI: fact("Baseline Config"),
      yourTeam: fact("First Deployment"),
    },
  },
  {
    name: fact("Embedded"),
    monthRange: fact("Months 4–6"),
    description: fact(
      "SmartCycleAI engineers embed with your team. Joint development with guided knowledge transfer.",
    ),
    milestones: [
      fact("Paired development sessions"),
      fact("Template customization & creation"),
      fact("Process handoff begins"),
      fact("Phase I checkpoint & scale decision"),
    ],
    lanes: {
      smartCycleAI: fact("Phase I Checkpoint"),
      yourTeam: fact("Scale Decision"),
    },
  },
  {
    name: fact("Co-Led"),
    monthRange: fact("Months 7–9"),
    description: fact(
      "Your team leads development with SmartCycleAI in an advisory role. Building confidence and velocity.",
    ),
    milestones: [
      fact("Client-led project delivery"),
      fact("SmartCycleAI advisory support"),
      fact("Governance mastery achieved"),
      fact("Cross-journey team expansion"),
    ],
    lanes: {
      smartCycleAI: fact("Expand Journey Teams"),
      yourTeam: fact("Client-Led Delivery"),
    },
  },
  {
    name: fact("Client-Led"),
    monthRange: fact("Months 10–12"),
    description: fact("Full ownership. Your team builds, governs, and deploys independently on the platform."),
    milestones: [
      fact("Full independence achieved"),
      fact("Internal center of excellence"),
      fact("Ongoing platform updates"),
      fact("Phase II decision & steady state"),
    ],
    lanes: {
      smartCycleAI: fact("Steady State Ownership"),
      yourTeam: fact("Phase II Decision"),
    },
  },
];
