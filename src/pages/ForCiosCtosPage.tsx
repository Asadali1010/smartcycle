import { Badge, SectionHeading } from "@/design-system";
import { HeroSection } from "@/components/common/HeroSection";
import { PageSection } from "@/components/common/PageSection";
import { FeatureGrid } from "@/components/common/FeatureGrid";
import { CtaBand } from "@/components/common/CtaBand";
import { forCiosCtos } from "@/content";

export function ForCiosCtosPage() {
  const h = forCiosCtos.forCiosCtosHero;
  const delivers = forCiosCtos.whatSmartCycleAIDelivers;
  const pains = forCiosCtos.ciosCtosPainPoints;
  const certs = forCiosCtos.ciosCtosCertifications;
  const cta = forCiosCtos.ciosCtosFinalCta;

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

      <PageSection tone="light">
        <SectionHeading eyebrow={delivers.eyebrow.value} heading="What SmartCycleAI Delivers" description={delivers.intro.value} />
        <FeatureGrid
          columns={2}
          items={delivers.items.map((item) => ({ key: item.name.value, name: item.name.value, description: item.description.value }))}
        />
      </PageSection>

      <PageSection tone="dark">
        <SectionHeading eyebrow={pains.eyebrow.value} heading="The Challenges You Face" description={pains.intro.value} />
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

      <PageSection tone="light" containerClassName="items-center text-center gap-6">
        <SectionHeading heading={certs.heading.value} align="center" />
        <div className="flex flex-wrap justify-center gap-3">
          {certs.items.map((item) => (
            <Badge key={item.value} label={item.value} tone="outline" />
          ))}
        </div>
      </PageSection>

      <CtaBand
        tone="dark"
        heading={cta.heading.value}
        supporting={cta.supporting.value}
        primaryCta={{ label: cta.ctaPrimary.value, to: "/request-demo" }}
        secondaryCta={{ label: cta.ctaSecondary.value, to: "/why-smartcycleai" }}
      />
    </>
  );
}
