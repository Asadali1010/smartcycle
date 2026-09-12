/**
 * In-memory (Zustand) multi-turn transcript for the local demo chatbot.
 *
 * Demo mode is fully synchronous under the hood (`generateReply` in
 * `demoEngine/responses.ts` has no I/O), but the UI is shaped as if it were
 * talking to a real async backend: `sendMessage` introduces a short
 * artificial delay before the reply lands, exposes a `status` of
 * "idle" | "loading" | "error", and keeps enough state (`lastFailedText`) to
 * support a working retry affordance. Nothing here is persisted — a full
 * page reload starts a fresh session, which is appropriate for a scripted
 * local demo that never actually stores anything.
 */
import { create } from "zustand";
import { generateReply } from "./demoEngine/responses";
import type { ChatReply } from "./demoEngine/responses";
import { CHATBOT_WELCOME_MESSAGE } from "@/content/chatbot";

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  link?: ChatReply["link"];
  showDemoCta?: boolean;
  isFallback?: boolean;
  isRefusal?: boolean;
}

export type ChatStatus = "idle" | "loading" | "error";

interface ChatSessionState {
  /** Panel open/closed — the launcher toggles this; never set true on mount. */
  isOpen: boolean;
  /** Collapsed-to-header-bar state, independent of isOpen. */
  isMinimized: boolean;
  messages: ChatMessage[];
  status: ChatStatus;
  /** Present only while status === "error"; drives the inline error bubble. */
  error: string | null;
  /** The user text a failed reply attempt was for, so Retry can resubmit it
   * without duplicating the user's message bubble. */
  lastFailedText: string | null;
  openPanel: () => void;
  closePanel: () => void;
  toggleMinimized: () => void;
  sendMessage: (text: string) => void;
  retry: () => void;
  startNewConversation: () => void;
}

/** Random-feeling but bounded delay so the loading state is visibly real
 * without making the demo feel sluggish. */
const REPLY_DELAY_MIN_MS = 500;
const REPLY_DELAY_MAX_MS = 900;

function randomDelay(): number {
  return REPLY_DELAY_MIN_MS + Math.random() * (REPLY_DELAY_MAX_MS - REPLY_DELAY_MIN_MS);
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function welcomeMessage(): ChatMessage {
  return { id: "welcome", role: "assistant", text: CHATBOT_WELCOME_MESSAGE };
}

/** Tracks the in-flight artificial-delay timer outside the store so
 * `startNewConversation` (or an unmount) can cancel a stale reply before it
 * lands on top of a reset transcript. Module-level is fine here — there is
 * only ever one chat session in this app. */
let pendingTimer: ReturnType<typeof setTimeout> | null = null;

function clearPendingTimer() {
  if (pendingTimer !== null) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }
}

export const useChatSession = create<ChatSessionState>((set, get) => {
  function deliverReply(userText: string) {
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      try {
        const reply = generateReply(userText);
        const assistantMessage: ChatMessage = {
          id: makeId(),
          role: "assistant",
          text: reply.text,
          link: reply.link,
          showDemoCta: reply.showDemoCta,
          isFallback: reply.isFallback,
          isRefusal: reply.isRefusal,
        };
        set((state) => ({
          messages: [...state.messages, assistantMessage],
          status: "idle",
          error: null,
          lastFailedText: null,
        }));
      } catch {
        // The demo engine is deterministic and offline, so this should not
        // happen in practice — but the store still models a real error path
        // (with a working retry) so the UI shape matches what a live async
        // backend would require.
        set({
          status: "error",
          error: "Something went wrong generating a reply. You can try again.",
          lastFailedText: userText,
        });
      }
    }, randomDelay());
  }

  return {
    isOpen: false,
    isMinimized: false,
    messages: [welcomeMessage()],
    status: "idle",
    error: null,
    lastFailedText: null,

    openPanel: () => set({ isOpen: true, isMinimized: false }),
    closePanel: () => set({ isOpen: false }),
    toggleMinimized: () => set((state) => ({ isMinimized: !state.isMinimized })),

    sendMessage: (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || get().status === "loading") return;

      const userMessage: ChatMessage = { id: makeId(), role: "user", text: trimmed };
      set((state) => ({
        messages: [...state.messages, userMessage],
        status: "loading",
        error: null,
        lastFailedText: null,
      }));
      deliverReply(trimmed);
    },

    retry: () => {
      const { lastFailedText } = get();
      if (!lastFailedText || get().status === "loading") return;
      set({ status: "loading", error: null });
      deliverReply(lastFailedText);
    },

    startNewConversation: () => {
      clearPendingTimer();
      set({
        messages: [welcomeMessage()],
        status: "idle",
        error: null,
        lastFailedText: null,
      });
    },
  };
});
