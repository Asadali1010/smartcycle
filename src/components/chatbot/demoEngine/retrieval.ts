/**
 * Deterministic, offline retrieval over `src/content/index.ts`.
 *
 * No ML dependency: this is plain keyword/token-overlap scoring against a
 * corpus built at module-load time by walking every routed content module's
 * exports. It intentionally goes beyond the 4 canned starter prompts (see
 * `responses.ts`) so a question like "what is EEF" or "tell me about denial
 * management" can still be answered from whatever content module mentions it.
 */
import * as content from "@/content";
import type { SourcedFact } from "@/content/types";

/** Maps a content namespace export (from src/content/index.ts) to the real
 * route that renders it. Modules not listed here (nav, gaps, types,
 * chatbot, requestDemo) are deliberately excluded from the answerable
 * corpus — they're metadata/copy the widget itself owns, or (for
 * requestDemo) documentation of a redirect rather than real page content. */
const MODULE_ROUTES: Record<string, string> = {
  home: "/",
  platform: "/platform",
  useCases: "/use-cases",
  solutionDomains: "/", // rendered inside HomePage
  why: "/why-smartcycleai",
  about: "/about",
  forCiosCtos: "/for-cios-ctos",
  forCfos: "/for-cfos",
  forClinicalLeaders: "/for-clinical-leaders",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  roi: "/", // rendered inside HomePage
  deliveryModel: "/", // rendered inside HomePage
};

/** Human-friendly label for a route, used both in generated links and in
 * excerpt prefixes. Exported so responses.ts can reuse the same names. */
export const ROUTE_LABELS: Record<string, string> = {
  "/": "the homepage",
  "/platform": "the Platform page",
  "/use-cases": "the Use Cases page",
  "/why-smartcycleai": "the Why SmartCycleAI page",
  "/about": "the About page",
  "/for-cios-ctos": "the For CIOs/CTOs page",
  "/for-cfos": "the For CFOs page",
  "/for-clinical-leaders": "the For Clinical Leaders page",
  "/contact": "the Contact page",
  "/request-demo": "Request a Demo",
  "/privacy": "the Privacy page",
  "/terms": "the Terms page",
};

function isSourcedFact(value: unknown): value is SourcedFact<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "value" in value &&
    "sourceUrl" in value &&
    "lastVerified" in value
  );
}

/** Recursively flattens any content shape (SourcedFact, nested object,
 * array, primitive) down to a flat list of individual text strings. */
function extractText(value: unknown): string[] {
  if (value === null || value === undefined) return [];
  if (typeof value === "string") return value.trim() ? [value] : [];
  if (typeof value === "number" || typeof value === "boolean") return [String(value)];
  if (Array.isArray(value)) return value.flatMap(extractText);
  if (isSourcedFact(value)) return extractText(value.value);
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).flatMap(extractText);
  return [];
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !isSourcedFact(value) && !Array.isArray(value);
}

/** True when `value` is an array whose items are themselves "real" nested
 * objects (categories/items with their own fields) rather than an array of
 * SourcedFact-wrapped primitives (e.g. a list of badge strings). */
function isArrayOfObjects(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.some((item) => isObjectRecord(item));
}

export interface RetrievalChunk {
  id: string;
  route: string;
  /** Short label for this chunk (usually its first/name-like field) — used
   * to prefix a generated answer for context. */
  heading: string;
  /** Every individual text field under this chunk, flattened. Scoring runs
   * per-sentence so a match deep in a long section still surfaces cleanly. */
  sentences: string[];
}

function makeChunk(id: string, route: string, sentences: string[]): RetrievalChunk | null {
  if (sentences.length === 0) return null;
  return { id, route, heading: sentences[0]!, sentences };
}

/**
 * One level of export-shape awareness: a top-level export that is (or
 * contains) an array of nested objects gets split into one chunk per item
 * (so e.g. each compliance detail or each use-case category scores
 * independently); everything else about that export collapses into a single
 * "section" chunk. This keeps corpus granularity reasonable without needing
 * to hand-model every content module's shape.
 */
function buildChunksForExport(moduleName: string, route: string, exportKey: string, value: unknown): RetrievalChunk[] {
  const chunks: RetrievalChunk[] = [];

  if (isArrayOfObjects(value)) {
    value.forEach((item, i) => {
      const chunk = makeChunk(`${moduleName}.${exportKey}.${i}`, route, extractText(item));
      if (chunk) chunks.push(chunk);
    });
    return chunks;
  }

  if (isObjectRecord(value)) {
    const sectionSentences: string[] = [];
    for (const [key, sub] of Object.entries(value)) {
      if (isArrayOfObjects(sub)) {
        sub.forEach((item, i) => {
          const chunk = makeChunk(`${moduleName}.${exportKey}.${key}.${i}`, route, extractText(item));
          if (chunk) chunks.push(chunk);
        });
      } else {
        sectionSentences.push(...extractText(sub));
      }
    }
    if (sectionSentences.length > 0) {
      chunks.unshift({
        id: `${moduleName}.${exportKey}`,
        route,
        heading: sectionSentences[0]!,
        sentences: sectionSentences,
      });
    }
    return chunks;
  }

  const chunk = makeChunk(`${moduleName}.${exportKey}`, route, extractText(value));
  if (chunk) chunks.push(chunk);
  return chunks;
}

function buildCorpus(): RetrievalChunk[] {
  const chunks: RetrievalChunk[] = [];
  const namespaces = content as unknown as Record<string, Record<string, unknown>>;
  for (const [moduleName, route] of Object.entries(MODULE_ROUTES)) {
    const ns = namespaces[moduleName];
    if (!ns) continue;
    for (const [exportKey, value] of Object.entries(ns)) {
      chunks.push(...buildChunksForExport(moduleName, route, exportKey, value));
    }
  }
  return chunks;
}

/** Built once at module load — the content set is static, so there's no
 * need to rebuild this per query. */
const CORPUS = buildCorpus();

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "do", "does", "did", "how", "what", "who", "which", "when", "where", "why",
  "can", "could", "would", "should", "will", "shall",
  "to", "of", "in", "on", "at", "for", "and", "or", "with", "as", "by", "from",
  "about", "my", "your", "our", "their", "his", "her", "its",
  "i", "you", "we", "they", "it", "this", "that", "these", "those",
  "have", "has", "had", "me", "us", "them", "tell", "please", "explain",
]);

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

/** Query tokens with stopwords and single-character noise removed — these
 * are the terms that actually carry search intent. */
function meaningfulTokens(text: string): string[] {
  return tokenize(text).filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

/**
 * Score = (# overlapping meaningful tokens) + 1 bonus point once at least
 * half of the query's meaningful tokens are covered by this sentence. This
 * rewards both raw keyword hits and queries that are substantially "about"
 * the same thing as the sentence, without any ML/embedding step.
 */
function scoreSentence(queryTokens: string[], sentence: string): number {
  const sentenceTokens = new Set(tokenize(sentence));
  if (sentenceTokens.size === 0) return 0;
  const matches = queryTokens.filter((token) => sentenceTokens.has(token)).length;
  if (matches === 0) return 0;
  const coverage = matches / queryTokens.length;
  return matches + (coverage >= 0.5 ? 1 : 0);
}

export interface RetrievalMatch {
  chunk: RetrievalChunk;
  sentence: string;
  score: number;
}

/** Returns the single best-scoring (chunk, sentence) pair for `query`, or
 * `null` when nothing in the corpus shares any meaningful token with it. */
export function retrieveBestMatch(query: string): RetrievalMatch | null {
  const queryTokens = meaningfulTokens(query);
  if (queryTokens.length === 0) return null;

  let best: RetrievalMatch | null = null;
  for (const chunk of CORPUS) {
    for (const sentence of chunk.sentences) {
      const score = scoreSentence(queryTokens, sentence);
      if (score > 0 && (!best || score > best.score)) {
        best = { chunk, sentence, score };
      }
    }
  }
  return best;
}

const DEMO_INTENT_PATTERN = /\b(demo|pricing|price|cost|buy|purchase|sign\s*-?\s*up)\b/i;

/** Sales/demo/pricing intent detector used to surface the "Request a Demo"
 * quick action regardless of how the retrieval/canned-response path answers. */
export function detectDemoIntent(text: string): boolean {
  return DEMO_INTENT_PATTERN.test(text);
}

/** Exposed for tests/debugging only — not part of the widget's public API. */
export const __internal = { CORPUS, meaningfulTokens, scoreSentence };
