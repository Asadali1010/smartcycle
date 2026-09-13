import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { nav } from "@/content";

export interface NavOverlayProps {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen nav overlay listing every header+footer link with a staggered
 * entrance. Interaction-state driven (open/closed), not scroll-driven, so
 * Framer Motion is the correct tool here per the project's GSAP-vs-Framer
 * boundary (GSAP/ScrollTrigger owns scroll choreography; Framer Motion owns
 * component/interaction-state motion).
 */
export function NavOverlay({ open, onClose, triggerRef }: NavOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const trigger = triggerRef.current;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null,
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      (previouslyFocused ?? trigger)?.focus();
    };
  }, [open, onClose, triggerRef]);

  const links = dedupeByPath([...nav.HEADER_NAV, ...nav.FOOTER_NAV.flatMap((group) => group.items), nav.FOOTER_USE_CASES_LINK]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="site-nav-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          ref={panelRef}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-obsidian-canvas text-snow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-gutter py-8">
            <Link to="/" className="font-inter text-xl font-semibold">
              SmartCycleAI
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="font-inter text-body font-medium uppercase tracking-widest text-snow/70 transition-colors hover:text-snow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric-iris"
            >
              Close
            </button>
          </div>

          <nav aria-label="Full site" className="flex flex-1 flex-col justify-center gap-1 px-gutter py-8">
            {links.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.06 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={item.path}
                  className="block py-2 font-esbuild text-display-sm text-snow/80 transition-colors hover:text-ember-pulse focus-visible:text-ember-pulse focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-gutter py-8 text-body text-snow/50">
            <p>&copy; {new Date().getFullYear()} SmartCycleAI</p>
            {nav.FOOTER_SOCIAL_LINKS.map((social) => (
              <a key={social.url} href={social.url} target="_blank" rel="noreferrer" className="hover:text-snow">
                {social.label}
              </a>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function dedupeByPath<T extends { path: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.path)) return false;
    seen.add(item.path);
    return true;
  });
}
