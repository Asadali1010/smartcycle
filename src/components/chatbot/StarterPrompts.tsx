import { CHATBOT_STARTER_PROMPTS } from "@/content/chatbot";
import { useChatSession } from "./useChatSession";

/**
 * Clickable chips for the 4 starter prompts, pulled verbatim from
 * content/chatbot.ts. Clicking one submits that exact prompt text through
 * the normal sendMessage path — no separate "canned" wiring here, that
 * matching happens in demoEngine/responses.ts.
 */
export function StarterPrompts() {
  const sendMessage = useChatSession((state) => state.sendMessage);
  const status = useChatSession((state) => state.status);

  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      <p className="font-inter text-xs uppercase tracking-widest text-ash">Try asking</p>
      <div className="flex flex-wrap gap-2">
        {CHATBOT_STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={status === "loading"}
            onClick={() => sendMessage(prompt)}
            className="rounded-full border border-transparent bg-electric-iris/12 px-3 py-1.5 text-left font-inter text-xs text-electric-iris transition-colors hover:bg-electric-iris/20 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-iris"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
