/**
 * The homepage's pinned scroll sequence: continues the hero's Build -> Govern
 * -> Deploy sculpture into a scroll-scrubbed recap, one section per product
 * pillar, using the same GSAP ScrollTrigger pin/scrub pattern established in
 * DesktopShowcase (trigger/scrub/pin/anticipatePin/invalidateOnRefresh).
 * Copy per stage comes from storyContent.ts (sourced homepage content) —
 * this file only owns layout, camera/scroll wiring, and crossfade timing.
 */
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";
import { Badge, MaskedReveal } from "@/design-system";
import { home } from "@/content";
import { SIGNATURE_EASE_ARRAY } from "@/motion/signature";
import { ScrollStoryScene } from "@/three/ScrollStoryScene";
import { useCanvasFrameloop } from "@/three/useCanvasFrameloop";
import { getStoryPanels } from "./storyContent";
import type { StoryPanel } from "./storyContent";

gsap.registerPlugin(ScrollTrigger);

const ACCENT_TEXT: Record<StoryPanel["accent"], string> = {
  ember: "text-ember-pulse",
  iris: "text-electric-iris",
  neutral: "text-ash",
};
const ACCENT_BG: Record<StoryPanel["accent"], string> = {
  ember: "bg-ember-pulse",
  iris: "bg-electric-iris",
  neutral: "bg-ash",
};

export function ScrollStoryPinned() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { containerRef, frameloop } = useCanvasFrameloop();
  const [stage, setStage] = useState(0);
  const panels = useMemo(() => getStoryPanels(), []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * 2.5}`,
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => setStage(self.progress),
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const zoneIndex = Math.min(panels.length - 1, Math.floor(stage * panels.length));
  const activePanel = panels[zoneIndex];

  return (
    <div ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-obsidian-canvas text-snow">
      <div ref={containerRef} className="absolute inset-0">
        <Canvas frameloop={frameloop} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} camera={{ fov: 45 }}>
          <ScrollStoryScene stage={stage} />
        </Canvas>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian-canvas via-obsidian-canvas/30 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-obsidian-canvas/15 to-obsidian-canvas/70" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-between px-gutter py-16">
        <div className="flex flex-wrap items-center gap-3">
          {panels.map((panel, i) => (
            <div key={panel.key} className="flex items-center gap-3">
              {i > 0 ? <span className="text-current/25">→</span> : null}
              <span
                className={clsx(
                  "font-inter text-caption font-medium uppercase tracking-[0.2em] transition-colors",
                  i === zoneIndex ? ACCENT_TEXT[panel.accent] : "text-current/40",
                )}
              >
                {panel.label}
              </span>
            </div>
          ))}
        </div>

        <div className="ml-auto flex w-full max-w-md flex-col gap-5 text-right">
          <div className="flex h-1 w-full overflow-hidden rounded-full bg-current/10">
            {panels.map((panel, i) => (
              <div
                key={panel.key}
                className={clsx("h-full transition-opacity", ACCENT_BG[panel.accent], i === zoneIndex ? "opacity-100" : "opacity-20")}
                style={{ width: `${100 / panels.length}%` }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: SIGNATURE_EASE_ARRAY }}
              className="flex flex-col items-end gap-3"
            >
              <p className={clsx("font-inter text-caption font-medium uppercase tracking-widest", ACCENT_TEXT[activePanel.accent])}>
                {activePanel.eyebrow}
              </p>
              <h3 className="font-esbuild text-display-sm">
                <MaskedReveal active mode="word">
                  {activePanel.heading}
                </MaskedReveal>
              </h3>
              <p className="max-w-sm font-inter text-body text-current/70">{activePanel.body}</p>
              <div className="flex flex-wrap justify-end gap-2">
                {activePanel.chips.map((chip) => (
                  <Badge key={chip} label={chip} tone="subtle" />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="font-inter text-caption font-medium uppercase tracking-widest text-current/35">
            {home.platformSection.flowLabel.value}
          </p>
        </div>
      </div>
    </div>
  );
}
