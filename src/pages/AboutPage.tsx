import { Badge, SectionHeading } from "@/design-system";
import { HeroSection } from "@/components/common/HeroSection";
import { PageSection } from "@/components/common/PageSection";
import { FeatureGrid } from "@/components/common/FeatureGrid";
import { CtaBand } from "@/components/common/CtaBand";
import { about } from "@/content";

export function AboutPage() {
  const hero = about.aboutHero;
  const founding = about.foundingStory;
  const mission = about.missionSection;
  const values = about.coreValuesSection;
  const native = about.healthcareNativeByDesign;
  const leadership = about.leadershipSection;
  const cta = about.aboutFinalCta;

  return (
    <>
      <HeroSection
        eyebrow={hero.eyebrow.value}
        headingLines={hero.headingLines.value}
        subheading={hero.intro.value}
        supporting={hero.supporting.value}
      />

      <PageSection tone="light">
        <SectionHeading heading={founding.heading.value} />
        <div className="flex flex-col gap-4 font-body text-lg leading-relaxed text-current/70">
          <p>{founding.paragraph1.value}</p>
          <p>{founding.paragraph2.value}</p>
          <p className="font-display text-2xl text-current">
            {founding.foundingQuestionLeadIn.value} {founding.foundingQuestion.value}
          </p>
        </div>
        <FeatureGrid
          columns={3}
          items={founding.stats.map((s) => ({ key: s.name.value, name: s.name.value, description: s.description.value }))}
        />
      </PageSection>

      <PageSection tone="dark" containerClassName="items-center text-center gap-10">
        <SectionHeading heading={mission.heading.value} description={mission.statement.value} align="center" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {mission.stats.map((stat) => (
            <div key={stat.headline.value} className="flex flex-col gap-1">
              <p className="font-display text-display-sm">
                {stat.headline.value}
                {stat.subline ? <span className="ml-2 text-ember-pulse">{stat.subline.value}</span> : null}
              </p>
              <p className="font-body text-sm text-current/60">{stat.caption.value}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection tone="light">
        <SectionHeading heading={values.heading.value} description={values.intro.value} />
        <FeatureGrid
          columns={2}
          items={values.values.map((v) => ({ key: v.name.value, name: v.name.value, description: v.description.value }))}
        />
      </PageSection>

      <PageSection tone="dark" containerClassName="gap-6">
        <SectionHeading heading={native.heading.value} description={native.body.value} />
        <div className="flex flex-col gap-3">
          <p className="font-body text-xs uppercase tracking-widest text-ember-pulse">{native.expertiseHeading.value}</p>
          <div className="flex flex-wrap gap-3">
            {native.expertiseTags.map((tag) => (
              <Badge key={tag.value} label={tag.value} tone="outline" />
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection tone="light" containerClassName="max-w-3xl gap-6">
        <SectionHeading heading={leadership.heading.value} description={leadership.intro.value} />
        {leadership.people.map((person) => (
          <div key={person.name.value} className="flex flex-col gap-3 rounded-lg border border-current/15 p-8">
            <div>
              <h3 className="font-display text-2xl">{person.name.value}</h3>
              <p className="font-body text-sm uppercase tracking-widest text-ember-pulse">{person.title.value}</p>
            </div>
            <div className="flex flex-col gap-3 font-body text-base leading-relaxed text-current/70">
              <p>{person.bioParagraph1.value}</p>
              <p>{person.bioParagraph2.value}</p>
              <p>{person.bioParagraph3.value}</p>
            </div>
          </div>
        ))}
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
