import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import clsx from "clsx";
import { SIGNATURE_EASE, staggerDelay } from "@/motion/signature";

gsap.registerPlugin(ScrollTrigger);

export interface StepListItem {
  key: string;
  name: string;
  description?: string | null;
}

export interface StepListProps {
  steps: StepListItem[];
  className?: string;
  footnote?: ReactNode;
  /**
   * When true, each step's left border and numeral light up ember-pulse in
   * sequence as the list scrolls into view (a PCB-trace-style "process
   * executing" reveal) instead of rendering statically. Defaults to false
   * so existing callers (platform how-it-works, delivery timeline, contact
   * process) are unaffected.
   */
  traced?: boolean;
}

/**
 * Plain numbered process list (used for the homepage's 4-step and
 * /platform's 5-step "How It Works", the delivery-model phases, and the
 * contact process), with an opt-in `traced` reveal for sections that want
 * it to read as a process actively executing rather than a static list.
 */
export function StepList({ steps, className, footnote, traced = false }: StepListProps) {
  const listRef = useRef<HTMLOListElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!traced || !list || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      itemRefs.current.forEach((item, i) => {
        if (!item) return;
        const numeral = item.querySelector<HTMLElement>("[data-trace-numeral]");
        gsap.set(item, { borderColor: "rgba(107, 108, 109, 0.4)" });
        if (numeral) gsap.set(numeral, { scale: 0.85, opacity: 0.5 });

        const scrollTrigger = { trigger: item, start: "top 85%", toggleActions: "play none none reverse" } as const;
        gsap.to(item, {
          borderColor: "#ff8964",
          duration: 0.5,
          ease: SIGNATURE_EASE,
          delay: staggerDelay(i, 0.06),
          scrollTrigger,
        });
        if (numeral) {
          gsap.to(numeral, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: SIGNATURE_EASE,
            delay: staggerDelay(i, 0.06),
            scrollTrigger,
          });
        }
      });
    }, list);

    return () => ctx.revert();
  }, [traced, prefersReducedMotion]);

  return (
    <div className={clsx("flex flex-col gap-8", className)}>
      <ol ref={listRef} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li
            key={step.key}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="flex flex-col gap-3 border-l-2 border-iron-veil/40 pl-5"
          >
            <span data-trace-numeral className="font-esbuild text-3xl text-ember-pulse">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-inter text-lg font-semibold">{step.name}</h3>
            {step.description ? (
              <p className="font-inter text-sm leading-relaxed text-current/70">{step.description}</p>
            ) : null}
          </li>
        ))}
      </ol>
      {footnote}
    </div>
  );
}
