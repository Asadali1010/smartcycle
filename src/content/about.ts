import { sourcedFact } from "./types.ts";
import type { ContentPage, FactOptions, SourcedFact } from "./types.ts";

const SRC = "https://smartcycle.ai/about";
const V = "2026-09-12";

const fact = <T,>(value: T, qualifier?: string, opts?: FactOptions): SourcedFact<T> =>
  sourcedFact(value, SRC, V, qualifier !== undefined ? { qualifier, ...opts } : opts);

export const aboutMeta: ContentPage = {
  path: "/about",
  title: fact("About | SmartCycleAI"),
  sourceUrl: SRC,
};

export const aboutHero = {
  eyebrow: fact("About SmartCycleAI"),
  headingLines: fact(["Healthcare Execution,", "Reimagined"]),
  intro: fact(
    "We exist to close the gap between healthcare strategy and results. Where others see complexity, we see opportunity to accelerate digital transformation.",
  ),
  supporting: fact("Built by healthcare veterans. Powered by proven technology. Designed for your success."),
};

export interface FoundingStat {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
}

/**
 * "The Execution Capacity Gap" founding story. The founding-story
 * paragraphs reference founders having "built and scaled
 * nationally-recognized healthcare technology platforms" without naming
 * those platforms or companies on this page — kept exactly that vague, no
 * specifics invented.
 */
export const foundingStory = {
  heading: fact("The Execution Capacity Gap"),
  paragraph1: fact(
    "Healthcare organizations face an unprecedented challenge: strategic priorities multiply while execution capacity remains constrained. Initiatives stall in committees. Best people are stretched thin. Every solution requires a new vendor relationship.",
  ),
  paragraph2: fact(
    "We've lived this challenge. Our founders have built and scaled nationally-recognized healthcare technology platforms—from payer integrity systems processing billions in transactions to patient engagement solutions serving millions.",
  ),
  foundingQuestionLeadIn: fact("SmartCycleAI was born from a simple question:"),
  foundingQuestion: fact(
    "What if health systems could turn strategic priorities into production applications in weeks, not quarters?",
  ),
  stats: [
    {
      name: fact("Healthcare Origins"),
      description: fact(
        "Founded by healthcare technology veterans who have built and scaled nationally-recognized platforms serving millions of patients.",
      ),
    },
    {
      name: fact("Enterprise Governance"),
      description: fact(
        "Security, compliance, and governance embedded from day one—not bolted on. Every application built with HIPAA awareness and enterprise controls.",
      ),
    },
    {
      name: fact("Proven at Scale"),
      description: fact(
        "Experience building platforms that process billions in healthcare transactions with enterprise-grade security and compliance.",
      ),
    },
  ] satisfies FoundingStat[],
};

export const missionSection = {
  heading: fact("Our Mission"),
  statement: fact(
    "To accelerate healthcare's digital transformation by giving every health system the execution capacity of a tech company—with the governance, security, and compliance healthcare demands.",
  ),
  /** The 3 stat callouts rendered alongside the mission statement. */
  stats: [
    { headline: fact("Weeks"), subline: fact("Not Months"), caption: fact("From concept to production applications") },
    { headline: fact("Code Ownership"), subline: null, caption: fact("Everything we build becomes yours") },
    { headline: fact("Zero"), subline: fact("Vendor Lock-In"), caption: fact("No licensing fees, no dependencies") },
  ],
};

export interface CoreValue {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
}

export const coreValuesSection = {
  heading: fact("What Guides Us"),
  intro: fact(
    "Our values aren't just words on a wall. They're the principles that shape every decision, every build, every partnership.",
  ),
  values: [
    {
      name: fact("Healthcare-Native"),
      description: fact(
        "We don't adapt generic tools for healthcare. We build exclusively for the unique complexities, workflows, and compliance requirements of health systems.",
      ),
    },
    {
      name: fact("Execution Over Theory"),
      description: fact(
        "Strategy without execution is just planning. We focus on building capabilities that deliver measurable results in weeks, not years.",
      ),
    },
    {
      name: fact("Ownership, Not Dependency"),
      description: fact(
        "Everything we build becomes yours. No licensing fees, no lock-in, no dependencies. Full code ownership from day one.",
      ),
    },
    {
      name: fact("Augment Teams, Don't Replace Them"),
      description: fact(
        "We amplify your team's capabilities rather than displacing them. Your people remain at the center of every solution.",
      ),
    },
  ] satisfies CoreValue[],
};

/** "Healthcare-Native, By Design" recap section with 3 expertise tags. */
export const healthcareNativeByDesign = {
  heading: fact("Healthcare-Native, By Design"),
  body: fact(
    "We didn't discover healthcare—we came from it. Our team has spent decades building the platforms that power modern healthcare operations.",
  ),
  expertiseHeading: fact("Health System Expertise"),
  expertiseTags: [fact("Epic Integration"), fact("HIPAA/HITRUST Aware"), fact("Enterprise Scale")],
};

export const leadershipSection = {
  heading: fact("Leadership"),
  intro: fact("Built by healthcare technology veterans with a proven track record of delivering results at scale."),
  people: [
    {
      name: fact("Kleber Gallardo"),
      title: fact("Founder & CEO"),
      bioParagraph1: fact(
        "A healthcare technology executive with over two decades of experience building and scaling platforms that serve millions of patients and process billions in healthcare transactions.",
      ),
      bioParagraph2: fact(
        "Prior to founding SmartCycleAI, Kleber led the development of nationally-recognized healthcare technology platforms, from payer integrity systems to patient engagement solutions. His work has directly impacted healthcare delivery across health systems nationwide.",
      ),
      bioParagraph3: fact(
        "Kleber founded SmartCycleAI to solve a problem he witnessed repeatedly: health systems have strategic vision but lack the execution capacity to turn priorities into production applications. SmartCycleAI is his answer—giving every health system the ability to move at startup speed with enterprise safety.",
      ),
      linkedInCtaLabel: fact("Connect on LinkedIn"),
    },
  ],
};

export const aboutFinalCta = {
  heading: fact("Ready to accelerate your digital transformation?"),
  supporting: fact(
    "Let's discuss how SmartCycleAI can help your organization turn strategic priorities into production applications.",
  ),
  ctaPrimary: fact("Request a Demo"),
  ctaSecondary: fact("Why SmartCycleAI"),
};
