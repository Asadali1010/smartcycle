import { SectionHeading } from "@/design-system";
import { PageSection } from "@/components/common/PageSection";
import { GapNote } from "@/components/common/GapNote";
import { privacy } from "@/content";

export function PrivacyPage() {
  return (
    <>
      <PageSection tone="dark" className="pt-40 md:pt-48" containerClassName="max-w-3xl gap-4">
        <SectionHeading eyebrow={`Last updated ${privacy.privacyLastUpdated.value}`} heading={privacy.privacyMeta.title.value.replace(" | SmartCycleAI", "")} level="h1" />
      </PageSection>

      <PageSection tone="light" containerClassName="max-w-3xl gap-10">
        {privacy.privacySections.map((section) => (
          <div key={section.heading.value} className="flex flex-col gap-2 border-b border-current/10 pb-8 last:border-none">
            <h2 className="font-inter text-heading font-semibold">{section.heading.value}</h2>
            <p className="font-inter text-base leading-relaxed text-current/70">{section.summary.value}</p>
          </div>
        ))}

        <div className="flex flex-col gap-2">
          <h2 className="font-inter text-heading font-semibold">Contact</h2>
          <p className="font-inter text-base leading-relaxed text-current/70">
            {privacy.privacyContact.legalEntity.value} —{" "}
            <a
              href={`mailto:${privacy.privacyContact.email.value}`}
              className="text-electric-iris underline underline-offset-4"
            >
              {privacy.privacyContact.email.value}
            </a>
          </p>
          <GapNote gapId="contact-email-obfuscated" label="Why this address needed manual verification" />
        </div>
      </PageSection>
    </>
  );
}
