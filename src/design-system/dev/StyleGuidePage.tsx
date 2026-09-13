import { useState } from "react";
import { Button } from "../Button";
import { Badge } from "../Badge";
import { SectionHeading } from "../SectionHeading";
import { MaskedReveal } from "../MaskedReveal";
import { LetterRoll } from "../LetterRoll";
import { Marquee } from "../Marquee";

/**
 * DEV-ONLY route: renders every design-system primitive against both surface
 * colors (dark obsidian-canvas + light white) so contrast and keyboard-focus
 * states can be eyeballed in one place.
 *
 * `forms-and-pages` OWNS routing/pages from here on — this route must be
 * removed (both this file and its entry in src/router.tsx) before the site
 * ships. It exists only as a temporary design-system QA aid.
 */
export function StyleGuidePage() {
  return (
    <main>
      <Surface tone="dark" />
      <Surface tone="light" />
    </main>
  );
}

function Surface({ tone }: { tone: "dark" | "light" }) {
  const isDark = tone === "dark";
  const [replayKey, setReplayKey] = useState(0);

  return (
    <section
      className={
        isDark
          ? "flex flex-col gap-16 bg-obsidian-canvas px-gutter py-section-sm text-snow"
          : "flex flex-col gap-16 bg-white px-gutter py-section-sm text-void"
      }
    >
      <p className="font-inter text-xs uppercase tracking-[0.3em] text-ash">
        surface: {tone}
      </p>

      <SectionHeading
        eyebrow="Style guide"
        heading={`Primitives on ${tone}`}
        description="Every design-system component rendered against this surface, for contrast and focus-ring review."
        reveal={false}
      />

      <div className="flex flex-col gap-4">
        <h2 className="font-esbuild text-display-sm">Type scale</h2>
        <p className="text-display font-esbuild leading-none">Display</p>
        <p className="text-display-sm font-esbuild leading-none">Display SM</p>
        <p className="text-heading font-esbuild leading-none">Heading</p>
        <p className="text-heading-sm font-inter font-medium">Heading SM</p>
        <p className="text-subheading font-inter">Subheading</p>
        <p className="text-body-lg font-inter">Body LG</p>
        <p className="font-inter text-body">
          Body copy in the body font, for comparison — the quick brown fox jumps over the lazy dog. 1234567890.
        </p>
        <p className="font-inter text-caption uppercase tracking-widest text-ash">Caption</p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-esbuild text-display-sm">Buttons</h2>
        <p className="font-inter text-sm text-current/60">
          Tab to each button to check the electric-iris focus ring; hover or focus to see the letter-roll.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Request a demo</Button>
          <Button variant="secondary">Learn more</Button>
          <Button variant="white">See in action</Button>
          <Button variant="primary" size="lg">
            Large primary
          </Button>
          <Button variant="secondary" size="lg">
            Large secondary
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-esbuild text-display-sm">Badges</h2>
        <p className="font-inter text-sm text-current/60">
          Badge renders whatever label text it's given — exact certification wording varies by source page.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Badge label="HIPAA" tone="outline" />
          <Badge label="HITRUST Ready" tone="outline" />
          <Badge label="Epic-Safe" tone="subtle" />
          <Badge label="SOC 2 Type II" tone="solid" />
          <Badge label="SOC 2 Aligned" tone="outline" />
          <Badge label="ANSI 27001 Alignment" tone="subtle" />
          <Badge label="Live" tone="subtle" className="bg-electric-iris/12 text-electric-iris" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-esbuild text-display-sm">Letter roll</h2>
        <p className="font-inter text-sm text-current/60">Hover or focus the text below.</p>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-block font-esbuild text-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric-iris"
        >
          <LetterRoll>Platform overview</LetterRoll>
        </a>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-esbuild text-display-sm">Masked reveal</h2>
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className="font-inter text-sm underline decoration-ember-pulse underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric-iris"
          >
            Replay (word mode is scroll-triggered below; this forces it)
          </button>
        </div>
        <p key={replayKey} className="font-esbuild text-3xl">
          <MaskedReveal mode="word" active>
            Masked reveal replayed on demand, forced true via the active prop.
          </MaskedReveal>
        </p>
        <p className="font-esbuild text-3xl">
          <MaskedReveal mode="word">
            Scroll this into view to trigger the default IntersectionObserver reveal.
          </MaskedReveal>
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-esbuild text-display-sm">Marquee</h2>
        <Marquee speed="normal">
          <span className="font-esbuild text-display-sm uppercase">Build</span>
          <span className="font-esbuild text-display-sm text-ember-pulse">·</span>
          <span className="font-esbuild text-display-sm uppercase">Govern</span>
          <span className="font-esbuild text-display-sm text-ember-pulse">·</span>
          <span className="font-esbuild text-display-sm uppercase">Deploy</span>
          <span className="font-esbuild text-display-sm text-ember-pulse">·</span>
        </Marquee>
      </div>
    </section>
  );
}
