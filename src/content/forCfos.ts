import { sourcedFact } from "./types.ts";
import type { ContentPage, FactOptions, SourcedFact } from "./types.ts";

const SRC = "https://smartcycle.ai/for-cfos";
const V = "2026-09-12";

const fact = <T,>(value: T, qualifier?: string, opts?: FactOptions): SourcedFact<T> =>
  sourcedFact(value, SRC, V, qualifier !== undefined ? { qualifier, ...opts } : opts);

export const forCfosMeta: ContentPage = {
  path: "/for-cfos",
  title: fact("For CFOs | SmartCycleAI"),
  sourceUrl: SRC,
};

export const forCfosHero = {
  eyebrow: fact("For Financial Leaders"),
  headingLines: fact(["Operational Leverage", "for Digital Investment"]),
  subheading: fact(
    "Maximize ROI on digital initiatives. SmartCycleAI delivers more projects, faster—with predictable costs and measurable outcomes.",
  ),
  supporting: fact("Lower costs. Faster delivery. Compounding value."),
  ctaPrimary: fact("Request a Demo"),
  ctaSecondary: fact("See the Platform"),
};

export interface ValueProp {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
}

export const financialImpactSection = {
  eyebrow: fact("Financial Impact You Can Measure"),
  intro: fact(
    "SmartCycleAI transforms how your organization invests in digital capabilities—delivering more value with better economics.",
  ),
  items: [
    {
      name: fact("Do More With Existing Resources"),
      description: fact(
        "Multiply your team's capacity without adding headcount. SmartCycleAI augments your existing workforce to deliver more projects with the same budget.",
      ),
    },
    {
      name: fact("Reduce Per-Project Costs"),
      description: fact(
        "Our reusable execution infrastructure dramatically lowers the marginal cost of each new application. Build more without spending more.",
      ),
    },
    {
      name: fact("Accelerate Time-to-Value"),
      description: fact(
        "Get from concept to production in weeks, not months. Faster delivery means faster ROI and quicker realization of strategic benefits.",
      ),
    },
    {
      name: fact("Predictable Delivery"),
      description: fact(
        "No more budget overruns or missed deadlines. Our proven methodology delivers consistent, predictable outcomes you can plan around.",
      ),
    },
  ] satisfies ValueProp[],
};

export interface PainPointWithSolution {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
  solutionPhrase: SourcedFact<string>;
}

export const cfosPainPoints = {
  eyebrow: fact("The Financial Pressures You Navigate"),
  intro: fact(
    "We understand the financial realities of digital transformation. SmartCycleAI was built to deliver better outcomes within your constraints.",
  ),
  items: [
    {
      name: fact("Rising IT Costs"),
      description: fact(
        "Every new initiative seems to require a new vendor, new contract, and new integration costs. Your IT budget stretches thinner each year.",
      ),
      solutionPhrase: fact("One platform. Unlimited applications. Fixed costs."),
    },
    {
      name: fact("Resource Constraints"),
      description: fact(
        "Hiring technical talent is expensive and slow. Your best people are stretched across too many projects, and contractors add complexity.",
      ),
      solutionPhrase: fact("Augment capacity without adding headcount."),
    },
    {
      name: fact("Delayed ROI"),
      description: fact(
        "Projects take 12-18 months to deliver, and the business case erodes with every delay. By launch time, requirements have changed.",
      ),
      solutionPhrase: fact("Weeks to production. Faster value realization."),
    },
    {
      name: fact("Budget Overruns"),
      description: fact(
        "Scope creep, hidden costs, and vendor surprises blow past initial estimates. Projects consistently cost more than planned.",
      ),
      solutionPhrase: fact("Predictable pricing. No surprises."),
    },
  ] satisfies PainPointWithSolution[],
};

export const financialCaseSection = {
  heading: fact("The Financial Case for SmartCycleAI"),
  items: [fact("Faster Time-to-Value"), fact("Lower Per-Project Cost"), fact("Compounding Returns"), fact("Predictable Budgets")],
};

export const cfosFinalCta = {
  heading: fact("Ready to maximize your digital investment?"),
  supporting: fact(
    "Schedule a personalized demonstration and see how SmartCycleAI can help you deliver more value with better economics.",
  ),
  ctaPrimary: fact("Request a Demo"),
  ctaSecondary: fact("Why SmartCycleAI"),
};
