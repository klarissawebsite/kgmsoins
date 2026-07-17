"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { STARTER_QUESTIONS } from "@/lib/config";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type CopilotResponse = {
  answer?: string;
  suggested_actions?: string[];
};

function visitorId(): string {
  if (typeof window === "undefined") return "server";
  const key = "kgm_visitor_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  window.localStorage.setItem(key, created);
  return created;
}

export default function LandingCopilot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Bonjour. Je peux vous orienter sur les services, les tarifs de départ et l'évaluation gratuite.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const vid = useMemo(() => visitorId(), []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (forced?: string) => {
    const text = (forced ?? input).trim();
    if (!text || loading) return;
    const userMessage: ChatMessage = { role: "user", content: text };
    const history = messages.slice(-8);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          visitor_id: vid,
          page_path: window.location.pathname,
        }),
      });
      const data = (await res.json()) as CopilotResponse & { error?: string };
      const answer = data.answer ?? data.error ?? "Je n'ai pas encore cette information.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Le clavardage est temporairement indisponible. Le formulaire d'évaluation gratuite reste la meilleure prochaine étape.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80] font-body">
      {open && (
        <div className="mb-3 flex h-[min(630px,calc(100dvh-7rem))] w-[min(calc(100vw-2.5rem),390px)] flex-col overflow-hidden rounded-lg border border-brand-200/70 bg-white/95 shadow-[0_24px_80px_rgba(23,49,58,0.18)] backdrop-blur-xl">
          <div className="border-b border-brand-100 bg-white px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-night">Assistant KGM Soins</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-sm text-brand-600 hover:bg-brand-50"
                aria-label="Fermer le chat"
              >
                Fermer
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[82%] overflow-hidden rounded-lg bg-brand-600 px-4 py-2.5 text-sm leading-relaxed text-white whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
                      : "max-w-[86%] overflow-hidden rounded-lg border border-brand-100 bg-brand-50/70 px-4 py-2.5 text-sm leading-relaxed text-night whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
                  }
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && <p className="px-2 text-xs text-brand-600">Réponse en cours...</p>}
          </div>

          <div className="shrink-0 flex flex-wrap gap-2 border-t border-brand-100 px-4 py-3">
            {STARTER_QUESTIONS.map((question) => (
              <button
                type="button"
                key={question}
                onClick={() => void send(question)}
                disabled={loading}
                className="rounded-md border border-brand-100 px-3 py-1 text-xs text-brand-700 hover:bg-brand-50 disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>

          <div className="shrink-0 flex gap-2 border-t border-brand-100 p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void send();
              }}
              placeholder="Votre question..."
              className="min-w-0 flex-1 rounded-md border border-brand-100 bg-white px-4 py-2 text-sm text-night outline-none focus:border-brand-400"
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={loading || !input.trim()}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_50px_rgba(63,148,168,0.35)] transition hover:-translate-y-0.5 hover:bg-brand-700"
      >
        {open ? "Fermer" : "Chat KGM"}
      </button>
    </div>
  );
}
