import clsx from "clsx";

export interface StatStripItem {
  key: string;
  label?: string;
  value: string;
  qualifier?: string;
  caption?: string;
}

export interface StatStripProps {
  items: StatStripItem[];
  className?: string;
}

/** Row of oversized number/label stat chips (execution-gap stat strip, mission stats, etc). */
export function StatStrip({ items, className }: StatStripProps) {
  return (
    <div className={clsx("grid grid-cols-1 gap-8 sm:grid-cols-3", className)}>
      {items.map((item) => (
        <div key={item.key} className="flex flex-col gap-1">
          {item.label ? (
            <p className="font-body text-xs uppercase tracking-[0.2em] text-current/60">{item.label}</p>
          ) : null}
          <p className="font-display text-display-sm">
            {item.qualifier ? <span className="mr-2 text-base text-coral align-middle">{item.qualifier}</span> : null}
            {item.value}
          </p>
          {item.caption ? <p className="font-body text-sm text-current/60">{item.caption}</p> : null}
        </div>
      ))}
    </div>
  );
}
