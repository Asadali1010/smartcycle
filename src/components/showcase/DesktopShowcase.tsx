import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";
import { ShowcaseCard, type CardParticleArtHandle } from "@/design-system";
import type { ShowcaseItem, ShowcaseSlide } from "./data";
import { DetailModal } from "./DetailModal";

gsap.registerPlugin(ScrollTrigger);

let instanceCounter = 0;

export interface DesktopShowcaseProps {
  slides: ShowcaseSlide[];
}

// How many neighboring slides on either side of the active one feel the
// arc — smaller values make the orbit tighter/faster, larger values spread
// it across more cards.
const ORBIT_RANGE = 1.15;
const ORBIT_LIFT = 32; // px risen at the peak of the arc
const ORBIT_ROTATE = 7; // deg tilt applied on the way in/out
const ORBIT_SCALE = 0.1; // extra scale at the peak of the arc
// Index-distance beyond which a card fades to fully transparent and goes
// inert — keeps exactly the active card plus one neighbor on each side
// (three cards total) legible at once instead of the whole track bleeding
// into view, and stops keyboard focus from landing on invisible cards.
const VISIBLE_RANGE = 1.2;
// How much vertical scroll (px) advances the sequence by one slide. Fixed
// rather than derived from track width, since every card now sits stacked
// at the same centered anchor point instead of flowing in a wide row.
const SLIDE_SCROLL_PX = 460;

/**
 * Pinned section that maps vertical scroll progress onto a centered card
 * carousel through the combined use-case / solution-domain slide list: every
 * card is anchored at the same center point and offset horizontally by its
 * distance from the active index, so the active slide always sits centered
 * while neighbors recede to either side (lift + tilt + scale + fade).
 * Registers and kills its own ScrollTrigger instance on mount/unmount
 * (self-contained, no dependency on src/components/scroll-story/**).
 */
export function DesktopShowcase({ slides }: DesktopShowcaseProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const artRefs = useRef<Array<CardParticleArtHandle | null>>([]);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<ShowcaseItem | null>(null);
  const idRef = useRef<string>(`showcase-scroll-${instanceCounter++}`);

  const domainsStartIndex = useMemo(
    () => Math.max(slides.findIndex((s) => s.taxonomy === "solution-domains"), 1),
    [slides],
  );

  // Resets to 01 at each taxonomy divider so the art-zone numeral reads as
  // a per-taxonomy ordinal rather than a raw slide index.
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

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const lastIndex = Math.max(slides.length - 1, 1);
    const totalDistance = Math.max((slides.length - 1) * SLIDE_SCROLL_PX, 1);

    gsap.set(cardRefs.current, { xPercent: -50, yPercent: -50 });

    const applyOrbitMotion = (positionInSlides: number) => {
      const spacing = Math.min(520, window.innerWidth * 0.5);
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const rawDistance = i - positionInSlides;
        const away = Math.abs(rawDistance);
        const localT = gsap.utils.clamp(-1, 1, -rawDistance / ORBIT_RANGE);
        const influence = Math.cos((localT * Math.PI) / 2);
        const opacity = gsap.utils.clamp(0, 1, 1 - away / VISIBLE_RANGE);
        gsap.set(card, {
          x: rawDistance * spacing,
          y: -ORBIT_LIFT * influence,
          rotate: localT * ORBIT_ROTATE,
          scale: 1 + ORBIT_SCALE * influence,
          opacity,
        });
        card.style.pointerEvents = opacity < 0.05 ? "none" : "";
        card.inert = opacity < 0.05;
        artRefs.current[i]?.setProgress(localT);
      });
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: idRef.current,
        trigger: section,
        start: "top top",
        end: `+=${totalDistance}`,
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setProgress(self.progress);
          applyOrbitMotion(self.progress * lastIndex);
        },
      });
      applyOrbitMotion(0);
    }, section);

    return () => ctx.revert();
  }, [slides.length]);

  const lastIndex = Math.max(slides.length - 1, 1);
  const currentIndex = Math.min(Math.round(progress * lastIndex), slides.length - 1);

  function goTo(index: number) {
    const clamped = Math.min(Math.max(index, 0), slides.length - 1);
    const st = ScrollTrigger.getById(idRef.current);
    if (!st) return;
    const target = st.start + (clamped / lastIndex) * (st.end - st.start);
    window.scrollTo({ top: target, behavior: "smooth" });
  }

  const useCaseSlideCount = domainsStartIndex;
  const domainSlideCount = slides.length - domainsStartIndex;
  const positionInSlides = progress * lastIndex;
  const useCaseFill = Math.min(positionInSlides / Math.max(useCaseSlideCount - 1, 1), 1);
  const domainFill = Math.min(
    Math.max((positionInSlides - useCaseSlideCount) / Math.max(domainSlideCount - 1, 1), 0),
    1,
  );

  return (
    <div ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-obsidian text-ivory">
      <div className="absolute inset-x-0 top-0 z-10 flex flex-col gap-4 px-gutter pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => goTo(0)}
              aria-current={currentIndex < domainsStartIndex ? "true" : undefined}
              className={clsx(
                "font-body text-xs font-medium uppercase tracking-[0.2em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral",
                currentIndex < domainsStartIndex ? "text-coral" : "text-current/50 hover:text-current",
              )}
            >
              Use Cases
            </button>
            <span aria-hidden="true" className="text-current/30">
              /
            </span>
            <button
              type="button"
              onClick={() => goTo(domainsStartIndex)}
              aria-current={currentIndex >= domainsStartIndex ? "true" : undefined}
              className={clsx(
                "font-body text-xs font-medium uppercase tracking-[0.2em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral",
                currentIndex >= domainsStartIndex ? "text-champagne" : "text-current/50 hover:text-current",
              )}
            >
              Solution Domains
            </button>
          </div>
          <p className="font-body text-xs uppercase tracking-widest text-current/50" aria-live="polite">
            {currentIndex + 1} / {slides.length}
          </p>
        </div>
        <div className="flex h-1 w-full overflow-hidden rounded-full bg-current/10">
          <div
            className="h-full bg-coral"
            style={{ width: `${useCaseFill * (useCaseSlideCount / slides.length) * 100}%` }}
          />
          <div
            className="h-full bg-champagne"
            style={{ width: `${domainFill * (domainSlideCount / slides.length) * 100}%` }}
          />
        </div>
      </div>

      <div ref={trackRef} className="relative h-full w-full">
        {slides.map((slide, i) => (
          <div
            key={slide.kind === "divider" ? `divider-${i}` : slide.item.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 h-[min(70svh,34rem)] w-[min(88vw,28rem)] will-change-transform"
          >
            {slide.kind === "divider" ? (
              <div className="flex h-full flex-col justify-center gap-3">
                <p
                  className={clsx(
                    "font-body text-xs font-medium uppercase tracking-[0.3em]",
                    slide.taxonomy === "use-cases" ? "text-coral" : "text-champagne",
                  )}
                >
                  Taxonomy
                </p>
                <h3 className="font-display text-display-sm">{slide.dividerTitle}</h3>
                <p className="font-body text-sm text-current/60">{slide.dividerBody}</p>
              </div>
            ) : (
              <ShowcaseCard
                index={itemOrdinals[i]}
                label={slide.taxonomy === "use-cases" ? "Use Case" : "Solution Domain"}
                eyebrow={slide.item.eyebrow}
                title={slide.item.title}
                description={slide.item.description}
                descriptionClassName="line-clamp-4"
                meta={slide.item.meta}
                onSelect={() => setActive(slide.item)}
                scrollLinked={false}
                artRef={(el) => {
                  artRefs.current[i] = el;
                }}
                className="h-full w-full"
              />
            )}
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-8 z-10 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          aria-label="Previous"
          className="rounded-full border border-current/30 p-3 disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === slides.length - 1}
          aria-label="Next"
          className="rounded-full border border-current/30 p-3 disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
        >
          →
        </button>
      </div>

      <DetailModal item={active} onClose={() => setActive(null)} />
    </div>
  );
}
