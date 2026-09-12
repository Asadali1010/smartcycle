import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";
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
const ORBIT_RANGE = 1.6;
const ORBIT_LIFT = 64; // px risen at the peak of the arc
const ORBIT_ROTATE = 9; // deg tilt applied on the way in/out
const ORBIT_SCALE = 0.07; // extra scale at the peak of the arc

/**
 * Pinned section that maps vertical scroll progress onto horizontal
 * translation through the combined use-case / solution-domain slide list,
 * with each slide additionally riding a circular arc (lift + tilt + scale)
 * as it passes through the center of the viewport.
 * Registers and kills its own ScrollTrigger instance on mount/unmount
 * (self-contained, no dependency on src/components/scroll-story/**).
 */
export function DesktopShowcase({ slides }: DesktopShowcaseProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<ShowcaseItem | null>(null);
  const idRef = useRef<string>(`showcase-scroll-${instanceCounter++}`);

  const domainsStartIndex = useMemo(
    () => Math.max(slides.findIndex((s) => s.taxonomy === "solution-domains"), 1),
    [slides],
  );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const lastIndex = Math.max(slides.length - 1, 1);

    const applyOrbitMotion = (positionInSlides: number) => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const localT = gsap.utils.clamp(-1, 1, (positionInSlides - i) / ORBIT_RANGE);
        const influence = Math.cos((localT * Math.PI) / 2);
        gsap.set(card, {
          y: -ORBIT_LIFT * influence,
          rotate: localT * ORBIT_ROTATE,
          scale: 1 + ORBIT_SCALE * influence,
        });
      });
    };

    const ctx = gsap.context(() => {
      const getDistance = () => Math.max(track.scrollWidth - section.clientWidth, 0);
      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          id: idRef.current,
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProgress(self.progress);
            applyOrbitMotion(self.progress * lastIndex);
          },
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

      <div ref={trackRef} className="flex h-full w-max items-center gap-6 px-gutter pt-24">
        {slides.map((slide, i) => (
          <div
            key={slide.kind === "divider" ? `divider-${i}` : slide.item.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="flex h-full w-[min(90vw,26rem)] shrink-0 items-center [transform-origin:center_bottom] will-change-transform"
          >
            {slide.kind === "divider" ? (
              <div className="flex flex-col gap-3">
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
              <button
                type="button"
                onClick={() => setActive(slide.item)}
                className="flex h-[70%] w-full flex-col gap-3 rounded-xl border border-current/15 p-6 text-left transition-colors hover:border-coral/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
              >
                <p className="font-body text-xs uppercase tracking-widest text-current/50">{slide.item.eyebrow}</p>
                <h3 className="font-display text-xl">{slide.item.title}</h3>
                <p className="line-clamp-4 font-body text-sm text-current/70">{slide.item.description}</p>
                {slide.item.meta?.length ? (
                  <p className="mt-auto font-body text-xs text-current/50">{slide.item.meta.join(" → ")}</p>
                ) : null}
                <span className="font-body text-xs font-medium uppercase tracking-widest text-coral">
                  View details →
                </span>
              </button>
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
