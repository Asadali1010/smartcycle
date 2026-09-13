import { Badge, SectionHeading } from "@/design-system";
import { ExecutionGapPair } from "@/components/scroll-story/ExecutionGapPair";
import { PlatformFeatureRail } from "@/components/scroll-story/PlatformFeatureRail";
import { IntegrationNetwork } from "@/components/scroll-story/IntegrationNetwork";
import { PageSection } from "@/components/common/PageSection";
import { StepList } from "@/components/common/StepList";
import { StatStrip } from "@/components/common/StatStrip";
import { CtaBand } from "@/components/common/CtaBand";
import { GapNote } from "@/components/common/GapNote";
import { Hero } from "@/components/hero/Hero";
import { ScrollStory } from "@/components/scroll-story/ScrollStory";
import { UseCaseShowcase } from "@/components/showcase";
import { DeliveryTimeline } from "@/components/timeline";
import { RoiCalculatorIllustrative } from "@/components/roi";
import { home, platform, solutionDomains, deliveryModel, roi } from "@/content";

// three.js/R3F/postprocessing are already isolated from every other route by
// router.tsx's route-level code-splitting (only "/" pulls this chunk in), so
// Hero is imported directly here rather than through a second, inner
// Suspense/lazy boundary — nesting one caused an R3F Canvas + React 19
// StrictMode remount race (a documented insertBefore DOM crash) with no
// bundle-size benefit, since ScrollStory below needs the same three.js chunk
// eagerly anyway.
export function HomePage() {
  const gap = home.executionGap;
  const platformSection = home.platformSection;
  const howItWorksHome = home.howItWorksHome;
  const howItWorksPlatform = platform.platformHowItWorks;
  const integrations = home.integrationEcosystem;
  const domains = solutionDomains.solutionDomainsSection;
  const finalCta = home.homeFinalCta;

  return (
    <>
      {/* --- Hero: real 3D sculpture --- */}
      <Hero />

      {/* --- Scroll story: Build -> Govern -> Deploy continues into the platform narrative --- */}
      <ScrollStory />

      {/* --- Execution Gap --- */}
      <PageSection tone="ivory" intensity="vivid" containerClassName="gap-10">
        <SectionHeading eyebrow={gap.eyebrow.value} heading={gap.headingLines.value.join(" ")} description={gap.intro.value} />
        <StatStrip
          items={gap.statStrip.map((s) => ({ key: s.label.value, label: s.label.value, value: s.value.value, qualifier: s.value.qualifier }))}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {gap.pairs.map((pair) => (
            <ExecutionGapPair
              key={pair.problemStat.value}
              problemLabel={pair.problemLabel.value}
              problemStat={pair.problemStat.value}
              problemDescription={pair.problemDescription.value}
              solutionLabel={pair.solutionLabel.value}
              solutionStat={pair.solutionStat.value}
              solutionQualifier={pair.solutionStat.qualifier}
              solutionDescription={pair.solutionDescription.value}
            />
          ))}
        </div>
        <div className="font-body text-sm text-current/50">
          The "73% Cost Reduction" figure above and the "57% Cost Reduction" figure in the ROI section further down
          this page are not the same measurement.
          <GapNote gapId={gap.gapRef} label="73% vs 57% — why they differ" className="ml-2" />
        </div>
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
              <PlatformFeatureRail
                features={product.features.map((f) => ({ name: f.name.value, description: f.description.value }))}
              />
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
            traced
          />
        </div>

        <div className="flex flex-col gap-6 border-t border-current/15 pt-14">
          <h3 className="font-display text-xl text-champagne">/platform version — 5 steps</h3>
          <StepList
            steps={howItWorksPlatform.steps.map((s) => ({ key: s.name.value, name: s.name.value, description: s.description.value }))}
            traced
          />
        </div>

        <div className="font-body text-sm text-current/50">
          These are two independently sourced, equally current descriptions of the same overall engagement at
          different levels of granularity — neither supersedes the other.
          <GapNote gapId={howItWorksHome.gapRef} label="Why there are two processes" className="ml-2" />
        </div>
      </PageSection>

      {/* --- Integration Ecosystem --- */}
      <PageSection tone="obsidian">
        <SectionHeading eyebrow={integrations.eyebrow.value} heading={integrations.headingLines.value.join(" ")} description={integrations.intro.value} />
        <IntegrationNetwork
          items={integrations.items.map((item) => ({
            name: item.name.value,
            category: item.category.value,
            description: item.description.value,
            tags: item.tags.map((tag) => tag.value),
          }))}
        />
      </PageSection>

      {/* --- 10 Solution Domains + Use Cases: real pinned horizontal showcase --- */}
      <PageSection tone="ivory" intensity="vivid" containerClassName="gap-6">
        <SectionHeading eyebrow={domains.eyebrow.value} heading={domains.headingLines.value.join(" ")} description={domains.intro.value} />
        <div className="flex flex-wrap gap-2">
          {domains.filters.map((f) => (
            <Badge key={f.value} label={f.value} tone="outline" />
          ))}
        </div>
        <div className="font-body text-sm text-current/60">
          This is a different taxonomy from /use-cases' 4-category breakdown — the showcase below includes both.
          <GapNote gapId={solutionDomains.solutionDomainsGapRef} label="Why two taxonomies" className="ml-2" />
        </div>
      </PageSection>
      <UseCaseShowcase />

      {/* --- Delivery Model: scroll-driven 12-month timeline --- */}
      <PageSection tone="obsidian" intensity="vivid" containerClassName="gap-10">
        <SectionHeading
          eyebrow={deliveryModel.deliveryModelSection.eyebrow.value}
          heading={deliveryModel.deliveryModelSection.headingLines.value.join(" ")}
          description={deliveryModel.deliveryModelSection.intro.value}
        />
        <DeliveryTimeline />
      </PageSection>

      {/* --- ROI: interactive illustrative calculator --- */}
      <PageSection tone="ivory" intensity="vivid" containerClassName="gap-8">
        <SectionHeading eyebrow={roi.roiSection.eyebrow.value} heading={roi.roiSection.headingLines.value.join(" ")} description={roi.roiSection.intro.value} />
        <RoiCalculatorIllustrative />
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
