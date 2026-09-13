import { useMemo } from "react";
import { GapNote } from "@/components/common/GapNote";
import { useCases as useCasesContent } from "@/content";
import { buildShowcaseSlides } from "./data";
import { useShowcaseMode } from "./useShowcaseMode";
import { DesktopShowcase } from "./DesktopShowcase";
import { MobileShowcase } from "./MobileShowcase";

/**
 * Root export. Combines both of the site's real use-case taxonomies
 * (content/useCases.ts's 4-category/16-item breakdown and
 * content/solutionDomains.ts's 10 named domains — see gaps.ts
 * `taxonomy-10-domains-vs-4-categories`) into one showcase instead of
 * silently picking one, and switches renderer based on viewport size and
 * `prefers-reduced-motion`. Headless by design (no big marketing heading) so
 * a page can drop it under its own SectionHeading, matching the rest of
 * src/components/common/**'s composition pattern.
 */
export function UseCaseShowcase() {
  const slides = useMemo(() => buildShowcaseSlides(), []);
  const isCompact = useShowcaseMode();

  return (
    <section aria-label="Healthcare use case and solution domain showcase" className="block">
      {/*
        Deliberately `block`, not `flex flex-col` — GSAP's pin-spacer sizing
        for DesktopShowcase's pinned ScrollTrigger silently breaks when the
        pinned element is a flex child (it inserted a spacer sized to only
        one viewport height instead of the full scroll distance, letting the
        next section's content ride up underneath the still-pinned showcase).
        Confirmed by measuring the actual pin-spacer height with/without a
        flex parent — verify this stays true before reintroducing flex here.
      */}
      <div className="mb-6 max-w-2xl px-gutter font-body text-sm text-current/60">
        SmartCycleAI's site describes what you can build through two separate, non-overlapping taxonomies — this
        showcase includes both rather than picking one.
        <GapNote gapId={useCasesContent.useCaseCategoriesGapRef} label="Why two taxonomies" className="ml-2" />
      </div>
      {isCompact ? <MobileShowcase slides={slides} /> : <DesktopShowcase slides={slides} />}
    </section>
  );
}
