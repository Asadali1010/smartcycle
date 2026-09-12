import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button, Badge, SectionHeading } from "@/design-system";
import { PageSection } from "./PageSection";
import type { SurfaceTone } from "./PageSection";

export interface HeroCta {
  label: string;
  to: string;
  variant?: "primary" | "secondary";
}

export interface HeroSectionProps {
  eyebrow?: string;
  headingLines: string[];
  subheading?: string;
  supporting?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  badges?: string[];
  tone?: SurfaceTone;
  children?: ReactNode;
}

/**
 * Plain (non-3D, non-scroll-driven) hero/page-intro pattern shared by every
 * secondary page's top section. three-d-hero/scroll-choreography later own
 * the homepage's immersive hero — this is the "early pass" static version
 * used everywhere else, and for the homepage's hero content for now too.
 */
export function HeroSection({
  eyebrow,
  headingLines,
  subheading,
  supporting,
  primaryCta,
  secondaryCta,
  badges,
  tone = "obsidian",
  children,
}: HeroSectionProps) {
  return (
    <PageSection tone={tone} className="pt-40 md:pt-48">
      <SectionHeading eyebrow={eyebrow} heading={headingLines.join(" ")} level="h1" description={subheading} />
      {supporting ? <p className="max-w-2xl font-body text-lg text-current/70">{supporting}</p> : null}
      {primaryCta || secondaryCta ? (
        <div className="flex flex-wrap items-center gap-4">
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
      {badges?.length ? (
        <div className="flex flex-wrap gap-3">
          {badges.map((b) => (
            <Badge key={b} label={b} tone="outline" />
          ))}
        </div>
      ) : null}
      {children}
    </PageSection>
  );
}
