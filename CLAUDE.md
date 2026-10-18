# CLAUDE.md — XAU/USD Trading Academy

Guidance for Claude Code (and any coding LLM) working in this repo. Read this first.

## What this is

**XAU/USD Trading Academy** — a polished, **local-first, fully editable** web app that teaches professional chart-based gold (XAU/USD) day trading from absolute zero. It is an interactive *learning workspace* (à la a clean document/canvas app), **not** a signal service, bot, or static course.

Core philosophy it teaches and must always reinforce:
> Trading is not "predict → click → hope." It is: **market context → important location → scenario → trigger → invalidation → position size → execution → management → journal → statistical review.**

**Non-negotiable product rule:** the app (and the AI tutor) is **educational only** — it must **never issue buy/sell signals**, predict where price "will" go, or give personalised financial advice. Everything is risk-first, process-over-outcome. Preserve this in any change.

## Live + repo

- **Live:** https://henokfasil.github.io/xauusd-trading-academy/
- **Repo:** https://github.com/henokfasil/xauusd-trading-academy (branch `main`)
- Every push to `main` auto-builds a **static export** and deploys to **GitHub Pages** via `.github/workflows/deploy.yml`.
- ✅ **Auto-deploy is working** (billing lock resolved 2026-10-11). Push to `main` → GitHub Actions builds → Pages updates (~1–2 min). To watch: `gh run watch <id> --repo henokfasil/xauusd-trading-academy --exit-status`.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** (custom theme via CSS variables in `app/globals.css`; dark/light through a `.dark` class)
- **Zustand** + `persist` middleware → **localStorage** (key `xauusd-academy-v1`, currently `version: 9`)
- **Recharts** (stats), **lucide-react** (icons, resolved by name via `<Icon name=.../>`), **react-markdown** + **remark-gfm** (lessons render Markdown), **nanoid** (ids)
- Node 18+ (developed on Node 26).

## Run / build / deploy

```bash
npm install
npm run dev        # http://localhost:3000  (normal SSR dev)
npm run build      # normal production build

# Static export exactly like CI (what GitHub Pages serves):
PAGES=true BASE_PATH=/xauusd-trading-academy npm run build   # outputs ./out
```

`next.config.mjs` only turns on `output: "export"` + `basePath`/`assetPrefix` when `PAGES=true`, so local dev/build are unaffected. CI sets `PAGES` and `BASE_PATH` and uploads `out/` (with a `.nojekyll`) to Pages.

**After a change, always run** `npx tsc --noEmit` **and the static build** before committing — the static export catches things dev mode is lenient about (e.g. `useSearchParams` needing a Suspense boundary, page files only allowing default + Next exports).

## Architecture & where things live

```
app/
  layout.tsx                 Root shell: Sidebar (in <Suspense>), main, <Assistant/>, ThemeProvider
  page.tsx                   Dashboard (incl. 4-chapter progress panel)
  roadmap/                   16-Week Learning Roadmap — phase breakdown, per-week lessons + deliverables
  start-here/                Clickable professional mental-model flow
  day-in-the-life/           Expandable hour-by-hour timeline
  top-down/                  Top-Down Analysis workspace (auto-synthesises bias; NEVER signals)
  labs/market-structure/     HH/HL/LH/LL classification lab (SVG)
  labs/candlestick/          OHLC / rejection lab (SVG)
  labs/support-resistance/   Mark-the-zone lab (SVG)
  learn/page.tsx             Lesson viewer — QUERY-PARAM route: /learn?m=<moduleId>&l=<lessonId>
  journal/ playbook/ backtesting/ statistics/ mistakes/ screenshots/ calendar/
  glossary/ resources/ settings/
components/
  ui.tsx                     Shared primitives: Icon, Card, Button, Badge, PageHeader,
                             EditableText, Field, Select, EmptyState, Stat, ClientOnly
  sidebar.tsx                Left nav. "trading-day" is FEATURED above the curriculum. Curriculum
                             modules are grouped into chapter sections (Ch.01 Price Action →
                             Ch.02 Trading Strategies → Ch.03 Risk Management → Ch.04 Quant
                             Validation) using the `chapter` field on Module. Chapter headers
                             render as centered badge labels between module groups. Price Action first.
  theme.tsx                  Dark/light provider (localStorage 'academy-theme')
  price-widget.tsx           Live read-only XAU/USD spot (gold-api.com, client fetch, 30s)
  assistant.tsx              Floating AI tutor drawer + client-side tool executors
lib/
  types.ts                   All domain types (Module now has optional `chapter?: string` field)
  store.ts                   Zustand store, all CRUD actions, computeStats(), persist config
  nav.ts                     Static nav sections (topNav includes "16-Week Roadmap" → /roadmap)
  ai.ts                      Claude BYOK client, tutor persona, tools, streaming + agentic loop
data/
  curriculum.ts              SEED modules, lessons, quizzes (Markdown bodies)
  glossary.ts                SEED glossary terms
```

### Data model / editability (important)

All learning content is **structured data**, not hard-coded in components, so a single lesson/term/setup can be rewritten without touching the app. Seed data lives in `data/*.ts`; on first run it is loaded into the Zustand store and thereafter everything lives in `localStorage` and is user-editable in-app (add/edit/delete/reorder lessons, edit any definition, build setups, journal trades, etc.).

- Entities (in `lib/types.ts`): `Module`, `Lesson`, `QuizQuestion`, `GlossaryTerm`, `JournalTrade`, `PlaybookSetup`, `TopDownSnapshot`, `MistakeEntry`, `Screenshot`, `BacktestSession`, `CalendarEvent`, `ResourceItem`, `Settings`, `Progress`. Each has a stable `id` and (mostly) `updatedAt`, so migration to SQLite/Postgres later is clean.
- Store persistence: `persist` with `version` + a `migrate` fn. **If you add/rename a `Settings` field or change persisted shape, bump `version` and handle it in `migrate`** (older browsers hold stale data). `importData` merges settings over defaults.
- `computeStats(trades)` derives win rate, expectancy (R), total R, equity curve, adherence, violations — used by Dashboard, Journal, Statistics, Backtesting.
- Settings has a JSON **export/import/reset** (Settings page). The **AI API key is deliberately NOT in the store/exports** — see below.

### Lesson routing gotcha

Lessons use a **query-param route** `/learn?m=<moduleId>&l=<lessonId>` (single static `app/learn/page.tsx`), NOT a dynamic `[moduleId]/[lessonId]` segment. This was required for static export and correctly handles user-added lessons. Use the local `lessonHref(m, l)` helper pattern when linking. Anything reading the active lesson elsewhere (e.g. sidebar highlight) uses `useSearchParams()` and must sit under a Suspense boundary.

## The AI tutor (bring-your-own-key, agentic)

- **Why BYOK:** the site is a static Pages export (no server to hold a key). The tutor calls the Anthropic API **directly from the browser** using header `anthropic-dangerous-direct-browser-access: true`. The key is stored **only** in `localStorage` under `academy-ai-key` (helpers `getApiKey`/`setApiKey` in `lib/ai.ts`), never in the Zustand store and never in JSON exports. Model choice is in `settings.aiModel`.
- **Persona:** `TUTOR_PERSONA` in `lib/ai.ts` — static so it can be **prompt-cached** (`cache_control: ephemeral`); dynamic per-turn page/lesson context is a second, uncached system block. Keep the educational/no-signals guardrails in the persona.
- **Streaming:** `streamChat()` (used by the Settings "Test" button) parses SSE `content_block_delta` text deltas.
- **Agentic tool loop:** `runAssistant()` streams text AND handles tool use. It accumulates content blocks (text + `tool_use` with `input_json_delta`), and when `stop_reason === "tool_use"` it calls the caller-supplied `executeTool(name, input)`, feeds a `tool_result` back, and loops (max 6 iterations) so the model can respond after acting.
- ⚠️ **`max_tokens` must cover the biggest tool payload (currently `8192`).** Tools like `add_lesson`/`update_lesson` carry a full markdown body inline (several KB). If `max_tokens` is too low the streamed `tool_use` JSON is truncated mid-object, `JSON.parse` fails, and the input would be lost — so `runAssistant` now feeds a *"arguments were truncated, retry in sections"* `tool_result` back instead of silently running the tool with `{}`. This was the 2026-10-03 bug where the tutor "promised but failed" to add the Fibonacci lesson (then-cap was 1400). Keep headroom when adding any tool that passes large content.
- **Tools** are declared in `TUTOR_TOOLS` (`lib/ai.ts`) and **executed client-side** in `assistant.tsx` against `useAcademy.getState()` (use `getState()`, not a render-time snapshot, to avoid stale data). Current tools:
  - Journal: `log_journal_trade` → `addTrade`; `get_recent_trades` (read, returns ids); `update_journal_trade` → `updateTrade`
  - Playbook: `add_playbook_setup` → `addSetup` (maps `checklist: string[]` → `{id,text}[]`); `get_playbook_setups` (read, returns ids); `update_playbook_setup` → `updateSetup`
  - Top-Down: `log_top_down_read` → `addSnapshot` (validates trend/structure enums, fills all 5 timeframes with blanks)
  - Curriculum (canvas editing): `get_curriculum` (modules+lessons index), `get_lesson` (full body), `update_lesson` → `updateLesson` (whole-field replace; omit lessonId ⇒ current lesson via `currentLessonId()` parsing `window.location`), `add_lesson`, `add_module` → `addModule` (creates a new nav section; optional slug `id`/`blurb`/`icon`, returns the moduleId so the tutor can then `add_lesson` into it)
  - Glossary/Mistakes: `upsert_glossary_term` → `upsertTerm`; `add_mistake` → `addMistake`
- **Canvas/live-edit behaviour:** editing a store entity re-renders its page live (Zustand subscription). Editing the *current* lesson updates the lesson viewer immediately because it renders `lesson.body` directly in non-edit mode. The persona explicitly forbids "I can't edit this / flag it to the app team" — the tutor must use these tools when asked to change page content.
- Tool results are narrated inline in the chat (`> 🛠️ …`). Chat history persists to `localStorage` `academy-ai-chat` (text-only turns; tool internals are side-effects, not re-sent across turns).

### Adding a new tutor tool (pattern)

1. Add a `ClaudeTool` entry to `TUTOR_TOOLS` in `lib/ai.ts` (clear `description`, JSON-Schema `input_schema`, minimal `required`).
2. Add a matching branch in the `executeTool` switch in `components/assistant.tsx` that calls a store action via `useAcademy.getState()`, validates/defaults input, and returns a short human-readable result string.
3. Update the persona's "TOOLS / ACTING IN THE APP" section so the model knows when to use it.
4. Optionally add a starter `SUGGESTIONS` prompt. Then `tsc --noEmit` + static build.

## Conventions

- Client components need `"use client"`. Pages that read the store wrap content in `<ClientOnly>` to avoid SSR/localStorage hydration mismatch.
- **Tailwind + dynamic classes:** never build class strings dynamically (e.g. `` `bg-${tone}` ``) — Tailwind purges them. Use full static class strings or explicit maps (see `TREND_OPTS` in `top-down`, `Badge`/`Button` variant maps in `ui.tsx`).
- Colors come from CSS variables: `bg`, `surface`, `elevated`, `border`, `fg`, `muted`, `subtle`, `accent`, `bull`, `bear`, `warn`. Use the Tailwind tokens (`text-bull`, `border-accent/30`, etc.) or `rgb(var(--x))` in SVG.
- Icons: `<Icon name="LucideName" />` (string → lucide component; falls back to Circle).
- Keep new pages consistent: `PageHeader`, `Card`, `Button`, `EmptyState`, `Field`/`Select`, inline `EditableText`.
- Money/units on gold: 1 lot = 100 oz → **$100 per $1 move**. Sizing: `lots = (account × risk%) / (stopDistance × 100)`. Keep this consistent (Journal editor + Settings calculator).

## Adding curriculum content

### Curriculum architecture (as of v9)

The curriculum is organised into **4 chapters**, each containing one or more modules:

| Chapter | `chapter` field value | Module IDs (in order) |
|---------|----------------------|----------------------|
| Ch.01 — Price Action | `"Price Action"` | `foundations` (10), `chart-reading` (20), `key-levels` (30), `price-action` (35), `sessions` (40), `fundamentals` (50), `pa-liquidity` (60), `pa-volume` (70), `pa-mtf` (80), `pa-integration` (90) |
| Ch.02 — Trading Strategies | `"Trading Strategies"` | `strategies` (100), `scenarios` (110), `entries` (120) |
| Ch.03 — Risk Management | `"Risk Management"` | `stops` (200), `sizing` (210), `rr` (220), `management` (230), `routine` (240), `psychology` (250), `calendar` (260) |
| Ch.04 — Quant Validation | `"Quant Validation"` | `gold-research` (300) |
| FEATURED (no chapter) | — | `trading-day` (0) — shown above the curriculum nav |

The `price-action` module is titled **"Price Behavior at Levels"** (renamed from "Price Action" to avoid collision with the chapter title).

### Adding / editing modules and lessons

- Add a module: `data/curriculum.ts` `modules[]` (id, title, blurb, order, icon, **`chapter`** = chapter label string). The `chapter` field controls which sidebar group it appears under.
- Add a lesson: use the `L(moduleId, id, title, summary, estMinutes, concepts[], body, toolRoute?)` helper. `body` is Markdown; end with a `> **Sources:** ...` line. `concepts` are glossary term ids; `toolRoute` links to an interactive lab.
- **Template literal gotcha:** if a lesson body contains a markdown code fence (` ``` `), escape the backticks as `\`\`\`` to avoid terminating the template literal.
- Quizzes: `seedQuizzes[]` keyed by `lessonId`.
- ⚠️ **To ship new seed content to EXISTING users** (not just fresh/reset browsers), add an **idempotent block to the persist `migrate` fn in `lib/store.ts` and bump `version`** — inject seed items by id only if absent, never overwrite user edits.

### Persist version history

| Version | What it does |
|---------|-------------|
| v2 | Ensures new Settings fields exist on older data |
| v3 | Injects `trading-day` chapter |
| v4 | Injects `strategies` module + `fibonacci-retracement` lesson; cleans up empty tutor-made strategy modules |
| v5 | Re-orders modules (Trading Strategies first at the time) |
| v6 | Injects `oc-zone-strategy` lesson above Fibonacci |
| v7 | Injects `gold-research` chapter (3 lessons + glossary terms + reading list resources) |
| v8 | Injects 21 `extra-strategies.ts` lessons into the `strategies` module |
| **v9** | **Reorganises into 4 chapters** — applies new `order` values and `chapter` field to all modules; renames `price-action` title to "Price Behavior at Levels"; injects 4 new PA modules (`pa-liquidity`, `pa-volume`, `pa-mtf`, `pa-integration`) + 23 new lessons by id (idempotent) |

## Deploy notes

- Pages source = **GitHub Actions** (`configure-pages` + `upload-pages-artifact` + `deploy-pages`). ✅ Working as of 2026-10-11 (billing lock resolved).
- **Normal deploy:** `git push origin main` → Actions runs in ~1–2 min → Pages updates. Watch with `gh run watch <id> --repo henokfasil/xauusd-trading-academy --exit-status`.
- Node-20 deprecation + ubuntu-migration warnings in CI output are harmless — ignore them.
- Only commit/push when asked. Commit messages end with the required `Co-Authored-By` trailer.

## Guardrails to never break

1. No buy/sell signals, no price predictions, no personalised financial advice — anywhere, including the tutor.
2. Never put the API key in the store or exports.
3. Bump persist `version` + `migrate` when changing persisted shape.
4. Run `tsc --noEmit` and the `PAGES=true` static build before committing.
