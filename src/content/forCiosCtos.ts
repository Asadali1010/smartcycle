import { sourcedFact } from "./types.ts";
import type { ContentPage, FactOptions, SourcedFact } from "./types.ts";

const SRC = "https://smartcycle.ai/for-cios-ctos";
const V = "2026-09-12";

const fact = <T,>(value: T, qualifier?: string, opts?: FactOptions): SourcedFact<T> =>
  sourcedFact(value, SRC, V, qualifier !== undefined ? { qualifier, ...opts } : opts);

export const forCiosCtosMeta: ContentPage = {
  path: "/for-cios-ctos",
  title: fact("For CIOs & CTOs | SmartCycleAI"),
  sourceUrl: SRC,
};

export const forCiosCtosHero = {
  eyebrow: fact("For Technology Leaders"),
  headingLines: fact(["Execution Infrastructure", "for Digital Transformation"]),
  subheading: fact(
    "Stop managing vendors. Start building capabilities. SmartCycleAI gives your organization the execution capacity to turn strategic priorities into production applications.",
  ),
  supporting: fact("Healthcare-native. Enterprise-ready. Fully owned by you."),
  ctaPrimary: fact("Request a Demo"),
  ctaSecondary: fact("See the Platform"),
};

export interface ValueProp {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
}

export const whatSmartCycleAIDelivers = {
  eyebrow: fact("What SmartCycleAI Delivers"),
  intro: fact(
    "A unified platform that transforms how your organization executes digital initiatives—without adding complexity or dependencies.",
  ),
  items: [
    {
      name: fact("Reduce Platform Sprawl"),
      description: fact(
        "One execution platform for unlimited applications. Stop buying point solutions and start building reusable infrastructure that compounds over time.",
      ),
    },
    {
      name: fact("Own Your IP"),
      description: fact(
        "Everything we build becomes your property. No licensing fees, no vendor lock-in, no dependencies. Full code ownership from day one.",
      ),
    },
    {
      name: fact("Accelerate Delivery"),
      description: fact(
        "Move from concept to production in weeks, not months. Our execution infrastructure eliminates the bottlenecks that slow down digital transformation.",
      ),
    },
    {
      name: fact("Enterprise Governance"),
      description: fact(
        "Built-in compliance, audit trails, and role-based access. Deploy with confidence knowing every application meets your security standards.",
      ),
    },
  ] satisfies ValueProp[],
};

export interface PainPointWithSolution {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
  solutionPhrase: SourcedFact<string>;
}

export const ciosCtosPainPoints = {
  eyebrow: fact("The Challenges You Face"),
  intro: fact(
    "We understand the pressures technology leaders navigate every day. SmartCycleAI was built to address the root causes, not just the symptoms.",
  ),
  items: [
    {
      name: fact("Vendor Dependency"),
      description: fact(
        "Every new initiative requires evaluating, contracting, and integrating a new vendor. Your technology stack becomes a liability.",
      ),
      solutionPhrase: fact("Build once, deploy anywhere. Own everything you create."),
    },
    {
      name: fact("Execution Drag"),
      description: fact(
        "Strategic initiatives sit in committees for months. By the time projects launch, requirements have changed and opportunities have passed.",
      ),
      solutionPhrase: fact("Weeks to production. Not quarters."),
    },
    {
      name: fact("Technical Debt"),
      description: fact(
        "Years of point solutions have created an integration nightmare. Your team spends more time maintaining than innovating.",
      ),
      solutionPhrase: fact("One platform. Clean architecture. Modern patterns."),
    },
    {
      name: fact("Governance Overhead"),
      description: fact(
        "Security reviews, compliance checks, and approval processes add months to every project. Speed and safety seem mutually exclusive.",
      ),
      solutionPhrase: fact("Governance built-in, not bolted-on."),
    },
  ] satisfies PainPointWithSolution[],
};

export const ciosCtosCertifications = {
  heading: fact("Enterprise-Grade by Design"),
  items: [fact("HIPAA/HITRUST Aware"), fact("Epic-Safe Patterns"), fact("Full Audit Trails"), fact("Role-Based Access")],
};

export const ciosCtosFinalCta = {
  heading: fact("Ready to transform your execution capacity?"),
  supporting: fact(
    "Schedule a personalized demonstration and see how SmartCycleAI can help you deliver on your digital transformation priorities.",
  ),
  ctaPrimary: fact("Request a Demo"),
  ctaSecondary: fact("Why SmartCycleAI"),
};
