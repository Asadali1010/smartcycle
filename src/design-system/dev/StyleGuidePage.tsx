import { useState } from "react";
import { Button } from "../Button";
import { Badge } from "../Badge";
import { SectionHeading } from "../SectionHeading";
import { MaskedReveal } from "../MaskedReveal";
import { LetterRoll } from "../LetterRoll";
import { Marquee } from "../Marquee";

/**
 * DEV-ONLY route: renders every design-system primitive against both surface
 * colors (obsidian + ivory) so contrast and keyboard-focus states can be
 * eyeballed in one place.
 *
 * `forms-and-pages` OWNS routing/pages from here on — this route must be
 * removed (both this file and its entry in src/router.tsx) before the site
 * ships. It exists only as a temporary design-system QA aid.
 */
export function StyleGuidePage() {
  return (
    <main>
      <Surface tone="obsidian" />
      <Surface tone="ivory" />
    </main>
  );
}

function Surface({ tone }: { tone: "obsidian" | "ivory" }) {
  const isDark = tone === "obsidian";
  const [replayKey, setReplayKey] = useState(0);

  return (
    <section
      className={
        isDark
          ? "flex flex-col gap-16 bg-obsidian px-gutter py-section-sm text-ivory"
          : "flex flex-col gap-16 bg-ivory px-gutter py-section-sm text-obsidian"
      }
    >
      <p className="font-body text-xs uppercase tracking-[0.3em] text-champagne">
        surface: {tone}
      </p>

      <SectionHeading
        eyebrow="Style guide"
        heading={`Primitives on ${tone}`}
        description="Every design-system component rendered against this surface, for contrast and focus-ring review."
        reveal={false}
      />

      <div className="flex flex-col gap-4">
        <h2 className="font-display text-display-sm">Type scale</h2>
        <p className="text-display-2xl font-display leading-none">Display 2XL</p>
        <p className="text-display-xl font-display leading-none">Display XL</p>
        <p className="text-display-lg font-display leading-none">Display LG</p>
        <p className="text-display-md font-display leading-none">Display MD</p>
        <p className="text-display-sm font-display leading-none">Display SM</p>
        <p className="font-body text-base">
          Body copy in the body font, for comparison — the quick brown fox jumps over the lazy dog. 1234567890.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-display text-display-sm">Buttons</h2>
        <p className="font-body text-sm text-current/60">
          Tab to each button to check the coral focus ring; hover or focus to see the letter-roll.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Request a demo</Button>
          <Button variant="secondary">Learn more</Button>
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
        <h2 className="font-display text-display-sm">Badges</h2>
        <p className="font-body text-sm text-current/60">
          Badge renders whatever label text it's given — exact certification wording varies by source page.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Badge label="HIPAA" tone="outline" />
          <Badge label="HITRUST Ready" tone="outline" />
          <Badge label="Epic-Safe" tone="subtle" />
          <Badge label="SOC 2 Type II" tone="solid" />
          <Badge label="SOC 2 Aligned" tone="outline" />
          <Badge label="ANSI 27001 Alignment" tone="subtle" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-display text-display-sm">Letter roll</h2>
        <p className="font-body text-sm text-current/60">Hover or focus the text below.</p>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-block font-display text-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral"
        >
          <LetterRoll>Platform overview</LetterRoll>
        </a>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-display-sm">Masked reveal</h2>
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className="font-body text-sm underline decoration-champagne underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral"
          >
            Replay (word mode is scroll-triggered below; this forces it)
          </button>
        </div>
        <p key={replayKey} className="font-display text-3xl">
          <MaskedReveal mode="word" active>
            Masked reveal replayed on demand, forced true via the active prop.
          </MaskedReveal>
        </p>
        <p className="font-display text-3xl">
          <MaskedReveal mode="word">
            Scroll this into view to trigger the default IntersectionObserver reveal.
          </MaskedReveal>
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-display text-display-sm">Marquee</h2>
        <Marquee speed="normal">
          <span className="font-display text-display-md uppercase">Build</span>
          <span className="font-display text-display-md text-coral">·</span>
          <span className="font-display text-display-md uppercase">Govern</span>
          <span className="font-display text-display-md text-coral">·</span>
          <span className="font-display text-display-md uppercase">Deploy</span>
          <span className="font-display text-display-md text-coral">·</span>
        </Marquee>
      </div>
    </section>
  );
}
