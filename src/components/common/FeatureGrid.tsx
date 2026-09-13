import type { ReactNode } from "react";
import clsx from "clsx";

export interface FeatureGridItem {
  key: string;
  name: string;
  description: string;
  tag?: string;
  footnote?: ReactNode;
}

export interface FeatureGridProps {
  items: FeatureGridItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const COLUMN_STYLES: Record<NonNullable<FeatureGridProps["columns"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * Plain responsive card grid for name/description feature lists — used for
 * value props, pain points, capabilities, benefits, etc. across every
 * content-driven page. No motion; a later pass may add scroll choreography.
 */
export function FeatureGrid({ items, columns = 2, className }: FeatureGridProps) {
  return (
    <div className={clsx("grid grid-cols-1 gap-6", COLUMN_STYLES[columns], className)}>
      {items.map((item) => (
        <div key={item.key} className="flex flex-col gap-2 rounded-lg border border-current/15 p-6">
          {item.tag ? (
            <p className="font-inter text-xs font-medium uppercase tracking-[0.2em] text-ember-pulse">{item.tag}</p>
          ) : null}
          <h3 className="font-inter text-xl font-semibold">{item.name}</h3>
          <p className="font-inter text-sm leading-relaxed text-current/70">{item.description}</p>
          {item.footnote}
        </div>
      ))}
    </div>
  );
}
