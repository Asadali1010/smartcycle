import { sourcedFact } from "./types.ts";
import type { ContentPage, FactOptions, SourcedFact } from "./types.ts";

const SRC = "https://smartcycle.ai/privacy";
const V = "2026-09-12";

const fact = <T,>(value: T, qualifier?: string, opts?: FactOptions): SourcedFact<T> =>
  sourcedFact(value, SRC, V, qualifier !== undefined ? { qualifier, ...opts } : opts);

export const privacyMeta: ContentPage = {
  path: "/privacy",
  title: fact("Privacy Policy | SmartCycleAI"),
  sourceUrl: SRC,
};

export const privacyLastUpdated = fact("January 2026");

export interface PolicySection {
  heading: SourcedFact<string>;
  /** Faithful summary, not verbatim reproduction (source is long-form legal copy). */
  summary: SourcedFact<string>;
}

export const privacySections: PolicySection[] = [
  {
    heading: fact("Introduction"),
    summary: fact(
      'SmartCycleAI ("we," "our," or "us") is committed to protecting your privacy and explains, in this policy, how it collects, uses, discloses, and safeguards visitor/user information across its website and services. Continued use of the services is stated to constitute agreement to the policy.',
    ),
  },
  {
    heading: fact("Information We Collect"),
    summary: fact(
      "Two categories: (1) personal information voluntarily provided — name, email, phone, organization, job title, and similar details — when requesting a demo, contacting the company, subscribing to communications, registering, or giving feedback; (2) information collected automatically, including IP address, browser type, operating system, referring URLs, and site-interaction data.",
    ),
  },
  {
    heading: fact("How We Use Your Information"),
    summary: fact(
      "Stated uses: providing/operating/maintaining services, responding to inquiries, sending marketing communications (with consent), personalizing and improving the website experience, analyzing usage trends, protecting against unauthorized access, and complying with legal obligations.",
    ),
  },
  {
    heading: fact("Information Sharing and Disclosure"),
    summary: fact(
      'States plainly: "We do not sell, trade, or rent your personal information to third parties." Sharing is limited to: service providers performing work on the company\'s behalf, disclosures required by law or to protect its rights, transfers as part of a merger/acquisition/asset sale, and sharing with the individual\'s explicit consent.',
    ),
  },
  {
    heading: fact("Data Security"),
    summary: fact(
      'Describes "appropriate technical and organizational security measures" against unauthorized access, alteration, disclosure, or destruction, while explicitly acknowledging "no method of transmission over the Internet or electronic storage is 100% secure" and that absolute security cannot be guaranteed.',
    ),
  },
  {
    heading: fact("Your Rights and Choices"),
    summary: fact(
      "Depending on the visitor's location, rights described include: access to and a copy of one's personal information, correction of inaccurate information, deletion of personal information, opting out of marketing communications, and withdrawing consent where processing is consent-based.",
    ),
  },
  {
    heading: fact("Cookies and Tracking Technologies"),
    summary: fact(
      "Cookies and similar technologies are used to collect browsing-activity data; cookie preferences are manageable via browser settings, with a note that disabling cookies may affect site functionality.",
    ),
  },
  {
    heading: fact("Children's Privacy"),
    summary: fact(
      "Services are stated not to be directed to individuals under 18, and the company states it does not knowingly collect information from children; visitors are asked to contact the company if they believe a child's information was collected.",
    ),
  },
  {
    heading: fact("Changes to This Privacy Policy"),
    summary: fact(
      'The policy may be updated at any time, with changes posted on the page and the "Last updated" date revised; periodic review by users is encouraged.',
    ),
  },
  {
    heading: fact("Contact Us"),
    summary: fact(
      "Questions about the policy or data practices can be directed to SmartCycleAI by email, or through the website's own contact channel.",
    ),
  },
];

/**
 * Legal entity + email as stated in this page's own "Contact Us" section
 * and confirmed in its embedded Organization JSON-LD (`"email":"info@smartcycleai.com"`).
 * Matches the email independently confirmed on /contact and /terms.
 */
export const privacyContact = {
  legalEntity: fact("SmartCycleAI"),
  email: fact("info@smartcycleai.com", undefined, { gapRef: "contact-email-obfuscated" }),
};
