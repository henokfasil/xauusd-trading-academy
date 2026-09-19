# XAU/USD Trading Academy
### From Zero to Systematic Chart-Based Gold Trading

A polished, **local-first, fully editable** learning workspace that teaches professional chart-based XAU/USD (gold) day trading from absolute zero — assuming no prior knowledge of candlesticks, pips, lots, structure, sessions, risk, or order types.

It is **not** a signal service, a bot, or a static course. It's a persistent personal workspace built around one idea:

> Trading is not "predict → click → hope." It is **observe → formulate conditional scenarios → wait → execute predefined conditions → control risk → record → evaluate.**

---

## Run it locally

```bash
cd xauusd-trading-academy
npm install       # already done if you're reading this
npm run dev       # open http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

Requires Node 18+ (developed on Node 26).

---

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** (custom dark/light theme via CSS variables)
- **Zustand** + `persist` → **localStorage** (local-first; structured for easy migration to SQLite/Postgres)
- **Recharts** (equity curve & stats), **lucide-react** (icons), **react-markdown** (editable lessons)

---

## What's inside

**Learning**
- **Dashboard** — where am I as a trader: completion, mastery, expectancy, rule violations, continue-learning, today's practice.
- **Start Here** — the professional mental model as a clickable flow (Context → Location → Scenario → Trigger → Invalidation → Size → Execution → Management → Journal → Review), each with meaning / why / beginner mistake / pro approach / gold example.
- **15 curriculum modules / 40+ lessons** — Foundations, Chart Reading, Key Levels, Sessions, Gold Fundamentals, Price Action, Scenarios, Entries, Stops, Sizing, Risk/Reward, Management, Routine, Psychology, Calendar. Every lesson is **editable** (Markdown), with personal notes, mastery status, concept links and quizzes.

**Interactive tools**
- **A Day Trading XAU/USD** — expandable hour-by-hour timeline.
- **Top-Down Analysis** — record Daily→5m reads; auto-synthesises a plain-English bias (reasoning aid, never a buy/sell signal).
- **Market Structure Lab** — classify HH/HL/LH/LL on synthetic charts of rising difficulty.
- **Candlestick Lab** — find OHLC, read the rejected side, and learn why context beats named patterns.
- **Support / Resistance Lab** — mark zones, reveal reasonable ones, learn zones-not-lines thinking.

**Workspace**
- **Trading Journal** — full process capture + live position sizing + RR; grade process vs outcome.
- **Playbook** — editable setups with pre-trade checklists (starter templates included).
- **Backtesting** — structured study sessions that read tagged journal trades.
- **Statistics** — expectancy, win rate, R-distribution, equity curve, performance by session.
- **Mistake Library**, **Screenshot Library** (drag-drop, stored locally), **Economic Calendar** (personal planning log).

**Reference**
- **Glossary** (130+ editable terms), **Resources**, **Settings** (account/risk, sizing calculator, curriculum management, JSON export/import/reset).

---

## Editability & data

Everything is structured data, not hard-coded into components:
- Seed content: `data/curriculum.ts`, `data/glossary.ts`
- State + persistence: `lib/store.ts` (localStorage key `xauusd-academy-v1`)
- Types: `lib/types.ts`

You can add / edit / delete / reorder lessons, edit any definition, build setups, journal trades, and back everything up to JSON from **Settings**. A coding LLM can rewrite a single lesson body in `data/curriculum.ts` (or via the in-app editor) without restructuring the app.

> **Educational tool only.** Nothing here is financial advice, and it never issues buy/sell signals.
