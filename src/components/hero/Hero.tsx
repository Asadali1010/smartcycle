/**
 * The homepage's immersive 3D hero: a particle-brain (BrainField, via
 * HeroScene) that continuously assembles/holds/disassembles on a seamless
 * loop, behind a headline/subheadline/trust-badges/CTA block. Not yet wired
 * into HomePage — that swap happens in a later integration pass
 * (forms-and-pages owns src/pages/**).
 */
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Badge, Button, SectionHeading } from "@/design-system";
import { home } from "@/content";
import { HeroScene } from "@/three/HeroScene";
import { CanvasFallback } from "@/three/CanvasFallback";
import { useWebGLSupport } from "@/three/useWebGLSupport";
import { useCanvasFrameloop } from "@/three/useCanvasFrameloop";

export function Hero() {
  const hero = home.homeHero;
  const webglSupport = useWebGLSupport();

  // Perf: fully stop the R3F render loop while the hero is scrolled far
  // offscreen; resume it once it's back in (or near) view.
  const { containerRef, frameloop } = useCanvasFrameloop();

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-surface-vivid-dark text-ivory">
      <div ref={containerRef} className="absolute inset-0">
        {webglSupport === "supported" ? (
          <Canvas
            frameloop={frameloop}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            camera={{ position: [0, 0.15, 3.4], fov: 45 }}
          >
            {/* No opaque scene background: alpha:true + the page's own
                bg-surface-vivid-dark gradient show through around the
                brain instead of a flat obsidian rectangle. No <fog> here —
                BrainField's custom shader material doesn't sample scene
                fog, so it would be inert. */}
            <HeroScene />
          </Canvas>
        ) : (
          <CanvasFallback className="mx-auto h-full max-h-[640px] w-full max-w-2xl opacity-70" />
        )}
        {/* Legibility scrim so headline/CTA stay readable over the sculpture:
            a vertical fade (stronger toward the bottom text block) layered
            with a horizontal fade (stronger over the left column, where the
            headline/CTA column sits) so the sculpture reads clearly on the
            right/upper region without ever competing with the copy. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/35 to-obsidian/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-obsidian/75 via-obsidian/25 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-8 px-gutter pb-24 pt-40">
        <SectionHeading
          eyebrow={hero.eyebrow.value}
          heading={hero.headingLines.value.join(" ")}
          description={hero.subheading.value}
          level="h1"
        />

        <div className="flex flex-wrap gap-3">
          {hero.badges.map((b) => (
            <Badge key={b.value} label={b.value} tone="outline" />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button as={Link} to="/request-demo" variant="primary" size="lg">
            {hero.ctaPrimary.value}
          </Button>
        </div>
        {webglSupport === "supported" ? (
          <p className="font-body text-xs uppercase tracking-widest text-current/40">Drag to rotate, scroll to zoom</p>
        ) : null}
      </div>
    </section>
  );
}
