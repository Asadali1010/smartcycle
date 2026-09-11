/**
 * Chatbot copy. Unlike every other module in src/content/**, this is NOT
 * scraped from https://smartcycle.ai/ (the live site has no chatbot) — it
 * is product copy specified by this project's own build orchestrator
 * (CLAUDE.md) for a local, scripted demo assistant. Kept as plain string
 * constants rather than `SourcedFact<T>` for that reason: there is no
 * external source URL to attribute these to.
 *
 * chatbot-builder (src/components/chatbot/**, server/**) owns the actual
 * widget, local "AI" behavior, and disclosure UI. This module only owns
 * the fixed copy and the canned Q&A content it may want to answer with —
 * every fact referenced below traces back to the sourced modules in this
 * directory, never invented here.
 */

export const CHATBOT_WELCOME_MESSAGE =
  "Hi! I'm SmartCycle's AI assistant. What would you like to explore?" as const;

export const CHATBOT_STARTER_PROMPTS = [
  "What does SmartCycleAI do?",
  "How do Studio and EEF work together?",
  "What could my organization build?",
  "How can I request a demo?",
] as const;

/**
 * Mandatory disclosure copy per CLAUDE.md: the chatbot must always be
 * visibly labeled as local/demo, and must never imply it is a live AI
 * backed by a real model or that it collects patient information.
 */
export const CHATBOT_DEMO_DISCLOSURE =
  "This is a local, scripted demo assistant — not a live AI. Nothing you type here is sent anywhere, and no patient information should be entered." as const;

export interface CannedResponse {
  prompt: (typeof CHATBOT_STARTER_PROMPTS)[number];
  /** Plain-text answer for the scripted demo bot to render. */
  response: string;
  /** Which content modules/pages back the claims used in this answer. */
  sourceUrls: string[];
}

/**
 * One scripted answer per starter prompt. Every factual claim inside these
 * answers is drawn from the already-sourced modules in this directory
 * (home.ts, platform.ts, useCases.ts, contact.ts) — nothing new is
 * asserted here that isn't traceable to a `SourcedFact` elsewhere.
 */
export const CHATBOT_CANNED_RESPONSES: CannedResponse[] = [
  {
    prompt: "What does SmartCycleAI do?",
    response:
      "SmartCycleAI is execution infrastructure for healthcare: SmartCycle Studio (an AI application builder) plus the Execution & Evidence Fabric (a governance and control plane) — together they let a health system build, govern, and deploy production-ready applications in weeks instead of the traditional 12–18 months, while the organization keeps full code ownership.",
    sourceUrls: ["https://smartcycle.ai/"],
  },
  {
    prompt: "How do Studio and EEF work together?",
    response:
      "SmartCycle Studio builds applications — AI code generation, healthcare-native integrations, security scanning, and compliance checks. The Execution & Evidence Fabric (EEF) then governs and runs them across your whole portfolio: application registry, change control and approvals, an execution audit log, cost governance, policy enforcement, and centralized identity. The site summarizes the relationship as \"Build → Govern → Deploy.\"",
    sourceUrls: ["https://smartcycle.ai/", "https://smartcycle.ai/platform"],
  },
  {
    prompt: "What could my organization build?",
    response:
      "Anything from patient-facing tools (telehealth, patient portals, intake/consent workflows) to revenue-cycle and operations apps (denial management, scheduling, compliance tracking), internal systems (self-service analytics, workflow tools), and analytics/insights dashboards (executive scorecards, population health, forecasting). SmartCycleAI frames these as possibilities you'd build tailored to your priorities, not fixed off-the-shelf products.",
    sourceUrls: ["https://smartcycle.ai/use-cases", "https://smartcycle.ai/"],
  },
  {
    prompt: "How can I request a demo?",
    response:
      "Use the Request a Demo form — it asks for your name, work email, phone, organization, title, organization size, and primary area of interest. SmartCycleAI states a team member will follow up within 24 hours to schedule a 30-minute discovery call and a personalized demonstration, described as a \"No Pressure Conversation.\"",
    sourceUrls: ["https://smartcycle.ai/contact"],
  },
];
