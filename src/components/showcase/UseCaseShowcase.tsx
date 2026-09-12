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
    <section aria-label="Healthcare use case and solution domain showcase" className="flex flex-col gap-6">
      <p className="max-w-2xl px-gutter font-body text-sm text-current/60">
        SmartCycleAI's site describes what you can build through two separate, non-overlapping taxonomies — this
        showcase includes both rather than picking one.
        <GapNote gapId={useCasesContent.useCaseCategoriesGapRef} label="Why two taxonomies" className="ml-2" />
      </p>
      {isCompact ? <MobileShowcase slides={slides} /> : <DesktopShowcase slides={slides} />}
    </section>
  );
}
