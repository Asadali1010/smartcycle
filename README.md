# SmartCycleAI Redesign

A from-scratch local redesign of the SmartCycleAI public marketing site — same product facts,
completely new visual and motion identity (obsidian charcoal / warm ivory / vivid coral /
champagne metallic), a Trionn-inspired 3D and scroll-driven motion system, and a
"SmartCycle Assistant" chatbot with an offline demo mode.

This is an independent frontend rebuild from publicly available content
(https://smartcycle.ai/) — no access to the original source, backend, or private APIs was used
or is required to run this project.

See [CLAUDE.md](./CLAUDE.md) for the build orchestration plan (subagents, phase order, hand-off
graph) and the full plan doc referenced there for context.

## Stack

React 18 + TypeScript + Vite + Tailwind CSS, React Three Fiber (three.js) for the 3D sculpture,
GSAP + ScrollTrigger + Lenis for scroll choreography, Framer Motion for interaction-state motion,
Zustand for shared scene state, react-hook-form + zod for forms. A separate `server/` package
holds an unwired stub for a future live chatbot backend.

## Getting started

```bash
npm install
npm run dev       # start the Vite dev server
```

## Building

```bash
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build locally
```

## Testing

```bash
npm run test        # Vitest unit tests (once-off)
npm run test:watch  # Vitest watch mode
npm run e2e          # Playwright e2e + accessibility smoke (builds/serves dist/ first)
```

## Project layout

- `src/content/` — the single source of truth for all copy/facts, typed and traceable to their
  source URL on smartcycle.ai. Includes `gaps.ts`, a tracked log of content that could not be
  cleanly verified or that conflicts across pages on the real site (never silently invented or
  reconciled).
- `src/design-system/` — palette-driven, reusable UI primitives.
- `src/three/` — the shared 3D sculpture (geometry, materials, lighting, transforms) used by both
  the hero and the scroll-driven story so they read as one connected system.
- `src/motion/` — Lenis/GSAP wiring and shared scroll-progress state.
- `src/components/` — hero, scroll-story, showcase, timeline, roi, typography, forms, and chatbot
  components.
- `src/pages/` — one file per route, matching the content inventory 1:1.
- `server/` — an isolated Express stub for a future live chatbot backend. Not bundled into the
  client, not wired up by default, and never holds real credentials in source control (see
  `server/.env.example`).
- `qa/` — accessibility/reduced-motion checklists and Playwright specs.

## Notes on content accuracy

All product names, workflows, healthcare use cases, and figures come directly from
smartcycle.ai's public pages, re-verified by the `content-curator` build phase. Where the real
site itself contains ambiguous or conflicting information (e.g. two different cost-reduction
percentages, two different step-count descriptions of "How It Works"), both versions are
preserved and cross-linked rather than merged or guessed at — see `src/content/gaps.ts`.
