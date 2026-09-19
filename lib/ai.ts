// ---------------------------------------------------------------------------
// Client-side (bring-your-own-key) Claude integration for the in-app tutor.
// The API key lives ONLY in this browser's localStorage (never in the store,
// never in JSON exports). Calls go directly to the Anthropic API using the
// documented browser-access header — no backend required, so it works on the
// static GitHub Pages deployment.
// ---------------------------------------------------------------------------

const KEY_STORAGE = "academy-ai-key";
const CHAT_STORAGE = "academy-ai-chat";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const AI_MODELS = [
  { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5 — fast & cheap (recommended)" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6 — deeper explanations" },
  { id: "claude-opus-4-8", label: "Claude Opus 4.8 — most capable (pricier)" },
];

export function getApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEY_STORAGE) ?? "";
}
export function setApiKey(key: string) {
  if (key) localStorage.setItem(KEY_STORAGE, key.trim());
  else localStorage.removeItem(KEY_STORAGE);
}

export function loadChat(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CHAT_STORAGE) ?? "[]");
  } catch {
    return [];
  }
}
export function saveChat(messages: ChatMessage[]) {
  localStorage.setItem(CHAT_STORAGE, JSON.stringify(messages.slice(-40)));
}

// The tutor persona — kept static so it can be prompt-cached across turns.
export const TUTOR_PERSONA = `You are the in-app tutor for the "XAU/USD Trading Academy", an educational app that teaches chart-based gold (XAU/USD) day trading from absolute zero.

YOUR ROLE
- You are a patient, rigorous trading educator and quantitative-minded mentor. The learner may know nothing about discretionary/chart trading — never assume prior knowledge of candlesticks, pips, lots, structure, sessions, risk, or order types. Explain from first principles when needed.
- Teach the academy's core process and reinforce it constantly: market context -> important location -> scenario -> trigger -> invalidation -> position size -> execution -> management -> journal -> statistical review.
- The central message: trading is NOT "predict -> click -> hope". It is "observe -> form conditional if-then scenarios -> wait -> execute predefined conditions -> control risk -> record -> evaluate".
- Emphasise risk management and survival first (small fixed % risk per trade), reward-to-risk and expectancy over win rate, and process over outcome.

HARD RULES
- You are an EDUCATIONAL tool, NOT a financial adviser. Never give personalised financial advice.
- Never issue buy/sell signals, never predict where gold "will" go, never tell the learner to enter a specific trade at a specific price. If asked "should I buy/sell now?", redirect to teaching the reasoning process (bias, level, scenario, trigger, invalidation, sizing) so they can decide.
- Be honest about uncertainty and that markets are probabilistic. Discourage FOMO, revenge trading, over-leverage and unrealistic get-rich expectations.

STYLE
- Be concise and clear. Prefer short paragraphs, concrete XAU/USD examples, and the academy's vocabulary. Use markdown (bold, lists, small tables) when it helps.
- When the learner is on a specific lesson or tool, ground your answer in that context.
- When useful, point them to the relevant part of the app (e.g. "try the Market Structure Lab", "log this in your Journal", "use the position size calculator in Settings").`;

interface StreamArgs {
  apiKey: string;
  model: string;
  context: string; // dynamic per-turn context (current page/lesson)
  messages: ChatMessage[];
  onDelta: (text: string) => void;
  signal?: AbortSignal;
}

// Streams a Claude response, calling onDelta with each text chunk.
export async function streamChat({ apiKey, model, context, messages, onDelta, signal }: StreamArgs): Promise<void> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    signal,
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1200,
      stream: true,
      system: [
        { type: "text", text: TUTOR_PERSONA, cache_control: { type: "ephemeral" } },
        { type: "text", text: `CURRENT CONTEXT (what the learner is looking at right now):\n${context}` },
      ],
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok || !res.body) {
    let detail = "";
    try {
      const j = await res.json();
      detail = j?.error?.message || JSON.stringify(j);
    } catch {
      detail = await res.text().catch(() => "");
    }
    if (res.status === 401) throw new Error("Invalid API key. Check it in Settings → AI Assistant.");
    if (res.status === 429) throw new Error("Rate limited or out of credits on your Anthropic account.");
    throw new Error(detail || `Request failed (HTTP ${res.status}).`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const evt = JSON.parse(data);
        if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
          onDelta(evt.delta.text);
        } else if (evt.type === "error") {
          throw new Error(evt.error?.message || "Stream error");
        }
      } catch {
        /* ignore keep-alive / partial lines */
      }
    }
  }
}
