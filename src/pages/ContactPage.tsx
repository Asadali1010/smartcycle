import { Badge, SectionHeading } from "@/design-system";
import { PageSection } from "@/components/common/PageSection";
import { StepList } from "@/components/common/StepList";
import { GapNote } from "@/components/common/GapNote";
import { FormDisclosure } from "@/components/forms/FormDisclosure";
import { ContactForm } from "@/components/forms/ContactForm";
import { contact } from "@/content";

export function ContactPage() {
  return (
    <>
      <PageSection tone="dark" className="pt-40 md:pt-48">
        <SectionHeading eyebrow={contact.contactLocation.display.value} heading={contact.contactHero.heading.value} level="h1" />
        <div className="flex flex-wrap gap-3">
          {contact.contactTrustBadges.map((badge) => (
            <Badge key={badge.value} label={badge.value} tone="outline" />
          ))}
        </div>
        <p className="font-body text-sm text-current/60">
          Email us directly at{" "}
          <a href={`mailto:${contact.contactEmail.value}`} className="text-ember-pulse underline underline-offset-4">
            {contact.contactEmail.value}
          </a>
          .{" "}
          <GapNote gapId="contact-email-obfuscated" label="Why this needed manual verification" />
        </p>
      </PageSection>

      <PageSection tone="light">
        <SectionHeading eyebrow="What Happens Next" heading="A No-Pressure Process" level="h2" />
        <StepList
          steps={contact.contactProcess.map((step, i) => ({
            key: `${i}-${step.name.value}`,
            name: step.name.value,
            description: step.description.value,
          }))}
        />
      </PageSection>

      <PageSection tone="dark" containerClassName="max-w-3xl gap-8">
        <SectionHeading heading="Request a Demo" level="h2" />
        <FormDisclosure />
        <ContactForm />
      </PageSection>
    </>
  );
}
