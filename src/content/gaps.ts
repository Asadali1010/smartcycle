import type { GapEntry } from "./types.ts";

/**
 * Every content discrepancy, ambiguity, or verification wrinkle found while
 * re-fetching https://smartcycle.ai/. None of these are silently resolved
 * anywhere in src/content/** — conflicting facts are preserved as-is on
 * both sides, and this file is the index a UI can use to surface an honest
 * caveat instead of pretending the site is internally consistent.
 *
 * `lastVerified` reflects the date each discrepancy was last confirmed
 * still present (or, for `contact-email-obfuscated`, confirmed resolved).
 */
export const gaps: GapEntry[] = [
  {
    id: "contact-email-obfuscated",
    title: "Contact email rendered obfuscated on-page",
    description:
      'The visible mailto link on /contact, /privacy, and /terms is Cloudflare email-protected (`data-cfemail="..."` + a "/cdn-cgi/l/email-protection" placeholder) rather than a plain mailto — a naive text scrape of the rendered link yields no literal address. RESOLVED for this build: the address decodes to info@smartcycleai.com (manually XOR-decoded from the data-cfemail hex), and independently matches the plain `"email":"info@smartcycleai.com"` value present in the Organization JSON-LD structured data embedded on /contact, /privacy, /request-demo, and /terms. All four sources agree. Recorded here because it required more than a plain page read/scrape, and because Cloudflare\'s obfuscation encoding could change on a future site update, silently invalidating the decode.',
    sourceUrls: [
      "https://smartcycle.ai/contact",
      "https://smartcycle.ai/privacy",
      "https://smartcycle.ai/terms",
    ],
    severity: "info",
    lastVerified: "2026-09-12",
  },
  {
    id: "request-demo-redirects-to-contact",
    title: "/request-demo has no independent content — it 307-redirects to /contact",
    description:
      'Confirmed via raw response headers (HTTP/2 307) and the page\'s own Next.js RSC payload, which carries `"digest":"NEXT_REDIRECT;replace;/contact;307;"` — an intentional server redirect, not a transient error or a fetch-tool artifact. There is no distinct "/request-demo" page copy to source. This redesign\'s /request-demo route must make its own explicit choice (e.g. mirror /contact\'s content, or itself redirect) rather than inventing unique copy for a page that doesn\'t exist on the live site.',
    sourceUrls: ["https://smartcycle.ai/request-demo"],
    severity: "low",
    lastVerified: "2026-09-12",
  },
  {
    id: "how-it-works-4-vs-5-step",
    title: '"How It Works" is a 4-step process on the homepage but a 5-step process on /platform',
    description:
      'Homepage: "Intake & Prioritize → Build in Studio → Instrument with EEF → Deploy & Own" (4 steps). /platform: "Define Business Need → Build Using Proven Patterns → Human Validation → Deploy With Governance → Monitor Portfolio" (5 steps). Both are live, current copy on their respective pages — neither is stale or superseded. They describe the same overall engagement at different levels of granularity/emphasis (the homepage version is Studio/EEF-product-centric; the /platform version is client-engagement-centric) but do not map 1:1 onto each other. Kept as two separate, independently sourced processes (home.ts `howItWorksHome`, platform.ts `platformHowItWorks`) rather than merged or reconciled.',
    sourceUrls: ["https://smartcycle.ai/", "https://smartcycle.ai/platform"],
    severity: "medium",
    lastVerified: "2026-09-12",
  },
  {
    id: "cost-reduction-73-vs-57",
    title: '"Up to 73% Cost Reduction" (Execution Gap) vs "57% Cost Reduction" (ROI Impact) on the same homepage',
    description:
      'The Execution Gap section states a static, qualified claim: "Up to 73% Cost Reduction." Further down the SAME homepage, the ROI Impact section shows "57% Cost Reduction" — but that section is an interactive calculator (see `roi-calculator-dynamic` below), and 57% is specifically the output rendered when its three sliders sit at their default positions (Organization Size 5,000 employees / Annual IT Build Spend $3.0M / Active Projects 20), not a second fixed marketing claim. The two numbers are therefore not strictly comparable — one is a ceiling ("up to"), the other a default-scenario output — but the page presents them close together without reconciling them, so both are preserved verbatim rather than picking one as "the" cost-reduction figure.',
    sourceUrls: ["https://smartcycle.ai/"],
    severity: "medium",
    lastVerified: "2026-09-12",
  },
  {
    id: "roi-calculator-dynamic",
    title: "ROI Impact section is an interactive calculator, not fixed stats",
    description:
      'The homepage "ROI Impact" section has three range-slider inputs (Organization Size, Annual IT Build Spend, Active Projects/Initiatives) whose outputs (Projected Annual Savings, % faster time to production, Cost Reduction, Time Saved, Vendor Consolidation) are computed client-side and change as the sliders move. The exact calculation logic runs in client-side JavaScript and is not present in the server-rendered HTML, so it could not be verified/reproduced here. roi.ts `roiCalculatorInputs`/`roiCalculatorDefaultOutputs` capture the DEFAULT slider positions and the corresponding default outputs, confirmed from the page\'s own initial server-rendered markup (5,000 employees / $3.0M / 20 projects → $1.7M projected annual savings, 68% faster time to production, 57% cost reduction, 5→1 vendor consolidation). These are illustrative defaults of a tool, not fixed claims, and should not be presented in the redesign as static facts the way the separate before/after comparison table (roi.ts `roiComparisonTable`) is.',
    sourceUrls: ["https://smartcycle.ai/"],
    severity: "medium",
    lastVerified: "2026-09-12",
  },
  {
    id: "taxonomy-10-domains-vs-4-categories",
    title: "Homepage's 10 Solution Domains vs /use-cases' 4-category / 16-item taxonomy",
    description:
      'The homepage lists 10 named "Solution Domains" (Enterprise Intake & Orchestration, Analytics Scorecard Automation, Denial Management, Clinical Inbox Workflow, Intelligent Document Processing, White Glove Conversion, Population Health, Data Migration & Validation, Digital Medicine, Financial Intelligence — solutionDomains.ts) with filter tabs All/Revenue/Clinical/Operations/Data. /use-cases instead organizes around 4 categories (Patient-Facing Applications, Revenue & Operations, Internal Systems, Analytics & Insights) each with 4 illustrative sub-use-cases (useCases.ts) — 16 items total. The two taxonomies do not share item names and do not map cleanly onto each other (e.g. "Denial Management" as a named solution domain vs "Accelerate revenue capture" as a use-case phrase). Both are live, current, and independently real; this redesign cross-links them (e.g. via shared category-style filtering) without merging or renaming either list.',
    sourceUrls: ["https://smartcycle.ai/", "https://smartcycle.ai/use-cases"],
    severity: "medium",
    lastVerified: "2026-09-12",
  },
  {
    id: "differentiator-count-5-vs-6",
    title: '/why-smartcycleai has SIX differentiators, not five',
    description:
      'The prior content inventory carried forward into this build listed 5 differentiators for /why-smartcycleai. On re-fetch, the live page\'s own copy states "Six foundational principles that define who we are..." and lists six: The Missing Execution Layer, Healthcare-Native by Design, One Platform Not Point Solutions, Governed by Design, Fast Without Breaking Things, and Built for Ownership and Autonomy. The fifth item ("Fast Without Breaking Things") was missing from the prior inventory. why.ts `differentiatorsSection` carries the corrected, re-verified list of six.',
    sourceUrls: ["https://smartcycle.ai/why-smartcycleai"],
    severity: "low",
    lastVerified: "2026-09-12",
  },
  {
    id: "iso-vs-ansi-27001",
    title: '"ISO 27001" (/platform) vs "ANSI 27001 Alignment" (/why-smartcycleai) for what reads as the same certification claim',
    description:
      'The /platform Security & Compliance badge row lists "ISO 27001" among HIPAA, HITRUST, Epic Safe, and SOC 2 Type II. /why-smartcycleai\'s Enterprise Governance section instead lists "ANSI 27001 Alignment" with the description "Security practices aligned with international information security standards." ISO/IEC 27001 is the internationally recognized information-security standard; "ANSI 27001" is not a standard designation ANSI publishes, so this reads as either a copy inconsistency or a typo on one of the two pages. Not corrected/normalized here — both are preserved exactly as each page states them (platform.ts `platformSecurity.badges`, why.ts `governanceSection.items`).',
    sourceUrls: ["https://smartcycle.ai/platform", "https://smartcycle.ai/why-smartcycleai"],
    severity: "low",
    lastVerified: "2026-09-12",
  },
  {
    id: "certification-language-varies-by-page",
    title: 'Compliance claims range from soft ("Aware"/"Ready"/"Aligned") to specific ("SOC 2 Type II", "ISO 27001") depending on the page',
    description:
      'Persona/marketing pages consistently use hedged language: /contact\'s trust badges read "HIPAA Aware," "HITRUST Ready," "Epic-Safe," "SOC 2 Aligned"; /for-cios-ctos reads "HIPAA/HITRUST Aware." /platform is the outlier, stating unhedged "HIPAA," "HITRUST," "ISO 27001," "Epic Safe," and "SOC 2 Type II" — the latter being a specific, auditable certification level, not a vague alignment claim. Per this project\'s constraints (no certifications beyond what\'s stated, preserve qualifiers exactly), each page\'s claim is kept exactly as that page states it rather than normalized to the strongest or weakest version site-wide — a component must not casually swap in "SOC 2 Type II" on a page whose source only says "SOC 2 Aligned," or vice versa.',
    sourceUrls: [
      "https://smartcycle.ai/contact",
      "https://smartcycle.ai/platform",
      "https://smartcycle.ai/for-cios-ctos",
    ],
    severity: "medium",
    lastVerified: "2026-09-12",
  },
];

export const GAPS_BY_ID: Record<string, GapEntry> = Object.fromEntries(gaps.map((g) => [g.id, g]));
