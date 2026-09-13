import { Badge, SectionHeading } from "@/design-system";
import { HeroSection } from "@/components/common/HeroSection";
import { PageSection } from "@/components/common/PageSection";
import { FeatureGrid } from "@/components/common/FeatureGrid";
import { CtaBand } from "@/components/common/CtaBand";
import { GapNote } from "@/components/common/GapNote";
import { why } from "@/content";

export function WhySmartCycleAIPage() {
  const hero = why.whyHero;
  const diagram = why.strategyExecutionDiagram;
  const painPoints = why.executionPainPoints;
  const differentiators = why.differentiatorsSection;
  const heritage = why.heritageSection;
  const expertise = why.healthcareExpertise;
  const infra = why.executionInfrastructureSection;
  const governance = why.governanceSection;
  const speedSafety = why.speedVsSafetySection;
  const workforce = why.workforceSection;
  const ip = why.ipOwnershipSection;
  const impact = why.businessImpactSection;
  const cta = why.whyFinalCta;

  return (
    <>
      <HeroSection
        eyebrow={hero.eyebrow.value}
        headingLines={hero.headingLines.value}
        subheading={hero.problemStatement.value}
        supporting={hero.supporting.value}
        primaryCta={{ label: hero.ctaPrimary.value, to: "/request-demo" }}
        secondaryCta={{ label: hero.ctaSecondary.value, to: "/platform" }}
      />

      <PageSection tone="light">
        <SectionHeading eyebrow={diagram.eyebrow.value} heading="The Missing Layer" description={diagram.intro.value} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[diagram.columns.strategy, diagram.columns.smartCycleAI, diagram.columns.results].map((col) => (
            <div key={col.name.value} className="flex flex-col gap-3 rounded-lg border border-current/15 p-6">
              <Badge label={col.tag.value} tone="subtle" className="self-start" />
              <h3 className="font-display text-2xl">{col.name.value}</h3>
              <p className="font-body text-sm text-current/70">{col.description.value}</p>
            </div>
          ))}
        </div>
        <p className="font-display text-xl">
          {diagram.closingLine1.value} {diagram.closingLine2.value}
        </p>
      </PageSection>

      <PageSection tone="dark">
        <SectionHeading heading="Why Initiatives Stall" />
        <FeatureGrid
          columns={3}
          items={painPoints.map((p) => ({ key: p.name.value, name: p.name.value, description: p.description.value }))}
        />
      </PageSection>

      <PageSection tone="light">
        <SectionHeading
          eyebrow={differentiators.eyebrow.value}
          heading={differentiators.headingLines.value.join(" ")}
          description={differentiators.intro.value}
        />
        <FeatureGrid
          columns={3}
          items={differentiators.items.map((d) => ({ key: d.name.value, name: d.name.value, description: d.description.value }))}
        />
        <p className="font-display text-xl">
          {differentiators.tagline.value.join(" ")}
          <GapNote gapId="differentiator-count-5-vs-6" label="Why six, not five" className="ml-3" />
        </p>
      </PageSection>

      <PageSection tone="dark" containerClassName="gap-10">
        <div className="flex flex-col gap-4">
          <SectionHeading eyebrow={heritage.eyebrow.value} heading={heritage.heading.value} />
          <p className="max-w-3xl font-body text-lg leading-relaxed text-current/70">{heritage.intro.value}</p>
          <p className="max-w-3xl font-body text-lg leading-relaxed text-current/70">{heritage.body.value}</p>
          <p className="font-display text-xl">{heritage.closingLine.value}</p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-display text-2xl">{expertise.heading.value}</h3>
          <FeatureGrid
            columns={3}
            items={expertise.items.map((e) => ({ key: e.name.value, name: e.name.value, description: e.description.value }))}
          />
          <p className="font-body text-lg">
            {expertise.closingLine1.value} {expertise.closingLine2.value}
          </p>
        </div>
      </PageSection>

      <PageSection tone="light" containerClassName="gap-8">
        <SectionHeading eyebrow={infra.eyebrow.value} heading="Not a Collection of Tools" description={infra.intro.value} />
        <div className="flex flex-wrap gap-3">
          {infra.platformCapabilityLabels.map((label) => (
            <Badge key={label.value} label={label.value} tone="outline" />
          ))}
        </div>
        <FeatureGrid
          columns={2}
          items={infra.valueProps.map((v) => ({ key: v.name.value, name: v.name.value, description: v.description.value }))}
        />
        <p className="font-display text-xl">
          {infra.closingLine1.value} {infra.closingLine2.value}
        </p>
      </PageSection>

      <PageSection tone="dark" containerClassName="gap-8">
        <SectionHeading eyebrow={governance.eyebrow.value} heading={governance.headingLines.value.join(" ")} description={governance.intro.value} />
        <FeatureGrid
          columns={3}
          items={governance.items.map((g) => ({
            key: g.name.value,
            name: g.name.value,
            description: g.description.value,
            footnote: g.name.gapRef ? <GapNote gapId={g.name.gapRef} label="ISO vs ANSI 27001" /> : undefined,
          }))}
        />
        <p className="font-body text-current/70">{governance.closingSupporting.value}</p>
        <p className="font-display text-xl">{governance.closingLines.value.join(" ")}</p>
      </PageSection>

      <PageSection tone="light" containerClassName="gap-10">
        <SectionHeading heading={speedSafety.headingLines.value.join(" ")} description={speedSafety.intro.value} />
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-2xl text-ember-pulse">{speedSafety.startupSpeed.name.value}</h3>
            <ul className="flex flex-col gap-4">
              {speedSafety.startupSpeed.items.map((item) => (
                <li key={item.name.value}>
                  <p className="font-medium">{item.name.value}</p>
                  <p className="font-body text-sm text-current/70">{item.description.value}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-2xl text-electric-iris">{speedSafety.enterpriseSafety.name.value}</h3>
            <ul className="flex flex-col gap-4">
              {speedSafety.enterpriseSafety.items.map((item) => (
                <li key={item.name.value}>
                  <p className="font-medium">{item.name.value}</p>
                  <p className="font-body text-sm text-current/70">{item.description.value}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <blockquote className="border-l-2 border-ember-pulse pl-6">
          <p className="font-display text-2xl italic">&ldquo;{speedSafety.quote.value}&rdquo;</p>
          <p className="mt-2 font-body text-xs uppercase tracking-widest text-current/50">
            Illustrative site copy — not a named customer testimonial
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {speedSafety.quoteCaveats.map((c) => (
              <Badge key={c.value} label={c.value} tone="subtle" />
            ))}
          </div>
        </blockquote>
      </PageSection>

      <PageSection tone="dark">
        <SectionHeading eyebrow={workforce.eyebrow.value} heading={workforce.headingLines.value.join(" ")} description={workforce.intro.value} />
        <p className="font-body text-current/70">{workforce.supporting.value}</p>
        <FeatureGrid
          columns={3}
          items={workforce.items.map((w) => ({ key: w.name.value, name: w.name.value, description: w.description.value }))}
        />
        <div className="flex flex-col gap-2">
          <p className="font-body text-xs uppercase tracking-widest text-ember-pulse">{workforce.comparisonHeading.value}</p>
          <div className="flex flex-wrap gap-3">
            {workforce.comparisonPoints.map((p) => (
              <Badge key={p.value} label={p.value} tone="outline" />
            ))}
          </div>
        </div>
        <p className="font-display text-xl">
          {workforce.closingLine1.value} {workforce.closingLine2.value}
        </p>
      </PageSection>

      <PageSection tone="light" containerClassName="gap-10">
        <SectionHeading eyebrow={ip.eyebrow.value} heading={ip.headingLines.value.join(" ")} description={ip.intro.value} />
        <p className="font-display text-display-sm text-ember-pulse">{ip.ownershipStat.value}</p>
        <FeatureGrid
          columns={2}
          items={ip.points.map((p) => ({ key: p.name.value, name: p.name.value, description: p.description.value }))}
        />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-lg border border-current/15 p-6">
            <h3 className="font-display text-xl text-current/60">{ip.traditionalVendorModel.heading.value}</h3>
            <ul className="flex flex-col gap-2 font-body text-sm text-current/60">
              {ip.traditionalVendorModel.points.map((p) => (
                <li key={p.value}>— {p.value}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3 rounded-lg border border-ember-pulse/40 bg-ember-pulse/5 p-6">
            <h3 className="font-display text-xl text-ember-pulse">{ip.smartCycleAIModel.heading.value}</h3>
            <ul className="flex flex-col gap-2 font-body text-sm">
              {ip.smartCycleAIModel.points.map((p) => (
                <li key={p.value}>— {p.value}</li>
              ))}
            </ul>
          </div>
        </div>
      </PageSection>

      <PageSection tone="dark">
        <SectionHeading eyebrow={impact.eyebrow.value} heading={impact.headingLines.value.join(" ")} description={impact.intro.value} />
        <FeatureGrid
          columns={3}
          items={impact.items.map((i) => ({ key: i.name.value, name: i.name.value, description: i.description.value, tag: i.tag.value }))}
        />
        <div className="flex flex-col gap-1 font-display text-xl">
          <p>{impact.closingLine1.value}</p>
          <p className="font-body text-base text-current/70">{impact.closingLine2.value}</p>
          <p className="font-body text-base text-current/70">{impact.closingLine3.value}</p>
          <p>{impact.closingLine4.value}</p>
          <p>{impact.closingLine5.value}</p>
        </div>
      </PageSection>

      <CtaBand
        tone="light"
        eyebrow={cta.eyebrow.value}
        heading={cta.headingLines.value.join(" ")}
        supporting={cta.supporting.value}
        statChips={cta.statChips.map((c) => c.value)}
        primaryCta={{ label: cta.ctaPrimary.value, to: "/request-demo" }}
        secondaryCta={{ label: cta.ctaSecondary.value, to: "/platform" }}
      >
        <div className="flex flex-col items-center gap-2">
          <p className="font-body text-xs uppercase tracking-widest text-current/50">{cta.trustRowHeading.value}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {cta.trustRowItems.map((item) => (
              <Badge key={item.value} label={item.value} tone="subtle" />
            ))}
          </div>
        </div>
      </CtaBand>
    </>
  );
}
