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

// ---- Tools the tutor can call to act inside the workspace -----------------
export interface ClaudeTool {
  name: string;
  description: string;
  input_schema: Record<string, any>;
}

export const TUTOR_TOOLS: ClaudeTool[] = [
  {
    name: "log_journal_trade",
    description:
      "Create a new entry in the learner's Trading Journal. Call this when the learner describes a trade (taken, paper, or hypothetical) and asks you to record it, or clearly asks you to log/journal something. Extract as many of the professional-process fields as the conversation supports; leave unknown fields out. Always tell the learner exactly what you logged afterwards, and that they can edit it on the Journal page.",
    input_schema: {
      type: "object",
      properties: {
        date: { type: "string", description: "Trade date, YYYY-MM-DD. Defaults to today if omitted." },
        direction: { type: "string", enum: ["long", "short"], description: "long = buy, short = sell" },
        session: { type: "string", enum: ["Asia", "London", "New York", "Overlap"] },
        context: { type: "string", description: "Market context / higher-timeframe bias" },
        location: { type: "string", description: "The important level/zone the trade is at" },
        scenario: { type: "string", description: "The conditional if-then hypothesis" },
        trigger: { type: "string", description: "What actually triggered entry" },
        invalidation: { type: "string", description: "Where/why the idea is wrong (stop logic)" },
        entry: { type: "number" },
        stop: { type: "number" },
        target: { type: "number" },
        size: { type: "number", description: "Position size in lots" },
        outcome: { type: "string", enum: ["open", "win", "loss", "breakeven"] },
        rMultiple: { type: "number", description: "Realized result in R (e.g. 2 or -1)" },
        pnl: { type: "number", description: "Profit/loss in account currency" },
        followedPlan: { type: "boolean" },
        emotions: { type: "string" },
        lessons: { type: "string", description: "What to repeat or change" },
        tags: { type: "array", items: { type: "string" } },
      },
      required: ["direction"],
    },
  },
  {
    name: "get_recent_trades",
    description:
      "Read the learner's most recent journal trades so you can review them, spot patterns, or reference an existing trade. Use before giving feedback on 'my trades' or 'my journal'.",
    input_schema: {
      type: "object",
      properties: { limit: { type: "number", description: "How many recent trades to fetch (default 5, max 20)" } },
      required: [],
    },
  },
];

// The tutor persona — kept static so it can be prompt-cached across turns.
export const TUTOR_PERSONA = `You are the in-app tutor for the "XAU/USD Trading Academy", an educational app that teaches chart-based gold (XAU/USD) day trading from absolute zero.

TOOLS / ACTING IN THE APP
- You can act inside the learner's workspace. When the learner describes a trade and asks you to record it (or says "log this", "add to my journal", etc.), call the log_journal_trade tool, filling as many process fields as the conversation supports. Do not invent numbers you weren't given — leave unknown fields blank. After logging, confirm exactly what you saved and note they can edit it on the Journal page.
- If the learner is vague, it's fine to ask one quick clarifying question first, but prefer to log what you have and let them refine it.
- Use get_recent_trades before commenting on "my trades"/"my journal" so your feedback is grounded in real data. When reviewing, focus on process and risk (adherence, reward-to-risk, sizing, rule violations), not on predicting outcomes.

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

// ---------------------------------------------------------------------------
// Agentic loop: streams text AND lets the model call tools that act in the app.
// The caller supplies executeTool() which performs the side effect (e.g. write
// to the Journal) and returns a short result string fed back to the model.
// ---------------------------------------------------------------------------

interface RunArgs {
  apiKey: string;
  model: string;
  context: string;
  history: ChatMessage[]; // prior visible turns (text only)
  userText: string;
  onText: (chunk: string) => void;
  onToolResult: (toolName: string, resultSummary: string) => void; // for UI narration
  executeTool: (name: string, input: any) => Promise<string>;
  signal?: AbortSignal;
}

async function callClaude(body: any, apiKey: string, signal?: AbortSignal): Promise<Response> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    signal,
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok || !res.body) {
    let detail = "";
    try { const j = await res.json(); detail = j?.error?.message || JSON.stringify(j); }
    catch { detail = await res.text().catch(() => ""); }
    if (res.status === 401) throw new Error("Invalid API key. Check it in Settings → AI Assistant.");
    if (res.status === 429) throw new Error("Rate limited or out of credits on your Anthropic account.");
    throw new Error(detail || `Request failed (HTTP ${res.status}).`);
  }
  return res;
}

export async function runAssistant({ apiKey, model, context, history, userText, onText, onToolResult, executeTool, signal }: RunArgs): Promise<void> {
  // Anthropic-format running message list for this turn.
  const messages: any[] = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userText },
  ];

  for (let iter = 0; iter < 6; iter++) {
    const res = await callClaude(
      {
        model,
        max_tokens: 1400,
        stream: true,
        tools: TUTOR_TOOLS,
        system: [
          { type: "text", text: TUTOR_PERSONA, cache_control: { type: "ephemeral" } },
          { type: "text", text: `CURRENT CONTEXT (what the learner is looking at right now):\n${context}` },
        ],
        messages,
      },
      apiKey,
      signal
    );

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    // blocks[index] accumulates each content block of THIS assistant message
    const blocks: Record<number, any> = {};
    let stopReason = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const t = line.trim();
        if (!t.startsWith("data:")) continue;
        const data = t.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        let evt: any;
        try { evt = JSON.parse(data); } catch { continue; }
        switch (evt.type) {
          case "content_block_start":
            if (evt.content_block?.type === "tool_use") {
              blocks[evt.index] = { type: "tool_use", id: evt.content_block.id, name: evt.content_block.name, _json: "" };
            } else {
              blocks[evt.index] = { type: "text", text: "" };
            }
            break;
          case "content_block_delta":
            if (evt.delta?.type === "text_delta") {
              onText(evt.delta.text);
              if (blocks[evt.index]) blocks[evt.index].text += evt.delta.text;
            } else if (evt.delta?.type === "input_json_delta") {
              if (blocks[evt.index]) blocks[evt.index]._json += evt.delta.partial_json;
            }
            break;
          case "message_delta":
            if (evt.delta?.stop_reason) stopReason = evt.delta.stop_reason;
            break;
          case "error":
            throw new Error(evt.error?.message || "Stream error");
        }
      }
    }

    // Assemble this assistant turn's content blocks.
    const ordered = Object.keys(blocks).map(Number).sort((a, b) => a - b).map((i) => blocks[i]);
    const assistantContent = ordered.map((b) => {
      if (b.type === "tool_use") {
        let input: any = {};
        try { input = b._json ? JSON.parse(b._json) : {}; } catch { input = {}; }
        return { type: "tool_use", id: b.id, name: b.name, input };
      }
      return { type: "text", text: b.text };
    });

    if (stopReason !== "tool_use") return; // plain answer, done.

    // Execute each requested tool and feed results back.
    messages.push({ role: "assistant", content: assistantContent });
    const toolResults: any[] = [];
    for (const b of assistantContent) {
      if (b.type !== "tool_use") continue;
      let summary = "";
      try {
        summary = await executeTool(b.name, b.input);
      } catch (e: any) {
        summary = `Tool error: ${e?.message ?? "failed"}`;
      }
      onToolResult(b.name, summary);
      toolResults.push({ type: "tool_result", tool_use_id: b.id, content: summary });
    }
    messages.push({ role: "user", content: toolResults });
    // loop continues so the model can respond after acting.
  }
}
