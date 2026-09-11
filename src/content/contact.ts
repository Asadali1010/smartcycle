import { sourcedFact } from "./types.ts";
import type { ContentPage, FactOptions, SourcedFact } from "./types.ts";

const SRC = "https://smartcycle.ai/contact";
const V = "2026-09-12";

const fact = <T,>(value: T, qualifier?: string, opts?: FactOptions): SourcedFact<T> =>
  sourcedFact(value, SRC, V, qualifier !== undefined ? { qualifier, ...opts } : opts);

export const contactMeta: ContentPage = {
  path: "/contact",
  title: fact("Request a Demo | SmartCycleAI"),
  sourceUrl: SRC,
};

export const contactHero = {
  heading: fact("Request a Demo"),
};

export interface ProcessStep {
  name: SourcedFact<string>;
  description: SourcedFact<string>;
}

export const contactProcess: ProcessStep[] = [
  { name: fact("Contact Within 24 Hours"), description: fact("A team member will reach out to schedule") },
  { name: fact("30-Minute Discovery Call"), description: fact("Learning about organizational goals") },
  { name: fact("Personalized Demonstration"), description: fact("See SmartCycleAI with relevant examples") },
  { name: fact("No Pressure Conversation"), description: fact("Honest dialogue without sales pressure") },
];

export const contactTrustBadges: SourcedFact<string>[] = [
  fact("HIPAA Aware"),
  fact("HITRUST Ready"),
  fact("Epic-Safe"),
  fact("SOC 2 Aligned"),
];

export const contactLocation = {
  city: fact("New Orleans"),
  region: fact("LA"),
  country: fact("US"),
  display: fact("New Orleans, Louisiana"),
};

/**
 * The literal contact email. The page's visible link is obfuscated with
 * Cloudflare's email-protection encoding (`data-cfemail="..."`) rather than
 * a plain `mailto:`. Decoded by hand and independently cross-confirmed
 * against the plain-text `"email":"info@smartcycleai.com"` value present in
 * this page's own Organization JSON-LD schema, and again in the JSON-LD on
 * /privacy and /terms — all three agree. See gaps.ts `contact-email-obfuscated`
 * for why this required extra verification instead of a plain page read.
 */
export const contactEmail: SourcedFact<string> = fact("info@smartcycleai.com", undefined, {
  gapRef: "contact-email-obfuscated",
});

export interface FormField {
  name: SourcedFact<string>;
  kind: "text" | "select" | "textarea";
  options?: SourcedFact<string>[];
}

export const demoFormFields: FormField[] = [
  { name: fact("First Name"), kind: "text" },
  { name: fact("Last Name"), kind: "text" },
  { name: fact("Work Email"), kind: "text" },
  { name: fact("Phone"), kind: "text" },
  { name: fact("Organization"), kind: "text" },
  { name: fact("Title"), kind: "text" },
  {
    name: fact("Organization Size"),
    kind: "select",
    options: [
      fact("1-50 employees"),
      fact("51-200"),
      fact("201-500"),
      fact("501-1,000"),
      fact("1,001-5,000"),
      fact("5,001-10,000"),
      fact("10,001+"),
    ],
  },
  {
    name: fact("Primary Interest"),
    kind: "select",
    options: [
      fact("Patient-Facing Applications"),
      fact("Revenue & Operations"),
      fact("Internal Workflow Systems"),
      fact("Analytics & Dashboards"),
      fact("Digital Transformation Strategy"),
      fact("General Information"),
      fact("Other"),
    ],
  },
  { name: fact("Message"), kind: "textarea" },
  {
    name: fact("How did you hear about us"),
    kind: "select",
    options: [
      fact("Search Engine"),
      fact("LinkedIn"),
      fact("Industry Conference/Event"),
      fact("Colleague/Referral"),
      fact("News Article/Publication"),
      fact("Other"),
    ],
  },
];
