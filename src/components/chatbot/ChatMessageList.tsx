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
          className="inline-flex items-center rounded-full border border-slate-edge px-3 py-1 font-inter text-xs text-ash transition-colors hover:border-iron-veil hover:text-snow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-iris"
        >
          View {message.link.label}
        </Link>
      ) : null}
      {showSeparateDemoCta ? (
        <Link
          to={DEMO_ROUTE}
          className="inline-flex items-center rounded-full bg-electric-iris px-3 py-1 font-inter text-xs font-medium text-snow transition-colors hover:bg-electric-iris/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-iris"
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
          "max-w-[85%] rounded-xl px-3.5 py-2.5 font-inter text-sm leading-relaxed",
          isUser
            ? "bg-electric-iris text-snow"
            : message.isRefusal
              ? "border border-ember-pulse/40 bg-ember-pulse/10 text-snow"
              : "border border-slate-edge bg-iron-veil/10 text-snow",
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
      <div className="flex items-center gap-1 rounded-xl border border-slate-edge bg-iron-veil/10 px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric-iris"
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
      <div className="flex max-w-[85%] flex-col gap-2 rounded-xl border border-ember-pulse/50 bg-ember-pulse/10 px-3.5 py-2.5 font-inter text-sm text-snow">
        <p>{error}</p>
        <button
          type="button"
          onClick={retry}
          className="self-start rounded-full border border-ember-pulse/60 px-3 py-1 font-inter text-xs font-medium text-ember-pulse transition-colors hover:bg-ember-pulse/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-iris"
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
        <p className="font-inter text-sm text-ash">Start a conversation below, or try one of the prompts.</p>
      ) : (
        messages.map((message) => <MessageBubble key={message.id} message={message} />)
      )}
      {status === "loading" ? <TypingIndicator /> : null}
      {status === "error" && error ? <ErrorBubble error={error} /> : null}
      <div ref={bottomRef} />
    </div>
  );
}
