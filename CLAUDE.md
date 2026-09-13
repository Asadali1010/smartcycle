# SmartCycleAI Redesign — Orchestrator

This file is the build orchestrator for a from-scratch local redesign of the SmartCycleAI public
marketing site (content source: https://smartcycle.ai/, motion/interaction reference:
https://trionn.com/). Stack: React 18 + TypeScript + Vite + Tailwind CSS, React Three Fiber for
the 3D sculpture, GSAP/ScrollTrigger + Lenis for scroll choreography, Framer Motion for
component-level motion, Zustand for shared scene state, react-hook-form + zod for forms, and an
isolated `server/` Express stub for a future live chatbot backend.

Full plan: `/Users/apple/.claude/plans/build-a-complete-local-streamed-avalanche.md`.

## Non-negotiable constraints (apply to every subagent below)

- **Content is sourced, never invented.** All copy/facts live in `src/content/*.ts`, typed as
  `SourcedFact<T>` with a `sourceUrl`. No component may hardcode a fact that belongs in content.
- **Palette (v3, Huly design system — supersedes v2's coral/champagne/violet pass per
  `/Users/apple/.claude/plans/foamy-spinning-giraffe.md`; do not revert to v2)**: obsidian-canvas
  `#303236` and void `#090a0c` are the dominant dark surfaces (charcoal-card `#111111` for
  elevated panels); snow `#FFFFFF` / linen `#E5E5E7` / frost `#D1D1D1` are the light-mode
  surfaces/borders; slate-edge `#4A4B50` / iron-veil `#6B6C6D` / smoke `#95979E` / ash `#A9A9AA`
  are neutral grays for borders, dividers and secondary/tertiary text. Electric Iris `#5683DA`
  (primary action, active nav indicator, hero aurora cool stop) and Ember Pulse `#FF8964`
  (secondary accent, hero aurora warm stop, notification dot) — with molasses `#5A250A` as a
  deep ember tone for dark-context borders/tag fills — are the two color anchors; never introduce
  a third accent beyond Electric Iris/Ember Pulse — that pair is the entire chromatic vocabulary.
  Fonts: Inter for all functional UI text, and Sora as the "Esbuild" display-font substitute
  (Esbuild itself isn't a distributable font; Sora is design.md's own named substitute) for large
  editorial headings only — never below 28px. Radius: `9999px` for controls/tags/buttons, `12px`
  for cards, `4px` for inputs, `30px` for large panels. An aurora/sunburst accent effect appears
  once per page at most (hero only gets the full `bg-aurora-hero` vertical beam) and never as a
  full-surface wash; other feature-highlight sections use the single low-opacity
  `bg-radial-sunburst` corner glow instead. Gradient text (`text-gradient-signature`) is a
  scarce, single-use device — not a default heading treatment.
- **Original geometry/assets only.** Do not reproduce Trionn's logo, sculpture, or copy — only
  the *behavior* (assembly/disassembly, pinned horizontal scroll, masked type reveals, dark/light
  scene transitions, letter-roll hovers).
- **Accessibility is not optional**: `prefers-reduced-motion` fallback for every motion-heavy
  section, full keyboard operability + visible focus states, WebGL-unavailable fallback, no
  console errors, production build must succeed at every phase gate from phase 2 onward.
- **Known content gaps** (`src/content/gaps.ts`) must be surfaced in the UI where relevant, never
  silently resolved: obfuscated contact email, `/request-demo` 307 redirect, 4-step vs 5-step
  workflow, 73% vs 57% cost-reduction figures, 10-domain vs 4-category use-case taxonomies.
- **Chatbot**: local demo mode must work with zero API keys and must always be visibly labeled as
  local/demo. Never collect patient information. Never fabricate a "live AI" impression from
  scripted responses. Server-side credentials never touch client code.
- **Forms**: never show a fabricated success state — there is no real backend. Always show the
  "local prototype, not transmitted" disclosure.

## Subagents (`.claude/agents/`)

| Agent | Owns | Depends on |
|---|---|---|
| `content-curator` | `src/content/**` | — (runs first) |
| `design-system` | `tailwind.config`/CSS tokens, `src/design-system/**` | content-curator |
| `three-d-hero` | `src/three/**`, `src/components/hero/**` | design-system |
| `chatbot-builder` | `src/components/chatbot/**`, `server/**` | design-system (parallel with three-d-hero) |
| `scroll-choreography` | `src/motion/**`, `src/components/scroll-story/**`, typography motion, nav overlay | three-d-hero |
| `showcase-and-timeline` | `src/components/showcase/**`, `timeline/**`, `roi/**` | design-system (parallel with three-d-hero/scroll-choreography) |
| `forms-and-pages` | `src/pages/**`, `src/components/forms/**`, `router.tsx`, layout | everything above |
| `qa-performance` | `qa/**`, final verification | everything above |

Hand-off graph: `content-curator → design-system → {three-d-hero, chatbot-builder} →
{scroll-choreography, showcase-and-timeline} → forms-and-pages → qa-performance`.
`chatbot-builder` and `showcase-and-timeline` only need `design-system` and may run in parallel
with the 3D/scroll work.

## Phased build order

0. Scaffold (this commit) — Vite+React+TS+Tailwind, router skeleton, git init.
1. Content + design tokens.
2. Static pages (all 12 routes, full real content, no motion yet) — de-risks completeness early.
3. 3D hero.
4. Scroll story (reuses hero's shared sculpture module).
5. Showcase + timeline + ROI (parallel-safe with 3/4).
6. Chatbot (parallel-safe with 3/4/5, can start as early as phase 2).
7. QA / performance / accessibility pass.

Git commits happen at each phase boundary; ask for explicit approval before each commit.

## Routes (1:1 with content inventory)

`/`, `/platform`, `/use-cases`, `/why-smartcycleai`, `/about`, `/for-cios-ctos`, `/for-cfos`,
`/for-clinical-leaders`, `/contact`, `/request-demo`, `/privacy`, `/terms`.
