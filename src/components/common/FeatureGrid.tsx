import type { ReactNode } from "react";
import clsx from "clsx";
import { ShowcaseCard } from "@/design-system";

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
  /** "showcase" renders the premium dark art-zone card used for use-case/solution-domain listings. */
  variant?: "plain" | "showcase";
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
export function FeatureGrid({ items, columns = 2, className, variant = "plain" }: FeatureGridProps) {
  return (
    <div className={clsx("grid grid-cols-1 items-stretch gap-6", COLUMN_STYLES[columns], className)}>
      {items.map((item, i) =>
        variant === "showcase" ? (
          <ShowcaseCard
            key={item.key}
            index={i + 1}
            label={item.tag ?? "Use Case"}
            title={item.name}
            description={item.description}
            footnote={item.footnote}
            className="h-full"
          />
        ) : (
          <div key={item.key} className="flex flex-col gap-2 rounded-lg border border-current/15 p-6">
            {item.tag ? (
              <p className="font-body text-xs font-medium uppercase tracking-[0.2em] text-coral">{item.tag}</p>
            ) : null}
            <h3 className="font-display text-xl">{item.name}</h3>
            <p className="font-body text-sm leading-relaxed text-current/70">{item.description}</p>
            {item.footnote}
          </div>
        ),
      )}
    </div>
  );
}
