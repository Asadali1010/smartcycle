import clsx from "clsx";
import { gaps } from "@/content";

export interface GapNoteProps {
  /** id of a GapEntry in src/content/gaps.ts */
  gapId: string;
  label?: string;
  className?: string;
}

/**
 * Small, visible, native <details> disclosure that surfaces a tracked
 * content gap/discrepancy inline wherever it's relevant, instead of the page
 * silently picking one version of a conflicting fact and dropping the
 * other. Renders nothing if the id doesn't resolve (fails safe/quiet rather
 * than crashing a page over a typo'd id).
 */
export function GapNote({ gapId, label = "Content note", className }: GapNoteProps) {
  const gap = gaps.GAPS_BY_ID[gapId];
  if (!gap) return null;

  return (
    <details className={clsx("group mt-2 inline-block max-w-full align-top text-left", className)}>
      <summary
        className={clsx(
          "inline-flex cursor-pointer list-none items-center gap-1.5 font-body text-xs font-medium uppercase",
          "tracking-[0.2em] text-champagne underline decoration-dotted decoration-1 underline-offset-4",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral",
        )}
      >
        <span aria-hidden="true">ⓘ</span>
        {label}
      </summary>
      <div className="mt-3 max-w-md rounded-md border border-current/15 bg-current/5 p-4 font-body text-sm normal-case tracking-normal text-current/80">
        <p className="mb-1.5 font-medium text-current">{gap.title}</p>
        <p>{gap.description}</p>
      </div>
    </details>
  );
}
