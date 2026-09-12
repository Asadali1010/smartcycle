# Homepage Motion Redesign — Design Spec

Date: 2026-09-12
Status: Approved by user, ready for planning

## Problem

The current hero animation (ambient auto-rotate of the whole sculpture + pointer-driven
parallax tilt) reads as generic — "shitty" per direct user feedback — not as a deliberate,
futuristic motion system. Separately, most of the homepage below the hero/scroll-story
(Execution Gap, Platform overview, How It Works, Integrations, ROI) currently has little to no
motion at all, and the two sections that do (Showcase, Timeline) use basic scroll-triggered
fades/fills unrelated to the 3D sculpture established in the hero.

The user wants every homepage section to have a distinctive, futuristic animation appropriate
to that section's content, while all of those animations read as part of one connected system
rather than nine unrelated effects.

## Scope

Homepage only (`/`), covering all sections currently composed in `src/pages/HomePage.tsx`:
Hero, ScrollStory, Execution Gap, Platform overview, How It Works, Integrations,
Use-Case Showcase, Delivery Timeline, ROI calculator. Inner pages (`/platform`, `/use-cases`,
etc.) are explicitly out of scope for this pass and may adopt the resulting motion signature in
a later follow-up.

## Architecture backbone

Two shared primitives carry the "related to each other" requirement across sections, without
paying for one always-mounted global WebGL canvas spanning the whole page:

### Shared scene store

`src/motion/sceneStore.ts` — a Zustand store (already an approved stack dependency) holding:

- `activeStage: number` — 0–1 Build→Govern→Deploy position, last value written by whichever
  WebGL section is currently active.
- `lastCameraPose: { position: [number, number, number]; lookAt: [number, number, number] }`
- `hoveredModuleIndex: number | null`
- `accentPulse: number` — 0–1, driven by content context (e.g. active use-case category in
  Showcase), consumed as an emissive/glow intensity multiplier.

Every section that mounts real WebGL (Hero, ScrollStory, Showcase, Timeline) reads this store on
mount to pick up where the sculpture last left off, and writes to it as its own scene evolves.
Each section keeps its own lightweight `<Canvas>` (reusing the existing
`useCanvasFrameloop`/offscreen-pause pattern from Hero) rather than one shared canvas — this
matches the codebase's existing per-section scene convention (`HeroScene` vs
`ScrollStoryScene` are already separate components coordinated by shared math in
`transforms.ts`/`cameraPath.ts`) and avoids the performance/complexity risk of a single
multi-viewport canvas.

### Shared motion signature

`src/motion/signature.ts` — one custom GSAP ease (architectural overshoot-then-settle, replacing
generic `power2.*` curves) and one stagger rhythm constant, imported by every animated section —
3D camera moves, 2D card/text reveals, hover states alike. This is what makes the plain 2D
sections feel authored by the same hand as the 3D ones.

## Section-by-section design

### Hero (`src/components/hero/Hero.tsx`, `src/three/HeroScene.tsx`)

Replaces the current ambient-auto-rotate + pointer-tilt opening with a "boot sequence":

1. Camera opens on an extreme close-up of the obsidian core (not today's wide establishing
   shot), holds briefly.
2. Modules arrive along visible coral trace-lines (a PCB-style routing reveal — lines draw in
   first, then the module travels along its line) rather than fading/drifting in from a
   scattered position.
3. Each module's arrival snaps into place using the new overshoot signature ease instead of
   `power2.out`.
4. Ambient idle motion changes from continuous rotation to a slow, near-imperceptible breathing
   scale on the core only — no more full-object spin.
5. Pointer parallax is kept but tightened (lower max angle) and re-eased through the signature
   curve.
6. The existing keyboard-accessible explode/reassemble button and interaction are unchanged —
   it already passed full verification (WebGL/reduced-motion/fallback/keyboard paths).

On mount, Hero writes its resolved end-state (`activeStage = 1`, resting camera pose) into
`sceneStore` so ScrollStory can pick up from exactly where Hero left off.

### ScrollStory (`src/components/scroll-story/**`, `src/three/ScrollStoryScene.tsx`)

Unchanged in kind — still a pure function of GSAP ScrollTrigger progress driving `stage` through
`SculptureModel`/`cameraPath.ts`. Two changes: (1) reads `sceneStore.lastCameraPose`/`activeStage`
on mount instead of always starting cold, so the handoff from Hero is seamless; (2) camera easing
switches to the shared signature curve.

### Execution Gap (2D, no WebGL)

Problem stat renders with a coral strike-through line that draws itself in via SVG
`stroke-dashoffset` as the card scrolls into view; the solution stat then wipes in beneath it
(clip-path reveal) — visually "a correction being made live," matching the content's own
problem→solution framing.

### Platform overview (2D, no WebGL)

Feature list items assemble as small chip/module glyphs that slot into a horizontal rail on
scroll-in, echoing the sculpture's module silhouette at 2D scale. Feature names use masked type
reveals (already an established technique per project constraints), staggered per the shared
rhythm constant.

### How It Works (2D, no WebGL)

A PCB-trace-style progress rail draws down the page as the viewer passes each step (GSAP
ScrollTrigger scrub on an SVG path), with the step's number lighting coral on entry. Applies to
both the 4-step and 5-step lists independently, keeping their existing "two independently sourced
descriptions" framing intact.

### Integrations (2D, no WebGL)

Cards enter staggered per the shared rhythm; hovering a card draws thin coral connection lines
(SVG, absolutely positioned) to related cards, reinforcing the "ecosystem" framing already in the
copy.

### Use-Case Showcase (WebGL, lightweight motif)

Keeps its existing pinned horizontal-scroll mechanics. Adds one drifting glass module (not the
full multi-module sculpture) as ambient backdrop behind the scroll track, reusing
`createGlassModulePreset`/`PALETTE` from `src/three/materials.ts`. Its emissive intensity is
driven by `sceneStore.accentPulse`, which the showcase sets based on the currently active
use-case category as the user scrolls horizontally — "the same object, glimpsed differently."

### Delivery Timeline (WebGL, lightweight motif)

Adds a thin 3D extruded build-path line behind the existing phase grid, with the camera drifting
slowly along it as the section scrolls (reusing `cameraPath.ts`'s interpolation approach at a
smaller, section-local scale — not the same literal path instance as ScrollStory). Coral sphere
markers along the path light up as each of the 12 months is scrolled past, replacing/augmenting
today's flat fill-bar.

### ROI calculator (2D, no WebGL)

Sliders continue driving `useAnimatedNumber`; output cards are replaced with a radial coral gauge
per stat. On value change, the gauge plays a brief "recalculating" scan-flicker (opacity/skew
pulse, signature-eased) before settling on the new value — motion driven by the data changing,
not ambient decoration.

## Guardrails (unchanged project constraints — reaffirmed here for this feature)

- Every new animation has a `prefers-reduced-motion` fallback that renders the same final
  content/state with no motion — this includes the new SVG line-draws, glyph assembly, and both
  new WebGL motifs.
- Full keyboard operability and visible focus states are preserved on every interactive element
  touched (explode button, ROI sliders, showcase controls).
- The WebGL-unavailable fallback (`CanvasFallback`) is extended to cover Showcase's and
  Timeline's new canvases, not just Hero's.
- No console errors; production build (`npm run build` or project equivalent) must succeed after
  each section's change.
- Content/copy is unaffected — this is a motion-only pass; no `src/content/**` changes.
- Palette discipline is unchanged: coral for emphasis/live-state, champagne for chassis/trim,
  violet reserved for governance/trust motifs — the new motion must not introduce new colors or
  reintroduce blue/cyan.

## Build order

1. `design-system` — add the shared motion signature (`src/motion/signature.ts`) and any new
   reusable primitives (SVG line-draw helper, glyph/chip component) needed by multiple sections.
2. `three-d-hero` — hero boot-sequence rebuild, `sceneStore` creation and Hero's read/write of it.
3. `scroll-choreography` — ScrollStory's `sceneStore` handoff + signature easing; the four 2D
   sections (Execution Gap, Platform, How It Works, Integrations).
4. `showcase-and-timeline` — Showcase's drifting-module motif, Timeline's build-path motif, ROI's
   radial gauge.

Steps run mostly in sequence since steps 2–4 depend on the shared signature/store from step 1,
and step 3's ScrollStory handoff depends on step 2's `sceneStore` shape.

## Out of scope

- Inner pages (`/platform`, `/use-cases`, `/why-smartcycleai`, `/about`, persona pages, `/contact`,
  `/request-demo`, `/privacy`, `/terms`) — follow-up pass once this motion language is proven on
  the homepage.
- Chatbot widget motion — owned by a separate agent/concern, untouched here.
- Any content or copy changes.
- A single global multi-viewport WebGL canvas (considered and explicitly rejected in favor of
  per-section canvases coordinated by `sceneStore`, matching existing codebase conventions and
  keeping GPU cost bounded).
