import { SectionHeading } from "@/design-system";
import { PageSection } from "@/components/common/PageSection";
import { GapNote } from "@/components/common/GapNote";
import { FormDisclosure } from "@/components/forms/FormDisclosure";
import { ContactForm } from "@/components/forms/ContactForm";
import { requestDemo } from "@/content";

/**
 * The live site has no independent /request-demo content — it 307-redirects
 * to /contact (see gaps.ts `request-demo-redirects-to-contact`). This
 * redesign's choice: keep /request-demo as its own route rendering the same
 * shared contact/demo form section as /contact (rather than performing a
 * client-side redirect), with a visible note explaining why the content is
 * identical instead of silently duplicating /contact without comment.
 */
export function RequestDemoPage() {
  return (
    <>
      <PageSection tone="obsidian" className="pt-40 md:pt-48" containerClassName="max-w-3xl gap-6">
        <SectionHeading eyebrow="Request a Demo" heading="See SmartCycleAI In Action" level="h1" />
        <div className="font-body text-sm text-current/70">
          On the live SmartCycleAI site, <code className="rounded bg-current/10 px-1.5 py-0.5">/request-demo</code>{" "}
          has no page of its own — it issues an HTTP 307 redirect to{" "}
          <code className="rounded bg-current/10 px-1.5 py-0.5">/contact</code>. This redesign keeps{" "}
          <code className="rounded bg-current/10 px-1.5 py-0.5">/request-demo</code> as a real route rendering the
          same shared demo-request form as /contact, rather than inventing unique copy for a page that doesn't exist.
          <GapNote gapId="request-demo-redirects-to-contact" label="Why this page mirrors /contact" className="ml-2" />
        </div>
        <dl className="grid grid-cols-1 gap-4 border-t border-current/15 pt-6 font-body text-sm sm:grid-cols-3">
          <div>
            <dt className="text-current/50 uppercase tracking-widest text-xs">Live site source</dt>
            <dd className="mt-1">{requestDemo.requestDemoRedirect.from.value}</dd>
          </div>
          <div>
            <dt className="text-current/50 uppercase tracking-widest text-xs">Redirects to</dt>
            <dd className="mt-1">{requestDemo.requestDemoRedirect.to.value}</dd>
          </div>
          <div>
            <dt className="text-current/50 uppercase tracking-widest text-xs">Mechanism</dt>
            <dd className="mt-1">
              HTTP {requestDemo.requestDemoRedirect.status.value} — {requestDemo.requestDemoRedirect.mechanism.value}
            </dd>
          </div>
        </dl>
      </PageSection>

      <PageSection tone="ivory" containerClassName="max-w-3xl gap-8">
        <SectionHeading heading="Request a Demo" level="h2" />
        <FormDisclosure />
        <ContactForm />
      </PageSection>
    </>
  );
}
