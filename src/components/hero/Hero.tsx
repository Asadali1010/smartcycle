/**
 * The homepage's immersive 3D hero: an R3F sculpture (Build → Govern →
 * Deploy) behind a headline/subheadline/trust-badges/CTA block that enters
 * concurrently with the 3D opening choreography, plus a keyboard-accessible
 * explode/reassemble interaction. Not yet wired into HomePage — that swap
 * happens in a later integration pass (forms-and-pages owns src/pages/**).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { motion, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { Badge, Button, SectionHeading } from "@/design-system";
import { home } from "@/content";
import { HeroScene } from "@/three/HeroScene";
import { CanvasFallback } from "@/three/CanvasFallback";
import { useWebGLSupport } from "@/three/useWebGLSupport";
import { useCanvasFrameloop } from "@/three/useCanvasFrameloop";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

/** Total explode-out → hold → reassemble duration target ("a couple seconds"). */
const EXPLODE_OUT = 0.9;
const EXPLODE_HOLD = 0.9;
const EXPLODE_BACK = 0.9;

export function Hero() {
  const hero = home.homeHero;
  const prefersReducedMotion = Boolean(useReducedMotion());
  const webglSupport = useWebGLSupport();

  // Perf: fully stop the R3F render loop while the hero is scrolled far
  // offscreen; resume it once it's back in (or near) view.
  const { containerRef, frameloop } = useCanvasFrameloop();

  const [explode, setExplode] = useState(0);
  const [isExploding, setIsExploding] = useState(false);
  const explodeTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    return () => {
      explodeTimelineRef.current?.kill();
    };
  }, []);

  const handleExplode = useCallback(() => {
    explodeTimelineRef.current?.kill();
    const proxy = { value: 0 };
    setIsExploding(true);
    const outDuration = prefersReducedMotion ? 0.01 : EXPLODE_OUT;
    const holdDuration = prefersReducedMotion ? 0.5 : EXPLODE_HOLD;
    const backDuration = prefersReducedMotion ? 0.01 : EXPLODE_BACK;

    const timeline = gsap.timeline({
      onComplete: () => setIsExploding(false),
    });
    timeline
      .to(proxy, {
        value: 1,
        duration: outDuration,
        ease: "power2.out",
        onUpdate: () => setExplode(proxy.value),
      })
      .to(proxy, { value: 1, duration: holdDuration })
      .to(proxy, {
        value: 0,
        duration: backDuration,
        ease: "power2.inOut",
        onUpdate: () => setExplode(proxy.value),
      });

    explodeTimelineRef.current = timeline;
  }, [prefersReducedMotion]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-surface-vivid-dark text-ivory">
      <div ref={containerRef} className="absolute inset-0">
        {webglSupport === "supported" ? (
          <Canvas
            frameloop={frameloop}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            camera={{ position: [0, 0.6, 8.2], fov: 45 }}
          >
            {/* No opaque scene background: alpha:true + the page's own
                bg-surface-vivid-dark gradient show through around the
                sculpture instead of a flat obsidian rectangle. */}
            <fog attach="fog" args={["#141215", 11, 24]} />
            <HeroScene explode={explode} />
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

      <motion.div
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-8 px-gutter pb-24 pt-40"
        variants={containerVariants}
        initial={prefersReducedMotion ? "visible" : "hidden"}
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <SectionHeading
            eyebrow={hero.eyebrow.value}
            heading={hero.headingLines.value.join(" ")}
            description={hero.subheading.value}
            level="h1"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
          {hero.badges.map((b) => (
            <Badge key={b.value} label={b.value} tone="outline" />
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
          <Button as={Link} to="/request-demo" variant="primary" size="lg">
            {hero.ctaPrimary.value}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleExplode}
            aria-pressed={isExploding}
            disabled={webglSupport !== "supported"}
          >
            See it come apart
          </Button>
        </motion.div>
        {webglSupport === "supported" ? (
          <motion.p variants={itemVariants} className="font-body text-xs uppercase tracking-widest text-current/40">
            Hover a module to inspect it
          </motion.p>
        ) : null}
      </motion.div>
    </section>
  );
}
