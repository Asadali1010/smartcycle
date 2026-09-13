import { Badge, SectionHeading } from "@/design-system";
import { HeroSection } from "@/components/common/HeroSection";
import { PageSection } from "@/components/common/PageSection";
import { FeatureGrid } from "@/components/common/FeatureGrid";
import { CtaBand } from "@/components/common/CtaBand";
import { GapNote } from "@/components/common/GapNote";
import { forCfos } from "@/content";

export function ForCfosPage() {
  const h = forCfos.forCfosHero;
  const impact = forCfos.financialImpactSection;
  const pains = forCfos.cfosPainPoints;
  const financialCase = forCfos.financialCaseSection;
  const cta = forCfos.cfosFinalCta;

  return (
    <>
      <HeroSection
        eyebrow={h.eyebrow.value}
        headingLines={h.headingLines.value}
        subheading={h.subheading.value}
        supporting={h.supporting.value}
        primaryCta={{ label: h.ctaPrimary.value, to: "/request-demo" }}
        secondaryCta={{ label: h.ctaSecondary.value, to: "/platform" }}
      />

      <PageSection tone="ivory">
        <SectionHeading eyebrow={impact.eyebrow.value} heading="Financial Impact You Can Measure" description={impact.intro.value} />
        <FeatureGrid
          columns={2}
          items={impact.items.map((item) => ({ key: item.name.value, name: item.name.value, description: item.description.value }))}
        />
      </PageSection>

      <PageSection tone="obsidian">
        <SectionHeading eyebrow={pains.eyebrow.value} heading="The Financial Pressures You Navigate" description={pains.intro.value} />
        <FeatureGrid
          columns={2}
          items={pains.items.map((item) => ({
            key: item.name.value,
            name: item.name.value,
            description: item.description.value,
            tag: item.solutionPhrase.value,
          }))}
        />
        <div className="font-body text-sm text-current/50">
          "Delayed ROI" cites 12–18 month timelines and this redesign's execution-gap content cites a 73% (up to) or
          57% (calculator-default) cost reduction depending on section.
          <GapNote gapId="cost-reduction-73-vs-57" label="Which cost-reduction figure" />
        </div>
      </PageSection>

      <PageSection tone="ivory" containerClassName="items-center text-center gap-6">
        <SectionHeading heading={financialCase.heading.value} align="center" />
        <div className="flex flex-wrap justify-center gap-3">
          {financialCase.items.map((item) => (
            <Badge key={item.value} label={item.value} tone="outline" />
          ))}
        </div>
      </PageSection>

      <CtaBand
        tone="obsidian"
        heading={cta.heading.value}
        supporting={cta.supporting.value}
        primaryCta={{ label: cta.ctaPrimary.value, to: "/request-demo" }}
        secondaryCta={{ label: cta.ctaSecondary.value, to: "/why-smartcycleai" }}
      />
    </>
  );
}
