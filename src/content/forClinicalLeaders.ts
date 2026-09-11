import { sourcedFact } from "./types.ts";
import type { ContentPage, FactOptions, SourcedFact } from "./types.ts";

const SRC = "https://smartcycle.ai/for-clinical-leaders";
const V = "2026-09-12";

const fact = <T,>(value: T, qualifier?: string, opts?: FactOptions): SourcedFact<T> =>
  sourcedFact(value, SRC, V, qualifier !== undefined ? { qualifier, ...opts } : opts);

export const forClinicalLeadersMeta: ContentPage = {
  path: "/for-clinical-leaders",
  title: fact("For Clinical Leaders | SmartCycleAI"),
  sourceUrl: SRC,
};

export const forClinicalLeadersHero = {
  eyebrow: fact("For Clinical Leaders"),
  headingLines: fact(["Digital Tools", "at the Speed of Care"]),
  subheading: fact(
    "Stop waiting for IT. Start executing on clinical priorities. SmartCycleAI delivers the digital tools you need to improve patient outcomes—when you need them.",
  ),
  supporting: fact("Clinical-first design. Rapid deployment. Real results."),
  ctaPrimary: fact("Request a Demo"),
  /**
   * This is the one page whose secondary CTA differs from the "See the
   * Platform" pattern used on the other persona pages.
   */
  ctaSecondary: fact("See Clinical Examples"),
};

export interface ValueProp {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
}

export const clinicalDeliverySection = {
  eyebrow: fact("What SmartCycleAI Delivers for Clinical Teams"),
  intro: fact(
    "Purpose-built digital tools that support your clinical priorities and improve the care experience for both patients and staff.",
  ),
  items: [
    {
      name: fact("Get Applications When You Need Them"),
      description: fact(
        "No more waiting months for IT to prioritize your requests. SmartCycleAI delivers production-ready clinical tools in weeks, not quarters—so you can address care gaps while they're still relevant.",
      ),
    },
    {
      name: fact("Focus on Patient Outcomes"),
      description: fact(
        "Digital tools designed around clinical workflows, not generic software adapted for healthcare. Every application is built with patient care at its center, improving outcomes without adding complexity.",
      ),
    },
    {
      name: fact("Reduce Staff Burnout"),
      description: fact(
        "Eliminate the manual workarounds and redundant data entry that frustrate your clinical teams. Streamlined digital tools mean less time on documentation and more time with patients.",
      ),
    },
    {
      name: fact("Codify Best Practices"),
      description: fact(
        "Transform your clinical protocols and care pathways into digital tools that ensure consistency across your organization. Standardize care delivery while maintaining the flexibility clinicians need.",
      ),
    },
  ] satisfies ValueProp[],
};

export interface PainPointWithSolution {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
  solutionPhrase: SourcedFact<string>;
}

export const clinicalLeadersPainPoints = {
  eyebrow: fact("The Challenges Clinical Leaders Face"),
  intro: fact(
    "We understand the daily frustrations of leading clinical teams without the digital tools you need. SmartCycleAI was built to bridge the gap.",
  ),
  items: [
    {
      name: fact("Long Wait Times"),
      description: fact(
        "Critical clinical initiatives wait in the IT backlog for months or years. By the time solutions arrive, the clinical landscape has changed and staff have developed their own workarounds.",
      ),
      solutionPhrase: fact("Weeks to production. Not quarters."),
    },
    {
      name: fact("Workarounds and Manual Processes"),
      description: fact(
        "Staff create spreadsheets, paper forms, and shadow systems to fill technology gaps. These workarounds increase risk, reduce visibility, and add to the documentation burden.",
      ),
      solutionPhrase: fact("Purpose-built tools that fit your workflow."),
    },
    {
      name: fact("Staff Frustration"),
      description: fact(
        "Clinicians spend too much time fighting technology instead of caring for patients. System friction leads to workarounds, errors, and burnout that impact both staff satisfaction and patient care.",
      ),
      solutionPhrase: fact("Tools designed for clinical workflows."),
    },
    {
      name: fact("Inconsistent Workflows"),
      description: fact(
        "Different units, departments, and facilities operate with different processes for the same clinical activities. Variation introduces risk and makes quality improvement nearly impossible.",
      ),
      solutionPhrase: fact("Standardized, codified best practices."),
    },
  ] satisfies PainPointWithSolution[],
};

export const clinicalExcellenceSection = {
  heading: fact("Built for Clinical Excellence"),
  items: [fact("Patient Safety First"), fact("EHR Integration Ready"), fact("Evidence-Based Design"), fact("Clinician-Centered")],
};

export const clinicalLeadersFinalCta = {
  heading: fact("Ready to accelerate your clinical initiatives?"),
  supporting: fact(
    "Schedule a personalized demonstration and see how SmartCycleAI can help you deliver the digital tools your clinical teams need.",
  ),
  ctaPrimary: fact("Request a Demo"),
  ctaSecondary: fact("Why SmartCycleAI"),
};
