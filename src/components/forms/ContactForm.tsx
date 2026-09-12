import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import clsx from "clsx";
import { Button } from "@/design-system";
import { contact } from "@/content";

/**
 * Structural field config matched against content/contact.ts's
 * `demoFormFields` by exact label text — the *copy* (labels, option text)
 * always comes from content; these keys/types/autoComplete hints are just
 * internal wiring, not copy.
 */
const FIELD_CONFIG = [
  { key: "firstName", match: "First Name", kind: "input", type: "text", autoComplete: "given-name" },
  { key: "lastName", match: "Last Name", kind: "input", type: "text", autoComplete: "family-name" },
  { key: "workEmail", match: "Work Email", kind: "input", type: "email", autoComplete: "email" },
  { key: "phone", match: "Phone", kind: "input", type: "tel", autoComplete: "tel" },
  { key: "organization", match: "Organization", kind: "input", type: "text", autoComplete: "organization" },
  { key: "title", match: "Title", kind: "input", type: "text", autoComplete: "organization-title" },
  { key: "organizationSize", match: "Organization Size", kind: "select" },
  { key: "primaryInterest", match: "Primary Interest", kind: "select" },
  { key: "message", match: "Message", kind: "textarea" },
  { key: "hearAboutUs", match: "How did you hear about us", kind: "select" },
] as const;

type FieldKey = (typeof FIELD_CONFIG)[number]["key"];

const contactFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  workEmail: z.string().trim().min(1, "Work email is required").email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .regex(/^[0-9+()\-.\s]+$/, "Use digits and phone punctuation only"),
  organization: z.string().trim().min(1, "Organization is required"),
  title: z.string().trim().min(1, "Title is required"),
  organizationSize: z.string().min(1, "Select an organization size"),
  primaryInterest: z.string().min(1, "Select a primary interest"),
  message: z.string().trim().min(10, "Tell us a bit more (10 characters minimum)"),
  hearAboutUs: z.string().min(1, "Select an option"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const DEFAULT_VALUES: ContactFormValues = {
  firstName: "",
  lastName: "",
  workEmail: "",
  phone: "",
  organization: "",
  title: "",
  organizationSize: "",
  primaryInterest: "",
  message: "",
  hearAboutUs: "",
};

const FIELD_CLASSES =
  "w-full rounded-md border bg-transparent px-4 py-3 font-body text-sm text-current placeholder:text-current/40 " +
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral";

/**
 * Shared form used by both /contact and /request-demo so they never drift.
 * react-hook-form + zod for real client-side validation with visible error
 * states; on successful validation it shows a neutral "validated locally"
 * state rather than a fabricated success/confirmation toast — there is no
 * real backend behind this prototype.
 */
export function ContactForm() {
  const [validated, setValidated] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(() => {
    setValidated(true);
  });

  if (validated) {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-lg border border-champagne/40 bg-champagne/5 px-6 py-10 text-center"
      >
        <p className="font-display text-2xl">Validated locally</p>
        <p className="max-w-md font-body text-sm text-current/70">
          In production this would submit to a CRM/endpoint. No data has actually been transmitted or stored — this
          is a local prototype.
        </p>
        <button
          type="button"
          onClick={() => {
            reset();
            setValidated(false);
          }}
          className="mt-2 font-body text-sm uppercase tracking-widest text-coral underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
        >
          Fill out another response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {contact.demoFormFields.map((field) => {
          const config = FIELD_CONFIG.find((c) => c.match === field.name.value);
          if (!config) return null;
          const key = config.key as FieldKey;
          const error = errors[key];
          const wide = config.kind === "textarea";
          const borderClass = error ? "border-coral" : "border-current/25";

          return (
            <div key={key} className={clsx("flex flex-col gap-2", wide && "sm:col-span-2")}>
              <label htmlFor={key} className="font-body text-xs uppercase tracking-widest text-current/70">
                {field.name.value}
              </label>

              {config.kind === "select" ? (
                <select
                  id={key}
                  defaultValue=""
                  {...register(key)}
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? `${key}-error` : undefined}
                  className={clsx(FIELD_CLASSES, borderClass)}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.value}
                    </option>
                  ))}
                </select>
              ) : config.kind === "textarea" ? (
                <textarea
                  id={key}
                  rows={5}
                  {...register(key)}
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? `${key}-error` : undefined}
                  className={clsx(FIELD_CLASSES, borderClass)}
                />
              ) : (
                <input
                  id={key}
                  type={config.type}
                  autoComplete={config.autoComplete}
                  {...register(key)}
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? `${key}-error` : undefined}
                  className={clsx(FIELD_CLASSES, borderClass)}
                />
              )}

              {error ? (
                <p id={`${key}-error`} role="alert" className="font-body text-xs text-coral">
                  {error.message}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Validating…" : "Submit"}
      </Button>
    </form>
  );
}
