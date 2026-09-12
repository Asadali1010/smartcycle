import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";
import { deliveryModel } from "@/content";

gsap.registerPlugin(ScrollTrigger);

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false,
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * Animates the 12-month delivery model as a progressing timeline: a fill
 * bar that scrubs in as the section scrolls into view, plus a per-phase
 * stagger reveal — pure progressive enhancement. The phase grid itself
 * (name, month range, description, milestones, both lanes) is always
 * rendered as real markup regardless of whether the animation plays, so
 * `prefers-reduced-motion` or a screen reader gets the complete 12-month
 * model, not just an animated bar.
 */
export function DeliveryTimeline() {
  const section = deliveryModel.deliveryModelSection;
  const phases = deliveryModel.deliveryPhases;
  const prefersReducedMotion = usePrefersReducedMotion();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const fill = fillRef.current;
    if (!container || !fill || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(fill, { scaleX: 0 });
      gsap.to(fill, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
          end: "bottom 60%",
          scrub: 0.6,
        },
      });

      cardRefs.current.forEach((card) => {
        if (!card) return;
        gsap.set(card, { opacity: 0, y: 24 });
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={containerRef} className="flex flex-col gap-10">
      <div className="flex flex-wrap gap-2">
        {section.macroStages.map((stage) => (
          <span
            key={stage.value}
            className="rounded-full border border-current/20 px-4 py-1.5 font-body text-xs uppercase tracking-widest text-current/60"
          >
            {stage.value}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between font-body text-xs uppercase tracking-widest text-current/50">
          <span>{section.axisLabels.capabilityLow.value}</span>
          <span>{section.axisLabels.capabilityHigh.value}</span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-current/10">
          <div
            ref={fillRef}
            className={clsx(
              "h-full w-full origin-left bg-gradient-to-r from-coral to-champagne",
              prefersReducedMotion && "scale-x-100",
            )}
          />
        </div>
        <div className="flex items-center justify-between font-body text-xs uppercase tracking-widest text-current/50">
          <span>{section.axisLabels.increasingCapability.value}</span>
          <span>{section.axisLabels.decreasingDependency.value}</span>
        </div>
      </div>

      <ol className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {phases.map((phase, i) => (
          <li
            key={phase.name.value}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="flex flex-col gap-4 rounded-xl border border-current/15 p-6"
          >
            <div className="flex items-center gap-3">
              <span className="font-display text-3xl text-coral">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-lg">{phase.name.value}</h3>
                <p className="font-body text-xs uppercase tracking-widest text-current/50">{phase.monthRange.value}</p>
              </div>
            </div>
            <p className="font-body text-sm text-current/70">{phase.description.value}</p>
            <ul className="flex flex-col gap-1.5 font-body text-xs text-current/60">
              {phase.milestones.map((m) => (
                <li key={m.value}>— {m.value}</li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-1 border-t border-current/10 pt-3 font-body text-xs">
              <span className="text-champagne">SmartCycleAI: {phase.lanes.smartCycleAI.value}</span>
              <span className="text-current/60">Your Team: {phase.lanes.yourTeam.value}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
