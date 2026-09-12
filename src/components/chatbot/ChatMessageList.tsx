import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useChatSession } from "./useChatSession";
import type { ChatMessage } from "./useChatSession";

const DEMO_ROUTE = "/request-demo";

/** The per-message quick-action row: a "View <page>" link whenever the reply
 * is grounded in a specific route, plus a distinct "Request a Demo" action
 * whenever sales/demo/pricing intent was detected (skipping a duplicate when
 * the grounded link already points at /request-demo). */
function MessageActions({ message }: { message: ChatMessage }) {
  if (!message.link && !message.showDemoCta) return null;
  const showSeparateDemoCta = message.showDemoCta && message.link?.to !== DEMO_ROUTE;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {message.link ? (
        <Link
          to={message.link.to}
          className="inline-flex items-center rounded-full border border-champagne/50 px-3 py-1 font-body text-xs text-ivory/90 transition-colors hover:border-champagne hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
        >
          View {message.link.label}
        </Link>
      ) : null}
      {showSeparateDemoCta ? (
        <Link
          to={DEMO_ROUTE}
          className="inline-flex items-center rounded-full bg-coral px-3 py-1 font-body text-xs font-medium text-obsidian transition-colors hover:bg-champagne focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
        >
          Request a Demo
        </Link>
      ) : null}
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={clsx("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "max-w-[85%] rounded-lg px-3.5 py-2.5 font-body text-sm leading-relaxed",
          isUser
            ? "bg-coral text-obsidian"
            : message.isRefusal
              ? "border border-champagne/40 bg-champagne/10 text-ivory"
              : "border border-ivory/10 bg-ivory/5 text-ivory",
        )}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
        {!isUser ? <MessageActions message={message} /> : null}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start" aria-live="polite" aria-label="SmartCycle Assistant is composing a reply">
      <div className="flex items-center gap-1 rounded-lg border border-ivory/10 bg-ivory/5 px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-ivory/50"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function ErrorBubble({ error }: { error: string }) {
  const retry = useChatSession((state) => state.retry);
  return (
    <div className="flex justify-start" role="alert">
      <div className="flex max-w-[85%] flex-col gap-2 rounded-lg border border-coral/50 bg-coral/10 px-3.5 py-2.5 font-body text-sm text-ivory">
        <p>{error}</p>
        <button
          type="button"
          onClick={retry}
          className="self-start rounded-full border border-coral/60 px-3 py-1 font-body text-xs uppercase tracking-widest text-coral transition-colors hover:bg-coral/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

/**
 * Scrollable transcript. Auto-scrolls to the newest message/status change;
 * `min-h-0` on the flex parent (see ChatPanel) plus `overflow-y-auto` here is
 * what keeps this region's height stable while its content grows.
 */
export function ChatMessageList() {
  const messages = useChatSession((state) => state.messages);
  const status = useChatSession((state) => state.status);
  const error = useChatSession((state) => state.error);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, status]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4" role="log" aria-live="polite">
      {messages.length === 0 ? (
        <p className="font-body text-sm text-ivory/50">Start a conversation below, or try one of the prompts.</p>
      ) : (
        messages.map((message) => <MessageBubble key={message.id} message={message} />)
      )}
      {status === "loading" ? <TypingIndicator /> : null}
      {status === "error" && error ? <ErrorBubble error={error} /> : null}
      <div ref={bottomRef} />
    </div>
  );
}
