"use client";

import Link from "next/link";
import { Card, PageHeader, Icon, Badge, ClientOnly } from "@/components/ui";
import { useAcademy } from "@/lib/store";
import { clsx } from "clsx";

// ── Roadmap data ────────────────────────────────────────────────────────────
// Each week has a phase, theme, lesson ids to mark as "this week's focus",
// a daily structure hint, and a deliverable.

const PHASES = [
  {
    phase: "Phase I",
    title: "Price Action Foundations",
    weeks: "1 – 6",
    color: "accent",
    weeks_data: [
      {
        week: 1,
        theme: "Candles & Price Movement",
        description: "Master OHLC anatomy, wick interpretation, candlestick sequences, and what candles actually record about the auction.",
        focusModules: ["foundations", "chart-reading"],
        lessonIds: ["what-is-xauusd", "how-markets-work", "bid-ask-spread", "passive-aggressive-liquidity", "price-discovery", "candlesticks", "ohlc", "inside-outside-bars", "engulfing-pin-bars", "doji-indecision", "candle-sequences"],
        practice: "Observe the same XAUUSD move on 5m, 15m, 1H, and 4H. Write down what each candle records — not what it predicts.",
        deliverable: "Annotate 20 candles in your journal and narrate each without using pattern names.",
        lab: "/labs/candlestick",
      },
      {
        week: 2,
        theme: "Market Structure",
        description: "Learn swing highs/lows, HH/HL/LH/LL sequencing, uptrends, downtrends, ranges, and what a Break of Structure actually means.",
        focusModules: ["chart-reading"],
        lessonIds: ["swing-points", "market-structure", "trend-range-momentum", "highs-lows-recap", "timeframes"],
        practice: "Mark structure on 5 historical XAUUSD charts. Label every swing point and classify the structure type.",
        deliverable: "Complete 10 chart-structure exercises in the Market Structure Lab.",
        lab: "/labs/market-structure",
      },
      {
        week: 3,
        theme: "Support, Resistance & Breakouts",
        description: "Identify key levels, distinguish zones from lines, study how levels change role, and understand false breakouts.",
        focusModules: ["key-levels", "price-action"],
        lessonIds: ["support-resistance", "zones-vs-lines", "reference-levels", "breakout-retest", "false-breakout-sweep", "rejection"],
        practice: "Mark 3 levels on a daily XAUUSD chart. Record the first reaction at each — bounce, break, or false break.",
        deliverable: "Document 10 breakout or rejection examples including all failures. Failures are more instructive than successes.",
        lab: "/labs/support-resistance",
      },
      {
        week: 4,
        theme: "Liquidity, Order Flow & Volume",
        description: "Understand stop clusters, sweeps, absorption, Volume Profile, POC, and what the chart cannot show you.",
        focusModules: ["pa-liquidity", "pa-volume"],
        lessonIds: ["what-is-liquidity", "stop-clusters", "liquidity-sweeps-mechanics", "absorption-order-flow", "what-charts-dont-show", "volume-on-gold", "volume-profile-basics", "auction-market-theory", "volume-as-context"],
        practice: "Find 3 liquidity sweeps on a 15m chart. For each: identify the stop cluster, the sweep, the reclaim. Record whether they reversed.",
        deliverable: "10 annotated case studies — for each observation, clearly separate what you can see from what you are hypothesising.",
        lab: null,
      },
      {
        week: 5,
        theme: "Multi-Timeframe Analysis & Trading Sessions",
        description: "Learn higher-timeframe bias, top-down process, conflicting signals, and how gold behaves differently across sessions.",
        focusModules: ["pa-mtf", "sessions"],
        lessonIds: ["why-multiple-timeframes", "top-down-process-mtf", "conflicting-signals", "one-candle-many-stories", "why-sessions-matter", "asia-session", "london-session", "ny-session-overlap"],
        practice: "Run a full top-down analysis on XAUUSD every morning this week. Record it in the Top-Down Analysis workspace.",
        deliverable: "10 multi-timeframe analyses with both bullish and bearish scenarios written before each session opens.",
        lab: "/top-down",
      },
      {
        week: 6,
        theme: "Integrated Price-Action Analysis",
        description: "Combine all preceding modules. Use the 10 Questions framework and the Both-Scenarios discipline on real historical chart segments.",
        focusModules: ["pa-integration", "fundamentals"],
        lessonIds: ["ten-questions", "both-scenarios-always", "when-not-to-trade", "gold-drivers-overview", "impulse-pullback"],
        practice: "Use chart replay — hide future candles and narrate the chart in real time using the 10 Questions.",
        deliverable: "15 blind chart-reading exercises with written analysis for each. Score yourself honestly: did you answer all 10 questions before looking forward?",
        lab: null,
      },
    ],
  },
  {
    phase: "Phase II",
    title: "Trading Strategy Development",
    weeks: "7 – 10",
    color: "warn",
    weeks_data: [
      {
        week: 7,
        theme: "Strategy Architecture & the Opening Candle",
        description: "Learn the anatomy of a trading strategy — context, setup, trigger, stop, target. Apply it to the Opening Candle / Opening Range setup.",
        focusModules: ["strategies"],
        lessonIds: ["scenario-thinking", "building-scenarios", "entry-models-overview", "confirmation-vs-anticipation"],
        practice: "Write a complete setup card for the Opening Candle strategy with explicit rules for every component.",
        deliverable: "One fully-written strategy template in your Playbook with trigger, stop logic, target, and no-trade conditions.",
        lab: "/playbook",
      },
      {
        week: 8,
        theme: "Breakouts, Order Blocks & Liquidity Setups",
        description: "Study how different strategies use the same price-action foundations — breakout/retest, false-breakout fades, and liquidity sweep reversal.",
        focusModules: ["strategies"],
        lessonIds: [],
        practice: "On a historical chart, mark 5 valid breakout retests and 5 liquidity sweeps. Record each with entry, stop, and target.",
        deliverable: "Add two more setup cards to your Playbook. Each must have a written 'when NOT to trade this' section.",
        lab: "/playbook",
      },
      {
        week: 9,
        theme: "Fibonacci, Volume Profile & Gann Approaches",
        description: "Study the assumptions, implementation, and evidence limitations of Fibonacci, Volume Profile setups, and Gann-based techniques.",
        focusModules: ["strategies"],
        lessonIds: [],
        practice: "Apply Fibonacci retracement to 10 historical impulse moves. Record which retracement level the pullback actually reached.",
        deliverable: "A written evaluation of each approach: What does the method assume? What evidence supports or challenges it? How would you test it?",
        lab: null,
      },
      {
        week: 10,
        theme: "Select & Formalise One Strategy",
        description: "Choose one or two strategies for structured research. Write explicit, testable trading rules — not guidelines. This is preparation for backtesting, not live trading.",
        focusModules: ["strategies", "scenarios"],
        lessonIds: [],
        practice: "Write your strategy's rules so precisely that someone who has never traded could follow them without asking you a question.",
        deliverable: "A completed Playbook setup with: market context filter, exact entry rule, exact stop placement rule, exact target rule, and statistical test plan.",
        lab: "/playbook",
      },
    ],
  },
  {
    phase: "Phase III",
    title: "Risk Management & Quantitative Validation",
    weeks: "11 – 14",
    color: "bull",
    weeks_data: [
      {
        week: 11,
        theme: "Risk Management Fundamentals",
        description: "Position sizing, account risk %, stop placement from structure, R-multiples, expectancy, drawdown management, and the psychology of losing streaks.",
        focusModules: ["stops", "sizing", "rr", "psychology"],
        lessonIds: ["invalidation-first", "stop-placement", "risk-per-trade", "sizing-formula", "leverage-margin-safety", "reward-to-risk", "expectancy-sample"],
        practice: "For every trade idea you have this week, calculate the correct lot size using the formula before considering whether to take the trade.",
        deliverable: "Sizing spreadsheet showing 10 scenarios with different account sizes, risk %, and stop distances — all correctly calculated.",
        lab: "/settings",
      },
      {
        week: 12,
        theme: "Backtesting Foundations",
        description: "Turn your strategy rules into a backtest. Learn about look-ahead bias, survivorship bias, transaction costs, and how to set a pre-registered pass/fail bar.",
        focusModules: ["gold-research"],
        lessonIds: ["gold-key-level-study", "gold-reading-list", "what-we-tested-on-gold"],
        practice: "Run a manual chart-replay backtest of your chosen strategy over at least 40 historical signals. Record every trade — including losses.",
        deliverable: "A backtest record with: entry, stop, target, outcome, R-multiple, and whether you followed the rules. Calculate win rate and expectancy.",
        lab: "/backtesting",
      },
      {
        week: 13,
        theme: "Robustness & Statistical Validation",
        description: "Out-of-sample testing, walk-forward analysis, parameter sensitivity, multiple-testing concerns, and how to avoid fooling yourself.",
        focusModules: ["gold-research"],
        lessonIds: [],
        practice: "Test your strategy on a different time period than you backtested it on. Does performance hold? Does it degrade?",
        deliverable: "A written honest assessment: Is my backtest result likely to be real edge, or is it probably overfitting or luck? Cite sample size and out-of-sample result.",
        lab: "/statistics",
      },
      {
        week: 14,
        theme: "Paper Trading & Performance Review",
        description: "Forward-test your validated strategy in a simulated environment. Compare live results to backtest expectations.",
        focusModules: ["management", "routine"],
        lessonIds: ["trade-management", "after-the-trade", "daily-routine", "risk-limits-rules"],
        practice: "Paper trade your strategy for a full week. Follow the rules exactly as written — no discretionary overrides without recording them.",
        deliverable: "A comparison report: backtest expectancy vs. paper-trade expectancy. What explains the difference? What needs adjusting before live trading?",
        lab: "/journal",
      },
    ],
  },
  {
    phase: "Phase IV",
    title: "Algorithmic Trading",
    weeks: "15 – 16",
    color: "bear",
    weeks_data: [
      {
        week: 15,
        theme: "Algorithmic Implementation",
        description: "Translate your clearly-defined strategy into code. Implement entry logic, stop placement, and position sizing in Python or the Jesse framework.",
        focusModules: [],
        lessonIds: [],
        practice: "Code the entry and exit rules for your chosen strategy. Run it on historical data and verify the output matches your manual backtest.",
        deliverable: "A working strategy script with: data loading, signal generation, position sizing, and a performance summary output.",
        lab: null,
      },
      {
        week: 16,
        theme: "AI-Assisted Research Workflow",
        description: "Build a research workflow: inspect market data, generate hypotheses, test strategies, summarise results, document limitations. AI is a research assistant, not an oracle.",
        focusModules: [],
        lessonIds: [],
        practice: "Use your AI tutor to generate 3 testable hypotheses about XAUUSD price behaviour. Test at least one. Write up results honestly, including failure modes.",
        deliverable: "A documented research workflow and at least one completed hypothesis test with full methodology, results, and conclusion.",
        lab: null,
      },
    ],
  },
];

// ── Daily structure ─────────────────────────────────────────────────────────
const DAILY_STRUCTURE = [
  { time: "15 min", label: "Review previous material", icon: "RotateCcw", note: "Spaced repetition: revisit the last 2–3 lessons briefly before starting new content." },
  { time: "20 min", label: "Study a new concept", icon: "BookOpen", note: "Read the lesson, follow any external references, take notes on what was non-obvious." },
  { time: "30 min", label: "Interactive chart practice", icon: "CandlestickChart", note: "Apply the concept on real or historical XAUUSD price data — not theoretical examples." },
  { time: "15 min", label: "Reflection, quiz & journal", icon: "NotebookPen", note: "Answer: what did I learn? What's still unclear? Log in the journal if relevant." },
];

// ── Component ────────────────────────────────────────────────────────────────
function RoadmapInner() {
  const { lessons, modules } = useAcademy();

  const completedIds = new Set(lessons.filter((l) => l.completed).map((l) => l.id));

  return (
    <div className="space-y-8">
      <PageHeader
        icon="MapPin"
        title="16-Week Gold Trading Curriculum"
        subtitle="A structured plan from first candle to algorithmic implementation. The weeks are a suggested pace — repeat or extend any module until it genuinely clicks."
      />

      {/* Daily structure */}
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Icon name="Clock" size={16} className="text-accent" />
          <h2 className="font-semibold">Suggested Daily Structure (60–90 min)</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DAILY_STRUCTURE.map((d) => (
            <div key={d.label} className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon name={d.icon} size={14} className="text-accent" />
                <span className="text-xs font-semibold text-accent">{d.time}</span>
              </div>
              <div className="text-sm font-medium">{d.label}</div>
              <div className="mt-1 text-xs text-muted">{d.note}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          A typical week: 4 days of new learning + 1 day of integrated exercises + 1 day of assessment and review + 1 optional rest/catch-up day.
        </p>
      </Card>

      {/* Phase sections */}
      {PHASES.map((phase) => (
        <section key={phase.phase} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 px-3 py-1.5">
              <span className="text-sm font-bold text-accent">{phase.phase}</span>
            </div>
            <div>
              <h2 className="font-semibold text-lg">{phase.title}</h2>
              <p className="text-sm text-muted">Weeks {phase.weeks}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {phase.weeks_data.map((w) => {
              const weekLessons = w.lessonIds.map((id) => lessons.find((l) => l.id === id)).filter(Boolean) as typeof lessons;
              const weekDone = weekLessons.filter((l) => completedIds.has(l.id)).length;
              const weekPct = weekLessons.length ? Math.round((weekDone / weekLessons.length) * 100) : 0;

              return (
                <Card key={w.week} className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="rounded bg-elevated px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-subtle">
                          Week {w.week}
                        </span>
                        {weekLessons.length > 0 && (
                          <span className={clsx(
                            "text-[10px] font-semibold tabular-nums",
                            weekPct === 100 ? "text-bull" : weekPct > 0 ? "text-accent" : "text-subtle"
                          )}>
                            {weekPct}%
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold">{w.theme}</h3>
                    </div>
                    {w.lab && (
                      <Link href={w.lab} className="shrink-0 text-[11px] text-accent hover:underline whitespace-nowrap">
                        Open lab →
                      </Link>
                    )}
                  </div>

                  <p className="text-sm text-muted mb-3">{w.description}</p>

                  {/* Lesson checklist */}
                  {weekLessons.length > 0 && (
                    <div className="mb-3 space-y-1">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-subtle mb-1.5">Lessons this week</div>
                      {weekLessons.slice(0, 6).map((l) => (
                        <Link
                          key={l.id}
                          href={`/learn?m=${l.moduleId}&l=${l.id}`}
                          className={clsx(
                            "flex items-center gap-2 rounded px-2 py-1 text-xs transition-colors hover:bg-elevated",
                            completedIds.has(l.id) ? "text-muted line-through" : "text-fg"
                          )}
                        >
                          <Icon
                            name={completedIds.has(l.id) ? "CheckCircle2" : "Circle"}
                            size={12}
                            className={completedIds.has(l.id) ? "text-bull shrink-0" : "text-subtle shrink-0"}
                          />
                          {l.title}
                        </Link>
                      ))}
                      {weekLessons.length > 6 && (
                        <p className="text-[11px] text-muted px-2">+ {weekLessons.length - 6} more</p>
                      )}
                    </div>
                  )}

                  {/* Practice */}
                  <div className="rounded-lg bg-elevated p-3 mb-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon name="Dumbbell" size={12} className="text-accent" />
                      <span className="text-[11px] font-semibold text-accent uppercase tracking-wide">Practice</span>
                    </div>
                    <p className="text-xs text-muted">{w.practice}</p>
                  </div>

                  {/* Deliverable */}
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon name="CheckSquare" size={12} className="text-warn" />
                      <span className="text-[11px] font-semibold text-warn uppercase tracking-wide">Deliverable</span>
                    </div>
                    <p className="text-xs text-muted">{w.deliverable}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ))}

      {/* Philosophy footer */}
      <Card className="border-accent/30 bg-accent/[0.04] p-5">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="mt-0.5 shrink-0 text-accent" />
          <div className="space-y-1 text-sm text-muted">
            <p><strong className="text-fg">This roadmap is a default, not a deadline.</strong> Repeat any week until the concepts feel genuinely clear on a real chart — not just recognisable in isolation.</p>
            <p><strong className="text-fg">Separate three forms of progress:</strong> conceptual understanding (can I explain it?), chart-reading competence (can I spot it live?), and empirical performance (does it produce positive expectancy over a real sample?). These are different skills that develop at different speeds.</p>
            <p><strong className="text-fg">Never conflate a backtest with an edge.</strong> A backtest is a hypothesis. An edge is a hypothesis that has survived out-of-sample testing with realistic costs and an honest sample size.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <ClientOnly fallback={<div className="text-muted">Loading roadmap…</div>}>
      <RoadmapInner />
    </ClientOnly>
  );
}
