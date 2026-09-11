import { sourcedFact } from "./types.ts";
import type { ContentPage, FactOptions, SourcedFact } from "./types.ts";

const SRC = "https://smartcycle.ai/";
const V = "2026-09-12";

const fact = <T,>(value: T, qualifier?: string, opts?: FactOptions): SourcedFact<T> =>
  sourcedFact(value, SRC, V, qualifier !== undefined ? { qualifier, ...opts } : opts);

export const homeMeta: ContentPage = {
  path: "/",
  title: fact("SmartCycleAI - Healthcare Software at the Speed of Ideas"),
  sourceUrl: SRC,
};

export const homeHero = {
  eyebrow: fact("Execution Infrastructure for Healthcare"),
  headingLines: fact(["Healthcare Software", "at the Speed of Ideas"]),
  subheading: fact(
    "SmartCycle Studio + Execution & Evidence Fabric — the complete platform to build, govern, and deploy production-ready healthcare applications in weeks, not months.",
  ),
  ctaPrimary: fact("Request a Demo"),
  ctaSecondary: fact("Explore the Platform"),
  badges: [
    fact("Enterprise-Grade"),
    fact("HIPAA & SOC 2 Ready"),
    fact("Full IP Ownership"),
    fact("Epic & FHIR Native"),
  ],
};

export interface ExecutionGapPair {
  problemLabel: SourcedFact<string>;
  problemStat: SourcedFact<string>;
  problemDescription: SourcedFact<string>;
  solutionLabel: SourcedFact<string>;
  solutionStat: SourcedFact<string>;
  solutionDescription: SourcedFact<string>;
}

export const executionGap = {
  eyebrow: fact("The Execution Gap"),
  headingLines: fact(["Healthcare IT Is", "Broken by Design"]),
  intro: fact(
    "Health systems spend millions and wait years for software that's outdated before it launches. There's a better way.",
  ),
  /** The three top-of-section stat chips (traditional-IT baseline). */
  statStrip: [
    { label: fact("Avg. Build Time"), value: fact("18", "mo") },
    { label: fact("Avg. Project Cost"), value: fact("$2.4M") },
    { label: fact("Vendors Per Project"), value: fact("5+") },
  ],
  pairs: [
    {
      problemLabel: fact("The Problem"),
      problemStat: fact("18-Month Build Cycles"),
      problemDescription: fact(
        "Traditional healthcare IT projects take 12–18 months from concept to production, with scope creep and vendor dependencies at every turn.",
      ),
      solutionLabel: fact("With SmartCycleAI"),
      solutionStat: fact("6-Week Deployments"),
      solutionDescription: fact(
        "Studio automates the entire software development lifecycle — planning, implementation, compliance checks, and change control documentation — end to end. What used to take months takes minutes.",
      ),
    },
    {
      problemLabel: fact("The Problem"),
      problemStat: fact("$2.4M Average Project Cost"),
      problemDescription: fact(
        "Multi-vendor coordination, custom integrations, and compliance retrofitting drive costs through the roof.",
      ),
      solutionLabel: fact("With SmartCycleAI"),
      solutionStat: fact("73% Cost Reduction", "Up to"),
      solutionDescription: fact(
        "One platform replaces 5+ vendors. Built-in compliance and reusable components slash total cost of ownership.",
      ),
    },
    {
      problemLabel: fact("The Problem"),
      problemStat: fact("Zero IP Ownership"),
      problemDescription: fact(
        "Vendor-built solutions mean vendor lock-in. You pay to build it, but you don't own it — and you can't leave.",
      ),
      solutionLabel: fact("With SmartCycleAI"),
      solutionStat: fact("Full Code Ownership"),
      solutionDescription: fact(
        "Every application built on SmartCycleAI is yours. Your code, your infrastructure, zero lock-in.",
      ),
    },
  ] satisfies ExecutionGapPair[],
  /**
   * The homepage's "73% Cost Reduction" (a static, qualified "Up to" claim
   * in this section) reads as if in tension with the ROI Impact section's
   * "57% Cost Reduction" further down the same page. They are not
   * necessarily the same measurement — see gaps.ts `cost-reduction-73-vs-57`
   * for why (the 57% figure is the default output of an interactive ROI
   * calculator, not a fixed claim). Both values are preserved verbatim.
   */
  gapRef: "cost-reduction-73-vs-57",
};

export interface PlatformProduct {
  name: SourcedFact<string>;
  tagline: SourcedFact<string>;
  features: { name: SourcedFact<string>; description: SourcedFact<string> }[];
}

export const platformSection = {
  eyebrow: fact("The Platform"),
  headingLines: fact(["Two Products.", "One Platform."]),
  intro: fact(
    "SmartCycle Studio builds your applications. The Execution & Evidence Fabric governs and runs them. Together, they're the complete execution infrastructure for healthcare IT.",
  ),
  flowLabel: fact("Build → Govern → Deploy"),
  studio: {
    name: fact("SmartCycle Studio"),
    tagline: fact("The AI application builder"),
    features: [
      {
        name: fact("AI Code Generation"),
        description: fact("Describe a clinical workflow; Studio generates a production-ready application"),
      },
      {
        name: fact("Healthcare-Native"),
        description: fact("Built-in Epic/EHR integration, PHI handling, and HIPAA compliance from day one"),
      },
      {
        name: fact("AI-Assisted Development"),
        description: fact("Clinical NLP, RAG pipelines, and ML models wired in automatically"),
      },
      {
        name: fact("Intake & Orchestration"),
        description: fact("AI-powered request scoring, routing, and lifecycle tracking"),
      },
      {
        name: fact("One-Click Deploy"),
        description: fact("Ship to production with full code ownership"),
      },
      {
        name: fact("Security Scanning"),
        description: fact("Automated OWASP, SAST, and dependency vulnerability analysis on every build"),
      },
      {
        name: fact("Compliance Checks"),
        description: fact("HIPAA compliance scoring with auto-fix suggestions and audit annotations"),
      },
    ],
  } satisfies PlatformProduct,
  eef: {
    name: fact("Execution & Evidence Fabric"),
    tagline: fact("The governance and control plane"),
    features: [
      {
        name: fact("Application Registry"),
        description: fact("Every app running in production, its environment, its cost — at a glance"),
      },
      {
        name: fact("Change Control & Approvals"),
        description: fact(
          "Full approval chain and automated checks before anything reaches production — verifiable, auditable, on demand",
        ),
      },
      {
        name: fact("Execution Audit Log"),
        description: fact("Every step every application took, exportable for any auditor or regulator"),
      },
      {
        name: fact("Cost Governance"),
        description: fact("Track spend across all applications as you scale"),
      },
      {
        name: fact("Policy Enforcement"),
        description: fact(
          "Ingest your org's policies and enforce them as logic — global, hospital, and department hierarchy supported",
        ),
      },
      {
        name: fact("Centralized Identity"),
        description: fact("Configure your identity provider once; every application inherits it"),
      },
      {
        name: fact("Workflow Patterns"),
        description: fact(
          "Standardize patient outreach, reminders, claims processing — define once, reuse everywhere",
        ),
      },
    ],
  } satisfies PlatformProduct,
};

export interface HowItWorksStep {
  name: SourcedFact<string>;
  description: SourcedFact<string> | null;
}

/**
 * Homepage's 4-step "How It Works". Note this is a DIFFERENT process from
 * /platform's 5-step "Define Business Need → ... → Monitor Portfolio" —
 * see gaps.ts `how-it-works-4-vs-5-step`, both preserved verbatim.
 */
export const howItWorksHome = {
  eyebrow: fact("How It Works"),
  headingLines: fact(["From Idea to Production", "in Four Steps"]),
  intro: fact(
    "A repeatable, governed process that turns strategic priorities into deployed healthcare applications.",
  ),
  steps: [
    {
      name: fact("Intake & Prioritize"),
      description: fact(
        "Submit strategic priorities into the AI-powered intake engine. Initiatives are automatically scored, categorized, and routed based on organizational impact, feasibility, and compliance requirements.",
      ),
    },
    {
      // No distinct description paragraph was present in the fetched markup
      // for this step (it renders as a heading inside an animated diagram
      // rather than heading+paragraph like the other three steps).
      name: fact("Build in Studio"),
      description: null,
    },
    {
      name: fact("Instrument with EEF"),
      description: fact(
        "As your application portfolio grows, the EEF governs it centrally. Application registry, change control, audit logs, cost tracking, policy enforcement, and identity — configured once, inherited by every application you build.",
      ),
    },
    {
      name: fact("Deploy & Own"),
      description: fact(
        "Ship to production with full code ownership. Your applications, your infrastructure, zero vendor lock-in. Real-time monitoring and analytics from day one.",
      ),
    },
  ] satisfies HowItWorksStep[],
  gapRef: "how-it-works-4-vs-5-step",
};

export interface IntegrationEntry {
  name: SourcedFact<string>;
  category: SourcedFact<string>;
  description: SourcedFact<string>;
  tags: SourcedFact<string>[];
}

export const integrationEcosystem = {
  eyebrow: fact("Integration Ecosystem"),
  headingLines: fact(["Connects to Everything", "Your Health System Runs"]),
  intro: fact(
    "Native integrations with Epic, Snowflake, FHIR, HL7, and the governance frameworks your compliance team requires.",
  ),
  items: [
    {
      name: fact("Epic"),
      category: fact("EHR"),
      description: fact("FHIR R4 & SMART on FHIR native integration"),
      tags: [fact("FHIR REST"), fact("SMART Auth"), fact("Backend Services")],
    },
    {
      name: fact("Snowflake"),
      category: fact("Data Platform"),
      description: fact("Direct warehouse connectivity for AI-powered dashboards"),
      tags: [fact("Dashboard Building"), fact("Data Analytics"), fact("Warehouse Connect")],
    },
    {
      name: fact("FHIR / HL7"),
      category: fact("Interoperability"),
      description: fact("Standards-based health data exchange"),
      tags: [fact("FHIR R4"), fact("HL7 v2"), fact("CDA Documents")],
    },
    {
      name: fact("NIST AI RMF"),
      category: fact("AI Governance"),
      description: fact("Automated AI risk management framework compliance"),
      tags: [fact("Govern"), fact("Map"), fact("Measure"), fact("Manage")],
    },
    {
      name: fact("HIPAA / SOC 2"),
      category: fact("Compliance"),
      description: fact("Continuous compliance monitoring and evidence"),
      tags: [fact("Security Rule"), fact("Privacy Rule"), fact("Audit Controls")],
    },
    {
      name: fact("REST / GraphQL"),
      category: fact("APIs"),
      description: fact("Connect to any healthcare system via open APIs"),
      tags: [fact("OAuth 2.0"), fact("Webhooks"), fact("Rate Limiting")],
    },
  ] satisfies IntegrationEntry[],
};

export const homeFinalCta = {
  headingLines: fact(["Ready to Build Healthcare Software", "at the Speed of Ideas?"]),
  subheading: fact("See how SmartCycleAI can accelerate your digital transformation roadmap."),
  ctaPrimary: fact("Request a Demo"),
  ctaSecondary: fact("Talk to Our Team"),
};
