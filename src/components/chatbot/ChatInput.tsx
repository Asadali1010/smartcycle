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
    <form onSubmit={submit} className="flex items-end gap-2 border-t border-slate-edge bg-charcoal-card p-3">
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
        className="min-h-11 flex-1 resize-none rounded-md border border-slate-edge bg-transparent px-3 py-2.5 font-inter text-sm text-snow placeholder:text-smoke focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-iris disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || value.trim().length === 0}
        className="inline-flex h-11 items-center justify-center rounded-full bg-electric-iris px-4 font-inter text-sm font-medium text-snow transition-colors hover:bg-electric-iris/90 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-iris"
      >
        Send
      </button>
    </form>
  );
}
