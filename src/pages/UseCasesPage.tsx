import { SectionHeading } from "@/design-system";
import { HeroSection } from "@/components/common/HeroSection";
import { PageSection } from "@/components/common/PageSection";
import { FeatureGrid } from "@/components/common/FeatureGrid";
import { CtaBand } from "@/components/common/CtaBand";
import { GapNote } from "@/components/common/GapNote";
import { useCases } from "@/content";

export function UseCasesPage() {
  const hero = useCases.useCasesHero;
  const flexibility = useCases.flexibilityOverFeatures;
  const intro = useCases.useCasesSectionIntro;
  const cta = useCases.useCasesFinalCta;

  return (
    <>
      <HeroSection headingLines={hero.headingLines.value} subheading={hero.subheading.value} />

      <PageSection tone="ivory">
        <SectionHeading eyebrow={flexibility.eyebrow.value} heading="Flexibility Over Features" description={flexibility.intro.value} />
        <FeatureGrid
          columns={3}
          items={flexibility.points.map((p) => ({ key: p.name.value, name: p.name.value, description: p.description.value }))}
        />
      </PageSection>

      <PageSection tone="obsidian" containerClassName="gap-14">
        <div className="flex flex-col gap-4">
          <SectionHeading eyebrow={intro.eyebrow.value} heading={intro.headingLines.value.join(" ")} description={intro.intro.value} />
          <div className="font-body text-sm text-current/60">
            This 4-category / 16-item taxonomy is a different breakdown from the homepage's 10 named Solution
            Domains — both are real and current; they aren't meant to map 1:1.
            <GapNote gapId={useCases.useCaseCategoriesGapRef} label="Why two taxonomies" className="ml-2" />
          </div>
        </div>

        {useCases.useCaseCategories.map((category) => (
          <div key={category.name.value} className="flex flex-col gap-6">
            <div>
              <h3 className="font-display text-2xl text-coral">{category.name.value}</h3>
              <p className="mt-1 max-w-2xl font-body text-current/70">{category.intro.value}</p>
            </div>
            <FeatureGrid
              columns={2}
              items={category.items.map((item) => ({ key: item.name.value, name: item.name.value, description: item.description.value }))}
            />
          </div>
        ))}
      </PageSection>

      <CtaBand
        tone="ivory"
        heading={cta.headingLines.value.join(" ")}
        supporting={cta.supporting.value}
        primaryCta={{ label: cta.ctaPrimary.value, to: "/request-demo" }}
        secondaryCta={{ label: cta.ctaSecondary.value, to: "/platform" }}
      >
        <p className="max-w-2xl font-display text-2xl">{cta.ctaHeadingLines.value.join(" ")}</p>
        <p className="max-w-xl font-body text-current/70">{cta.ctaSupporting.value}</p>
      </CtaBand>
    </>
  );
}
