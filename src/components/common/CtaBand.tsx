import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button, Badge } from "@/design-system";
import { PageSection } from "./PageSection";
import type { SurfaceIntensity, SurfaceTone } from "./PageSection";
import type { HeroCta } from "./HeroSection";

export interface CtaBandProps {
  eyebrow?: string;
  heading: string;
  supporting?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  statChips?: string[];
  tone?: SurfaceTone;
  /** Defaults to "vivid" — the final CTA is a conversion moment, not a quiet one. */
  intensity?: SurfaceIntensity;
  children?: ReactNode;
}

/** Shared closing/final-CTA band used at the bottom of every content page. */
export function CtaBand({
  eyebrow,
  heading,
  supporting,
  primaryCta,
  secondaryCta,
  statChips,
  tone = "obsidian",
  intensity = "vivid",
  children,
}: CtaBandProps) {
  return (
    <PageSection tone={tone} intensity={intensity} containerClassName="items-center gap-8 text-center">
      {eyebrow ? (
        <p className="font-body text-sm font-medium uppercase tracking-[0.3em] text-champagne">{eyebrow}</p>
      ) : null}
      <h2 className="max-w-3xl font-display text-display-md">{heading}</h2>
      {supporting ? <p className="max-w-2xl font-body text-lg text-current/70">{supporting}</p> : null}
      {statChips?.length ? (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {statChips.map((chip) => (
            <Badge key={chip} label={chip} tone="subtle" />
          ))}
        </div>
      ) : null}
      {primaryCta || secondaryCta ? (
        <div className="flex flex-wrap items-center justify-center gap-4">
          {primaryCta ? (
            <Button as={Link} to={primaryCta.to} variant={primaryCta.variant ?? "primary"} size="lg">
              {primaryCta.label}
            </Button>
          ) : null}
          {secondaryCta ? (
            <Button as={Link} to={secondaryCta.to} variant={secondaryCta.variant ?? "secondary"} size="lg">
              {secondaryCta.label}
            </Button>
          ) : null}
        </div>
      ) : null}
      {children}
    </PageSection>
  );
}
