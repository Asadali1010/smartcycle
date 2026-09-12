/**
 * Integration Ecosystem grid: cards enter staggered, and hovering a card
 * draws thin coral connection lines to the other cards sharing its real
 * content `category` (not a fabricated relationship) — reinforcing the
 * "ecosystem" framing already in the copy.
 */
import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Badge } from "@/design-system";
import { SIGNATURE_EASE_ARRAY, staggerDelay } from "@/motion/signature";

export interface IntegrationNetworkItem {
  name: string;
  category: string;
  description: string;
  tags: string[];
}

export interface IntegrationNetworkProps {
  items: IntegrationNetworkItem[];
}

interface ConnectionLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function IntegrationNetwork({ items }: IntegrationNetworkProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [lines, setLines] = useState<ConnectionLine[]>([]);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (hovered === null || !container || prefersReducedMotion) {
      setLines([]);
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const source = cardRefs.current[hovered];
    if (!source) {
      setLines([]);
      return;
    }
    const sourceRect = source.getBoundingClientRect();
    const sourceCenter = {
      x: sourceRect.left + sourceRect.width / 2 - containerRect.left,
      y: sourceRect.top + sourceRect.height / 2 - containerRect.top,
    };
    const relatedIndexes = items
      .map((_item, i) => i)
      .filter((i) => i !== hovered && items[i].category === items[hovered].category);

    setLines(
      relatedIndexes
        .map((i) => cardRefs.current[i])
        .filter((el): el is HTMLDivElement => Boolean(el))
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            x1: sourceCenter.x,
            y1: sourceCenter.y,
            x2: rect.left + rect.width / 2 - containerRect.left,
            y2: rect.top + rect.height / 2 - containerRect.top,
          };
        }),
    );
  }, [hovered, items, prefersReducedMotion]);

  return (
    <div ref={containerRef} className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-coral" aria-hidden="true">
        {lines.map((line, i) => (
          <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        ))}
      </svg>
      {items.map((item, i) => (
        <motion.div
          key={item.name}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
          animate={active || prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: SIGNATURE_EASE_ARRAY, delay: staggerDelay(i) }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered((current) => (current === i ? null : current))}
          className="flex flex-col gap-2 rounded-lg border border-current/15 p-6 transition-colors hover:border-coral/40"
        >
          <p className="font-body text-xs uppercase tracking-widest text-champagne">{item.category}</p>
          <h3 className="font-display text-xl">{item.name}</h3>
          <p className="font-body text-sm text-current/70">{item.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} label={tag} tone="subtle" />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
