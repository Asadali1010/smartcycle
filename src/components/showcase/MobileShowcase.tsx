import { useMemo, useState } from "react";
import { ShowcaseCard } from "@/design-system";
import type { ShowcaseItem, ShowcaseSlide } from "./data";
import { DetailModal } from "./DetailModal";

export interface MobileShowcaseProps {
  slides: ShowcaseSlide[];
}

/**
 * Accessible fallback for mobile viewports and `prefers-reduced-motion`: a
 * plain vertical stack, no gesture required. Renders the exact same slide
 * list as the desktop pinned track (grouped by taxonomy via the same
 * divider entries) so every use case and every solution domain stays
 * reachable — nothing is dropped between the two renderers.
 */
export function MobileShowcase({ slides }: MobileShowcaseProps) {
  const [active, setActive] = useState<ShowcaseItem | null>(null);

  // Resets to 01 at each taxonomy divider — mirrors DesktopShowcase's ordinal.
  const itemOrdinals = useMemo(
    () =>
      slides.reduce<{ counter: number; ordinals: number[] }>(
        (acc, slide) => {
          const counter = slide.kind === "divider" ? 0 : acc.counter + 1;
          return { counter, ordinals: [...acc.ordinals, counter] };
        },
        { counter: 0, ordinals: [] },
      ).ordinals,
    [slides],
  );

  return (
    <div className="flex flex-col gap-4 px-gutter">
      {slides.map((slide, i) =>
        slide.kind === "divider" ? (
          <div key={`divider-${i}`} className="mt-6 flex flex-col gap-1 border-b border-current/15 pb-3 first:mt-0">
            <p className="font-body text-xs font-medium uppercase tracking-[0.25em] text-champagne">
              {slide.dividerTitle}
            </p>
            <p className="font-body text-sm text-current/60">{slide.dividerBody}</p>
          </div>
        ) : (
          <ShowcaseCard
            key={slide.item.id}
            index={itemOrdinals[i]}
            label={slide.taxonomy === "use-cases" ? "Use Case" : "Solution Domain"}
            eyebrow={slide.item.eyebrow}
            title={slide.item.title}
            description={slide.item.description}
            descriptionClassName="line-clamp-2"
            meta={slide.item.meta}
            onSelect={() => setActive(slide.item)}
            className="h-auto"
          />
        ),
      )}
      <DetailModal item={active} onClose={() => setActive(null)} />
    </div>
  );
}
