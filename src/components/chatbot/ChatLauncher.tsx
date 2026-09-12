import { motion } from "motion/react";
import { useChatSession } from "./useChatSession";
import { ChatPanel } from "./ChatPanel";

/**
 * Site-wide floating entry point for the local demo chatbot: a fixed
 * launcher button plus the (closed-by-default) ChatPanel it toggles. Mounted
 * once in Layout.tsx. Never opens itself and never plays sound — the only
 * way the panel opens is a deliberate click/keypress on this button.
 */
export function ChatLauncher() {
  const isOpen = useChatSession((state) => state.isOpen);
  const openPanel = useChatSession((state) => state.openPanel);
  const closePanel = useChatSession((state) => state.closePanel);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => (isOpen ? closePanel() : openPanel())}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="smartcycle-chat-panel"
        aria-label={isOpen ? "Close SmartCycle Assistant" : "Open SmartCycle Assistant, a local demo chat"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-champagne/40 bg-obsidian text-ivory shadow-[0_10px_30px_-8px_rgba(255,101,79,0.45)] transition-colors hover:border-champagne focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral sm:bottom-6 sm:right-6"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-coral/25 via-transparent to-transparent"
        />
        {isOpen ? <CloseGlyph /> : <ChatGlyph />}
      </motion.button>

      <div id="smartcycle-chat-panel">
        <ChatPanel />
      </div>
    </>
  );
}

function ChatGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="relative">
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="9.5" r="1" fill="currentColor" />
      <circle cx="12" cy="9.5" r="1" fill="currentColor" />
      <circle cx="15.5" cy="9.5" r="1" fill="currentColor" />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="relative">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
