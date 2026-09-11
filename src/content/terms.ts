import { sourcedFact } from "./types.ts";
import type { ContentPage, FactOptions, SourcedFact } from "./types.ts";

const SRC = "https://smartcycle.ai/terms";
const V = "2026-09-12";

const fact = <T,>(value: T, qualifier?: string, opts?: FactOptions): SourcedFact<T> =>
  sourcedFact(value, SRC, V, qualifier !== undefined ? { qualifier, ...opts } : opts);

export const termsMeta: ContentPage = {
  path: "/terms",
  title: fact("Terms of Service | SmartCycleAI"),
  sourceUrl: SRC,
};

export const termsLastUpdated = fact("January 2026");

export interface TermsSection {
  heading: SourcedFact<string>;
  /** Faithful summary, not verbatim reproduction (source is long-form legal copy). */
  summary: SourcedFact<string>;
}

export const termsSections: TermsSection[] = [
  {
    heading: fact("Agreement to Terms"),
    summary: fact(
      "Using SmartCycleAI's website/services means agreeing to be bound by these Terms; anyone who does not agree is instructed to discontinue use immediately.",
    ),
  },
  {
    heading: fact("Description of Services"),
    summary: fact(
      '"Healthcare technology execution infrastructure and related services designed to help healthcare organizations build and deploy digital applications," including consulting, software development, and technology platforms tailored to the healthcare industry.',
    ),
  },
  {
    heading: fact("User Responsibilities"),
    summary: fact(
      "Users agree to: provide accurate/complete information; keep account credentials confidential; use the services only lawfully and per these Terms; not seek unauthorized access to systems or other accounts; not transmit harmful/malicious content; and comply with applicable law, including healthcare privacy law.",
    ),
  },
  {
    heading: fact("Intellectual Property Rights"),
    summary: fact(
      "SmartCycleAI owns the website and its content/features/functionality (text, graphics, logos, icons, images, software), protected by copyright/trademark/other IP law. For custom development performed under a service agreement, IP ownership instead follows that specific agreement's terms.",
    ),
  },
  {
    heading: fact("Prohibited Activities"),
    summary: fact(
      "Bars: systematic data retrieval without written permission; unauthorized/competitive use of the services; circumventing security or interfering with proper functioning; unauthorized framing/linking; transmitting viruses/malware/harmful code; automated scraping; impersonating another user or entity; and harassing, intimidating, or threatening users or staff.",
    ),
  },
  {
    heading: fact("Service Modifications"),
    summary: fact(
      "SmartCycleAI reserves the right to modify, suspend, or discontinue any part of the services at any time without notice, and disclaims liability to users or third parties for doing so.",
    ),
  },
  {
    heading: fact("Disclaimer of Warranties"),
    summary: fact(
      'Services are provided "AS IS" and "AS AVAILABLE" with no express or implied warranties, including as to accuracy/reliability/completeness of content, uninterrupted/secure/error-free operation, results obtainable from use, or fitness for a particular purpose/merchantability.',
    ),
  },
  {
    heading: fact("Limitation of Liability"),
    summary: fact(
      "To the maximum extent permitted by law, SmartCycleAI is not liable for indirect, incidental, special, consequential, or punitive damages, or any loss of profits/revenue/data/use/goodwill or other intangible losses arising from use of the services.",
    ),
  },
  {
    heading: fact("Indemnification"),
    summary: fact(
      "Users agree to indemnify, defend, and hold harmless SmartCycleAI and its officers/directors/employees/agents/affiliates from claims, liabilities, damages, judgments, losses, costs, or expenses (including reasonable attorneys' fees) arising from a Terms violation or use of the services.",
    ),
  },
  {
    heading: fact("Governing Law"),
    summary: fact(
      "Governed by the laws of the United States (without regard to conflict-of-law provisions); legal actions must be brought exclusively in federal or state courts located in the United States. No specific state is named.",
    ),
  },
  {
    heading: fact("Changes to These Terms"),
    summary: fact(
      'SmartCycleAI may modify these Terms at any time, posting the new Terms and updating the "Last updated" date; continued use after changes constitutes acceptance.',
    ),
  },
  {
    heading: fact("Severability"),
    summary: fact(
      "An unenforceable/invalid provision is modified/interpreted to achieve its objective to the greatest extent possible under applicable law, with remaining provisions staying in full force.",
    ),
  },
  {
    heading: fact("Contact Information"),
    summary: fact(
      "Questions about these Terms can be directed to SmartCycleAI by email, or through the website's own contact channel.",
    ),
  },
];

/**
 * Legal entity + email as stated in this page's own "Contact Information"
 * section and confirmed in its embedded Organization JSON-LD
 * (`"email":"info@smartcycleai.com"`). Matches the email independently
 * confirmed on /contact and /privacy.
 */
export const termsContact = {
  legalEntity: fact("SmartCycleAI"),
  email: fact("info@smartcycleai.com", undefined, { gapRef: "contact-email-obfuscated" }),
  governingLawJurisdiction: fact("United States (federal or state courts); no specific state named"),
};
