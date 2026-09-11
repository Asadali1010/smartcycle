/**
 * The only import path pages/components/the chatbot should use to reach
 * content. Every page's content module is re-exported as a namespace
 * (several modules declare same-named local types like `ValueProp`, so
 * namespacing avoids collisions and keeps each page's data visibly
 * grouped: `content.platform.platformHero`, `content.about.leadershipSection`, etc).
 *
 * Shared, cross-cutting modules (types, nav, gaps, solution domains,
 * delivery model, ROI, chatbot copy) are re-exported both as a namespace
 * and flattened at the top level for convenience.
 */

export * as types from "./types.ts";
export * as nav from "./nav.ts";
export * as gaps from "./gaps.ts";

export * as home from "./home.ts";
export * as platform from "./platform.ts";
export * as useCases from "./useCases.ts";
export * as solutionDomains from "./solutionDomains.ts";
export * as why from "./why.ts";
export * as about from "./about.ts";
export * as forCiosCtos from "./forCiosCtos.ts";
export * as forCfos from "./forCfos.ts";
export * as forClinicalLeaders from "./forClinicalLeaders.ts";
export * as contact from "./contact.ts";
export * as requestDemo from "./requestDemo.ts";
export * as privacy from "./privacy.ts";
export * as terms from "./terms.ts";
export * as roi from "./roi.ts";
export * as deliveryModel from "./deliveryModel.ts";
export * as chatbot from "./chatbot.ts";

import { gaps as gapsModule } from "./gaps.ts";
import type { ContentPage } from "./types.ts";
import { homeMeta } from "./home.ts";
import { platformMeta } from "./platform.ts";
import { useCasesMeta } from "./useCases.ts";
import { whyMeta } from "./why.ts";
import { aboutMeta } from "./about.ts";
import { forCiosCtosMeta } from "./forCiosCtos.ts";
import { forCfosMeta } from "./forCfos.ts";
import { forClinicalLeadersMeta } from "./forClinicalLeaders.ts";
import { contactMeta } from "./contact.ts";
import { privacyMeta } from "./privacy.ts";
import { termsMeta } from "./terms.ts";

/**
 * Registry of every routed page's metadata (path/title/sourceUrl), keyed by
 * route path. /request-demo is deliberately absent — it has no independent
 * content on the live site (see gaps.ts `request-demo-redirects-to-contact`);
 * consult requestDemo.ts directly for that redirect's own sourced facts.
 */
export const PAGES: ContentPage[] = [
  homeMeta,
  platformMeta,
  useCasesMeta,
  whyMeta,
  aboutMeta,
  forCiosCtosMeta,
  forCfosMeta,
  forClinicalLeadersMeta,
  contactMeta,
  privacyMeta,
  termsMeta,
];

/** All tracked content gaps/discrepancies — see gaps.ts for full detail. */
export const ALL_GAPS = gapsModule;
