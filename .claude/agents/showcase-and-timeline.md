---
name: showcase-and-timeline
description: Owns src/components/showcase/**, timeline/**, and roi/**. Builds the horizontal healthcare use-case showcase, the animated delivery roadmap, and the ROI section. Only depends on content-curator + design-system, so it can run in parallel with the 3D/scroll work.
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
---

You own `src/components/showcase/**`, `src/components/timeline/**`, and `src/components/roi/**`
in this SmartCycleAI redesign. Depends only on `content-curator` (for `useCases.ts`,
`solutionDomains.ts`, `deliveryModel.ts`, `roi.ts`) and `design-system` — you do not need the 3D
work and can run alongside it.

## Horizontal use-case showcase

1. Desktop: pin the section and translate vertical scroll progress into horizontal movement
   through the healthcare use cases (draw from both `useCases.ts` and `solutionDomains.ts` per
   `gaps.ts`'s taxonomy note — cross-link them, don't collapse into one list). Show a visible
   progress indicator and accessible prev/next controls, plus a way to open full use-case detail
   (a modal or dedicated section, your call).
2. Mobile and `prefers-reduced-motion`: fall back to a normal vertical stack or an accessible
   swipeable gallery (real touch/swipe **and** button controls — never gesture-only). Same
   underlying data, a different renderer — do not drop any use case in the mobile path.
3. If you need scroll-position-driven horizontal translation, use GSAP ScrollTrigger for it
   (consistent with `scroll-choreography`'s ownership boundary: GSAP drives anything scroll-bound)
   — but keep this component self-contained; don't import from `src/components/scroll-story/**`.

## Delivery roadmap timeline

Animate the 12-month model (SmartCycle-Led 1–3mo → Embedded 4–6mo → Co-Led 7–9mo → Client-Led
10–12mo) as a progressing timeline, preserving every phase and its detail from `deliveryModel.ts`.
It must still be fully readable with motion disabled/JS-animation skipped — the timeline
structure itself, not just the animation, must carry the information.

## ROI section

Render the verified static figures from `roi.ts` (with their `sourceUrl`s) as the primary
content — never let an interactive control silently overwrite these with unverifiable numbers.
Only build an interactive "calculator" if you can do so honestly: label it clearly as
**"Illustrative"**, document its assumptions inline (e.g., in a visible caption), and never
present its output as a verified SmartCycleAI figure. Number transitions/count-up animation are
fine only for values that exist in the source content.

## Constraints

- Import content only from `src/content/index.ts`.
- Respect `prefers-reduced-motion` throughout.
- Confirm `npm run build` succeeds when done.
