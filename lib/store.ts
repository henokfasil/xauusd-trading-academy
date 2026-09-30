"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import {
  Module,
  Lesson,
  GlossaryTerm,
  JournalTrade,
  PlaybookSetup,
  TopDownSnapshot,
  MistakeEntry,
  Screenshot,
  BacktestSession,
  Settings,
  Progress,
  QuizQuestion,
} from "./types";
import { modules as seedModules, lessons as seedLessons, seedQuizzes } from "@/data/curriculum";
import { glossary as seedGlossary } from "@/data/glossary";

export interface CalendarEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  impact: "low" | "medium" | "high";
  policy: string; // pre-planned approach
  done: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  url: string;
  note: string;
  category: string;
}

interface AcademyState {
  hydrated: boolean;
  setHydrated: () => void;

  modules: Module[];
  lessons: Lesson[];
  quizzes: QuizQuestion[];
  glossary: GlossaryTerm[];
  trades: JournalTrade[];
  setups: PlaybookSetup[];
  snapshots: TopDownSnapshot[];
  mistakes: MistakeEntry[];
  screenshots: Screenshot[];
  backtests: BacktestSession[];
  calendar: CalendarEvent[];
  resources: ResourceItem[];
  settings: Settings;
  progress: Progress;

  // Lessons
  updateLesson: (id: string, patch: Partial<Lesson>) => void;
  addLesson: (moduleId: string, title: string) => string;
  deleteLesson: (id: string) => void;
  reorderLesson: (id: string, dir: -1 | 1) => void;
  toggleComplete: (id: string) => void;
  setLessonStatus: (id: string, status: Lesson["status"]) => void;

  // Modules
  addModule: (title: string) => void;
  updateModule: (id: string, patch: Partial<Module>) => void;
  deleteModule: (id: string) => void;

  // Glossary
  upsertTerm: (t: Partial<GlossaryTerm> & { id?: string }) => void;
  deleteTerm: (id: string) => void;

  // Trades
  addTrade: (t?: Partial<JournalTrade>) => string;
  updateTrade: (id: string, patch: Partial<JournalTrade>) => void;
  deleteTrade: (id: string) => void;

  // Setups
  addSetup: (s?: Partial<PlaybookSetup>) => string;
  updateSetup: (id: string, patch: Partial<PlaybookSetup>) => void;
  deleteSetup: (id: string) => void;

  // Snapshots
  addSnapshot: (s?: Partial<TopDownSnapshot>) => string;
  updateSnapshot: (id: string, patch: Partial<TopDownSnapshot>) => void;
  deleteSnapshot: (id: string) => void;

  // Mistakes
  addMistake: (m?: Partial<MistakeEntry>) => string;
  updateMistake: (id: string, patch: Partial<MistakeEntry>) => void;
  deleteMistake: (id: string) => void;

  // Screenshots
  addScreenshot: (s: Omit<Screenshot, "id" | "createdAt">) => string;
  updateScreenshot: (id: string, patch: Partial<Screenshot>) => void;
  deleteScreenshot: (id: string) => void;

  // Backtests
  addBacktest: (b?: Partial<BacktestSession>) => string;
  updateBacktest: (id: string, patch: Partial<BacktestSession>) => void;
  deleteBacktest: (id: string) => void;

  // Calendar
  addCalendarEvent: (e?: Partial<CalendarEvent>) => string;
  updateCalendarEvent: (id: string, patch: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;

  // Resources
  addResource: (r?: Partial<ResourceItem>) => string;
  updateResource: (id: string, patch: Partial<ResourceItem>) => void;
  deleteResource: (id: string) => void;

  // Settings & progress
  updateSettings: (patch: Partial<Settings>) => void;
  recordQuiz: (lessonId: string, correct: number, total: number) => void;
  setLastLessonRoute: (route: string) => void;

  resetAll: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
}

const now = () => Date.now();

const defaultSettings: Settings = {
  accountBalance: 5000,
  riskPercent: 1,
  currency: "USD",
  learnerName: "",
  timezone: "Europe/London",
  aiModel: "claude-haiku-4-5-20251001",
};

const defaultProgress: Progress = { lastLessonRoute: null, quizScores: {} };

const defaultResources: ResourceItem[] = [
  { id: "r-cal", title: "Economic calendar (any provider)", url: "https://www.forexfactory.com/calendar", note: "Filter for USD high-impact events. Convert times to your platform's timezone.", category: "Data & Calendars" },
  { id: "r-dxy", title: "US Dollar Index (DXY)", url: "https://www.tradingview.com/symbols/TVC-DXY/", note: "Gold's frequent mirror — a stronger dollar usually pressures gold.", category: "Data & Calendars" },
  { id: "r-yields", title: "US 10Y Treasury yield", url: "https://www.tradingview.com/symbols/TVC-US10Y/", note: "Watch the direction of yields (and real yields) — gold tracks them inversely.", category: "Data & Calendars" },
  { id: "r-fed", title: "Federal Reserve (FOMC calendar)", url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm", note: "Official meeting dates — gold's biggest scheduled driver.", category: "Fundamentals" },
  { id: "r-tv", title: "Charting platform (TradingView)", url: "https://www.tradingview.com/chart/?symbol=OANDA%3AXAUUSD", note: "Practise marking levels and structure on XAU/USD.", category: "Tools" },
  // Sources cited in "A Gold Trader's Day" (Chapter 1)
  { id: "r-babypips-sessions", title: "BabyPips — Forex Trading Sessions", url: "https://www.babypips.com/learn/forex/forex-trading-sessions", note: "Session structure and why the London/NY overlap is the busiest window. Cited in Chapter 1.", category: "Learning" },
  { id: "r-oanda-time", title: "OANDA — Best time for forex trading", url: "https://www.oanda.com/us-en/skills-and-insights/education/trading-asset-classes/forex/when-is-the-best-time-for-forex-trading/", note: "London/NY overlap = peak liquidity and volatility. Cited in Chapter 1.", category: "Learning" },
  { id: "r-inv002-tf", title: "Investopedia — Multiple Time Frames", url: "https://www.investopedia.com/articles/trading/07/timeframes.asp", note: "Top-down multi-timeframe analysis. Cited in Chapter 1.", category: "Learning" },
  { id: "r-robo-gold", title: "RoboForex — Gold Trading Explained (XAUUSD)", url: "https://roboforex.com/blog/education/gold-trading-xauusd/", note: "Gold-specific: peak hours, USD/yield inverse, wider stops, 1:2–1:3 RR (broker education). Cited in Chapter 1.", category: "Learning" },
  { id: "r-daytrading-1pct", title: "DayTrading.com — The 1% Rule", url: "https://www.daytrading.com/one-percent-rule", note: "Risk ≤1% of equity per trade; caps loss, not capital. Cited in Chapter 1.", category: "Learning" },
];

export const useAcademy = create<AcademyState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      modules: seedModules,
      lessons: seedLessons,
      quizzes: seedQuizzes as QuizQuestion[],
      glossary: seedGlossary,
      trades: [],
      setups: [],
      snapshots: [],
      mistakes: [],
      screenshots: [],
      backtests: [],
      calendar: [],
      resources: defaultResources,
      settings: defaultSettings,
      progress: defaultProgress,

      updateLesson: (id, patch) =>
        set((s) => ({
          lessons: s.lessons.map((l) => (l.id === id ? { ...l, ...patch, updatedAt: now() } : l)),
        })),

      addLesson: (moduleId, title) => {
        const id = `lesson-${nanoid(6)}`;
        const order = Math.max(0, ...get().lessons.map((l) => l.order)) + 1;
        const lesson: Lesson = {
          id, moduleId, title: title || "Untitled lesson",
          summary: "", body: "# " + (title || "Untitled lesson") + "\n\nStart writing…",
          notes: "", order, estMinutes: 5, completed: false, status: "unseen",
          concepts: [], updatedAt: now(),
        };
        set((s) => ({ lessons: [...s.lessons, lesson] }));
        return id;
      },

      deleteLesson: (id) => set((s) => ({ lessons: s.lessons.filter((l) => l.id !== id) })),

      reorderLesson: (id, dir) =>
        set((s) => {
          const lesson = s.lessons.find((l) => l.id === id);
          if (!lesson) return {};
          const siblings = s.lessons
            .filter((l) => l.moduleId === lesson.moduleId)
            .sort((a, b) => a.order - b.order);
          const idx = siblings.findIndex((l) => l.id === id);
          const swapIdx = idx + dir;
          if (swapIdx < 0 || swapIdx >= siblings.length) return {};
          const a = siblings[idx];
          const b = siblings[swapIdx];
          const aOrder = a.order;
          return {
            lessons: s.lessons.map((l) =>
              l.id === a.id ? { ...l, order: b.order } : l.id === b.id ? { ...l, order: aOrder } : l
            ),
          };
        }),

      toggleComplete: (id) =>
        set((s) => ({
          lessons: s.lessons.map((l) =>
            l.id === id ? { ...l, completed: !l.completed, status: !l.completed ? "mastered" : l.status, updatedAt: now() } : l
          ),
        })),

      setLessonStatus: (id, status) =>
        set((s) => ({ lessons: s.lessons.map((l) => (l.id === id ? { ...l, status, updatedAt: now() } : l)) })),

      addModule: (title) =>
        set((s) => ({
          modules: [
            ...s.modules,
            { id: `mod-${nanoid(6)}`, title: title || "New module", blurb: "", order: Math.max(0, ...s.modules.map((m) => m.order)) + 1, icon: "Folder" },
          ],
        })),
      updateModule: (id, patch) => set((s) => ({ modules: s.modules.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
      deleteModule: (id) => set((s) => ({ modules: s.modules.filter((m) => m.id !== id), lessons: s.lessons.filter((l) => l.moduleId !== id) })),

      upsertTerm: (t) =>
        set((s) => {
          if (t.id && s.glossary.some((g) => g.id === t.id)) {
            return { glossary: s.glossary.map((g) => (g.id === t.id ? { ...g, ...t, updatedAt: now() } as GlossaryTerm : g)) };
          }
          const id = t.id || `term-${nanoid(6)}`;
          return {
            glossary: [
              ...s.glossary,
              { id, term: t.term || "New term", definition: t.definition || "", example: t.example || "", category: t.category || "General", updatedAt: now() },
            ],
          };
        }),
      deleteTerm: (id) => set((s) => ({ glossary: s.glossary.filter((g) => g.id !== id) })),

      addTrade: (t) => {
        const id = `trade-${nanoid(8)}`;
        const trade: JournalTrade = {
          id, date: new Date().toISOString().slice(0, 10), direction: "long", session: "London",
          context: "", location: "", scenario: "", trigger: "", invalidation: "",
          entry: null, stop: null, target: null, riskPerUnit: null, plannedRR: null,
          size: null, riskAmount: null, outcome: "open", rMultiple: null, pnl: null,
          followedPlan: true, ruleViolations: [], emotions: "", lessons: "",
          screenshotIds: [], tags: [], createdAt: now(), updatedAt: now(), ...t,
        };
        set((s) => ({ trades: [trade, ...s.trades] }));
        return id;
      },
      updateTrade: (id, patch) => set((s) => ({ trades: s.trades.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: now() } : t)) })),
      deleteTrade: (id) => set((s) => ({ trades: s.trades.filter((t) => t.id !== id) })),

      addSetup: (sIn) => {
        const id = `setup-${nanoid(6)}`;
        const setup: PlaybookSetup = {
          id, name: "New Setup", thesis: "", context: "", location: "", trigger: "",
          invalidation: "", management: "", targets: "", checklist: [], tags: [], updatedAt: now(), ...sIn,
        };
        set((s) => ({ setups: [setup, ...s.setups] }));
        return id;
      },
      updateSetup: (id, patch) => set((s) => ({ setups: s.setups.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: now() } : x)) })),
      deleteSetup: (id) => set((s) => ({ setups: s.setups.filter((x) => x.id !== id) })),

      addSnapshot: (sIn) => {
        const id = `snap-${nanoid(6)}`;
        const blank = { trend: "unclear" as const, structure: "mixed" as const, levels: "", observations: "", bias: "" };
        const snap: TopDownSnapshot = {
          id, date: new Date().toISOString().slice(0, 10), title: "Session " + new Date().toISOString().slice(0, 10),
          reads: { Daily: { ...blank }, "4H": { ...blank }, "1H": { ...blank }, "15m": { ...blank }, "5m": { ...blank } },
          interpretation: "", screenshotIds: [], updatedAt: now(), ...sIn,
        };
        set((s) => ({ snapshots: [snap, ...s.snapshots] }));
        return id;
      },
      updateSnapshot: (id, patch) => set((s) => ({ snapshots: s.snapshots.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: now() } : x)) })),
      deleteSnapshot: (id) => set((s) => ({ snapshots: s.snapshots.filter((x) => x.id !== id) })),

      addMistake: (m) => {
        const id = `mistake-${nanoid(6)}`;
        const mistake: MistakeEntry = { id, title: "New mistake", description: "", cost: "", correction: "", relatedTradeIds: [], tags: [], updatedAt: now(), ...m };
        set((s) => ({ mistakes: [mistake, ...s.mistakes] }));
        return id;
      },
      updateMistake: (id, patch) => set((s) => ({ mistakes: s.mistakes.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: now() } : x)) })),
      deleteMistake: (id) => set((s) => ({ mistakes: s.mistakes.filter((x) => x.id !== id) })),

      addScreenshot: (sIn) => {
        const id = `shot-${nanoid(8)}`;
        set((s) => ({ screenshots: [{ ...sIn, id, createdAt: now() }, ...s.screenshots] }));
        return id;
      },
      updateScreenshot: (id, patch) => set((s) => ({ screenshots: s.screenshots.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      deleteScreenshot: (id) => set((s) => ({ screenshots: s.screenshots.filter((x) => x.id !== id) })),

      addBacktest: (b) => {
        const id = `bt-${nanoid(6)}`;
        const bt: BacktestSession = { id, name: "New backtest", hypothesis: "", period: "", sampleTradeIds: [], notes: "", updatedAt: now(), ...b };
        set((s) => ({ backtests: [bt, ...s.backtests] }));
        return id;
      },
      updateBacktest: (id, patch) => set((s) => ({ backtests: s.backtests.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: now() } : x)) })),
      deleteBacktest: (id) => set((s) => ({ backtests: s.backtests.filter((x) => x.id !== id) })),

      addCalendarEvent: (e) => {
        const id = `evt-${nanoid(6)}`;
        const evt: CalendarEvent = { id, date: new Date().toISOString().slice(0, 10), time: "13:30", title: "New event", impact: "high", policy: "Be flat into the release; trade the post-news structure.", done: false, ...e };
        set((s) => ({ calendar: [...s.calendar, evt] }));
        return id;
      },
      updateCalendarEvent: (id, patch) => set((s) => ({ calendar: s.calendar.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      deleteCalendarEvent: (id) => set((s) => ({ calendar: s.calendar.filter((x) => x.id !== id) })),

      addResource: (r) => {
        const id = `res-${nanoid(6)}`;
        set((s) => ({ resources: [...s.resources, { id, title: r?.title ?? "New resource", url: r?.url ?? "", note: r?.note ?? "", category: r?.category ?? "General" }] }));
        return id;
      },
      updateResource: (id, patch) => set((s) => ({ resources: s.resources.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      deleteResource: (id) => set((s) => ({ resources: s.resources.filter((x) => x.id !== id) })),

      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      recordQuiz: (lessonId, correct, total) =>
        set((s) => ({ progress: { ...s.progress, quizScores: { ...s.progress.quizScores, [lessonId]: { correct, total, at: now() } } } })),
      setLastLessonRoute: (route) => set((s) => ({ progress: { ...s.progress, lastLessonRoute: route } })),

      resetAll: () =>
        set({
          modules: seedModules, lessons: seedLessons, quizzes: seedQuizzes as QuizQuestion[], glossary: seedGlossary,
          trades: [], setups: [], snapshots: [], mistakes: [], screenshots: [], backtests: [], calendar: [],
          resources: defaultResources, settings: defaultSettings, progress: defaultProgress,
        }),

      exportData: () => {
        const s = get();
        return JSON.stringify(
          {
            version: 1,
            modules: s.modules, lessons: s.lessons, quizzes: s.quizzes, glossary: s.glossary,
            trades: s.trades, setups: s.setups, snapshots: s.snapshots, mistakes: s.mistakes,
            screenshots: s.screenshots, backtests: s.backtests, calendar: s.calendar,
            resources: s.resources, settings: s.settings, progress: s.progress,
          },
          null,
          2
        );
      },
      importData: (json) => {
        try {
          const d = JSON.parse(json);
          set({
            modules: d.modules ?? seedModules,
            lessons: d.lessons ?? seedLessons,
            quizzes: d.quizzes ?? (seedQuizzes as QuizQuestion[]),
            glossary: d.glossary ?? seedGlossary,
            trades: d.trades ?? [],
            setups: d.setups ?? [],
            snapshots: d.snapshots ?? [],
            mistakes: d.mistakes ?? [],
            screenshots: d.screenshots ?? [],
            backtests: d.backtests ?? [],
            calendar: d.calendar ?? [],
            resources: d.resources ?? defaultResources,
            settings: { ...defaultSettings, ...(d.settings ?? {}) },
            progress: d.progress ?? defaultProgress,
          });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "xauusd-academy-v1",
      version: 3,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted: any, version) => {
        if (!persisted) return persisted;
        // v2: ensure new Settings fields exist on older data
        if (persisted.settings && persisted.settings.aiModel === undefined) {
          persisted.settings = { ...defaultSettings, ...persisted.settings };
        }
        // v3: inject the "A Gold Trader's Day" chapter into existing installs
        // WITHOUT touching the user's own edits, journal, trades or settings.
        // Idempotent: only adds items whose id is not already present.
        const NEW_MODULE_ID = "trading-day";
        if (Array.isArray(persisted.modules) && !persisted.modules.some((m: Module) => m.id === NEW_MODULE_ID)) {
          const mod = seedModules.find((m) => m.id === NEW_MODULE_ID);
          if (mod) persisted.modules = [mod, ...persisted.modules];
        }
        const newLessonIds = new Set(seedLessons.filter((l) => l.moduleId === NEW_MODULE_ID).map((l) => l.id));
        if (Array.isArray(persisted.lessons)) {
          const have = new Set(persisted.lessons.map((l: Lesson) => l.id));
          const add = seedLessons.filter((l) => l.moduleId === NEW_MODULE_ID && !have.has(l.id));
          if (add.length) persisted.lessons = [...persisted.lessons, ...add];
        }
        if (Array.isArray(persisted.quizzes)) {
          const haveQ = new Set(persisted.quizzes.map((q: QuizQuestion) => q.id));
          const addQ = (seedQuizzes as QuizQuestion[]).filter((q) => newLessonIds.has(q.lessonId) && !haveQ.has(q.id));
          if (addQ.length) persisted.quizzes = [...persisted.quizzes, ...addQ];
        }
        if (Array.isArray(persisted.resources)) {
          const haveR = new Set(persisted.resources.map((r: ResourceItem) => r.id));
          const addR = defaultResources.filter((r) => r.id.startsWith("r-") && !haveR.has(r.id) &&
            ["r-babypips-sessions", "r-oanda-time", "r-inv002-tf", "r-robo-gold", "r-daytrading-1pct"].includes(r.id));
          if (addR.length) persisted.resources = [...persisted.resources, ...addR];
        }
        return persisted;
      },
      onRehydrateStorage: () => (state) => state?.setHydrated(),
      partialize: (s) => {
        const { hydrated, setHydrated, ...rest } = s as any;
        return rest;
      },
    }
  )
);

// Derived selectors
export function computeStats(trades: JournalTrade[]) {
  const closed = trades.filter((t) => t.outcome !== "open");
  const wins = closed.filter((t) => t.outcome === "win");
  const losses = closed.filter((t) => t.outcome === "loss");
  const withR = closed.filter((t) => typeof t.rMultiple === "number") as (JournalTrade & { rMultiple: number })[];
  const totalR = withR.reduce((a, t) => a + t.rMultiple, 0);
  const winR = wins.filter((t) => typeof t.rMultiple === "number").map((t) => t.rMultiple as number);
  const lossR = losses.filter((t) => typeof t.rMultiple === "number").map((t) => t.rMultiple as number);
  const avgWin = winR.length ? winR.reduce((a, b) => a + b, 0) / winR.length : 0;
  const avgLoss = lossR.length ? lossR.reduce((a, b) => a + b, 0) / lossR.length : 0;
  const winRate = closed.length ? wins.length / closed.length : 0;
  const expectancy = withR.length ? totalR / withR.length : 0;
  const pnl = closed.reduce((a, t) => a + (t.pnl ?? 0), 0);
  const followed = closed.filter((t) => t.followedPlan).length;
  const violations = trades.reduce((a, t) => a + (t.ruleViolations?.length ?? 0), 0);
  // equity curve in R
  let cum = 0;
  const curve = withR
    .slice()
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((t, i) => {
      cum += t.rMultiple;
      return { i: i + 1, r: Number(cum.toFixed(2)), date: t.date };
    });
  return {
    total: trades.length, closed: closed.length, open: trades.length - closed.length,
    wins: wins.length, losses: losses.length, winRate, expectancy, totalR,
    avgWin, avgLoss, pnl, followed, violations, curve,
  };
}
