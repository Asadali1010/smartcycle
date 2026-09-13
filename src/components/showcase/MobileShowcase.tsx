import { useState } from "react";
import clsx from "clsx";
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
          <div key={`divider-${i}`} className="mt-6 flex flex-col gap-1 border-b border-slate-edge pb-3 first:mt-0">
            <p
              className={clsx(
                "font-inter text-xs font-medium uppercase tracking-[0.25em]",
                slide.taxonomy === "use-cases" ? "text-ember-pulse" : "text-electric-iris",
              )}
            >
              {slide.dividerTitle}
            </p>
            <p className="font-inter text-sm text-current/60">{slide.dividerBody}</p>
          </div>
        ) : (
          <button
            key={slide.item.id}
            type="button"
            onClick={() => setActive(slide.item)}
            className="flex flex-col gap-1.5 rounded-xl border border-slate-edge bg-charcoal-card p-5 text-left text-snow transition-colors hover:border-ember-pulse/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-iris"
          >
            <p className="font-inter text-xs uppercase tracking-widest text-current/50">{slide.item.eyebrow}</p>
            <h3 className="font-inter text-subheading font-medium">{slide.item.title}</h3>
            <p className="line-clamp-2 font-inter text-sm text-current/70">{slide.item.description}</p>
            {slide.item.meta?.length ? (
              <p className="mt-1 font-inter text-xs text-current/50">{slide.item.meta.join(" → ")}</p>
            ) : null}
            <span className="mt-1 font-inter text-xs font-medium uppercase tracking-widest text-ember-pulse">
              View details →
            </span>
          </button>
        ),
      )}
      <DetailModal item={active} onClose={() => setActive(null)} />
    </div>
  );
}
