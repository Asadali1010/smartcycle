import { Badge, SectionHeading } from "@/design-system";
import { HeroSection } from "@/components/common/HeroSection";
import { PageSection } from "@/components/common/PageSection";
import { FeatureGrid } from "@/components/common/FeatureGrid";
import { CtaBand } from "@/components/common/CtaBand";
import { forClinicalLeaders } from "@/content";

export function ForClinicalLeadersPage() {
  const h = forClinicalLeaders.forClinicalLeadersHero;
  const delivers = forClinicalLeaders.clinicalDeliverySection;
  const pains = forClinicalLeaders.clinicalLeadersPainPoints;
  const excellence = forClinicalLeaders.clinicalExcellenceSection;
  const cta = forClinicalLeaders.clinicalLeadersFinalCta;

  return (
    <>
      <HeroSection
        eyebrow={h.eyebrow.value}
        headingLines={h.headingLines.value}
        subheading={h.subheading.value}
        supporting={h.supporting.value}
        primaryCta={{ label: h.ctaPrimary.value, to: "/request-demo" }}
        secondaryCta={{ label: h.ctaSecondary.value, to: "/use-cases" }}
      />

      <PageSection tone="ivory">
        <SectionHeading eyebrow={delivers.eyebrow.value} heading="Built for Clinical Teams" description={delivers.intro.value} />
        <FeatureGrid
          columns={2}
          items={delivers.items.map((item) => ({ key: item.name.value, name: item.name.value, description: item.description.value }))}
        />
      </PageSection>

      <PageSection tone="obsidian">
        <SectionHeading eyebrow={pains.eyebrow.value} heading="The Challenges Clinical Leaders Face" description={pains.intro.value} />
        <FeatureGrid
          columns={2}
          items={pains.items.map((item) => ({
            key: item.name.value,
            name: item.name.value,
            description: item.description.value,
            tag: item.solutionPhrase.value,
          }))}
        />
      </PageSection>

      <PageSection tone="ivory" containerClassName="items-center text-center gap-6">
        <SectionHeading heading={excellence.heading.value} align="center" />
        <div className="flex flex-wrap justify-center gap-3">
          {excellence.items.map((item) => (
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
