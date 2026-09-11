import { sourcedFact } from "./types.ts";
import type { ContentPage, FactOptions, SourcedFact } from "./types.ts";

const SRC = "https://smartcycle.ai/platform";
const V = "2026-09-12";

const fact = <T,>(value: T, qualifier?: string, opts?: FactOptions): SourcedFact<T> =>
  sourcedFact(value, SRC, V, qualifier !== undefined ? { qualifier, ...opts } : opts);

export const platformMeta: ContentPage = {
  path: "/platform",
  title: fact("Platform | SmartCycleAI"),
  sourceUrl: SRC,
};

export const platformHero = {
  eyebrow: fact("Execution Infrastructure for Healthcare"),
  headingLines: fact(["The", "Execution", "Platform"]),
  subheading: fact("One platform that converts strategy into applications while you retain control."),
  supporting: fact(
    "From strategic priorities to production applications—with governance built in from day one.",
  ),
};

export interface FiveStepEntry {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
}

/**
 * /platform's 5-step process. This is a DIFFERENT process from the
 * homepage's 4-step "Intake & Prioritize → Build in Studio → Instrument
 * with EEF → Deploy & Own" — see gaps.ts `how-it-works-4-vs-5-step`. Both
 * are real, live, current copy; neither supersedes the other.
 */
export const platformHowItWorks = {
  eyebrow: fact("How It Works"),
  intro: fact(
    "A streamlined process that transforms your strategic priorities into production-ready applications without the traditional development friction.",
  ),
  steps: [
    {
      name: fact("Define Business Need"),
      description: fact(
        "Share your strategic priorities. We work with you to identify the specific outcomes you need to achieve and align on what success looks like.",
      ),
    },
    {
      name: fact("Build Using Proven Patterns"),
      description: fact(
        "Leverage healthcare-native patterns to rapidly build applications tailored to your needs. From concept to working solution in weeks, not months.",
      ),
    },
    {
      name: fact("Human Validation"),
      description: fact(
        "Your team reviews and approves every application. Human-in-the-loop ensures quality, alignment with your policies, and confidence before deployment.",
      ),
    },
    {
      name: fact("Deploy With Governance"),
      description: fact(
        "Launch to production with built-in governance. Compliance, security, and audit trails are embedded from day one—not bolted on later.",
      ),
    },
    {
      name: fact("Monitor Portfolio"),
      description: fact(
        "Full visibility across your application portfolio. Track performance, usage, and value delivered—all from a single view.",
      ),
    },
  ] satisfies FiveStepEntry[],
  gapRef: "how-it-works-4-vs-5-step",
};

export interface BenefitEntry {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
}

/** "What You Get" section. */
export const platformBenefits = {
  eyebrow: fact("What You Get"),
  intro: fact(
    "SmartCycleAI converts your strategic priorities into production applications—while you retain control over outcomes and ownership.",
  ),
  items: [
    {
      name: fact("Weeks, Not Months"),
      description: fact(
        "Move from strategic priority to production application quickly. Stop waiting on lengthy development cycles and backlogs.",
      ),
    },
    {
      name: fact("Governance Built In"),
      description: fact(
        "Compliance, security, and audit trails are embedded from day one. Move confidently without sacrificing control.",
      ),
    },
    {
      name: fact("Portfolio Visibility"),
      description: fact(
        "See every application, track performance, and measure value delivered—all from a single view. Know what's working.",
      ),
    },
    {
      name: fact("You Own It"),
      description: fact(
        "No vendor lock-in, no dependencies. You own the applications we build. Maintain full control over your digital assets.",
      ),
    },
  ] satisfies BenefitEntry[],
};

/** The 8 capabilities shown under "Execution Platform Capabilities". */
export const platformCapabilities = {
  eyebrow: fact("Execution Platform Capabilities"),
  headline: fact("One Platform. Unlimited Applications."),
  intro: fact(
    "A unified infrastructure that powers unlimited healthcare applications—with governance, visibility, and enterprise-grade features built in from the start.",
  ),
  items: [
    fact("Virtual Care"),
    fact("Patient Intake"),
    fact("Scheduling"),
    fact("Revenue Cycle"),
    fact("Dashboards"),
    fact("Care Plans"),
    fact("Workflows"),
    fact("Analytics"),
  ],
};

export interface OutcomeEntry {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
  outcomeTag: SourcedFact<string>;
}

/** "Core Capabilities Delivered as Business Outcomes". */
export const platformOutcomes = {
  eyebrow: fact("Core Capabilities Delivered as Business Outcomes"),
  items: [
    {
      name: fact("Rapid Execution"),
      description: fact(
        "Transform strategic requirements into production-ready applications. Move from idea to deployment without the traditional delays.",
      ),
      outcomeTag: fact("Go from concept to deployment in weeks, not months"),
    },
    {
      name: fact("Portfolio Visibility"),
      description: fact(
        "See every application, track performance, and measure business impact. Know what's working and what needs attention.",
      ),
      outcomeTag: fact("Single view of all your digital initiatives"),
    },
    {
      name: fact("Governed by Design"),
      description: fact(
        "Governance, compliance, and audit trails embedded from day one. Move confidently without sacrificing control or oversight.",
      ),
      outcomeTag: fact("Compliance and control built in from the start"),
    },
    {
      name: fact("Healthcare-Native"),
      description: fact(
        "Built specifically for healthcare workflows and requirements. Every application inherits healthcare-appropriate patterns.",
      ),
      outcomeTag: fact("Accelerate with healthcare-ready foundations"),
    },
  ] satisfies OutcomeEntry[],
};

export const platformOwnership = {
  headingLines: fact(["You Own What", "You Build"]),
  body: fact(
    "Every application built on SmartCycleAI is your IP. No vendor lock-in. No hidden dependencies. No surprise licensing.",
  ),
  supporting: fact(
    "Build strategic assets that appreciate over time—not rental software that depreciates.",
  ),
};

export interface EnterpriseFeatureEntry {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
}

/**
 * "Enterprise-Ready Capabilities". Note "Portfolio Visibility" appears here
 * a second time with its own description, distinct from (but overlapping)
 * the one under platformBenefits above — that duplication is present on
 * the live page itself, not an error in this content module.
 */
export const platformEnterpriseFeatures = {
  eyebrow: fact("Enterprise-Ready Capabilities"),
  intro: fact(
    "Built from the ground up for large healthcare organizations. SmartCycleAI provides the governance, visibility, and control that enterprise IT demands.",
  ),
  items: [
    {
      name: fact("Portfolio Visibility"),
      description: fact(
        "Complete visibility into all applications, their status, and business impact across your entire digital portfolio.",
      ),
    },
    {
      name: fact("Audit Trails"),
      description: fact(
        "Comprehensive logging of all changes, decisions, and deployments. Track who did what, when, and why—essential for compliance.",
      ),
    },
    {
      name: fact("Role-Based Access"),
      description: fact(
        "Control who can view, edit, approve, and deploy applications. Align access with your organizational structure and policies.",
      ),
    },
    {
      name: fact("Healthcare Interoperability"),
      description: fact(
        "Connect seamlessly with your existing healthcare systems. Applications work with your EHR and other core platforms out of the box.",
      ),
    },
    {
      name: fact("Enterprise-Wide Deployment"),
      description: fact(
        "Deploy applications across departments, facilities, and regions with consistent governance and standardized operations.",
      ),
    },
  ] satisfies EnterpriseFeatureEntry[],
  ctaHeading: fact("Ready to see enterprise capabilities in action?"),
  ctaSupporting: fact("Schedule a demo tailored to your organization's requirements."),
};

export interface ComplianceDetailEntry {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
}

/**
 * Security & Compliance. Certification badge row here reads "ISO 27001" —
 * compare gaps.ts `iso-vs-ansi-27001` where /why-smartcycleai instead reads
 * "ANSI 27001 Alignment" for what otherwise appears to be the same claim.
 */
export const platformSecurity = {
  eyebrow: fact("Security & Compliance"),
  intro: fact(
    "Healthcare-grade security and compliance, embedded from day one. Move confidently knowing governance is built in—not bolted on.",
  ),
  badges: [
    fact("HIPAA"),
    fact("HITRUST"),
    fact("ISO 27001", undefined, { gapRef: "iso-vs-ansi-27001" }),
    fact("Epic Safe"),
    fact("SOC 2 Type II"),
  ],
  details: [
    {
      name: fact("HIPAA/HITRUST Aware"),
      description: fact(
        "Built with healthcare compliance requirements at the core. Our platform is designed to support HIPAA and HITRUST frameworks from the ground up.",
      ),
    },
    {
      name: fact("Epic-Safe Patterns"),
      description: fact(
        "Pre-validated integration patterns for Epic EHR systems. Designed to work safely within your existing Epic ecosystem without disruption.",
      ),
    },
    {
      name: fact("Audit Trails"),
      description: fact(
        "Complete audit logging of all system activities, changes, and decisions. Meet compliance requirements with detailed, tamper-proof records.",
      ),
    },
    {
      name: fact("Role-Based Access"),
      description: fact(
        "Granular access controls ensure the right people have the right permissions. Define roles and permissions that align with your organizational structure.",
      ),
    },
    {
      name: fact("Enterprise Governance"),
      description: fact(
        "Built-in governance frameworks that align with enterprise policies. Oversight, control, and accountability embedded at every level.",
      ),
    },
    {
      name: fact("Data Protection"),
      description: fact(
        "Comprehensive data protection with encryption at rest and in transit, secure key management, and data residency compliance.",
      ),
    },
  ] satisfies ComplianceDetailEntry[],
  closing: fact(
    "Security isn't an afterthought—it's foundational. Enterprise governance, compliance, and security are embedded from day one. Move fast without breaking trust.",
  ),
};

export const platformFinalCta = {
  heading: fact("Ready to see it in action?"),
  supporting: fact(
    "Schedule a personalized demonstration to see how SmartCycleAI can accelerate your digital transformation.",
  ),
  ctaPrimary: fact("Request a Demo"),
  ctaSecondary: fact("Explore Use Cases"),
};
