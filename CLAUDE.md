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
- ⚠️ **Auto-deploy is currently BROKEN (since ~2026-09-30):** the GitHub account is **locked due to a billing issue**, so the Actions `workflow` deploy fails in ~3s (*"the job was not started because your account is locked due to a billing issue"*). As a stopgap (2026-10-03) Pages was switched to **`build_type: legacy` serving the `gh-pages` branch**, which is NOT subject to the Actions lock. See **Deploy notes** for how to publish now and how to restore the normal flow.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** (custom theme via CSS variables in `app/globals.css`; dark/light through a `.dark` class)
- **Zustand** + `persist` middleware → **localStorage** (key `xauusd-academy-v1`, currently `version: 4`)
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
  page.tsx                   Dashboard
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
  sidebar.tsx                Left nav (curriculum from store + static tool/workspace/reference nav)
  theme.tsx                  Dark/light provider (localStorage 'academy-theme')
  price-widget.tsx           Live read-only XAU/USD spot (gold-api.com, client fetch, 30s)
  assistant.tsx              Floating AI tutor drawer + client-side tool executors
lib/
  types.ts                   All domain types
  store.ts                   Zustand store, all CRUD actions, computeStats(), persist config
  nav.ts                     Static nav sections
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

- Add a module: `data/curriculum.ts` `modules[]` (id, title, blurb, order, `icon` = lucide name).
- Add a lesson: use the `L(moduleId, id, title, summary, estMinutes, concepts[], body, toolRoute?)` helper. `body` is Markdown; `concepts` are glossary term ids; `toolRoute` links to an interactive lab. Users can also add/edit lessons in-app (persisted to localStorage; seed changes only affect fresh/reset state).
- Quizzes: `seedQuizzes[]` keyed by `lessonId`.
- ⚠️ **To ship new seed content to EXISTING users** (not just fresh/reset browsers), add an **idempotent block to the persist `migrate` fn in `lib/store.ts` and bump `version`** — inject seed items by id only if absent, never overwrite user edits. Precedents: `v3` injects the `trading-day` chapter; `v4` injects the `strategies` module + `fibonacci-retracement` lesson + its glossary terms *and* removes any empty "Trading Strategies" module the tutor left behind. Current seed modules include **`strategies` (Trading Strategies, order 9)**.

## Deploy notes

- **Intended** Pages source = GitHub Actions. `configure-pages` + `upload-pages-artifact` + `deploy-pages`. To watch: `gh run watch <id> --repo henokfasil/xauusd-trading-academy --exit-status`. Node-20 deprecation + ubuntu-migration lines in CI are warnings only.
- ⚠️ **CURRENT reality (account billing-locked → Actions blocked):** Pages serves the **`gh-pages` branch** (`build_type: legacy`). **`git push` to `main` does NOT update the live site.** To publish a change now:
  1. Build: `PAGES=true BASE_PATH=/xauusd-trading-academy npm run build` (→ `out/`).
  2. Publish `out/` to `gh-pages`: copy `out/` to a temp dir, `touch .nojekyll`, `git init`, `git checkout -b gh-pages`, commit, then `git push -f https://github.com/henokfasil/xauusd-trading-academy.git gh-pages`.
  3. Trigger + poll the build: `gh api -X POST repos/henokfasil/xauusd-trading-academy/pages/builds` then poll `gh api repos/henokfasil/xauusd-trading-academy/pages/builds/latest` until `"status":"built"`.
  4. Verify the live bundle actually changed (don't trust status alone): `curl` a referenced `_next/static/chunks/*.js` and grep for a known new string.
- **To RESTORE normal auto-deploy once billing is fixed:** `gh api -X PUT repos/henokfasil/xauusd-trading-academy/pages -f build_type=workflow -F 'source[branch]=main' -F 'source[path]=/'`, then push to `main` and watch the Actions run. (Still commit source to `main` either way so the repo stays the source of truth.)
- Only commit/push when asked. Commit messages end with the required `Co-Authored-By` trailer.

## Guardrails to never break

1. No buy/sell signals, no price predictions, no personalised financial advice — anywhere, including the tutor.
2. Never put the API key in the store or exports.
3. Bump persist `version` + `migrate` when changing persisted shape.
4. Run `tsc --noEmit` and the `PAGES=true` static build before committing.
