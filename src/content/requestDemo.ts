import { sourcedFact } from "./types.ts";
import type { SourcedFact } from "./types.ts";

const SRC = "https://smartcycle.ai/request-demo";
const V = "2026-09-12";

/**
 * /request-demo is not an independent page on the live site. Confirmed via
 * raw response headers AND the page's own Next.js RSC payload, which
 * carries an explicit server redirect instruction:
 *
 *   "digest":"NEXT_REDIRECT;replace;/contact;307;"
 *
 * i.e. a genuine, intentional 307 (temporary) redirect to /contact — not a
 * transient error. There is no distinct "/request-demo" content to
 * capture; this module exists only to document that fact so the redesign's
 * own /request-demo route can make an informed choice (e.g. render the
 * same content as /contact, or itself redirect) rather than silently
 * inventing different copy. See gaps.ts `request-demo-redirects-to-contact`.
 */
export const requestDemoRedirect = {
  from: sourcedFact("/request-demo", SRC, V),
  to: sourcedFact("/contact", SRC, V),
  status: sourcedFact(307, SRC, V),
  mechanism: sourcedFact("Next.js server redirect (NEXT_REDIRECT;replace;/contact;307)", SRC, V),
  gapRef: "request-demo-redirects-to-contact",
} satisfies {
  from: SourcedFact<string>;
  to: SourcedFact<string>;
  status: SourcedFact<number>;
  mechanism: SourcedFact<string>;
  gapRef: string;
};
