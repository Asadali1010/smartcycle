import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import clsx from "clsx";
import { LetterRoll } from "./LetterRoll";

export type ButtonVariant = "primary" | "secondary";
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
  "inline-flex items-center justify-center gap-2 font-display font-medium uppercase tracking-wide " +
  "transition-colors duration-300 focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-offset-4 focus-visible:outline-coral disabled:opacity-40 disabled:pointer-events-none";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-coral text-obsidian hover:bg-champagne",
  // border/text use `currentColor` so this variant automatically adapts to
  // whichever surface (obsidian or ivory) it's placed on without a prop.
  secondary: "border-2 border-current text-current bg-transparent hover:bg-current/10",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

/**
 * Primary (coral fill) / secondary (outline) button. Both variants roll their
 * label text on hover/focus via LetterRoll and expose a visible keyboard
 * focus ring (coral outline, offset so it reads on both obsidian and ivory).
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
      {label !== null ? <LetterRoll>{label}</LetterRoll> : children}
    </Comp>
  );
}
