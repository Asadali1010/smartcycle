import { useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import { Button } from "@/design-system";
import { nav } from "@/content";
import { NavOverlay } from "./NavOverlay";

/**
 * Site header: text wordmark, the header nav items (visible md+, alongside
 * a dedicated Request Demo button), and a menu-open trigger for NavOverlay
 * that's present at every viewport size (not just mobile) so the full
 * header+footer link inventory is always one click away.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const primaryLinks = nav.HEADER_NAV.filter((item) => item.path !== "/request-demo");

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ivory/10 bg-obsidian/85 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-gutter">
        <Link
          to="/"
          className="font-display text-xl tracking-tight text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral"
        >
          SmartCycleAI
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {primaryLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  "font-body text-sm uppercase tracking-widest text-ivory/70 transition-colors hover:text-ivory",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral",
                  isActive && "text-ivory",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Button as={Link} to="/request-demo" size="md">
            Request Demo
          </Button>
        </nav>

        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="site-nav-overlay"
          onClick={() => setOpen(true)}
          className="inline-flex flex-col items-center justify-center gap-1.5 p-2 text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral"
        >
          <span className="sr-only">Open menu</span>
          <span aria-hidden="true" className="block h-px w-6 bg-current" />
          <span aria-hidden="true" className="block h-px w-6 bg-current" />
          <span aria-hidden="true" className="block h-px w-4 self-end bg-current" />
        </button>
      </div>

      <NavOverlay open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} />
    </header>
  );
}
