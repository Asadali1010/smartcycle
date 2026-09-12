import { useCases, solutionDomains as solutionDomainsContent } from "@/content";

/**
 * The showcase deliberately keeps BOTH of the site's real, non-overlapping
 * taxonomies rather than collapsing into one (see gaps.ts
 * `taxonomy-10-domains-vs-4-categories`, surfaced via GapNote in
 * UseCaseShowcase). Every rendered item carries which taxonomy it came from
 * so no consumer can accidentally blend them.
 */
export type ShowcaseTaxonomy = "use-cases" | "solution-domains";

export interface ShowcaseItem {
  id: string;
  taxonomy: ShowcaseTaxonomy;
  /** Category name (use-case items) or a fixed "Solution Domain" label. */
  eyebrow: string;
  title: string;
  description: string;
  /** Workflow-step chips — solution domains only. */
  meta?: string[];
  sourceUrl: string;
  lastVerified: string;
}

export type ShowcaseSlide =
  | {
      kind: "divider";
      taxonomy: ShowcaseTaxonomy;
      dividerTitle: string;
      dividerBody: string;
    }
  | {
      kind: "item";
      taxonomy: ShowcaseTaxonomy;
      item: ShowcaseItem;
    };

const slug = (...parts: string[]) =>
  parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function buildUseCaseItems(): ShowcaseItem[] {
  const items: ShowcaseItem[] = [];
  useCases.useCaseCategories.forEach((category) => {
    category.items.forEach((item) => {
      items.push({
        id: slug("uc", category.name.value, item.name.value),
        taxonomy: "use-cases",
        eyebrow: category.name.value,
        title: item.name.value,
        description: item.description.value,
        sourceUrl: item.description.sourceUrl,
        lastVerified: item.description.lastVerified,
      });
    });
  });
  return items;
}

export function buildSolutionDomainItems(): ShowcaseItem[] {
  return solutionDomainsContent.solutionDomains.map((domain) => ({
    id: slug("sd", domain.name.value),
    taxonomy: "solution-domains" as const,
    eyebrow: "Solution Domain",
    title: domain.name.value,
    description: domain.description.value,
    meta: domain.workflowSteps.map((step) => step.value),
    sourceUrl: domain.description.sourceUrl,
    lastVerified: domain.description.lastVerified,
  }));
}

/**
 * Flat, ordered slide list: a divider card introducing each taxonomy
 * followed by that taxonomy's items — "two consecutive horizontal tracks"
 * within one continuous pinned scroll journey, per the
 * showcase-and-timeline brief. Nothing from either source list is dropped.
 */
export function buildShowcaseSlides(): ShowcaseSlide[] {
  const useCaseItems = buildUseCaseItems();
  const domainItems = buildSolutionDomainItems();
  const categoryCount = new Set(useCaseItems.map((i) => i.eyebrow)).size;

  const slides: ShowcaseSlide[] = [
    {
      kind: "divider",
      taxonomy: "use-cases",
      dividerTitle: "Use Cases",
      dividerBody: `${useCaseItems.length} illustrative sub-use-cases across ${categoryCount} categories, from /use-cases.`,
    },
    ...useCaseItems.map((item) => ({ kind: "item" as const, taxonomy: "use-cases" as const, item })),
    {
      kind: "divider",
      taxonomy: "solution-domains",
      dividerTitle: "Solution Domains",
      dividerBody: `${domainItems.length} named enterprise solution domains, from the homepage.`,
    },
    ...domainItems.map((item) => ({ kind: "item" as const, taxonomy: "solution-domains" as const, item })),
  ];

  return slides;
}
