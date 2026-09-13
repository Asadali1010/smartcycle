import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CHATBOT_DEMO_DISCLOSURE } from "@/content/chatbot";
import { useChatSession } from "./useChatSession";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { StarterPrompts } from "./StarterPrompts";

/**
 * The chat window itself. Mounted/unmounted by ChatLauncher based on
 * `isOpen`; AnimatePresence drives the entrance/exit. Interaction-state
 * driven (open/closed, minimized/restored), not scroll-bound, so Framer/
 * `motion` is the right tool here per the project's GSAP-vs-motion split
 * (see NavOverlay for the same reasoning).
 */
export function ChatPanel() {
  const isOpen = useChatSession((state) => state.isOpen);
  const isMinimized = useChatSession((state) => state.isMinimized);
  const messages = useChatSession((state) => state.messages);
  const closePanel = useChatSession((state) => state.closePanel);
  const toggleMinimized = useChatSession((state) => state.toggleMinimized);
  const startNewConversation = useChatSession((state) => state.startNewConversation);
  const prefersReducedMotion = useReducedMotion();

  const hasUserSpoken = messages.some((message) => message.role === "user");

  // Non-modal by design (the launcher button and rest of the page stay
  // reachable while the panel is open), but Escape-to-close is still
  // expected keyboard behavior for a dismissible panel like this.
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closePanel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closePanel]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          role="dialog"
          aria-label="SmartCycle Assistant, local demo chat"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: prefersReducedMotion ? 0.15 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-slate-edge bg-charcoal-card sm:right-6 sm:bottom-28"
          style={{ maxHeight: isMinimized ? undefined : "min(32rem, calc(100vh - 9rem))" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-edge bg-snow/5 px-4 py-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="h-2 w-2 shrink-0 rounded-full bg-electric-iris" aria-hidden="true" />
              <div className="flex flex-col overflow-hidden">
                <span className="truncate font-inter text-sm font-medium text-snow">SmartCycle Assistant</span>
                <span className="font-inter text-[0.65rem] font-medium uppercase tracking-widest text-ash">
                  Local demo mode
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={startNewConversation}
                title="New conversation"
                aria-label="Start a new conversation"
                className="rounded-md p-1.5 text-smoke transition-colors hover:bg-snow/10 hover:text-snow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-iris"
              >
                <PlusIcon />
              </button>
              <button
                type="button"
                onClick={toggleMinimized}
                title={isMinimized ? "Restore" : "Minimize"}
                aria-label={isMinimized ? "Restore chat window" : "Minimize chat window"}
                className="rounded-md p-1.5 text-smoke transition-colors hover:bg-snow/10 hover:text-snow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-iris"
              >
                {isMinimized ? <ExpandIcon /> : <MinimizeIcon />}
              </button>
              <button
                type="button"
                onClick={closePanel}
                title="Close"
                aria-label="Close chat window"
                className="rounded-md p-1.5 text-smoke transition-colors hover:bg-snow/10 hover:text-snow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-iris"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {isMinimized ? null : (
            <>
              {/* Persistent disclosure — always visible while the panel is open,
                  per CLAUDE.md: the widget must never be mistaken for live AI. */}
              <p className="border-b border-slate-edge bg-snow/[0.03] px-4 py-2 font-inter text-[0.7rem] leading-snug text-ash">
                {CHATBOT_DEMO_DISCLOSURE}
              </p>

              <ChatMessageList />

              {!hasUserSpoken ? <StarterPrompts /> : null}

              <ChatInput />
            </>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
