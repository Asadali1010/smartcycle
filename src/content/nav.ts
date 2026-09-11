import type { NavItem } from "./types.ts";

/**
 * Site navigation, confirmed against the rendered header/footer markup of
 * every fetched page (identical across all 12 pages as of lastVerified).
 */
export const HEADER_NAV: NavItem[] = [
  { label: "Platform", path: "/platform" },
  { label: "Why SmartCycleAI", path: "/why-smartcycleai" },
  { label: "About", path: "/about" },
  { label: "Request Demo", path: "/request-demo" },
];

export const FOOTER_NAV: {
  heading: string;
  items: NavItem[];
}[] = [
  {
    heading: "Platform",
    items: [{ label: "Platform", path: "/platform" }],
  },
  {
    heading: "Company",
    items: [
      { label: "About", path: "/about" },
      { label: "Why SmartCycleAI", path: "/why-smartcycleai" },
      { label: "Contact", path: "/contact" },
    ],
  },
  {
    heading: "For Leaders",
    items: [
      { label: "For CIOs & CTOs", path: "/for-cios-ctos" },
      { label: "For CFOs", path: "/for-cfos" },
      { label: "For Clinical Leaders", path: "/for-clinical-leaders" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
    ],
  },
];

/**
 * Footer also lists "Use Cases" directly under the Platform column heading
 * on the live site (between "Platform" and the "Company" column) — kept
 * here as a distinct item since it isn't in the header nav at all.
 */
export const FOOTER_USE_CASES_LINK: NavItem = {
  label: "Use Cases",
  path: "/use-cases",
};

export const FOOTER_SOCIAL_LINKS: { label: string; url: string }[] = [
  { label: "LinkedIn", url: "https://www.linkedin.com/company/smartcycleai" },
];

export const NAV_SOURCE_URL = "https://smartcycle.ai/";
export const NAV_LAST_VERIFIED = "2026-09-12";
