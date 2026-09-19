"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Icon, PageHeader, Badge, Button } from "@/components/ui";

interface Step {
  key: string;
  title: string;
  icon: string;
  meaning: string;
  why: string;
  mistake: string;
  pro: string;
  example: string;
}

const STEPS: Step[] = [
  {
    key: "context", title: "Market Context", icon: "Compass",
    meaning: "The bigger-picture state of gold right now: higher-timeframe trend (up/down/range), volatility, and the macro backdrop (dollar, yields, upcoming news).",
    why: "Context decides which tactics even make sense. A buy-the-dip idea is only valid if the higher timeframe is actually bullish. Everything downstream is filtered by this.",
    mistake: "Zooming straight to the 1-minute chart and reacting to noise with no idea what the Daily/4H is doing.",
    pro: "Start top-down. Establish bias and note the macro calendar before looking for a single trade.",
    example: "Daily & 4H printing higher highs and higher lows → bias = bullish → today I prefer longs from support, and I'll be sceptical of shorts.",
  },
  {
    key: "location", title: "Important Location", icon: "MapPin",
    meaning: "A specific price area where a decision is likely: support/resistance, PDH/PDL, session extremes, round numbers — where the auction previously reacted.",
    why: "Trades taken at meaningful locations have logical invalidation and a reason for other participants to act. Trades in 'no-man's-land' have neither.",
    mistake: "Entering in the middle of a range, far from any level, because a candle 'looked good'.",
    pro: "Pre-mark 2–4 key levels and wait for price to arrive at one of them. Patience is the edge.",
    example: "Marking 3705–3710 support (prior demand + round number) and simply waiting for price to trade into that zone.",
  },
  {
    key: "scenario", title: "Scenario", icon: "GitBranch",
    meaning: "A conditional if-then plan for BOTH directions at your location, written before anything happens.",
    why: "It replaces prediction with preparation. You can't be blindsided when you've already scripted what you'll do for each outcome.",
    mistake: "Having a single fixed prediction ('it WILL bounce here') and marrying it, ignoring evidence to the contrary.",
    pro: "Write the bull and bear case for the same level, each with a trigger, invalidation and target — then let price choose.",
    example: "'If 3708 rejects with a bullish close → long to 3735. If price closes below 3702 → short to 3685.'",
  },
  {
    key: "trigger", title: "Trigger", icon: "Crosshair",
    meaning: "The precise, pre-defined event that gives you permission to enter — a rejection candle, a break-and-retest hold, a sweep-and-reclaim.",
    why: "A trigger turns 'I think' into 'the market confirmed'. It makes entries repeatable, journalable and testable.",
    mistake: "Entering the instant price touches a level, on a live (unclosed) candle, with no confirmation.",
    pro: "Wait for the specific closed-candle trigger your model requires. If it doesn't come, there is no trade.",
    example: "Price taps 3708, then a 5m candle prints a long lower wick and closes strong → that close is the trigger to go long.",
  },
  {
    key: "invalidation", title: "Invalidation", icon: "ShieldAlert",
    meaning: "The price at which your idea is simply wrong. Your stop-loss sits just beyond it.",
    why: "It defines your risk-per-unit (the input to sizing) and makes the trade falsifiable so you exit unemotionally.",
    mistake: "Placing a stop based on how many dollars you're willing to lose, rather than where the idea is structurally broken.",
    pro: "Find invalidation from structure first, then let it size the trade. If a logical stop makes the reward poor, skip the trade.",
    example: "Long off 3708 → wrong if 5m closes below 3702 (zone failed). Stop below 3702; risk-per-unit ≈ $6 of price.",
  },
  {
    key: "size", title: "Position Size", icon: "Scale",
    meaning: "The lot size that makes your loss-if-stopped equal to a small fixed % of the account.",
    why: "It's the #1 survival skill. Correct sizing lets you endure inevitable losing streaks; incorrect sizing blows accounts regardless of edge.",
    mistake: "Choosing a lot size that 'feels normal' or that leverage permits, ignoring the stop distance.",
    pro: "Risk $ = Account × Risk%. Lots = Risk $ ÷ (stop distance × $100). The stop distance decides the size — never the mood.",
    example: "$5,000 acct, 1% = $50 risk; $6 stop → $600/lot → 0.08 lots. Same $50 risk no matter the setup.",
  },
  {
    key: "execution", title: "Execution", icon: "MousePointerClick",
    meaning: "Actually placing the order (market/limit/stop) with the stop-loss and take-profit attached, exactly as planned.",
    why: "The best plan is worthless if you hesitate, chase, or fat-finger the size. Clean execution preserves the edge you designed.",
    mistake: "Chasing a worse price out of FOMO, or entering without attaching a stop.",
    pro: "Execute mechanically the moment the trigger fires: correct size, SL and TP set, then hands off.",
    example: "Trigger fires → buy 0.08 lots at market, SL 3701.5, TP 3735 — all set within seconds, then stop staring at it.",
  },
  {
    key: "management", title: "Trade Management", icon: "Settings2",
    meaning: "Executing the post-entry plan: hold to target, move to breakeven, scale out, or trail — as pre-decided.",
    why: "Post-entry emotion (fear/greed) is where planned edges die. Pre-written management keeps you disciplined under pressure.",
    mistake: "Moving the stop further away to avoid a loss, or snatching tiny profits from fear.",
    pro: "Follow the rules you wrote while calm. Never widen a stop. Let winners reach their multi-R targets.",
    example: "Plan: take half at +1R, move stop to breakeven, let the rest run to 3735 — and do exactly that.",
  },
  {
    key: "journal", title: "Journal", icon: "NotebookPen",
    meaning: "An honest record of each trade — the process, not just the result — plus a screenshot and your emotions.",
    why: "Skill compounds only through feedback. Without a journal you repeat mistakes with new money and call it experience.",
    mistake: "Only logging wins, or logging just P&L with no note on whether you followed the plan.",
    pro: "Grade the process separately from the outcome. A disciplined loss is a good trade; a lucky rule-break is a warning.",
    example: "'Followed plan ✓. Entered on the sweep-reclaim, held to target. Felt calm. −0 rule violations.'",
  },
  {
    key: "review", title: "Statistical Review", icon: "BarChart3",
    meaning: "Evaluating a SAMPLE of trades (20–100+) for expectancy, win rate, average R and rule adherence — then improving the strategy.",
    why: "One trade is noise. Only a sample reveals your true edge and where it leaks. This is how a discretionary trader thinks like a researcher.",
    mistake: "Changing the whole strategy after 3 losing trades (reacting to variance, not signal).",
    pro: "Run a full sample by the same rules, review the stats, then make one deliberate improvement — and test again.",
    example: "'Over 40 trades: +0.4R expectancy, but I lose most when I skip the sweep. Rule added: require the reclaim.'",
  },
];

const RELATED: Record<string, { label: string; href: string }[]> = {
  context: [{ label: "Gold Fundamentals", href: "/learn?m=fundamentals&l=gold-drivers-overview" }, { label: "Top-Down Analysis", href: "/top-down" }],
  location: [{ label: "Support & Resistance", href: "/learn?m=key-levels&l=support-resistance" }, { label: "S/R Lab", href: "/labs/support-resistance" }],
  scenario: [{ label: "Scenario Thinking", href: "/learn?m=scenarios&l=scenario-thinking" }],
  trigger: [{ label: "Entry Models", href: "/learn?m=entries&l=entry-models-overview" }, { label: "Candlestick Lab", href: "/labs/candlestick" }],
  invalidation: [{ label: "Invalidation First", href: "/learn?m=stops&l=invalidation-first" }],
  size: [{ label: "Position Sizing Formula", href: "/learn?m=sizing&l=sizing-formula" }],
  execution: [{ label: "Order Types", href: "/learn?m=foundations&l=order-types" }],
  management: [{ label: "Trade Management", href: "/learn?m=management&l=trade-management" }],
  journal: [{ label: "Trading Journal", href: "/journal" }],
  review: [{ label: "Statistics", href: "/statistics" }, { label: "Expectancy & Sample Size", href: "/learn?m=rr&l=expectancy-sample" }],
};

export default function StartHerePage() {
  const [active, setActive] = useState<string>("context");
  const step = STEPS.find((s) => s.key === active)!;

  return (
    <div>
      <PageHeader
        icon="Sparkles"
        title="Start Here — The Professional Mental Model"
        subtitle="Trading is not 'predict → click → hope.' It is a repeatable process. Click any stage below to learn what it means, why it matters, the beginner mistake, and the professional approach."
      />

      {/* The manifesto */}
      <Card className="mb-8 border-accent/30 bg-accent/[0.05] p-5">
        <div className="flex items-start gap-3">
          <Icon name="Quote" size={22} className="mt-0.5 shrink-0 text-accent" />
          <p className="text-[15px] leading-relaxed">
            <b>Your job is not to predict every movement in gold.</b> Your job is to recognise situations in which your predefined
            trading hypothesis has <b>acceptable risk</b> and <b>positive expected value</b> — then execute your plan and record the result.
          </p>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
        {/* The flow */}
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">The process</div>
          <div className="space-y-1">
            {STEPS.map((s, i) => (
              <div key={s.key}>
                <button
                  onClick={() => setActive(s.key)}
                  className={`group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${
                    active === s.key ? "border-accent/60 bg-accent/10" : "border-border hover:border-accent/30 hover:bg-elevated"
                  }`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active === s.key ? "bg-accent text-accent-fg" : "bg-elevated text-subtle group-hover:text-fg"}`}>
                    <Icon name={s.icon} size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-medium ${active === s.key ? "text-accent" : ""}`}>{s.title}</div>
                  </div>
                  <span className="text-[10px] tabular-nums text-subtle">{String(i + 1).padStart(2, "0")}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className="ml-[27px] my-0.5 flex h-3 items-center">
                    <Icon name="ChevronDown" size={13} className="text-subtle" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div>
          <Card className="p-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/12 text-accent">
                <Icon name={step.icon} size={22} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-subtle">Stage {STEPS.findIndex((s) => s.key === active) + 1} of {STEPS.length}</div>
                <h2 className="text-xl font-semibold">{step.title}</h2>
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <Block icon="Info" tone="accent" label="What it means">{step.meaning}</Block>
              <Block icon="Lightbulb" tone="accent" label="Why it matters">{step.why}</Block>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-bear/30 bg-bear/[0.05] p-4">
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-bear"><Icon name="X" size={14} /> Beginner mistake</div>
                  <p className="text-sm text-muted">{step.mistake}</p>
                </div>
                <div className="rounded-lg border border-bull/30 bg-bull/[0.05] p-4">
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-bull"><Icon name="Check" size={14} /> Professional approach</div>
                  <p className="text-sm text-muted">{step.pro}</p>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-elevated p-4">
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-accent"><Icon name="CandlestickChart" size={14} /> Simple XAU/USD example</div>
                <p className="font-mono text-sm">{step.example}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                <span className="text-xs text-subtle">Go deeper:</span>
                {RELATED[active]?.map((r) => (
                  <Link key={r.href} href={r.href}>
                    <Badge tone="accent" className="cursor-pointer hover:opacity-80">{r.label} →</Badge>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-between border-t border-border pt-4">
              <Button
                variant="ghost" size="sm"
                disabled={STEPS.findIndex((s) => s.key === active) === 0}
                onClick={() => setActive(STEPS[STEPS.findIndex((s) => s.key === active) - 1].key)}
              >
                <Icon name="ArrowLeft" size={14} /> Previous
              </Button>
              <Button
                variant="primary" size="sm"
                disabled={STEPS.findIndex((s) => s.key === active) === STEPS.length - 1}
                onClick={() => setActive(STEPS[STEPS.findIndex((s) => s.key === active) + 1].key)}
              >
                Next stage <Icon name="ArrowRight" size={14} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Block({ icon, label, children, tone }: { icon: string; label: string; children: React.ReactNode; tone?: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
        <Icon name={icon} size={14} /> {label}
      </div>
      <p className="text-[15px] leading-relaxed text-fg">{children}</p>
    </div>
  );
}
