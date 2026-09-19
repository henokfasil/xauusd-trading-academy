"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Icon, PageHeader, Badge } from "@/components/ui";

interface Stage {
  time: string;
  title: string;
  icon: string;
  doing: string;
  looking: string;
  question: string;
  avoid: string;
  example: string;
  mistake: string;
  pro: string;
}

const STAGES: Stage[] = [
  {
    time: "07:30", title: "Higher-timeframe analysis", icon: "Telescope",
    doing: "Open Daily → 4H → 1H. Read the trend and structure top-down before any lower-timeframe noise.",
    looking: "Sequence of highs/lows (HH/HL vs LH/LL), the most recent decisive move, and where the Daily/4H closed yesterday.",
    question: "What is my bias today — bullish, bearish, or range — and how strong is it?",
    avoid: "Don't skip to the 1-minute chart. Don't form a bias from a single candle.",
    example: "4H making higher highs and higher lows, price pulling back → bias bullish, I'll favour longs from support.",
    mistake: "Deciding direction from the 5m because it 'looks like it's going up' right now.",
    pro: "Write the bias down in one sentence and let it filter every trade for the rest of the day.",
  },
  {
    time: "07:45", title: "Mark key levels", icon: "Ruler",
    doing: "Draw the battlegrounds: PDH/PDL, prior session highs/lows, major S/R zones, big round numbers.",
    looking: "Where price previously reacted hard; the Asian range that's forming; obvious liquidity pools (equal highs/lows).",
    question: "Where are the 2–4 areas a decision is most likely to happen today?",
    avoid: "Don't clutter the chart with 20 lines. Draw zones, not pixel-perfect lines.",
    example: "Mark 3705–3710 support, 3740 resistance (yesterday's high), 3750 round number.",
    mistake: "Marking so many levels that every price is 'near a level' and none of them mean anything.",
    pro: "Fewer, higher-quality zones. Each one should have a clear story for why it matters.",
  },
  {
    time: "08:00", title: "Check the economic calendar", icon: "CalendarClock",
    doing: "Note every high-impact release today and its exact time in your platform's timezone.",
    looking: "Red-folder events: FOMC, CPI, NFP, PCE, Fed speakers — and when they land relative to sessions.",
    question: "When is my technical analysis likely to be overridden by macro, and what's my policy for it?",
    avoid: "Don't get ambushed. Don't open a normal technical trade minutes before a red-folder release.",
    example: "CPI at 13:30 → plan: be flat into it, watch the reaction, trade the structure that forms after.",
    mistake: "Only noticing the news after price rips $30 through your stop.",
    pro: "Decide your news policy in advance (flat / wait / pre-planned) so you never improvise under fire.",
  },
  {
    time: "08:15", title: "Build scenarios", icon: "GitBranch",
    doing: "For each key level, write BOTH an if-then bull case and bear case, each with trigger, invalidation and target.",
    looking: "How your bias + the levels + the calendar combine into 2–3 concrete, rankable plans.",
    question: "Exactly what will I do at each level — in both directions?",
    avoid: "Don't walk into the session with a vague 'I'll see what happens'.",
    example: "'If 3708 rejects → long to 3735. If 3702 breaks and retests → short to 3685.'",
    mistake: "Preparing only the direction you 'want', so the opposite move blindsides you.",
    pro: "Rank the scenario that best fits your HTF bias as the A+ — that's the one worth full size.",
  },
  {
    time: "09:00", title: "London observation", icon: "Eye",
    doing: "Watch how London opens. Volatility ramps; the day's character starts to show.",
    looking: "Does London sweep the Asian high/low? Is it trending or ranging? Is momentum impulsive or hesitant?",
    question: "Is a sweep-and-reverse or a clean breakout developing — or neither yet?",
    avoid: "Don't chase the first spike. The opening move is often a fake / liquidity grab.",
    example: "London spikes above the Asian high, then closes back inside → potential sweep, watch for shorts.",
    mistake: "Buying the breakout of the Asian high the instant it breaks — right into the reversal.",
    pro: "Let London show its hand. Wait for the reclaim or the retest before committing.",
  },
  {
    time: "09:30", title: "Possible setup", icon: "Crosshair",
    doing: "If price reaches a level and your trigger fires, size the trade by risk and execute mechanically.",
    looking: "Your specific pre-defined trigger: rejection close, break-and-retest hold, or sweep-and-reclaim.",
    question: "Has my exact trigger actually occurred, or am I forcing it?",
    avoid: "Don't enter without a trigger. Don't oversize. Don't skip the stop.",
    example: "Price sweeps 3708, reclaims with a strong 5m close → long 0.08 lots, SL 3701.5, TP 3735.",
    mistake: "Entering because you're bored or afraid of missing out, with no trigger present.",
    pro: "No trigger = no trade. One clean A+ entry beats five forced ones. Size by risk, every time.",
  },
  {
    time: "10:00", title: "Trade management", icon: "Settings2",
    doing: "Execute the post-entry plan you already wrote — hold, breakeven, partial, or trail.",
    looking: "Whether price is behaving as your scenario predicted; new structure forming in your favour.",
    question: "Is my thesis still valid, and am I following my written management rules?",
    avoid: "Never widen your stop. Don't snatch profit early from fear. Don't invent new rules mid-trade.",
    example: "At +1R take half, move stop to breakeven, let the rest run toward 3735.",
    mistake: "Moving the stop further away 'to give it room' as price approaches it.",
    pro: "Manage by the pre-written plan, not by the emotion of the moment. Hands off otherwise.",
  },
  {
    time: "11:00", title: "Stop or continue per plan", icon: "ListChecks",
    doing: "Assess against your daily rules: have you hit max trades or max daily loss? Is the session going quiet?",
    looking: "Your running P&L in R, number of trades taken, and whether quality setups are still appearing.",
    question: "Do my own rules say I should keep trading, or step back?",
    avoid: "Don't revenge-trade a loss. Don't overtrade a quiet midday drift.",
    example: "Down −2R (your daily limit) → close the platform for the day, no exceptions.",
    mistake: "Trying to 'win it back' after a loss with a bigger, unplanned trade.",
    pro: "The midday lull is often best skipped. Discipline to stop is as valuable as skill to enter.",
  },
  {
    time: "14:00", title: "Prepare for the US session", icon: "FlagTriangleRight",
    doing: "Re-mark levels, note where London left price, and re-read the calendar for US releases.",
    looking: "London's high/low as new references; the London/NY overlap approaching; USD behaviour.",
    question: "What's my scenario for the overlap — continuation of London or a reversal?",
    avoid: "Don't carry a stale morning bias if London already invalidated it.",
    example: "London trended up into 3740; plan a retest-long on the overlap, or a short if 3740 rejects hard.",
    mistake: "Assuming the morning plan still applies when structure has already changed.",
    pro: "Refresh the analysis. The overlap is prime time — walk in with a current, specific plan.",
  },
  {
    time: "14:30", title: "US releases / New York activity", icon: "Zap",
    doing: "Trade the highest-liquidity window carefully — or sit out the news spike and trade the cleaner move after.",
    looking: "The reaction to US data, the real directional move once the initial whipsaw settles (15–30 min).",
    question: "Is this a tradeable structured move, or still chaotic news noise?",
    avoid: "Don't trade the instant of a red-folder release (blown spreads, slippage, two-way whips).",
    example: "After a hot CPI whipsaw, price builds a clean lower-high → short with the post-news trend.",
    mistake: "Market-buying the first green candle of the news spike and getting slipped and reversed.",
    pro: "Let the dust settle. The second, structured move is usually the higher-probability trade.",
  },
  {
    time: "End of day", title: "Journal & review", icon: "NotebookPen",
    doing: "Screenshot every trade, journal the process honestly, log any rule violations and emotions.",
    looking: "Did you follow the plan? Which scenarios fired? What would you repeat or change?",
    question: "Did I execute my process well — independent of whether trades won or lost?",
    avoid: "Don't only log winners. Don't skip the review because it was a losing day.",
    example: "'2 trades, both by plan. +1.5R net. Felt calm. Note: I still enter sweeps a touch early.'",
    mistake: "Closing the laptop after a red day with no notes, guaranteeing you repeat the mistake.",
    pro: "Grade process over outcome. A disciplined losing day is a good day for your development.",
  },
];

export default function DayInTheLifePage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <PageHeader
        icon="Sun"
        title="A Day Trading XAU/USD"
        subtitle="A stage-by-stage walkthrough of a professional's day. Expand each stage for what you're doing, what you're looking at, the question you're answering, and what NOT to do."
      />

      <Card className="mb-6 border-warn/30 bg-warn/[0.05] p-4">
        <div className="flex items-start gap-2.5">
          <Icon name="Info" size={18} className="mt-0.5 shrink-0 text-warn" />
          <p className="text-sm text-muted">
            <b className="text-fg">These times are illustrative (roughly London time), not fixed rules.</b> Session times and the London/NY overlap
            shift with daylight saving — which changes on different dates in Europe and the US — so the relationships drift by an hour a few times a year.
            Learn the <i>rhythm</i> (quiet Asia → London expansion → NY/overlap), then re-anchor to your own platform clock.
          </p>
        </div>
      </Card>

      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
        <div className="space-y-2">
          {STAGES.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="relative">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-center gap-4 rounded-xl border border-transparent py-1.5 pr-3 text-left transition-colors hover:bg-elevated/50"
                >
                  <div className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${isOpen ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface text-subtle group-hover:text-fg"}`}>
                    <Icon name={s.icon} size={17} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-accent tabular-nums">{s.time}</span>
                      <span className="font-medium">{s.title}</span>
                    </div>
                  </div>
                  <Icon name="ChevronDown" size={16} className={`text-subtle transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="ml-14 mb-3 mt-1 animate-fade-in">
                    <Card className="p-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Info icon="Activity" label="What am I doing?">{s.doing}</Info>
                        <Info icon="Eye" label="What am I looking at?">{s.looking}</Info>
                        <Info icon="HelpCircle" label="What question am I answering?">{s.question}</Info>
                        <Info icon="Ban" label="What should I NOT do?" tone="bear">{s.avoid}</Info>
                      </div>
                      <div className="mt-4 rounded-lg border border-border bg-elevated p-3">
                        <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-accent"><Icon name="CandlestickChart" size={13} /> Example chart situation</div>
                        <p className="font-mono text-sm">{s.example}</p>
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-bear/30 bg-bear/[0.05] p-3">
                          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-bear"><Icon name="X" size={13} /> Beginner mistake</div>
                          <p className="text-sm text-muted">{s.mistake}</p>
                        </div>
                        <div className="rounded-lg border border-bull/30 bg-bull/[0.05] p-3">
                          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-bull"><Icon name="Check" size={13} /> Professional thought process</div>
                          <p className="text-sm text-muted">{s.pro}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Card className="mt-8 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon name="ListChecks" size={18} className="text-accent" />
            <span className="text-sm">Turn this routine into your own editable checklist and rules.</span>
          </div>
          <div className="flex gap-2">
            <Link href="/routine" className="hidden" />
            <Link href="/playbook"><Badge tone="accent" className="cursor-pointer px-3 py-1.5 hover:opacity-80">Build my Playbook →</Badge></Link>
            <Link href="/top-down"><Badge tone="accent" className="cursor-pointer px-3 py-1.5 hover:opacity-80">Log a top-down read →</Badge></Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Info({ icon, label, children, tone }: { icon: string; label: string; children: React.ReactNode; tone?: string }) {
  return (
    <div>
      <div className={`mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${tone === "bear" ? "text-bear" : "text-accent"}`}>
        <Icon name={icon} size={13} /> {label}
      </div>
      <p className="text-sm text-fg">{children}</p>
    </div>
  );
}
