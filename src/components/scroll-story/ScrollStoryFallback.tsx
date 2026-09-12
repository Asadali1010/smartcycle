/**
 * Accessible fallback for the pinned 3D scroll sequence: reduced motion, no
 * WebGL, or a narrow viewport. Renders the same three Build/Govern/Deploy
 * panels as plain stacked content with the existing static CanvasFallback
 * illustration and a simple whileInView crossfade — no pinning, no
 * scroll-scrubbed camera, no continuous animation loop.
 */
import { motion, useReducedMotion } from "motion/react";
import { Badge } from "@/design-system";
import { CanvasFallback } from "@/three/CanvasFallback";
import { getStoryPanels } from "./storyContent";
import type { StoryPanel } from "./storyContent";

const ACCENT_TEXT: Record<StoryPanel["accent"], string> = {
  coral: "text-coral",
  violet: "text-violet",
  champagne: "text-champagne",
};

export function ScrollStoryFallback() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const panels = getStoryPanels();

  return (
    <section className="w-full bg-surface-vivid-dark py-section-md text-ivory">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-section-sm px-gutter">
        {panels.map((panel) => (
          <motion.div
            key={panel.key}
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 items-center gap-8 md:grid-cols-2"
          >
            <CanvasFallback className="mx-auto h-56 w-56 opacity-80" />
            <div className="flex flex-col gap-3">
              <p className={`font-body text-xs uppercase tracking-widest ${ACCENT_TEXT[panel.accent]}`}>{panel.eyebrow}</p>
              <h3 className="font-display text-display-sm">{panel.heading}</h3>
              <p className="max-w-md font-body text-sm text-current/70">{panel.body}</p>
              <div className="flex flex-wrap gap-2">
                {panel.chips.map((chip) => (
                  <Badge key={chip} label={chip} tone="subtle" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
