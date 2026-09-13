import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import clsx from "clsx";
import { LetterRoll } from "./LetterRoll";

export type ButtonVariant = "primary" | "secondary" | "white";
export type ButtonSize = "md" | "lg";

type OwnProps<T extends ElementType> = {
  /** Render as a different element/component (e.g. react-router's `Link`). */
  as?: T;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
};

export type ButtonProps<T extends ElementType = "button"> = OwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof OwnProps<T>>;

const BASE =
  "group relative isolate overflow-hidden inline-flex items-center justify-center gap-2 rounded-full font-inter " +
  "font-medium tracking-[-0.01em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-offset-4 focus-visible:outline-electric-iris disabled:opacity-40 disabled:pointer-events-none";

/**
 * Decorative "water rising" hover fill: a tiled sine-wave SVG sits translated
 * fully below the button at rest, then rises into view on hover/focus while
 * drifting horizontally (`animate-water-drift`, index.css) so the wave surface
 * itself keeps rippling rather than just sliding up as a static shape. Painted
 * in `currentColor` at low opacity so it adapts to either variant/surface the
 * same way the secondary variant's border already does. `aria-hidden` and
 * `pointer-events-none` keep it out of the interaction/AX tree; the global
 * `prefers-reduced-motion` rule in index.css collapses both the rise
 * transition and the drift keyframe to ~0 for anyone who needs that.
 */
function WaterFill() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0"
    >
      <svg
        className="h-full w-[200%] animate-water-drift text-current opacity-20"
        viewBox="0 0 200 40"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,8 C12.5,16 37.5,0 50,8 C62.5,16 87.5,0 100,8 C112.5,16 137.5,0 150,8 C162.5,16 187.5,0 200,8 L200,40 L0,40 Z" />
      </svg>
    </span>
  );
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-electric-iris text-snow hover:bg-electric-iris/90",
  // border/text use `currentColor` so this variant automatically adapts to
  // whichever surface (dark or light) it's placed on without a prop.
  secondary: "border-2 border-current text-current bg-transparent hover:bg-current/10",
  // Hero-only solid white pill: the one place white is a foreground fill
  // rather than a neutral surface/border color (design.md's "White Pill
  // Button" spec) — dark text keeps contrast on the hero's void/aurora bg.
  white: "bg-snow text-void hover:bg-linen",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

/**
 * Primary (electric-iris fill) / secondary (outline) / white (hero-only
 * solid pill) button. All variants roll their label text on hover/focus via
 * LetterRoll and expose a visible keyboard focus ring (electric-iris
 * outline, offset so it reads on both dark and light surfaces).
 */
export function Button<T extends ElementType = "button">(props: ButtonProps<T>) {
  const { as, variant = "primary", size = "md", children, className, ...rest } = props;
  /**
   * Cast to `any` rather than `ElementType` here deliberately: once anything
   * in the program imports `@react-three/fiber` (three-d-hero's sculpture),
   * its global `declare module "react" { namespace JSX { interface
   * IntrinsicElements extends ThreeElements {} } }` augmentation balloons
   * `JSX.IntrinsicElements` with hundreds of three.js tag names. TS then
   * can't resolve a single `children` type across that whole union for a
   * dynamically-typed `<Comp>` tag and collapses it to `never` (TS2745),
   * breaking every polymorphic `as`-prop usage of Button project-wide — even
   * ones with nothing to do with 3D. The generic `ButtonProps<T>` signature
   * above already gives callers full type safety for whatever `as` they
   * pass; this internal render-time cast doesn't need (and can't safely
   * have, given the above) a precise IntrinsicElements-checked type.
   */
  const Comp = (as ?? "button") as any;
  const label = typeof children === "string" ? children : null;

  const defaultType = Comp === "button" && !("type" in rest) ? { type: "button" as const } : {};

  return (
    <Comp className={clsx(BASE, VARIANT_STYLES[variant], SIZE_STYLES[size], className)} {...defaultType} {...rest}>
      <WaterFill />
      <span className="relative">{label !== null ? <LetterRoll>{label}</LetterRoll> : children}</span>
    </Comp>
  );
}
