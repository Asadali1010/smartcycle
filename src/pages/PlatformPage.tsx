import { Badge, SectionHeading } from "@/design-system";
import { HeroSection } from "@/components/common/HeroSection";
import { PageSection } from "@/components/common/PageSection";
import { FeatureGrid } from "@/components/common/FeatureGrid";
import { StepList } from "@/components/common/StepList";
import { CtaBand } from "@/components/common/CtaBand";
import { GapNote } from "@/components/common/GapNote";
import { platform } from "@/content";

export function PlatformPage() {
  const hero = platform.platformHero;
  const howItWorks = platform.platformHowItWorks;
  const benefits = platform.platformBenefits;
  const capabilities = platform.platformCapabilities;
  const outcomes = platform.platformOutcomes;
  const ownership = platform.platformOwnership;
  const enterprise = platform.platformEnterpriseFeatures;
  const security = platform.platformSecurity;
  const cta = platform.platformFinalCta;

  return (
    <>
      <HeroSection
        eyebrow={hero.eyebrow.value}
        headingLines={hero.headingLines.value}
        subheading={hero.subheading.value}
        supporting={hero.supporting.value}
      />

      <PageSection tone="light">
        <SectionHeading
          eyebrow={howItWorks.eyebrow.value}
          heading="How It Works"
          description={howItWorks.intro.value}
        />
        <StepList
          steps={howItWorks.steps.map((s) => ({ key: s.name.value, name: s.name.value, description: s.description.value }))}
          footnote={
            <p className="font-inter text-sm text-current/60">
              This is /platform's own 5-step process.
              <GapNote gapId="how-it-works-4-vs-5-step" label="Different from the homepage's 4-step process" className="ml-2" />
            </p>
          }
        />
      </PageSection>

      <PageSection tone="dark">
        <SectionHeading eyebrow={benefits.eyebrow.value} heading="What You Get" description={benefits.intro.value} />
        <FeatureGrid
          columns={2}
          items={benefits.items.map((b) => ({ key: b.name.value, name: b.name.value, description: b.description.value }))}
        />
      </PageSection>

      <PageSection tone="light">
        <SectionHeading eyebrow={capabilities.eyebrow.value} heading={capabilities.headline.value} description={capabilities.intro.value} />
        <div className="flex flex-wrap gap-3">
          {capabilities.items.map((item) => (
            <Badge key={item.value} label={item.value} tone="solid" />
          ))}
        </div>
      </PageSection>

      <PageSection tone="dark">
        <SectionHeading eyebrow={outcomes.eyebrow.value} heading="Business Outcomes" />
        <FeatureGrid
          columns={2}
          items={outcomes.items.map((o) => ({ key: o.name.value, name: o.name.value, description: o.description.value, tag: o.outcomeTag.value }))}
        />
      </PageSection>

      <PageSection tone="light" containerClassName="items-center text-center gap-4">
        <SectionHeading heading={ownership.headingLines.value.join(" ")} description={ownership.body.value} align="center" />
        <p className="max-w-xl font-inter text-current/70">{ownership.supporting.value}</p>
      </PageSection>

      <PageSection tone="dark">
        <SectionHeading eyebrow={enterprise.eyebrow.value} heading="Enterprise-Ready Capabilities" description={enterprise.intro.value} />
        <FeatureGrid
          columns={3}
          items={enterprise.items.map((e) => ({ key: e.name.value, name: e.name.value, description: e.description.value }))}
        />
        <div className="flex flex-col gap-2 border-t border-current/15 pt-6">
          <p className="font-inter text-xl font-semibold">{enterprise.ctaHeading.value}</p>
          <p className="font-inter text-current/70">{enterprise.ctaSupporting.value}</p>
        </div>
      </PageSection>

      <PageSection tone="light" containerClassName="gap-8">
        <SectionHeading eyebrow={security.eyebrow.value} heading="Security & Compliance" description={security.intro.value} />
        <div className="flex flex-wrap gap-3">
          {security.badges.map((badge) => (
            <span key={badge.value} className="inline-flex items-center gap-1">
              <Badge label={badge.value} tone="outline" />
              {badge.gapRef ? <GapNote gapId={badge.gapRef} label="ISO vs ANSI" /> : null}
            </span>
          ))}
        </div>
        <FeatureGrid
          columns={3}
          items={security.details.map((d) => ({ key: d.name.value, name: d.name.value, description: d.description.value }))}
        />
        <p className="font-inter text-lg text-current/70">{security.closing.value}</p>
        <p className="font-inter text-xs text-current/50">
          Certification language on this page ("HIPAA", "ISO 27001", "SOC 2 Type II") is unhedged, unlike softer
          "Aware"/"Ready"/"Aligned" wording used on other pages.
          <GapNote gapId="certification-language-varies-by-page" label="Why this varies by page" className="ml-2" />
        </p>
      </PageSection>

      <CtaBand
        tone="dark"
        heading={cta.heading.value}
        supporting={cta.supporting.value}
        primaryCta={{ label: cta.ctaPrimary.value, to: "/request-demo" }}
        secondaryCta={{ label: cta.ctaSecondary.value, to: "/use-cases" }}
      />
    </>
  );
}
