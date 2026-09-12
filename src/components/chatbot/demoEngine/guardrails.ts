/**
 * Patient-information guardrail. Runs before retrieval on every message —
 * see `responses.ts` `generateReply`, which checks this first and returns
 * immediately on a hit without ever calling into `retrieval.ts`.
 *
 * This is deliberately pattern-based rather than "smart": the goal is a
 * cheap, predictable trip-wire that never lets patient-identifying or
 * clinical detail reach the (already-local, already-offline) demo engine —
 * not a clinical NLP classifier.
 */

export interface GuardrailResult {
  blocked: boolean;
  message?: string;
}

export const PATIENT_INFO_REFUSAL_MESSAGE =
  "I can't take in patient information, diagnoses, or other personal identifiers (like a date of birth or SSN) — this is a local demo assistant, not a clinical or PHI-handling system. Please don't enter patient data here. For anything patient- or account-specific, use Request a Demo to talk with our team through a proper, secure channel.";

/** Keyword trip-wire: patient/clinical/identifier vocabulary. */
const KEYWORD_PATTERN =
  /\b(patients?|diagnos(is|ed|e|es)|symptoms?|medical record|chart number|\bmrn\b|social security|\bssn\b|date of birth|\bdob\b)\b/i;

/** SSN-shaped digit pattern: 123-45-6789 or 123 45 6789 or 123456789-ish
 * with separators. */
const SSN_PATTERN = /\b\d{3}[-\s]\d{2}[-\s]\d{4}\b/;

/** A date that looks like it's being supplied as a date of birth
 * (MM/DD/YYYY or MM-DD-YYYY, generous about 2 vs 4 digit years). Combined
 * with the guardrail running on free text, this deliberately errs toward
 * over-blocking rather than under-blocking. */
const DOB_SHAPED_DATE_PATTERN = /\b(0?[1-9]|1[0-2])[/-](0?[1-9]|[12]\d|3[01])[/-](\d{2}|\d{4})\b/;

export function checkGuardrails(input: string): GuardrailResult {
  if (KEYWORD_PATTERN.test(input) || SSN_PATTERN.test(input) || DOB_SHAPED_DATE_PATTERN.test(input)) {
    return { blocked: true, message: PATIENT_INFO_REFUSAL_MESSAGE };
  }
  return { blocked: false };
}
