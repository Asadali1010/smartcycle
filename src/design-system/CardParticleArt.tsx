import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export interface CardParticleArtHandle {
  /**
   * Drive the art directly with a -1..1 distance-from-active value (0 =
   * centered/active, ±1 = a full slide away). Used by ancestors that already
   * track scroll progress themselves, e.g. a pinned GSAP carousel — bypasses
   * this component's own scroll listener.
   */
  setProgress: (t: number) => void;
}

export interface CardParticleArtProps {
  /** Selects the procedural point-cloud shape: 0 = sphere, 1 = helix band, 2 = stacked rings. */
  variant?: 0 | 1 | 2;
  className?: string;
  /**
   * When true (default), the component tracks its own position in the
   * viewport as the page scrolls and derives progress from that. Set to
   * false when an ancestor drives it imperatively via a ref instead.
   */
  scrollLinked?: boolean;
}

const POINT_COUNT = 260;
const TAU = Math.PI * 2;
const ROTATE_RANGE = 0.9; // radians of tumble across the full -1..1 progress sweep

interface ArtPoint {
  x: number;
  y: number;
  z: number;
}

function buildPoints(variant: number): ArtPoint[] {
  const points: ArtPoint[] = [];
  for (let i = 0; i < POINT_COUNT; i++) {
    let x = 0;
    let y = 0;
    let z = 0;
    if (variant === 0) {
      // Fibonacci sphere.
      y = 1 - (2 * i) / POINT_COUNT;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const a = i * 2.39996323;
      x = Math.cos(a) * r;
      z = Math.sin(a) * r;
    } else if (variant === 1) {
      // Three-strand twisted helix band.
      const band = i % 3;
      const u = Math.floor(i / 3) / (POINT_COUNT / 3);
      const a = u * TAU * 1.7 + (band * TAU) / 3;
      x = (u - 0.5) * 2.5;
      y = Math.sin(a) * 0.6;
      z = Math.cos(a) * 0.6;
    } else {
      // Three stacked rings.
      const perRing = POINT_COUNT / 3;
      const layer = Math.min(2, Math.floor(i / perRing));
      const a = ((i % perRing) / perRing) * TAU;
      x = Math.cos(a) * 0.86;
      y = (layer - 1) * 0.49;
      z = Math.sin(a) * 0.86;
    }
    points.push({ x, y, z });
  }
  return points;
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/**
 * Scroll-driven procedural particle art for a card's header zone — a fully
 * formed point-cloud (sphere / helix / rings) rendered on canvas 2D that
 * tumbles as the card nears the active/centered position (or a
 * caller-supplied progress value). The shape itself is always complete and
 * legible; only its rotation and brightness respond to progress, so there is
 * never a half-scattered, illegible frame. No animation clock — like the
 * reference, scroll progress alone determines the frame.
 */
export const CardParticleArt = forwardRef<CardParticleArtHandle, CardParticleArtProps>(function CardParticleArt(
  { variant = 0, className, scrollLinked = true },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawRef = useRef<(t: number) => void>(() => {});
  const lastProgressRef = useRef(0);

  useImperativeHandle(
    ref,
    () => ({
      setProgress(t: number) {
        lastProgressRef.current = t;
        drawRef.current(t);
      },
    }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const points = buildPoints(variant);
    let width = 1;
    let height = 1;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width || 1;
      height = rect.height || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(t: number) {
      const clamped = clamp(t, -1, 1);
      const angle = clamped * ROTATE_RANGE;
      const dim = 1 - Math.abs(clamped) * 0.35; // slight dim as the card recedes; the card's own opacity does the rest
      ctx!.clearRect(0, 0, width, height);
      const co = Math.cos(angle);
      const si = Math.sin(angle);
      const tilt = 0.32;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      const scale = Math.min(width, height) * 0.42;
      ctx!.globalCompositeOperation = "lighter";
      for (const p of points) {
        const rx = p.x * co + p.z * si;
        const rz = p.z * co - p.x * si;
        const ry = p.y * ct - rz * st;
        const depth = rz * ct + p.y * st;
        const perspective = 3.2 / Math.max(1.2, 3.2 - depth);
        const px = width / 2 + rx * scale * perspective;
        const py = height * 0.54 + ry * scale * perspective;
        const size = Math.max(0.7, (1.6 + depth * 0.6) * perspective);
        const alpha = Math.min(0.95, Math.max(0.18, (0.5 + depth * 0.32) * dim));
        ctx!.beginPath();
        ctx!.fillStyle = depth > 0.1 ? `rgba(155,111,201,${alpha})` : `rgba(255,148,120,${alpha})`;
        ctx!.arc(px, py, size, 0, TAU);
        ctx!.fill();
      }
      ctx!.globalCompositeOperation = "source-over";
    }

    drawRef.current = draw;
    resize();
    draw(lastProgressRef.current);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(lastProgressRef.current);
    });
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      drawRef.current = () => {};
    };
  }, [variant]);

  useEffect(() => {
    if (!scrollLinked) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      lastProgressRef.current = 0;
      drawRef.current(0);
      return;
    }

    let ticking = false;
    function computeAndDraw() {
      ticking = false;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      const elementCenter = rect.top + rect.height / 2;
      const t = clamp((elementCenter - viewportH / 2) / (viewportH / 2 + rect.height / 2), -1, 1);
      lastProgressRef.current = t;
      drawRef.current(t);
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(computeAndDraw);
    }

    computeAndDraw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [scrollLinked]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
});
