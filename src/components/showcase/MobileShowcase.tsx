import { useState } from "react";
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
          <button
            key={slide.item.id}
            type="button"
            onClick={() => setActive(slide.item)}
            className="flex flex-col gap-1.5 rounded-lg border border-current/15 p-5 text-left transition-colors hover:border-coral/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
          >
            <p className="font-body text-xs uppercase tracking-widest text-current/50">{slide.item.eyebrow}</p>
            <h3 className="font-display text-lg">{slide.item.title}</h3>
            <p className="line-clamp-2 font-body text-sm text-current/70">{slide.item.description}</p>
            {slide.item.meta?.length ? (
              <p className="mt-1 font-body text-xs text-current/50">{slide.item.meta.join(" → ")}</p>
            ) : null}
            <span className="mt-1 font-body text-xs font-medium uppercase tracking-widest text-coral">
              View details →
            </span>
          </button>
        ),
      )}
      <DetailModal item={active} onClose={() => setActive(null)} />
    </div>
  );
}
