import { sourcedFact } from "./types.ts";
import type { ContentPage, FactOptions, SourcedFact } from "./types.ts";

const SRC = "https://smartcycle.ai/why-smartcycleai";
const V = "2026-09-12";

const fact = <T,>(value: T, qualifier?: string, opts?: FactOptions): SourcedFact<T> =>
  sourcedFact(value, SRC, V, qualifier !== undefined ? { qualifier, ...opts } : opts);

export const whyMeta: ContentPage = {
  path: "/why-smartcycleai",
  title: fact("Why SmartCycleAI | SmartCycleAI"),
  sourceUrl: SRC,
};

export const whyHero = {
  eyebrow: fact("Bridging Strategy and Execution"),
  headingLines: fact(["The", "Execution Layer", "Healthcare Has Been Missing"]),
  problemStatement: fact(
    "Healthcare organizations don't lack strategy. They lack the capacity to execute. SmartCycleAI closes the gap between what leadership envisions and what IT can deliver.",
  ),
  supporting: fact(
    "Transform strategic priorities into production applications in weeks, not months—with enterprise governance built in.",
  ),
  ctaPrimary: fact("Request a Demo"),
  ctaSecondary: fact("See How It Works"),
};

/** "From Strategy to Execution — The Missing Layer" 3-column diagram. */
export const strategyExecutionDiagram = {
  eyebrow: fact("From Strategy to Execution — The Missing Layer"),
  intro: fact(
    "Every healthcare organization has a digital transformation strategy. The challenge isn't knowing what to build—it's having the capacity to build it.",
  ),
  columns: {
    strategy: {
      name: fact("Strategy"),
      description: fact("Leadership defines priorities, initiatives get approved, roadmaps are created..."),
      tag: fact("Stuck in committees"),
    },
    smartCycleAI: {
      name: fact("SmartCycleAI"),
      description: fact("Execution infrastructure that transforms priorities into production applications in weeks."),
      tag: fact("The Execution Layer"),
    },
    results: {
      name: fact("Results"),
      description: fact("Production applications delivering real value. Full ownership. No vendor lock-in."),
      tag: fact("In production"),
    },
  },
  closingLine1: fact("SmartCycleAI doesn't just help you plan better."),
  closingLine2: fact("It helps you execute faster."),
};

export interface PainPoint {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
}

export const executionPainPoints: PainPoint[] = [
  {
    name: fact("Initiatives Stall"),
    description: fact(
      "Good ideas die in steering committees. Approved projects wait months for resources. Priorities shift before anything launches.",
    ),
  },
  {
    name: fact("Resources Are Constrained"),
    description: fact(
      "Too many requests, not enough capacity. Your best people are stretched thin maintaining existing systems while transformation waits.",
    ),
  },
  {
    name: fact("Vendors Create Lock-In"),
    description: fact(
      "Every new capability requires a new vendor, contract, and integration. Your application portfolio becomes a collection of dependencies.",
    ),
  },
];

export interface Differentiator {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
}

/**
 * "Our Positioning" — the live page's own heading states "Six foundational
 * principles", i.e. SIX differentiators, not the five carried over from the
 * prior content inventory. That inventory undercounted; this is the
 * corrected, re-verified list. See gaps.ts `differentiator-count-5-vs-6`.
 */
export const differentiatorsSection = {
  eyebrow: fact("Our Positioning"),
  headingLines: fact(["Why SmartCycleAI Exists"]),
  intro: fact(
    "Six foundational principles that define who we are and why healthcare organizations choose us as their execution partner.",
  ),
  items: [
    {
      name: fact("The Missing Execution Layer"),
      description: fact(
        "Healthcare doesn't lack strategy—it lacks the capacity to execute. SmartCycleAI bridges the gap between what leadership envisions and what IT can deliver.",
      ),
    },
    {
      name: fact("Healthcare-Native by Design"),
      description: fact(
        "Built from the ground up for healthcare complexity. Clinical workflows, compliance requirements, and patient safety are embedded—not bolted on.",
      ),
    },
    {
      name: fact("One Platform, Not Point Solutions"),
      description: fact(
        "Stop managing vendor sprawl. One execution platform for unlimited applications. Every project strengthens the foundation for the next.",
      ),
    },
    {
      name: fact("Governed by Design"),
      description: fact(
        "HIPAA/HITRUST awareness, audit trails, and enterprise governance are built into every layer. Compliance is automatic, not optional.",
      ),
    },
    {
      name: fact("Fast Without Breaking Things"),
      description: fact(
        "Move at startup speed with enterprise safety. Human-in-the-loop validation ensures nothing reaches production without approval.",
      ),
    },
    {
      name: fact("Built for Ownership and Autonomy"),
      description: fact(
        "You own what you build. No vendor lock-in, no licensing traps, no dependencies. Your applications, your IP, your control.",
      ),
    },
  ] satisfies Differentiator[],
  tagline: fact(["Not another vendor.", "Your execution partner."]),
  gapRef: "differentiator-count-5-vs-6",
};

/** "Built Exclusively for Healthcare" heritage section. */
export const heritageSection = {
  eyebrow: fact("Built Exclusively for Healthcare"),
  intro: fact(
    "SmartCycleAI wasn't adapted for healthcare—it was built from the ground up by a team with deep healthcare technology expertise. Every design decision reflects decades of experience in clinical workflows, compliance requirements, and enterprise healthcare IT.",
  ),
  heading: fact("Our Heritage"),
  /**
   * The founding-story copy references specific prior work — "MIT neural
   * network research" and a "nationally-scaled payer integrity platform" —
   * as inline emphasized phrases within one sentence, not separate named
   * companies/products. Reproduced exactly; no further specifics (company
   * names, dates) are given on the page itself.
   */
  body: fact(
    "Founded on proven healthcare technology expertise—including pioneering work in MIT neural network research and the development of a nationally-scaled payer integrity platform—SmartCycleAI represents the next evolution in healthcare execution infrastructure.",
  ),
  closingLine: fact("We understand healthcare complexity because we've spent our careers navigating it."),
};

export interface ExpertisePoint {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
}

export const healthcareExpertise = {
  heading: fact("Healthcare Expertise in Every Layer"),
  items: [
    { name: fact("Clinical Workflows"), description: fact("Built for how healthcare actually works") },
    { name: fact("Data Integrity"), description: fact("Payer-grade accuracy and auditability") },
    { name: fact("Compliance First"), description: fact("HIPAA/HITRUST awareness built-in") },
    { name: fact("Enterprise Scale"), description: fact("Proven at national healthcare scale") },
    { name: fact("EHR Integration"), description: fact("Epic-safe patterns by default") },
    { name: fact("Patient Safety"), description: fact("Human-in-the-loop validation") },
  ] satisfies ExpertisePoint[],
  closingLine1: fact("Built by healthcare technologists."),
  closingLine2: fact("For healthcare organizations."),
};

/** "Execution Infrastructure — Not a Collection of Tools". */
export const executionInfrastructureSection = {
  eyebrow: fact("Execution Infrastructure — Not a Collection of Tools"),
  intro: fact(
    "Point solutions create complexity. Vendor portfolios create dependencies. SmartCycleAI provides a unified execution platform that turns strategic priorities into production applications—while you maintain complete control.",
  ),
  platformCapabilityLabels: [
    fact("Patient Engagement"),
    fact("Care Coordination"),
    fact("Revenue Cycle"),
    fact("Clinical Workflows"),
    fact("Analytics"),
    fact("Operations"),
  ],
  valueProps: [
    {
      name: fact("Reusable Foundation"),
      description: fact(
        "Every application strengthens the platform. Build once, deploy everywhere. Each project accelerates the next.",
      ),
    },
    {
      name: fact("Pre-Built Integrations"),
      description: fact(
        "Healthcare-validated connections to EHRs, scheduling systems, revenue cycle tools, and clinical applications.",
      ),
    },
    {
      name: fact("Governed by Default"),
      description: fact(
        "Compliance, security, and audit trails are built into the foundation—not bolted on as an afterthought.",
      ),
    },
    {
      name: fact("Enterprise Scale"),
      description: fact("Architecture proven at national healthcare scale. Grow without re-architecting."),
    },
  ],
  closingLine1: fact("One platform. Unlimited applications."),
  closingLine2: fact("Compounding returns on every investment."),
};

export interface GovernancePoint {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
}

/**
 * "Enterprise Governance — Execution With Guardrails". Certification badge
 * here reads "ANSI 27001 Alignment" — compare /platform's "ISO 27001" in
 * platform.ts `platformSecurity.badges`. See gaps.ts `iso-vs-ansi-27001`.
 */
export const governanceSection = {
  eyebrow: fact("Enterprise Governance"),
  headingLines: fact(["Execution With Guardrails"]),
  intro: fact(
    "Speed without safety isn't an option in healthcare. SmartCycleAI delivers rapid execution within a framework of enterprise-grade governance, compliance awareness, and operational controls.",
  ),
  items: [
    {
      name: fact("HIPAA/HITRUST Awareness"),
      description: fact("Compliance considerations built into every workflow, not bolted on after the fact"),
    },
    {
      name: fact("Human-in-the-Loop Validation"),
      description: fact("Critical decisions always include human review and approval checkpoints"),
    },
    {
      name: fact("Epic-Safe Patterns"),
      description: fact("Proven integration approaches that protect your EHR investment and patient data"),
    },
    {
      name: fact("Role-Based Access Control"),
      description: fact("Granular permissions ensure the right people have access to the right capabilities"),
    },
    {
      name: fact("ANSI 27001 Alignment", undefined, { gapRef: "iso-vs-ansi-27001" }),
      description: fact("Security practices aligned with international information security standards"),
    },
    {
      name: fact("Complete Audit Trails"),
      description: fact("Every action logged and traceable for compliance, accountability, and improvement"),
    },
  ] satisfies GovernancePoint[],
  closingLines: fact(["Move fast.", "Stay safe.", "Build with confidence."]),
  closingSupporting: fact("Every guardrail is designed to enable innovation, not block it."),
  gapRef: "iso-vs-ansi-27001",
};

/** "Startup Speed. Enterprise Safety." two-column comparison. */
export const speedVsSafetySection = {
  headingLines: fact(["Startup Speed.", "Enterprise Safety."]),
  intro: fact(
    "Healthcare organizations have always faced a choice: move fast and take risks, or stay safe and fall behind. SmartCycleAI eliminates that trade-off.",
  ),
  startupSpeed: {
    name: fact("Startup Speed"),
    items: [
      {
        name: fact("Weeks, Not Months"),
        description: fact(
          "Transform strategic priorities into production applications in a fraction of traditional timelines",
        ),
      },
      {
        name: fact("Rapid Iteration"),
        description: fact("Test, learn, and refine quickly—without the overhead of traditional development cycles"),
      },
      {
        name: fact("Pre-Built Patterns"),
        description: fact("Leverage healthcare-specific components and workflows that accelerate every project"),
      },
      {
        name: fact("Compounding Returns"),
        description: fact("Every application you build makes the next one faster through shared infrastructure"),
      },
    ],
  },
  enterpriseSafety: {
    name: fact("Enterprise Safety"),
    items: [
      {
        name: fact("Enterprise Governance"),
        description: fact("Built-in controls, audit trails, and compliance awareness at every step"),
      },
      {
        name: fact("Production-Ready"),
        description: fact("Applications meet enterprise standards for security, reliability, and scalability"),
      },
    ],
  },
  /**
   * A pull-quote presented without named attribution (no customer name,
   * title, or organization given on the page) — treated as illustrative
   * site copy, NOT a customer testimonial. Do not attribute this to a real
   * person/organization.
   */
  quote: fact(
    "We can finally move at the speed the business needs without compromising our governance standards.",
  ),
  quoteCaveats: [fact("Faster time-to-production"), fact("Enterprise governance maintained"), fact("Compliance shortcuts taken")],
};

/** "Augment Your Teams. Don't Replace Them." workforce section. */
export const workforceSection = {
  eyebrow: fact("Workforce Enablement"),
  headingLines: fact(["Augment Your Teams.", "Don't Replace Them."]),
  intro: fact(
    "SmartCycleAI isn't about automation for its own sake. It's about giving your people—clinicians, analysts, IT professionals—the tools to accomplish more than ever before.",
  ),
  supporting: fact("We believe the best healthcare technology amplifies human judgment, not replaces it."),
  comparisonHeading: fact("Your Team + SmartCycleAI"),
  comparisonPoints: [
    fact("Same team size, greater output"),
    fact("Higher-value work for everyone"),
    fact("Institutional knowledge preserved"),
  ],
  items: [
    {
      name: fact("Elevate Expertise"),
      description: fact(
        "Free your best people from routine work so they can focus on what matters most—strategic thinking, innovation, and patient care",
      ),
    },
    {
      name: fact("Multiply Capacity"),
      description: fact(
        "Do more with your existing team by providing them with tools that accelerate every project they touch",
      ),
    },
    {
      name: fact("Capture Knowledge"),
      description: fact(
        "Codify institutional expertise into reusable patterns, ensuring best practices scale across your organization",
      ),
    },
    {
      name: fact("Enable Innovation"),
      description: fact(
        "Give clinicians and operational leaders the ability to turn ideas into working tools without waiting in IT queues",
      ),
    },
    {
      name: fact("Reduce Burnout"),
      description: fact(
        "Eliminate tedious manual processes and workarounds that frustrate your teams and consume valuable time",
      ),
    },
  ],
  closingLine1: fact("Technology should make people more capable,"),
  closingLine2: fact("not more replaceable."),
};

/** "Your IP, Your Future" / "100% IP Ownership" section. */
export const ipOwnershipSection = {
  eyebrow: fact("Your IP, Your Future"),
  headingLines: fact(["Build What Matters.", "Own What You Build."]),
  intro: fact(
    "Traditional vendors create dependencies. SmartCycleAI creates assets. Every application you build becomes part of your organization's intellectual property—not another subscription to manage.",
  ),
  diagramLabel: fact("Your Organization"),
  ownershipStat: fact("100% IP Ownership"),
  exampleApps: [fact("Patient Portal"), fact("Care Dashboard"), fact("Workflow Tool"), fact("Analytics App")],
  points: [
    {
      name: fact("Full Intellectual Property Rights"),
      description: fact(
        "Every application built on SmartCycleAI belongs to you. Your code, your data, your IP—with no licensing dependencies or vendor claims.",
      ),
    },
    {
      name: fact("Portable & Standards-Based"),
      description: fact(
        "Applications are built on modern, open standards. If you ever want to move them, you can—with no proprietary lock-in or migration fees.",
      ),
    },
    {
      name: fact("Strategic Asset Building"),
      description: fact(
        "Every application becomes a strategic asset for your organization, not a line item on a vendor's subscription renewal.",
      ),
    },
    {
      name: fact("Continuous Evolution"),
      description: fact(
        "Modify, extend, and evolve your applications as your needs change—without renegotiating contracts or waiting for vendor roadmaps.",
      ),
    },
  ],
  traditionalVendorModel: {
    heading: fact("Traditional Vendor Model"),
    points: [
      fact("Vendor owns the IP"),
      fact("Recurring subscription costs"),
      fact("Dependent on vendor roadmap"),
      fact("Migration is expensive"),
      fact("Limited customization"),
    ],
  },
  smartCycleAIModel: {
    heading: fact("SmartCycleAI Model"),
    points: [
      fact("You own 100% of the IP"),
      fact("Build assets, not expenses"),
      fact("Full control over evolution"),
      fact("Portable & standards-based"),
      fact("Unlimited customization"),
    ],
  },
};

export interface BusinessImpactPoint {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
  tag: SourcedFact<string>;
}

/** "What This Means For Your Organization" business impact section. */
export const businessImpactSection = {
  eyebrow: fact("Business Impact"),
  headingLines: fact(["What This Means For", "Your Organization"]),
  intro: fact(
    "SmartCycleAI doesn't just change how you build applications—it transforms what your organization can achieve. Here's what execution infrastructure enables:",
  ),
  items: [
    {
      name: fact("Increase Revenue"),
      description: fact(
        "Deploy patient engagement, revenue cycle, and access optimization applications that directly impact your bottom line.",
      ),
      tag: fact("Revenue Growth"),
    },
    {
      name: fact("Improve Service Levels"),
      description: fact(
        "Build applications that enhance patient experience, reduce wait times, and improve care coordination across your organization.",
      ),
      tag: fact("Patient Satisfaction"),
    },
    {
      name: fact("Execute Faster"),
      description: fact(
        "Transform strategic priorities into production applications in weeks, not months—without compromising quality or governance.",
      ),
      tag: fact("Faster Delivery"),
    },
    {
      name: fact("Reduce Complexity"),
      description: fact(
        "Replace fragmented vendor solutions with a unified execution platform. One infrastructure, unlimited applications.",
      ),
      tag: fact("Platform Sprawl"),
    },
    {
      name: fact("Maintain Control"),
      description: fact(
        "Keep full ownership of your intellectual property, data, and strategic assets—with enterprise governance built in.",
      ),
      tag: fact("IP Ownership"),
    },
  ] satisfies BusinessImpactPoint[],
  closingLine1: fact("Stop Planning. Start Executing."),
  closingLine2: fact("SmartCycleAI is the execution layer that turns your healthcare strategy into operational reality."),
  closingLine3: fact(
    "Because the organizations that thrive aren't the ones with the best strategies—they're the ones that can execute them.",
  ),
  closingLine4: fact("SmartCycleAI doesn't just automate healthcare."),
  closingLine5: fact("It operationalizes healthcare strategy."),
};

export const whyFinalCta = {
  eyebrow: fact("Ready to Transform Execution"),
  headingLines: fact(["Ready to Close the", "Execution Gap?"]),
  supporting: fact(
    "Schedule a personalized demonstration to see how SmartCycleAI transforms strategic priorities into production applications.",
  ),
  statChips: [fact("Weeks to Production"), fact("Full IP Ownership"), fact("Enterprise Governance")],
  ctaPrimary: fact("Request a Demo"),
  ctaSecondary: fact("See the Platform"),
  /**
   * The live page labels this row "Trusted by Healthcare Organizations" but
   * the four items beneath it are capability/positioning claims, not named
   * customer logos or testimonials — no customer names are given anywhere
   * on this page. Do not render as customer proof.
   */
  trustRowHeading: fact("Trusted by Healthcare Organizations"),
  trustRowItems: [fact("Healthcare-Native"), fact("HIPAA/HITRUST Aware"), fact("Epic-Safe Patterns"), fact("Enterprise-Ready")],
};
