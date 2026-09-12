import { Badge, SectionHeading } from "@/design-system";
import { PageSection } from "@/components/common/PageSection";
import { HeroSection } from "@/components/common/HeroSection";
import { StepList } from "@/components/common/StepList";
import { StatStrip } from "@/components/common/StatStrip";
import { ComparisonRows } from "@/components/common/ComparisonRows";
import { CtaBand } from "@/components/common/CtaBand";
import { GapNote } from "@/components/common/GapNote";
import { home, platform, solutionDomains, deliveryModel, roi } from "@/content";

/**
 * Early pass (per CLAUDE.md phase 2 + this run's narrower scope): plain,
 * non-3D/non-scroll layout covering every homepage content section so the
 * site is fully content-complete and navigable. three-d-hero owns the real
 * immersive hero, scroll-choreography owns the scroll story, and
 * showcase-and-timeline owns the animated horizontal solution-domain
 * showcase and the interactive ROI calculator — none of that is built here.
 */
export function HomePage() {
  const hero = home.homeHero;
  const gap = home.executionGap;
  const platformSection = home.platformSection;
  const howItWorksHome = home.howItWorksHome;
  const howItWorksPlatform = platform.platformHowItWorks;
  const integrations = home.integrationEcosystem;
  const domains = solutionDomains.solutionDomainsSection;
  const finalCta = home.homeFinalCta;

  return (
    <>
      {/* --- Hero (plain placeholder for the 3D hero) --- */}
      <HeroSection
        eyebrow={hero.eyebrow.value}
        headingLines={hero.headingLines.value}
        subheading={hero.subheading.value}
        primaryCta={{ label: hero.ctaPrimary.value, to: "/request-demo" }}
        secondaryCta={{ label: hero.ctaSecondary.value, to: "/platform" }}
        badges={hero.badges.map((b) => b.value)}
      >
        <p className="font-body text-xs uppercase tracking-widest text-current/40">
          Plain layout placeholder — the 3D sculpture hero and scroll story ship in a later pass.
        </p>
      </HeroSection>

      {/* --- Execution Gap --- */}
      <PageSection tone="ivory" containerClassName="gap-10">
        <SectionHeading eyebrow={gap.eyebrow.value} heading={gap.headingLines.value.join(" ")} description={gap.intro.value} />
        <StatStrip
          items={gap.statStrip.map((s) => ({ key: s.label.value, label: s.label.value, value: s.value.value, qualifier: s.value.qualifier }))}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {gap.pairs.map((pair) => (
            <div key={pair.problemStat.value} className="flex flex-col gap-4 rounded-lg border border-current/15 p-6">
              <div>
                <p className="font-body text-xs uppercase tracking-widest text-current/50">{pair.problemLabel.value}</p>
                <p className="font-display text-xl text-current/60 line-through decoration-current/30">{pair.problemStat.value}</p>
                <p className="mt-1 font-body text-sm text-current/60">{pair.problemDescription.value}</p>
              </div>
              <div className="border-t border-current/10 pt-4">
                <p className="font-body text-xs uppercase tracking-widest text-coral">{pair.solutionLabel.value}</p>
                <p className="font-display text-xl text-coral">
                  {pair.solutionStat.qualifier ? `${pair.solutionStat.qualifier} ` : ""}
                  {pair.solutionStat.value}
                </p>
                <p className="mt-1 font-body text-sm text-current/70">{pair.solutionDescription.value}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="font-body text-sm text-current/50">
          The "73% Cost Reduction" figure above and the "57% Cost Reduction" figure in the ROI section further down
          this page are not the same measurement.
          <GapNote gapId={gap.gapRef} label="73% vs 57% — why they differ" className="ml-2" />
        </p>
      </PageSection>

      {/* --- Platform overview: Studio + EEF --- */}
      <PageSection tone="obsidian" containerClassName="gap-10">
        <SectionHeading eyebrow={platformSection.eyebrow.value} heading={platformSection.headingLines.value.join(" ")} description={platformSection.intro.value} />
        <p className="font-body text-sm uppercase tracking-widest text-champagne">{platformSection.flowLabel.value}</p>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {[platformSection.studio, platformSection.eef].map((product) => (
            <div key={product.name.value} className="flex flex-col gap-4">
              <div>
                <h3 className="font-display text-2xl">{product.name.value}</h3>
                <p className="font-body text-sm text-coral">{product.tagline.value}</p>
              </div>
              <ul className="flex flex-col gap-3">
                {product.features.map((f) => (
                  <li key={f.name.value} className="border-l-2 border-current/15 pl-4">
                    <p className="font-medium">{f.name.value}</p>
                    <p className="font-body text-sm text-current/70">{f.description.value}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PageSection>

      {/* --- How It Works: both processes, clearly labeled --- */}
      <PageSection tone="ivory" containerClassName="gap-14">
        <SectionHeading eyebrow={howItWorksHome.eyebrow.value} heading="How It Works" description={howItWorksHome.intro.value} />

        <div className="flex flex-col gap-6">
          <h3 className="font-display text-xl text-coral">Homepage version — 4 steps</h3>
          <StepList
            steps={howItWorksHome.steps.map((s) => ({ key: s.name.value, name: s.name.value, description: s.description?.value ?? null }))}
          />
        </div>

        <div className="flex flex-col gap-6 border-t border-current/15 pt-14">
          <h3 className="font-display text-xl text-champagne">/platform version — 5 steps</h3>
          <StepList
            steps={howItWorksPlatform.steps.map((s) => ({ key: s.name.value, name: s.name.value, description: s.description.value }))}
          />
        </div>

        <p className="font-body text-sm text-current/50">
          These are two independently sourced, equally current descriptions of the same overall engagement at
          different levels of granularity — neither supersedes the other.
          <GapNote gapId={howItWorksHome.gapRef} label="Why there are two processes" className="ml-2" />
        </p>
      </PageSection>

      {/* --- Integration Ecosystem --- */}
      <PageSection tone="obsidian">
        <SectionHeading eyebrow={integrations.eyebrow.value} heading={integrations.headingLines.value.join(" ")} description={integrations.intro.value} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.items.map((item) => (
            <div key={item.name.value} className="flex flex-col gap-2 rounded-lg border border-current/15 p-6">
              <p className="font-body text-xs uppercase tracking-widest text-champagne">{item.category.value}</p>
              <h3 className="font-display text-xl">{item.name.value}</h3>
              <p className="font-body text-sm text-current/70">{item.description.value}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag.value} label={tag.value} tone="subtle" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      {/* --- 10 Solution Domains (plain grid for now) --- */}
      <PageSection tone="ivory" containerClassName="gap-8">
        <SectionHeading eyebrow={domains.eyebrow.value} heading={domains.headingLines.value.join(" ")} description={domains.intro.value} />
        <div className="flex flex-wrap gap-2">
          {domains.filters.map((f) => (
            <Badge key={f.value} label={f.value} tone="outline" />
          ))}
        </div>
        <p className="font-body text-sm text-current/60">
          Shown here as a plain grid; showcase-and-timeline builds the animated horizontal version. This is a
          different taxonomy from /use-cases' 4-category breakdown.
          <GapNote gapId={solutionDomains.solutionDomainsGapRef} label="Why two taxonomies" className="ml-2" />
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutionDomains.solutionDomains.map((d) => (
            <div key={d.name.value} className="flex flex-col gap-2 rounded-lg border border-current/15 p-6">
              <h3 className="font-display text-lg">{d.name.value}</h3>
              <p className="font-body text-sm text-current/70">{d.description.value}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {d.workflowSteps.map((step, i) => (
                  <span key={step.value} className="font-body text-xs text-current/50">
                    {step.value}
                    {i < d.workflowSteps.length - 1 ? " → " : ""}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      {/* --- Delivery Model (plain list/timeline) --- */}
      <PageSection tone="obsidian" containerClassName="gap-10">
        <SectionHeading
          eyebrow={deliveryModel.deliveryModelSection.eyebrow.value}
          heading={deliveryModel.deliveryModelSection.headingLines.value.join(" ")}
          description={deliveryModel.deliveryModelSection.intro.value}
        />
        <div className="flex flex-wrap gap-2">
          {deliveryModel.deliveryModelSection.macroStages.map((stage) => (
            <Badge key={stage.value} label={stage.value} tone="subtle" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {deliveryModel.deliveryPhases.map((phase, i) => (
            <div key={phase.name.value} className="flex flex-col gap-3 border-l-2 border-champagne/40 pl-5">
              <span className="font-display text-3xl text-coral">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-lg">{phase.name.value}</h3>
                <p className="font-body text-xs uppercase tracking-widest text-current/50">{phase.monthRange.value}</p>
              </div>
              <p className="font-body text-sm text-current/70">{phase.description.value}</p>
              <ul className="flex flex-col gap-1 font-body text-xs text-current/60">
                {phase.milestones.map((m) => (
                  <li key={m.value}>— {m.value}</li>
                ))}
              </ul>
              <div className="mt-1 flex flex-col gap-1 text-xs">
                <span className="text-champagne">SmartCycleAI: {phase.lanes.smartCycleAI.value}</span>
                <span className="text-current/60">Your Team: {phase.lanes.yourTeam.value}</span>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      {/* --- ROI: static comparison table only --- */}
      <PageSection tone="ivory" containerClassName="gap-8">
        <SectionHeading eyebrow={roi.roiSection.eyebrow.value} heading={roi.roiSection.headingLines.value.join(" ")} description={roi.roiSection.intro.value} />
        <ComparisonRows
          rows={roi.roiComparisonTable.map((row) => ({ key: row.label.value, label: row.label.value, before: row.before.value, after: row.after.value }))}
          footnote={
            <p className="font-body text-sm text-current/50">
              This is the live site's static before/after comparison strip. The homepage's ROI Impact section is
              actually an interactive calculator with slider inputs — that calculator (and its default 57% cost
              reduction / $1.7M savings / 68% faster time-to-production outputs) is built separately by
              showcase-and-timeline, not rendered here.
              <GapNote gapId="roi-calculator-dynamic" label="Why no calculator here" className="ml-2" />
            </p>
          }
        />
      </PageSection>

      <CtaBand
        tone="obsidian"
        heading={finalCta.headingLines.value.join(" ")}
        supporting={finalCta.subheading.value}
        primaryCta={{ label: finalCta.ctaPrimary.value, to: "/request-demo" }}
        secondaryCta={{ label: finalCta.ctaSecondary.value, to: "/contact" }}
      />
    </>
  );
}
