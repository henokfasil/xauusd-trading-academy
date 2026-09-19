// ---------------------------------------------------------------------------
// Core domain types for XAU/USD Trading Academy
// All learning content is structured data so individual pieces can be edited,
// added, deleted, reordered — and later migrated to SQLite/Postgres.
// ---------------------------------------------------------------------------

export type ConceptStatus = "unseen" | "learning" | "review" | "mastered";

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  summary: string;
  /** Markdown body — the editable lesson text */
  body: string;
  /** Optional personal notes appended by the learner */
  notes: string;
  order: number;
  /** minutes, rough estimate */
  estMinutes: number;
  completed: boolean;
  status: ConceptStatus;
  /** ids into the glossary this lesson introduces */
  concepts: string[];
  /** optional link to a special interactive tool route */
  toolRoute?: string;
  updatedAt: number;
}

export interface Module {
  id: string;
  title: string;
  /** short blurb shown under the module heading */
  blurb: string;
  order: number;
  /** lucide icon name */
  icon: string;
}

export interface QuizQuestion {
  id: string;
  lessonId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  /** plain example on XAU/USD */
  example?: string;
  category: string;
  updatedAt: number;
}

// ------- Journal & Trades -------

export type Direction = "long" | "short";
export type TradeOutcome = "win" | "loss" | "breakeven" | "open";

export interface JournalTrade {
  id: string;
  date: string; // ISO date
  direction: Direction;
  session: string; // Asia / London / NY / Overlap
  setupId?: string; // link to playbook setup
  // The professional process, captured per trade:
  context: string; // market context / higher-timeframe bias
  location: string; // important level
  scenario: string; // the conditional hypothesis
  trigger: string; // what actually triggered entry
  invalidation: string; // where the idea is wrong
  entry: number | null;
  stop: number | null;
  target: number | null;
  riskPerUnit: number | null; // usually |entry-stop|
  plannedRR: number | null;
  size: number | null; // lots
  riskAmount: number | null; // account currency risked
  outcome: TradeOutcome;
  rMultiple: number | null; // realized R
  pnl: number | null;
  followedPlan: boolean;
  ruleViolations: string[];
  emotions: string;
  lessons: string;
  screenshotIds: string[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

// ------- Playbook (personal setups) -------

export interface PlaybookSetup {
  id: string;
  name: string;
  thesis: string; // one-line description of the edge/idea
  context: string; // when it applies (market context)
  location: string; // where (levels)
  trigger: string; // entry trigger
  invalidation: string; // stop logic
  management: string; // trade management rules
  targets: string; // exit logic
  checklist: ChecklistItem[];
  tags: string[];
  updatedAt: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
}

// ------- Top-Down Analysis snapshots -------

export type TrendState = "bullish" | "bearish" | "range" | "unclear";
export type StructureState = "hh_hl" | "lh_ll" | "mixed";

export interface TimeframeRead {
  trend: TrendState;
  structure: StructureState;
  levels: string;
  observations: string;
  bias: string;
}

export interface TopDownSnapshot {
  id: string;
  date: string;
  title: string;
  reads: Record<string, TimeframeRead>; // key = timeframe (Daily/4H/1H/15m/5m)
  interpretation: string;
  screenshotIds: string[];
  updatedAt: number;
}

// ------- Mistakes -------

export interface MistakeEntry {
  id: string;
  title: string;
  description: string;
  cost: string; // qualitative or numeric
  correction: string; // the professional fix
  relatedTradeIds: string[];
  tags: string[];
  updatedAt: number;
}

// ------- Screenshots -------

export interface Screenshot {
  id: string;
  title: string;
  /** data URL (base64) stored locally */
  dataUrl: string;
  note: string;
  tags: string[];
  createdAt: number;
}

// ------- Backtesting sessions -------

export interface BacktestSession {
  id: string;
  name: string;
  setupId?: string;
  hypothesis: string;
  period: string;
  sampleTradeIds: string[]; // journal trades tagged as backtest
  notes: string;
  updatedAt: number;
}

// ------- Settings -------

export interface Settings {
  accountBalance: number;
  riskPercent: number; // default risk per trade
  currency: string;
  learnerName: string;
  timezone: string;
}

export interface Progress {
  lastLessonRoute: string | null;
  quizScores: Record<string, { correct: number; total: number; at: number }>;
}
