"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAcademy } from "@/lib/store";
import { getApiKey, loadChat, saveChat, streamChat, ChatMessage, AI_MODELS } from "@/lib/ai";
import { Icon, Button } from "./ui";

const PAGE_LABELS: { test: RegExp; label: string }[] = [
  { test: /\/learn\/?$/, label: "Lesson viewer" },
  { test: /\/start-here\/?$/, label: "Start Here — the professional mental model" },
  { test: /\/day-in-the-life\/?$/, label: "A Day Trading XAU/USD timeline" },
  { test: /\/top-down\/?$/, label: "Top-Down Analysis workspace" },
  { test: /\/labs\/market-structure\/?$/, label: "Market Structure Lab (HH/HL/LH/LL)" },
  { test: /\/labs\/candlestick\/?$/, label: "Candlestick Lab" },
  { test: /\/labs\/support-resistance\/?$/, label: "Support / Resistance Lab" },
  { test: /\/journal\/?$/, label: "Trading Journal" },
  { test: /\/playbook\/?$/, label: "Playbook (personal setups)" },
  { test: /\/backtesting\/?$/, label: "Backtesting" },
  { test: /\/statistics\/?$/, label: "Statistics" },
  { test: /\/mistakes\/?$/, label: "Mistake Library" },
  { test: /\/screenshots\/?$/, label: "Screenshot Library" },
  { test: /\/calendar\/?$/, label: "Economic Calendar" },
  { test: /\/glossary\/?$/, label: "Glossary" },
  { test: /\/resources\/?$/, label: "Resources" },
  { test: /\/settings\/?$/, label: "Settings" },
];

const SUGGESTIONS = [
  "Explain this page simply, like I'm a beginner.",
  "Quiz me on this topic with 3 questions.",
  "What's a liquidity sweep, with a gold example?",
  "How do I size a trade risking 1% of $5,000?",
];

export function Assistant() {
  const { lessons, settings } = useAcademy();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(loadChat());
    setHasKey(!!getApiKey());
  }, []);
  useEffect(() => { if (open) setHasKey(!!getApiKey()); }, [open]);
  useEffect(() => { saveChat(messages); }, [messages]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, busy]);

  const buildContext = (): string => {
    if (typeof window === "undefined") return "Unknown page.";
    const path = window.location.pathname;
    const label = PAGE_LABELS.find((p) => p.test.test(path))?.label ?? "Dashboard";
    if (/\/learn\/?$/.test(path)) {
      const p = new URLSearchParams(window.location.search);
      const l = lessons.find((x) => x.id === p.get("l"));
      if (l) return `Page: Lesson viewer.\nCurrent lesson: "${l.title}" (module: ${l.moduleId}).\nLesson summary: ${l.summary}\n\nLesson content (markdown):\n${l.body.slice(0, 3000)}${l.notes ? `\n\nLearner's own notes on this lesson:\n${l.notes.slice(0, 800)}` : ""}`;
    }
    return `Page: ${label}. The learner's default risk is ${settings.riskPercent}% of a ${settings.currency} ${settings.accountBalance} account.`;
  };

  const send = async (text: string) => {
    const key = getApiKey();
    if (!key) { setHasKey(false); return; }
    const content = text.trim();
    if (!content || busy) return;
    setError(null);
    setInput("");
    const next: ChatMessage[] = [...messages, { role: "user", content }, { role: "assistant", content: "" }];
    setMessages(next);
    setBusy(true);
    abortRef.current = new AbortController();
    try {
      await streamChat({
        apiKey: key,
        model: settings.aiModel,
        context: buildContext(),
        messages: next.slice(0, -1), // exclude the empty assistant placeholder
        signal: abortRef.current.signal,
        onDelta: (chunk) => {
          setMessages((prev) => {
            const copy = prev.slice();
            copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + chunk };
            return copy;
          });
        },
      });
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setError(e?.message ?? "Something went wrong.");
        setMessages((prev) => {
          const copy = prev.slice();
          if (copy[copy.length - 1]?.role === "assistant" && !copy[copy.length - 1].content) copy.pop();
          return copy;
        });
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  };

  const stop = () => abortRef.current?.abort();
  const clear = () => { setMessages([]); setError(null); };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-accent-fg shadow-lg shadow-black/20 transition-transform hover:scale-105"
          title="Ask the tutor"
        >
          <Icon name="Sparkles" size={18} />
          <span className="text-sm font-semibold">Ask the tutor</span>
        </button>
      )}

      {/* Drawer */}
      {open && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col border-l border-border bg-surface shadow-2xl animate-fade-in">
          {/* header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/12 text-accent"><Icon name="Sparkles" size={17} /></div>
              <div>
                <div className="text-sm font-semibold leading-tight">Academy Tutor</div>
                <div className="text-[11px] text-subtle leading-tight">{AI_MODELS.find((m) => m.id === settings.aiModel)?.label.split(" — ")[0] ?? settings.aiModel} · knows your current page</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clear} title="Clear chat" className="rounded-md p-1.5 text-subtle hover:bg-elevated hover:text-fg"><Icon name="Trash2" size={16} /></button>
              <button onClick={() => setOpen(false)} title="Close" className="rounded-md p-1.5 text-subtle hover:bg-elevated hover:text-fg"><Icon name="X" size={18} /></button>
            </div>
          </div>

          {/* body */}
          {!hasKey ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent"><Icon name="KeyRound" size={22} /></div>
              <div className="font-medium">Connect your Claude key to begin</div>
              <p className="text-sm text-muted">
                The tutor runs on your own Anthropic API key, stored only in this browser — never uploaded or included in backups. Add it once and ask away.
              </p>
              <Link href="/settings" onClick={() => setOpen(false)}><Button variant="primary" size="sm"><Icon name="Settings" size={14} /> Add key in Settings</Button></Link>
              <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">Get an Anthropic API key →</a>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted">Hi! I'm your trading tutor. I can see the page you're on, so ask me anything — I'll explain from first principles and keep it honest (no signals, risk first).</p>
                    <div className="space-y-1.5">
                      {SUGGESTIONS.map((s) => (
                        <button key={s} onClick={() => send(s)} className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-left text-sm text-muted transition-colors hover:border-accent/40 hover:bg-elevated hover:text-fg">
                          <Icon name="ArrowRight" size={13} className="text-accent" /> {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div className={m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-accent/15 px-3.5 py-2 text-sm"
                      : "max-w-[92%] rounded-2xl rounded-bl-sm bg-elevated px-3.5 py-2 text-sm"}>
                      {m.role === "assistant" ? (
                        m.content ? (
                          <article className="prose-academy text-sm [&_h1]:text-base [&_h2]:text-base [&_h2]:mt-3 [&_h2]:border-0 [&_h2]:pb-0 [&>*+*]:mt-2"><ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown></article>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted"><Icon name="Loader" size={13} className="animate-spin" /> thinking…</span>
                        )
                      ) : m.content}
                    </div>
                  </div>
                ))}
                {error && (
                  <div className="rounded-lg border border-bear/30 bg-bear/[0.06] p-2.5 text-xs text-bear">
                    <Icon name="TriangleAlert" size={13} className="mr-1 inline" /> {error}
                  </div>
                )}
              </div>

              {/* input */}
              <div className="border-t border-border p-3">
                <div className="flex items-end gap-2 rounded-xl border border-border bg-elevated px-3 py-2 focus-within:border-accent/50">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                    placeholder="Ask about this page, a concept, your risk…"
                    rows={1}
                    className="max-h-32 flex-1 resize-none bg-transparent text-sm outline-none"
                  />
                  {busy ? (
                    <button onClick={stop} className="rounded-lg bg-bear/15 p-2 text-bear" title="Stop"><Icon name="Square" size={15} /></button>
                  ) : (
                    <button onClick={() => send(input)} disabled={!input.trim()} className="rounded-lg bg-accent p-2 text-accent-fg disabled:opacity-40" title="Send"><Icon name="ArrowUp" size={15} /></button>
                  )}
                </div>
                <div className="mt-1.5 px-1 text-[10px] text-subtle">Educational only · not financial advice · never signals. Runs on your Anthropic key.</div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
