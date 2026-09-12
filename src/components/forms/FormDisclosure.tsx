/**
 * Always rendered above ContactForm on both /contact and /request-demo.
 * There is no real backend in this prototype — this disclosure and the
 * "validated locally" post-submit state (see ContactForm) are the only
 * honest way to represent that; a fabricated success/confirmation toast is
 * a non-negotiable per CLAUDE.md.
 */
export function FormDisclosure() {
  return (
    <div className="rounded-lg border border-champagne/40 bg-champagne/5 px-6 py-4 font-body text-sm text-current/80">
      <p>
        <span className="font-medium text-current">This is a local prototype.</span> No data is transmitted or
        stored.
      </p>
    </div>
  );
}
