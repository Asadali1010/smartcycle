/**
 * One problem/solution pair from the homepage's "Execution Gap" section,
 * rendered so the correction reads as happening live: the problem stat gets
 * struck through by a coral line that draws itself in (SVG
 * stroke-dashoffset), then the solution block wipes in beneath it
 * (clip-path). Matches the section's own problem→solution framing instead
 * of a generic fade-in.
 */
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { SIGNATURE_EASE } from "@/motion/signature";

gsap.registerPlugin(ScrollTrigger);

export interface ExecutionGapPairProps {
  problemLabel: string;
  problemStat: string;
  problemDescription: string;
  solutionLabel: string;
  solutionStat: string;
  solutionQualifier?: string;
  solutionDescription: string;
}

export function ExecutionGapPair({
  problemLabel,
  problemStat,
  problemDescription,
  solutionLabel,
  solutionStat,
  solutionQualifier,
  solutionDescription,
}: ExecutionGapPairProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const strikeRef = useRef<SVGLineElement | null>(null);
  const solutionRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useLayoutEffect(() => {
    const root = rootRef.current;
    const strike = strikeRef.current;
    const solution = solutionRef.current;
    if (!root || !strike || !solution || prefersReducedMotion) return;

    const length = strike.getTotalLength();
    gsap.set(strike, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(solution, { clipPath: "inset(0 100% 0 0)" });

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: "top 75%", toggleActions: "play none none reverse" } })
        .to(strike, { strokeDashoffset: 0, duration: 0.5, ease: SIGNATURE_EASE })
        .to(solution, { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: SIGNATURE_EASE }, "-=0.15");
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={rootRef} className="flex flex-col gap-4 rounded-lg border border-current/15 p-6">
      <div>
        <p className="font-body text-xs uppercase tracking-widest text-current/50">{problemLabel}</p>
        <p className="relative inline-block font-display text-xl text-current/60">
          {problemStat}
          {/*
            Bounded to one line-height (not h-full/inset-0) so the strike lands on the
            first line even if problemStat wraps to two lines on narrow viewports — real
            content includes long stats like "$2.4M Average Project Cost". text-xl has no
            project-specific override (see src/index.css @theme), so it resolves to
            Tailwind's default 1.75rem (28px) line-height, i.e. h-7.
          */}
          <svg className="pointer-events-none absolute inset-x-0 top-0 h-7 w-full overflow-visible" aria-hidden="true">
            <line x1="0" y1="50%" x2="100%" y2="50%" ref={strikeRef} stroke="currentColor" strokeWidth="2" className="text-coral" />
          </svg>
        </p>
        <p className="mt-1 font-body text-sm text-current/60">{problemDescription}</p>
      </div>
      <div ref={solutionRef} className="border-t border-current/10 pt-4">
        <p className="font-body text-xs uppercase tracking-widest text-coral">{solutionLabel}</p>
        <p className="font-display text-xl text-coral">
          {solutionQualifier ? `${solutionQualifier} ` : ""}
          {solutionStat}
        </p>
        <p className="mt-1 font-body text-sm text-current/70">{solutionDescription}</p>
      </div>
    </div>
  );
}
