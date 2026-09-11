import { sourcedFact } from "./types.ts";
import type { ContentPage, FactOptions, SourcedFact } from "./types.ts";

const SRC = "https://smartcycle.ai/use-cases";
const V = "2026-09-12";

const fact = <T,>(value: T, qualifier?: string, opts?: FactOptions): SourcedFact<T> =>
  sourcedFact(value, SRC, V, qualifier !== undefined ? { qualifier, ...opts } : opts);

export const useCasesMeta: ContentPage = {
  path: "/use-cases",
  title: fact("Use Cases | SmartCycleAI"),
  sourceUrl: SRC,
};

export const useCasesHero = {
  headingLines: fact(["What Will You", "Build"]),
  subheading: fact(
    "SmartCycleAI is execution infrastructure. We don't sell pre-built products. We build exactly what your organization needs.",
  ),
};

export interface FlexibilityPoint {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
}

/**
 * "Flexibility Over Features" — a 6-point framing section that precedes the
 * use-case taxonomy below. Not present in the prior content inventory;
 * confirmed on re-fetch.
 */
export const flexibilityOverFeatures = {
  eyebrow: fact("Flexibility Over Features"),
  intro: fact(
    "Every healthcare organization is unique. Your technology should reflect your priorities, not force you into someone else's workflow.",
  ),
  points: [
    {
      name: fact("Your Priorities, Not Ours"),
      description: fact(
        "Tell us what matters most to your organization. We'll build applications that execute exactly what you need.",
      ),
    },
    {
      name: fact("Weeks, Not Months"),
      description: fact(
        "Our execution infrastructure accelerates delivery. Go from concept to production in weeks, not the typical 12-18 months.",
      ),
    },
    {
      name: fact("Healthcare Governance Built-In"),
      description: fact(
        "Every application is built with HIPAA awareness, audit trails, and enterprise-grade security from day one.",
      ),
    },
    {
      name: fact("One Platform, Unlimited Use Cases"),
      description: fact(
        "Build patient apps, operational dashboards, workflow tools, and more on a single execution platform.",
      ),
    },
    {
      name: fact("You Own the IP"),
      description: fact(
        "Applications built on SmartCycleAI are yours. No vendor lock-in, no dependencies on external platforms.",
      ),
    },
    {
      name: fact("Empower Your Teams"),
      description: fact(
        "Augment your existing teams rather than replace them. Your people gain new capabilities, not new competition.",
      ),
    },
  ] satisfies FlexibilityPoint[],
};

export interface UseCaseItem {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
}

export interface UseCaseCategory {
  name: SourcedFact<string>;
  intro: SourcedFact<string>;
  items: UseCaseItem[];
}

export const useCasesSectionIntro = {
  eyebrow: fact("Application potential — these are possibilities, not fixed products"),
  headingLines: fact(["What You Can Build"]),
  intro: fact(
    "Every organization has unique needs. These examples show the kinds of applications you could build with SmartCycleAI—tailored to your priorities, owned by you.",
  ),
};

/**
 * The 4-category / 16-item use-case taxonomy. This is a DIFFERENT breakdown
 * from the homepage's 10 "Solution Domains" (solutionDomains.ts) — see
 * gaps.ts `taxonomy-10-domains-vs-4-categories`. Cross-link, don't merge.
 */
export const useCaseCategories: UseCaseCategory[] = [
  {
    name: fact("Patient-Facing Applications"),
    intro: fact(
      "Imagine applications that meet patients where they are—designed around your care model, owned by you.",
    ),
    items: [
      {
        name: fact("Connect patients to care virtually"),
        description: fact(
          "Build telehealth experiences, remote monitoring dashboards, or async messaging tools tailored to how your organization delivers care.",
        ),
      },
      {
        name: fact("Streamline the patient journey"),
        description: fact(
          "Create intake experiences, consent workflows, and pre-visit forms that reflect your brand and integrate with your systems.",
        ),
      },
      {
        name: fact("Unify your digital front door"),
        description: fact(
          "Design patient portals that bring together scheduling, messaging, records, and navigation—your way.",
        ),
      },
      {
        name: fact("Keep patients engaged"),
        description: fact(
          "Develop outreach tools, care plan reminders, and feedback systems that drive the outcomes you care about.",
        ),
      },
    ],
  },
  {
    name: fact("Revenue & Operations"),
    intro: fact(
      "Build applications that turn operational priorities into measurable results—without waiting for vendor roadmaps.",
    ),
    items: [
      {
        name: fact("Accelerate revenue capture"),
        description: fact(
          "Create applications for claims workflows, denial management, or authorization processes that fit your revenue cycle.",
        ),
      },
      {
        name: fact("Optimize scheduling and capacity"),
        description: fact(
          "Build scheduling tools, resource allocation apps, or capacity planners designed for how your organization operates.",
        ),
      },
      {
        name: fact("Gain operational visibility"),
        description: fact(
          "Develop dashboards and monitoring tools that surface the KPIs and metrics that matter to your teams.",
        ),
      },
      {
        name: fact("Automate compliance tracking"),
        description: fact(
          "Create audit-ready applications, documentation workflows, and quality tracking systems tailored to your requirements.",
        ),
      },
    ],
  },
  {
    name: fact("Internal Systems"),
    intro: fact("Empower your teams with purpose-built tools—no more forcing processes into generic software."),
    items: [
      {
        name: fact("Manage requests and projects"),
        description: fact(
          "Build intake portals, prioritization workflows, and tracking applications that match how your organization works.",
        ),
      },
      {
        name: fact("Put data in your team's hands"),
        description: fact(
          "Create self-service analytics tools, custom report builders, or departmental dashboards your staff will actually use.",
        ),
      },
      {
        name: fact("Automate reporting workflows"),
        description: fact(
          "Develop automated report generation, scheduled distributions, and compliance documentation that runs itself.",
        ),
      },
      {
        name: fact("Digitize manual processes"),
        description: fact(
          "Transform paper-based workflows, approval chains, and task management into digital applications you own.",
        ),
      },
    ],
  },
  {
    name: fact("Analytics & Insights"),
    intro: fact(
      "Turn your data into applications that drive decisions—built for your questions, not generic templates.",
    ),
    items: [
      {
        name: fact("Inform executive decisions"),
        description: fact(
          "Build dashboards that give leadership visibility into the performance, financial, and strategic metrics they need.",
        ),
      },
      {
        name: fact("Track what matters"),
        description: fact(
          "Create scorecards, benchmarking tools, and performance trackers designed around your quality and efficiency goals.",
        ),
      },
      {
        name: fact("Understand your populations"),
        description: fact(
          "Develop risk stratification tools, care gap analysis applications, and cohort tracking systems for your patient base.",
        ),
      },
      {
        name: fact("Anticipate what's next"),
        description: fact(
          "Build forecasting tools, predictive models, and trend analysis applications that help you plan proactively.",
        ),
      },
    ],
  },
];

export const useCaseCategoriesGapRef = "taxonomy-10-domains-vs-4-categories";

export const useCasesFinalCta = {
  headingLines: fact(["Your needs won't fit a template—and they shouldn't have to."]),
  supporting: fact("Tell us what you want to accomplish, and we'll build exactly what you need. You own the result."),
  ctaHeadingLines: fact(["Tell us your priority.", "We'll show you how fast we can build it."]),
  ctaSupporting: fact(
    "Schedule a conversation to discuss your strategic priorities and see how SmartCycleAI can transform them into production applications.",
  ),
  ctaPrimary: fact("Request a Demo"),
  ctaSecondary: fact("Learn About Our Platform"),
};
