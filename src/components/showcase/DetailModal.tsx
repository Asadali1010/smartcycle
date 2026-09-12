import { useEffect, useRef } from "react";
import type { ShowcaseItem } from "./data";

export interface DetailModalProps {
  item: ShowcaseItem | null;
  onClose: () => void;
}

/**
 * Full-detail view for a single use case / solution domain, shared by both
 * the desktop and mobile renderers so "every item's full description is
 * reachable, not just a truncated card excerpt" holds in both layouts.
 * Uses the native <dialog> element: free focus containment, Escape-to-close,
 * and backdrop semantics without hand-rolling a focus trap.
 */
export function DetailModal({ item, onClose }: DetailModalProps) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // Feature-detect rather than assume: HTMLDialogElement.showModal/close are
    // unsupported in a couple of older WebKit releases and in jsdom (test env).
    if (item && !dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    } else if (!item && dialog.open) {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    }
  }, [item]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      className="w-[calc(100%-2rem)] max-w-lg rounded-xl border border-current/15 bg-obsidian p-0 text-ivory backdrop:bg-obsidian/70"
    >
      {item ? (
        <div className="flex flex-col gap-4 p-8">
          <p className="font-body text-xs font-medium uppercase tracking-[0.2em] text-champagne">
            {item.taxonomy === "use-cases" ? "Use Case" : "Solution Domain"} — {item.eyebrow}
          </p>
          <h3 className="font-display text-2xl">{item.title}</h3>
          <p className="font-body text-base leading-relaxed text-current/80">{item.description}</p>
          {item.meta?.length ? (
            <div className="flex flex-wrap items-center gap-1.5 font-body text-xs text-current/60">
              {item.meta.map((step, i) => (
                <span key={step}>
                  {step}
                  {i < item.meta!.length - 1 ? <span aria-hidden="true"> → </span> : null}
                </span>
              ))}
            </div>
          ) : null}
          <p className="font-body text-xs text-current/40">
            Source: {item.sourceUrl} · verified {item.lastVerified}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="self-end font-body text-sm font-medium uppercase tracking-widest text-coral focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
          >
            Close
          </button>
        </div>
      ) : null}
    </dialog>
  );
}
