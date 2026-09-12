/**
 * Composes the final chat reply: guardrails first, then the 4 scripted
 * starter-prompt answers verbatim, then general retrieval over the rest of
 * the content corpus, then an explicit fallback below the confidence
 * threshold. See CLAUDE.md / chatbot-builder.md for why each of these
 * layers exists.
 */
import { CHATBOT_CANNED_RESPONSES, CHATBOT_STARTER_PROMPTS } from "@/content/chatbot";
import type { CannedResponse } from "@/content/chatbot";
import { checkGuardrails } from "./guardrails";
import { detectDemoIntent, retrieveBestMatch, ROUTE_LABELS } from "./retrieval";

export interface ChatLink {
  label: string;
  to: string;
}

export interface ChatReply {
  text: string;
  link?: ChatLink;
  /** Sales/demo/pricing intent was detected in the user's message — the UI
   * surfaces a "Request a Demo" quick action when this is true. */
  showDemoCta: boolean;
  /** True when this reply is the "I don't have that information yet"
   * fallback rather than a grounded/canned answer. */
  isFallback: boolean;
  /** True when this reply is the patient-information guardrail refusal. */
  isRefusal: boolean;
}

/** A real answer needs at least two overlapping meaningful tokens (or one
 * token that covers the whole query) — see `scoreSentence` in retrieval.ts.
 * Below this, a stray shared word isn't enough to hang an answer on. */
const CONFIDENCE_THRESHOLD = 2;

const FALLBACK_MESSAGE =
  "I don't have that information yet — I can only answer from SmartCycleAI's published content. The fastest way to get a real answer is to request a demo, or browse the site for the closest relevant page.";

/** Maps a canned response's external smartcycle.ai sourceUrl to this
 * redesign's internal route, so canned answers link somewhere real. */
const SOURCE_URL_TO_ROUTE: Array<[string, string]> = [
  ["https://smartcycle.ai/use-cases", "/use-cases"],
  ["https://smartcycle.ai/platform", "/platform"],
  ["https://smartcycle.ai/contact", "/contact"],
  ["https://smartcycle.ai/", "/"],
];

function linkFromSourceUrls(sourceUrls: string[]): ChatLink | undefined {
  for (const url of sourceUrls) {
    const hit = SOURCE_URL_TO_ROUTE.find(([sourceUrl]) => sourceUrl === url);
    if (hit) {
      const [, route] = hit;
      return { label: ROUTE_LABELS[route] ?? route, to: route };
    }
  }
  return undefined;
}

function matchCannedPrompt(userText: string): CannedResponse | undefined {
  const normalized = userText.trim().toLowerCase();
  return CHATBOT_CANNED_RESPONSES.find((canned) => canned.prompt.toLowerCase() === normalized);
}

const MAX_EXCERPT_LENGTH = 420;

function truncate(text: string): string {
  if (text.length <= MAX_EXCERPT_LENGTH) return text;
  return `${text.slice(0, MAX_EXCERPT_LENGTH).replace(/\s+\S*$/, "")}…`;
}

function buildExcerpt(chunkHeading: string, sentence: string): string {
  const body = truncate(sentence);
  if (chunkHeading && chunkHeading !== sentence && chunkHeading.length <= 60) {
    return `${chunkHeading}: ${body}`;
  }
  return body;
}

/** The "How can I request a demo?" starter prompt should point straight at
 * `/request-demo` (the actual CTA) rather than wherever its sourceUrls
 * happen to map — everything else derives its link from sourceUrls. */
const REQUEST_DEMO_PROMPT: (typeof CHATBOT_STARTER_PROMPTS)[number] = "How can I request a demo?";

export function generateReply(userText: string): ChatReply {
  const guardrail = checkGuardrails(userText);
  if (guardrail.blocked) {
    return {
      text: guardrail.message ?? "I can't help with that here.",
      showDemoCta: false,
      isFallback: false,
      isRefusal: true,
    };
  }

  const demoCta = detectDemoIntent(userText);

  const canned = matchCannedPrompt(userText);
  if (canned) {
    const link =
      canned.prompt === REQUEST_DEMO_PROMPT
        ? { label: ROUTE_LABELS["/request-demo"]!, to: "/request-demo" }
        : linkFromSourceUrls(canned.sourceUrls);
    return {
      text: canned.response,
      link,
      showDemoCta: demoCta || canned.prompt === REQUEST_DEMO_PROMPT,
      isFallback: false,
      isRefusal: false,
    };
  }

  const match = retrieveBestMatch(userText);
  if (!match || match.score < CONFIDENCE_THRESHOLD) {
    return {
      text: FALLBACK_MESSAGE,
      link: { label: ROUTE_LABELS["/request-demo"]!, to: "/request-demo" },
      showDemoCta: demoCta,
      isFallback: true,
      isRefusal: false,
    };
  }

  const label = ROUTE_LABELS[match.chunk.route] ?? match.chunk.route;
  return {
    text: buildExcerpt(match.chunk.heading, match.sentence),
    link: { label, to: match.chunk.route },
    showDemoCta: demoCta,
    isFallback: false,
    isRefusal: false,
  };
}
