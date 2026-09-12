import { useState } from "react";
import type { FormEvent } from "react";
import { useChatSession } from "./useChatSession";

const MAX_LENGTH = 500;

/**
 * Message composer. Disabled while a reply is in flight; Enter (without
 * Shift) submits, matching ordinary chat-input convention.
 */
export function ChatInput() {
  const [value, setValue] = useState("");
  const sendMessage = useChatSession((state) => state.sendMessage);
  const status = useChatSession((state) => state.status);
  const isLoading = status === "loading";

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    sendMessage(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={submit} className="flex items-end gap-2 border-t border-ivory/10 bg-obsidian p-3">
      <label htmlFor="chat-input" className="sr-only">
        Message SmartCycle Assistant
      </label>
      <textarea
        id="chat-input"
        rows={1}
        value={value}
        maxLength={MAX_LENGTH}
        disabled={isLoading}
        placeholder="Ask about SmartCycleAI…"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit(event);
          }
        }}
        className="min-h-11 flex-1 resize-none rounded-md border border-ivory/20 bg-transparent px-3 py-2.5 font-body text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || value.trim().length === 0}
        className="inline-flex h-11 items-center justify-center rounded-md bg-coral px-4 font-display text-sm font-medium uppercase tracking-wide text-obsidian transition-colors hover:bg-champagne disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
      >
        Send
      </button>
    </form>
  );
}
