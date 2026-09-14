import type { PointerEvent, ReactNode, Ref } from "react";
import clsx from "clsx";
import { CardParticleArt, type CardParticleArtHandle } from "./CardParticleArt";

export interface ShowcaseCardProps {
  /** Ordinal shown as a large numeral in the art zone (1-indexed). Omit to hide it. */
  index?: number;
  /** Small uppercase label inside the art zone, e.g. the taxonomy or category name. */
  label: string;
  /** Uppercase line above the heading, in champagne. Defaults to `label` when omitted. */
  eyebrow?: string;
  title: string;
  description: string;
  /** Optional workflow-step chips, joined with an arrow. */
  meta?: string[];
  footnote?: ReactNode;
  /** Clamp class for the description — callers tune this per layout density. */
  descriptionClassName?: string;
  /** When provided, the card renders as a button and shows a "View details" footer. */
  onSelect?: () => void;
  /**
   * When true (default), the art-zone particle animation tracks this card's
   * own scroll position. Set false when an ancestor (e.g. a pinned carousel
   * that already tracks scroll progress) drives it via `artRef` instead.
   */
  scrollLinked?: boolean;
  /** Imperative handle for an ancestor driving the art-zone animation directly. */
  artRef?: Ref<CardParticleArtHandle>;
  className?: string;
}

function handlePointerMove(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
  event.currentTarget.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
}

function handlePointerLeave(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.removeProperty("--mx");
  event.currentTarget.style.removeProperty("--my");
}

/**
 * Premium dark chassis card for use-case and solution-domain listings: a
 * numbered art zone over a radial coral/violet wash, a champagne eyebrow +
 * serif heading, and (when interactive) a coral "View details" footer with a
 * pointer-tracked highlight. Presentational only — content and selection
 * behavior are supplied by the caller.
 */
export function ShowcaseCard({
  index,
  label,
  eyebrow,
  title,
  description,
  meta,
  footnote,
  descriptionClassName,
  onSelect,
  scrollLinked = true,
  artRef,
  className,
}: ShowcaseCardProps) {
  const chrome = clsx(
    "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ivory/10 bg-obsidian text-left shadow-[0_28px_70px_-28px_rgba(0,0,0,0.7)]",
    "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300 before:content-['']",
    "before:[background-image:radial-gradient(360px_circle_at_var(--mx,50%)_var(--my,20%),rgba(255,101,79,0.14),transparent_65%)]",
    onSelect &&
      "transition-[transform,border-color] duration-300 hover:border-coral/40 hover:before:opacity-100 motion-safe:hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral",
    className,
  );

  const body = (
    <>
      <div className="relative h-[38%] min-h-[104px] shrink-0 overflow-hidden bg-[radial-gradient(ellipse_at_30%_65%,rgba(255,101,79,0.16),transparent_65%),radial-gradient(ellipse_at_75%_35%,rgba(155,111,201,0.18),transparent_65%)]">
        <CardParticleArt
          ref={artRef}
          variant={((typeof index === "number" ? index - 1 : 0) % 3) as 0 | 1 | 2}
          scrollLinked={scrollLinked}
          className="absolute inset-0 h-full w-full"
        />
        <span className="absolute left-5 top-4 font-body text-[10px] font-medium uppercase tracking-[0.24em] text-ivory/60">
          {label}
        </span>
        {typeof index === "number" ? (
          <span className="absolute right-5 top-3 font-display text-2xl italic text-ivory/35">
            {String(index).padStart(2, "0")}
          </span>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-obsidian to-transparent" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        {eyebrow ? (
          <p className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-champagne">{eyebrow}</p>
        ) : null}
        <h3 className="font-display text-xl leading-tight text-ivory">{title}</h3>
        <p className={clsx("font-body text-sm leading-relaxed text-ivory/65", descriptionClassName ?? "line-clamp-3")}>
          {description}
        </p>
        {meta?.length ? <p className="font-body text-xs text-ivory/45">{meta.join(" → ")}</p> : null}
        {footnote}
        {onSelect ? (
          <div className="mt-auto flex items-center justify-between border-t border-ivory/10 pt-3">
            <span className="font-body text-[10px] font-medium uppercase tracking-[0.2em] text-coral">
              View details
            </span>
            <span
              aria-hidden="true"
              className="grid h-7 w-7 place-items-center rounded-full bg-coral/10 text-sm text-coral transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
            >
              ↗
            </span>
          </div>
        ) : null}
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={chrome}
      >
        {body}
      </button>
    );
  }

  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} className={chrome}>
      {body}
    </div>
  );
}
