import { SectionHeading } from "@/design-system";
import { PageSection } from "@/components/common/PageSection";
import { GapNote } from "@/components/common/GapNote";
import { terms } from "@/content";

export function TermsPage() {
  return (
    <>
      <PageSection tone="obsidian" className="pt-40 md:pt-48" containerClassName="max-w-3xl gap-4">
        <SectionHeading eyebrow={`Last updated ${terms.termsLastUpdated.value}`} heading={terms.termsMeta.title.value.replace(" | SmartCycleAI", "")} level="h1" />
      </PageSection>

      <PageSection tone="ivory" containerClassName="max-w-3xl gap-10">
        {terms.termsSections.map((section) => (
          <div key={section.heading.value} className="flex flex-col gap-2 border-b border-current/10 pb-8 last:border-none">
            <h2 className="font-display text-2xl">{section.heading.value}</h2>
            <p className="font-body text-base leading-relaxed text-current/70">{section.summary.value}</p>
          </div>
        ))}

        <div className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">Contact</h2>
          <p className="font-body text-base leading-relaxed text-current/70">
            {terms.termsContact.legalEntity.value} —{" "}
            <a href={`mailto:${terms.termsContact.email.value}`} className="text-coral underline underline-offset-4">
              {terms.termsContact.email.value}
            </a>
          </p>
          <p className="font-body text-sm text-current/60">
            Governing law: {terms.termsContact.governingLawJurisdiction.value}
          </p>
          <GapNote gapId="contact-email-obfuscated" label="Why this address needed manual verification" />
        </div>
      </PageSection>
    </>
  );
}
