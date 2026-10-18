import { Module, Lesson } from "@/lib/types";
import { extraStrategyLessons } from "@/data/extra-strategies";

// ---------------------------------------------------------------------------
// Seed curriculum. This is the DEFAULT content the app loads on first run.
// After first load everything lives in local storage and is fully editable.
// Content is intentionally structured so a coding LLM can rewrite a single
// lesson body without touching the rest of the app.
// ---------------------------------------------------------------------------

export const modules: Module[] = [
  // Featured chapter — always shown separately above the curriculum nav
  { id: "trading-day",    title: "A Gold Trader's Day",          blurb: "Follow a professional XAU/USD day trader from pre-market prep to entry, exit and the closing journal.",                              order: 0,   icon: "Sunrise" },
  // ── Chapter 1: Price Action ──────────────────────────────────────────────
  { id: "foundations",    title: "Foundations",                   blurb: "The vocabulary and mechanics every trade rests on: bid/ask, order types, lots, leverage, and how auctions produce price.",           order: 10,  icon: "BookOpen",          chapter: "Price Action" },
  { id: "chart-reading",  title: "Chart Reading",                 blurb: "Turn a wall of candles into structure you can reason about — bodies, wicks, timeframes, swing points, and market structure.",        order: 20,  icon: "CandlestickChart",  chapter: "Price Action" },
  { id: "key-levels",     title: "Key Levels",                    blurb: "Where price is likely to react — and why zones beat exact lines.",                                                                   order: 30,  icon: "Ruler",             chapter: "Price Action" },
  { id: "price-action",   title: "Price Behavior at Levels",      blurb: "How price acts when it reaches a key level: rejection, breakout, retest, and liquidity sweep.",                                     order: 35,  icon: "Activity",          chapter: "Price Action" },
  { id: "sessions",       title: "Trading Sessions",              blurb: "Gold behaves differently across Asia, London and New York — liquidity, volatility, and the opening range.",                         order: 40,  icon: "Clock",             chapter: "Price Action" },
  { id: "fundamentals",   title: "Gold Fundamentals",             blurb: "The macro forces — USD, real yields, Fed, risk sentiment — that move XAU/USD over days and hours.",                                 order: 50,  icon: "Landmark",          chapter: "Price Action" },
  { id: "pa-liquidity",   title: "Liquidity & Order Flow",        blurb: "Stop clusters, sweeps, absorption, and the honest limits of what a standard OHLC chart can show you.",                              order: 60,  icon: "Waves",             chapter: "Price Action" },
  { id: "pa-volume",      title: "Volume & Auction Theory",       blurb: "Volume Profile, POC, value areas, Auction Market Theory — and why tick volume ≠ real volume on spot gold.",                         order: 70,  icon: "BarChart2",         chapter: "Price Action" },
  { id: "pa-mtf",         title: "Multi-Timeframe Analysis",      blurb: "How the same price action tells different stories at different zoom levels, and how to read them together.",                         order: 80,  icon: "GalleryHorizontal", chapter: "Price Action" },
  { id: "pa-integration", title: "Reading a Full Chart",          blurb: "Combine every preceding module into a complete, honest, structured chart analysis before any trade decision.",                      order: 90,  icon: "ScanSearch",        chapter: "Price Action" },
  // ── Chapter 2: Trading Strategies ───────────────────────────────────────
  { id: "strategies",     title: "Trading Strategies",            blurb: "Complete chart-based setups that combine context, location and trigger into one repeatable play.",                                   order: 100, icon: "Target",            chapter: "Trading Strategies" },
  { id: "scenarios",      title: "Trade Scenarios",               blurb: "Convert analysis into conditional 'if-then' hypotheses — always with both a bullish and a bearish plan.",                           order: 110, icon: "GitBranch",         chapter: "Trading Strategies" },
  { id: "entries",        title: "Entry Models",                  blurb: "Precise, repeatable triggers instead of gut clicks — confirmation vs anticipation.",                                                order: 120, icon: "Crosshair",         chapter: "Trading Strategies" },
  // ── Chapter 3: Risk Management ──────────────────────────────────────────
  { id: "stops",          title: "Stops & Invalidation",          blurb: "Define where you are wrong before you enter — structural invalidation, not arbitrary distances.",                                   order: 200, icon: "ShieldAlert",       chapter: "Risk Management" },
  { id: "sizing",         title: "Position Sizing",               blurb: "The single most important survival skill: risk-first sizing, the formula, and why leverage is almost irrelevant.",                  order: 210, icon: "Scale",             chapter: "Risk Management" },
  { id: "rr",             title: "Risk / Reward",                 blurb: "Why expectancy — not win rate — pays you, and how to think in R-multiples.",                                                        order: 220, icon: "TrendingUp",        chapter: "Risk Management" },
  { id: "management",     title: "Trade Management",              blurb: "What to do after you are in — breakeven, partials, trailing, and the golden rule of pre-commitment.",                              order: 230, icon: "Settings2",         chapter: "Risk Management" },
  { id: "routine",        title: "Daily Routine",                 blurb: "The repeatable pre-, during-, and post-session process that professionals run every day.",                                           order: 240, icon: "ListChecks",        chapter: "Risk Management" },
  { id: "psychology",     title: "Trading Psychology",            blurb: "Manage the one variable you can't chart: fear, greed, FOMO, ego — and the process-over-outcome mindset.",                          order: 250, icon: "Brain",             chapter: "Risk Management" },
  { id: "calendar",       title: "Economic Calendar",             blurb: "Plan around CPI, FOMC and NFP instead of being ambushed — and how to handle news technically.",                                    order: 260, icon: "CalendarClock",     chapter: "Risk Management" },
  // ── Chapter 4: Quant Validation ─────────────────────────────────────────
  { id: "gold-research",  title: "Gold Research Lab",             blurb: "What 23 years of data and the academic literature say about gold, key levels, and honest strategy testing.",                        order: 300, icon: "FlaskConical",      chapter: "Quant Validation" },
];

// Helper to keep the seed compact & consistent.
let seq = 0;
function L(
  moduleId: string,
  id: string,
  title: string,
  summary: string,
  estMinutes: number,
  concepts: string[],
  body: string,
  toolRoute?: string
): Lesson {
  seq += 1;
  return {
    id,
    moduleId,
    title,
    summary,
    body: body.trim(),
    notes: "",
    order: seq,
    estMinutes,
    completed: false,
    status: "unseen",
    concepts,
    toolRoute,
    updatedAt: Date.now(),
  };
}

export const lessons: Lesson[] = [
  // ---------------------------------------------------------------- FOUNDATIONS
  L("foundations", "what-is-xauusd", "What is XAU/USD?", "The instrument you are actually trading and what its price means.", 8, ["xauusd", "spot-gold", "pip", "point"], `
# What is XAU/USD?

**XAU/USD** is the price of **one troy ounce of gold, quoted in US dollars**. "XAU" is the market code for gold (X = commodity, AU = the chemical symbol for gold). So when XAU/USD = **3720.50**, the market is saying: *one ounce of gold costs 3,720.50 US dollars right now.*

You are not buying physical bars. As a retail day trader you trade a **contract for difference (CFD)** or a **spot** position with a broker. You profit (or lose) from the *change* in price between when you open and close, multiplied by your position size.

## Why gold moves
Gold is simultaneously three things, and that is why it is so active intraday:

- A **currency** (priced in USD, so it moves inversely to the dollar).
- A **safe-haven asset** (money flows into it when investors are scared).
- A **real-yield instrument** (it competes with interest-bearing assets like US Treasuries).

You will study each of these forces in **Gold Fundamentals**. For now, just anchor the core idea:

> The number on your chart is dollars per ounce. Everything else in this academy is about *when* that number is likely to move in your favour with acceptable risk.

## Long vs short — a first taste
- If you think price will **rise**, you go **long** (buy). You profit if it goes up.
- If you think price will **fall**, you go **short** (sell). You profit if it goes down.

Gold trends and reverses in both directions, so a complete trader must be comfortable trading *down* as well as up. Beginners often only look for buys — that halves your opportunities and biases your analysis.

## Common beginner mistake
Treating gold like it "always goes up over time." That is true for a buy-and-hold *investor* over years. As a **day trader** you care about the next few hours, where gold whips in both directions. Long-term bullishness is not an intraday edge.
`),

  L("foundations", "how-markets-work", "How markets work", "Price is an auction between buyers and sellers, not a fixed number.", 9, ["order-flow", "liquidity", "auction"], `
# How markets work

A price is not handed down from an authority. It is the outcome of a continuous **auction**: buyers bidding to get in, sellers offering to get out. The last agreed transaction *is* the price.

## The auction mental model
Imagine a busy market stall:
- Buyers shout the highest price they'll **pay** — the **bid**.
- Sellers shout the lowest price they'll **accept** — the **ask** (or offer).
- A trade happens when someone crosses the gap and accepts the other side.

When aggressive buyers outnumber sellers, they lift the offer and price ticks **up**. When aggressive sellers dominate, price ticks **down**. That is *all* a candlestick is recording: who won the auction, and by how much, over a slice of time.

## Liquidity — the fuel
**Liquidity** is how much size is resting to be traded at nearby prices. Deep liquidity → price moves smoothly. Thin liquidity → price jumps. Gold is deeply liquid during **London** and **New York** hours and much thinner during late Asia — the same "setup" can behave completely differently depending on liquidity.

## Why this matters to you
Everything you'll learn — support, resistance, breakouts, sweeps — is a *story about the auction*. A "support level" is just a price where buyers previously showed up in size. It is not magic; it is memory of order flow. Keep asking: **who is likely trapped, and who is likely in control here?**
`),

  L("foundations", "bid-ask-spread", "Bid, Ask & Spread", "The two prices you actually trade at, and the hidden cost between them.", 7, ["bid", "ask", "spread", "slippage"], `
# Bid, Ask & Spread

There are always **two** prices, not one:

- **Bid** — the price you can **sell** at.
- **Ask** — the price you can **buy** at.

The **spread** is the gap between them, and it is a real cost you pay on every trade.

Example on gold:
- Bid = 3720.20, Ask = 3720.50 → spread = **0.30** (30 cents, or 30 "points").

If you buy at the ask (3720.50) and immediately sell at the bid (3720.20), you are already **down 0.30** before the market moves at all. The trade must move *at least* the spread just to break even.

## Why the spread changes
- **Tight** during liquid hours (London/NY) — often a few cents on major brokers.
- **Wide** during rollover, news spikes, and thin Asian hours — it can blow out to several dollars for a moment.

## Slippage
When you press buy/sell "at market", you take whatever price is available *now*. In fast conditions the fill can be worse than the price you saw — that difference is **slippage**. It is worst around high-impact news (see **Economic Calendar**).

## Professional habit
Never plan a trade whose entire profit target is smaller than the spread + expected slippage. Scalping 2–3 point moves on gold with a 1.5 point spread is a losing game before you start. Your **reward must dwarf your frictions.**
`),

  L("foundations", "lots-contract-size", "Lots & Contract Size", "How position size is measured, and what one lot of gold is really worth.", 8, ["lot", "contract-size", "position-size"], `
# Lots & Contract Size

Your **position size** on gold is measured in **lots**. For XAU/USD on most brokers:

- **1.00 standard lot = 100 ounces** of gold.
- **0.10 lot = 10 ounces.**
- **0.01 lot (micro) = 1 ounce.**

## What a move is worth
Because 1 lot = 100 oz, a **\$1.00 move** in the gold price = **\$100** profit/loss per standard lot.

| Size | Ounces | Value of a \$1.00 move | Value of a 0.10 (10-cent) move |
|------|--------|------------------------|-------------------------------|
| 1.00 lot | 100 | \$100.00 | \$10.00 |
| 0.10 lot | 10 | \$10.00 | \$1.00 |
| 0.01 lot | 1 | \$1.00 | \$0.10 |

So if you buy **0.10 lots** at 3700.00 and gold rises to 3705.00 (a \$5 move), your profit is \$5 × \$10 = **\$50**.

## The point that saves accounts
Notice how *fast* this scales. On **1.00 lot**, a completely ordinary 20-dollar swing in gold — which can happen in an hour — is **\$2,000**. New traders pick a lot size because it "feels normal", not because they calculated the risk. That is backwards. In **Position Sizing** you'll learn to do it the professional way: decide the dollars you're willing to lose *first*, then let that math *tell you* the lot size.
`),

  L("foundations", "pips-points", "Pips & Points", "How distance on the gold chart is measured and counted.", 6, ["pip", "point"], `
# Pips & Points

To size trades and set stops you need a unit for **distance**. On gold, terminology is loose, so pin it down:

- A **point** (or "pip" as many gold traders say) on XAU/USD is usually **\$0.10** of price movement... **but many brokers and traders count \$1.00 as one "pip" on gold.** This ambiguity causes real mistakes.

**The only unit that never lies is the dollar price itself.** So this academy always talks in **price terms**:

- Entry 3700.00, stop 3695.00 → risk = **\$5.00 of price** = 5 dollars = 50 "ten-cent points".

## Do this to stay safe
When a signal service or mentor says "50 pip stop on gold", *always* ask: 50 × \$0.10 (= \$5.00) or 50 × \$1.00 (= \$50.00)? Those are **10× different** and will destroy your risk math if confused.

## Rule of thumb
Convert everything to **price** and to **dollars of P&L** using the lot table from the previous lesson. If you can answer *"how many actual dollars do I make/lose per \$1 move?"* you never need to argue about pips again.
`),

  L("foundations", "leverage", "Leverage", "How a small deposit controls a large position — and why that cuts both ways.", 8, ["leverage", "margin", "position-size"], `
# Leverage

**Leverage** lets you control a large position with a small amount of your own money. If your broker offers **1:100** leverage, \$1 of your capital can control \$100 of gold exposure.

## A concrete example
- Gold at 3700, you want **1.00 lot** = 100 oz = **\$370,000** of exposure.
- At 1:100 leverage you only need **\$3,700** of *margin* set aside.

That sounds powerful — and it is exactly why beginners blow up. Leverage does not change your *risk per trade*; it only changes how big a position your deposit **permits**. The danger is that it permits positions far larger than your account can survive.

## The reframe that keeps you alive
> Leverage is a *ceiling on position size*, not a *target*. Just because you *can* open 5 lots doesn't mean you should risk 5 lots of exposure.

Professionals often use only a tiny fraction of available leverage. Your real constraint is not margin — it's **how many dollars you're willing to lose on this one trade** (see Position Sizing). Set that first; leverage just needs to be *enough* to allow the correctly-sized position.

## Beginner mistake
"I have \$500 and 1:500 leverage, so I can trade 2 lots!" — Yes, and a \$5 move against you (routine for gold) is \$1,000 → your \$500 account is gone, plus you owe. High leverage + emotional sizing is the single most common way new accounts die.
`),

  L("foundations", "margin", "Margin", "The deposit your broker locks up, and the dreaded margin call.", 7, ["margin", "free-margin", "margin-call", "leverage"], `
# Margin

**Margin** is the chunk of your account balance the broker **locks up** as collateral while a leveraged position is open. It is not a fee — you get it back when you close — but while the trade is open it is unavailable.

## Key terms
- **Used margin** — collateral currently locked by open positions.
- **Free margin** — what's left that you can use for new trades or to absorb losses.
- **Equity** — balance ± floating profit/loss of open trades.
- **Margin level** = Equity ÷ Used margin × 100%.

## Margin call & stop-out
If open trades move against you, your **equity** falls. When your **margin level** drops below the broker's threshold you get a **margin call** (a warning), and if it keeps falling the broker will **automatically close** your positions (a **stop-out**) — usually at the worst possible time, locking in your losses.

## Why beginners hit this
They size positions off *free margin* ("I can afford 3 lots") instead of off *risk*. A normal adverse swing eats their buffer and forces liquidation. If you size trades correctly (risking a small % per trade), you will essentially **never** see a margin call — you'll have closed at your planned stop long before margin becomes an issue.
`),

  L("foundations", "long-vs-short", "Long vs Short", "Profiting from both rising and falling gold.", 6, ["long", "short", "direction"], `
# Long vs Short

Every trade picks a **direction**:

- **Long (buy):** you profit if price **rises**. You buy at the ask now, hoping to sell higher later.
- **Short (sell):** you profit if price **falls**. You sell now (borrowing the exposure via your broker), hoping to buy back lower.

Shorting feels strange at first ("selling something I don't own"), but on gold CFDs/spot it is completely symmetric — the platform handles the mechanics. A short is simply a bet the auction will resolve **downward**.

## Why you must trade both sides
Gold spends plenty of time falling. If you only ever look for longs:
1. You miss half your opportunities.
2. You develop **confirmation bias** — you'll see "buy" setups even in downtrends and get run over.

## Mental symmetry
For a **short**, everything flips: your stop goes *above* your entry, resistance is where you want price to reject, and "higher lows" become "lower highs". Train yourself to read the chart both ways. A useful drill: cover the direction and ask, *"if this exact structure were upside-down, would I take the buy?"* If yes, take the short.
`),

  L("foundations", "order-types", "Order Types", "Market, limit and stop orders — the tools that put you in a trade.", 9, ["market-order", "limit-order", "stop-order", "stop-loss", "take-profit"], `
# Order Types

An **order** is an instruction to the broker. The four you must know cold:

## 1. Market order
"Fill me **now** at the best available price." You get in immediately but pay the spread and risk **slippage**. Use when *being in the trade* matters more than the exact price (e.g. a fast breakout).

## 2. Limit order
"Fill me only at **this price or better**." A **buy limit** sits *below* current price; a **sell limit** sits *above*. Great for patiently buying a pullback into support. Risk: if price never comes back to your level, you simply don't get filled — the trade leaves without you.

## 3. Stop order (entry stop)
"Fill me once price **reaches** this worse level." A **buy stop** sits *above* price (to catch an upside breakout); a **sell stop** sits *below*. It triggers a market order when hit. Used to enter on momentum/confirmation.

## 4. Stop-loss & take-profit
These are exits attached to an open position:
- **Stop-loss (SL):** auto-closes the trade at your **invalidation** price to cap the loss.
- **Take-profit (TP):** auto-closes at your **target** to bank the win.

## The professional default
Most of this academy's setups use a **clear invalidation (SL)** and a **defined target (TP)** set *before* entry, so the outcome is decided by your plan, not your nerves. Whether you *enter* with a market, limit, or stop order depends on the setup — you'll choose deliberately in **Entry Models**.

> A trade without a stop-loss is not a trade. It's an open-ended bet on your account's survival.
`),

  // -------------------------------------------------------------- CHART READING
  L("chart-reading", "candlesticks", "Candlesticks", "Read a single candle as a record of the auction, not a magic pattern.", 10, ["candlestick", "ohlc", "body", "wick", "rejection"], `
# Candlesticks

A candlestick compresses an entire slice of the auction into one shape. On a **15-minute** chart, each candle = 15 minutes of trading.

## The four prices (OHLC)
- **Open** — first traded price of the period.
- **High** — highest price reached.
- **Low** — lowest price reached.
- **Close** — last traded price of the period.

## Anatomy
- The **body** spans open→close. Filled/red = close **below** open (sellers won the period). Hollow/green = close **above** open (buyers won).
- The **wicks** (or shadows) reach up to the high and down to the low — prices that were *touched but rejected*.

## Read it as a story, not a name
Forget memorising "hammer / doji / engulfing" as spells. Ask three questions of every candle:
1. **Where did it open and close?** (who ended in control)
2. **How far did it travel?** (conviction / range)
3. **Which extreme got rejected?** (a long lower wick = price went down but buyers slammed it back up)

A candle with a **long lower wick** at an important support level tells you *sellers tried to push lower and failed* — buyers defended. The **same candle in the middle of nowhere means almost nothing.** Location is everything.

> Practice this hands-on in the **Candlestick Lab**, where you'll click the open, close and rejected side on live synthetic candles.

## The one habit that separates pros
Never trade a candle *pattern* in isolation. A "bullish engulfing" into major resistance in a downtrend is a **trap**, not a buy. The candle is evidence; *context* is the verdict.
`, "/labs/candlestick"),

  L("chart-reading", "ohlc", "OHLC & how candles form", "Watch a candle build tick by tick to truly understand it.", 6, ["ohlc", "open", "high", "low", "close"], `
# OHLC & how candles form

A candle is **alive** until it closes. Understanding this stops a huge class of beginner errors.

## The life of a 15m candle
1. At 09:00 the candle **opens** — the open price is fixed forever.
2. Over the next 15 minutes price wanders. The **high** and **low** stretch as new extremes are hit.
3. The current price *is* the candle's "close-so-far" — it flickers up and down.
4. At 09:15 the candle **closes**. Now O, H, L, C are locked and a new candle opens.

## Why "wait for the close" matters
A candle can look like a strong bullish breakout at minute 3, then get rejected and close as an ugly red pin by minute 15. Traders who react to the *forming* candle get faked out constantly. Most rule-based entries specify **"on the close of the candle"** precisely to avoid this noise.

## Beginner mistake
Entering the instant price *touches* a level because the live candle "looks bullish". The unclosed candle is a rumour; the closed candle is the news. Decide whether your setup needs a **confirmed close** or an **anticipatory limit** — and write it into the plan.
`),

  L("chart-reading", "timeframes", "Timeframes", "The same market tells different stories at different zoom levels.", 8, ["timeframe", "higher-timeframe", "lower-timeframe", "top-down"], `
# Timeframes

A **timeframe** is how much time each candle represents. Common ones for gold day trading: **Daily, 4H, 1H, 15m, 5m** (and 1m for fine entries).

## Zoom changes the story
The *same* price can be:
- an uptrend on the **5m** (zoomed in), while
- a pullback inside a **downtrend** on the **4H** (zoomed out).

Both are true. Neither is "right". They answer different questions. This is why professionals do **top-down analysis**: start high (Daily/4H) to get the **bias and important levels**, then drop to lower timeframes (15m/5m) to **time the entry**.

## The rule of thumb
- **Higher timeframe = context & direction** (where are we in the bigger picture? where are the walls?).
- **Lower timeframe = precision & timing** (exactly where do I enter, and where's my tight invalidation?).

Trade *with* the higher-timeframe bias and use the lower timeframe only to get a better price and a tighter stop. Fighting the higher timeframe with a lower-timeframe signal is how you get repeatedly stopped out.

> You'll practise combining timeframes in the **Top-Down Analysis** workspace.
`, "/top-down"),

  L("chart-reading", "swing-points", "Swing Highs & Lows", "The pivots that define structure and where stops hide.", 8, ["swing-high", "swing-low", "pivot", "liquidity"], `
# Swing Highs & Lows

A **swing high** is a peak: a candle whose high is higher than the candles on either side. A **swing low** is a trough: a low lower than its neighbours. These pivots are the **skeleton** of price — everything (trend, structure, levels) is built from them.

## Why they matter so much
1. They define **market structure** (the sequence of highs and lows — next lesson).
2. **Stop-losses cluster just beyond them.** Everyone who bought the last swing low puts their stop just under it. That pool of stops is **liquidity** — and price is often *drawn* to it (a "liquidity sweep").

## How to mark them
Don't over-count every tiny wiggle. Use **meaningful** swings — pivots that a reasonable person would circle on the chart. On the 15m you might mark the last 3–5 significant swings, not every 2-candle bump.

## The insight most beginners miss
A break of a swing high/low is **information**: it tells you the prior control has shifted. A *failure* to break one is also information: it tells you the level held. Learn to treat swing points as **decision boundaries**, not decoration.

> Train your eye in the **Market Structure Lab**, where you'll classify swing points as HH/HL/LH/LL.
`, "/labs/market-structure"),

  L("chart-reading", "market-structure", "Market Structure", "HH, HL, LH, LL — the grammar of trend and reversal.", 11, ["market-structure", "higher-high", "higher-low", "lower-high", "lower-low", "break-of-structure"], `
# Market Structure

Market structure is the **sequence of swing highs and lows**. It's the single most useful lens in discretionary trading because it turns chaos into a readable grammar.

## The four building blocks
- **HH — Higher High:** a peak above the previous peak.
- **HL — Higher Low:** a trough above the previous trough.
- **LH — Lower High:** a peak below the previous peak.
- **LL — Lower Low:** a trough below the previous trough.

## Reading trend from structure
- **Uptrend** = a chain of **HH + HL**. Buyers keep pushing higher and dips stop at higher prices.
- **Downtrend** = a chain of **LH + LL**. Sellers dominate; rallies fail lower.
- **Range** = highs and lows roughly equal — no one is in control.

## Break of Structure (BOS) & shift
The trend is "intact" until structure breaks:
- In an uptrend, a **lower low** (breaking the last HL) is the first warning the uptrend may be ending — a potential **structure shift**.
- In a downtrend, a **higher high** (breaking the last LH) warns of a possible bottom.

## How pros use it
1. Identify the current structure on your higher timeframe → sets your **bias**.
2. Only look for trades **in the direction of that structure** (until it clearly breaks).
3. Use lower-timeframe structure shifts to **time entries** into the higher-timeframe direction.

> The **Market Structure Lab** drills this with clean trends, messy trends, ranges, failed breakouts and reversals of increasing difficulty.

## Beginner mistake
Calling a reversal after a single counter-move. One lower high in a strong uptrend is *noise* until structure actually breaks and *confirms*. Wait for the **break**, then the **retest**, before betting on a new direction.
`, "/labs/market-structure"),

  L("chart-reading", "trend-range-momentum", "Trend, Range, Momentum & Consolidation", "Classify the environment before choosing any tactic.", 9, ["trend", "range", "momentum", "consolidation"], `
# Trend, Range, Momentum & Consolidation

Before *any* setup, answer one question: **what environment am I in?** The same tactic that prints money in a trend loses steadily in a range.

## Trend
Directional, structural (HH/HL or LH/LL). Best tactic: **buy pullbacks in an uptrend / sell rallies in a downtrend.** Breakout and continuation setups shine here.

## Range
Price oscillates between a **floor** (support) and **ceiling** (resistance). Best tactic: **fade the edges** — sell near the top, buy near the bottom — and *avoid* the middle. Breakout setups get chopped up here (false breakouts everywhere).

## Momentum
The *speed and conviction* of movement — big bodies, small wicks, little pullback. Strong momentum = don't fade it; join it or stand aside. Weak/fading momentum near a level = higher chance of reversal.

## Consolidation
A tight, low-volatility pause — often before an explosive move (a "coil"). Great for *preparing* a breakout scenario, terrible for trading inside (chop). Gold often consolidates before major news, then expands violently.

## The professional filter
> First classify the environment. Then pick a tactic that *matches* it. Most beginner losses come from running a trend tactic in a range, or fading strong momentum. Environment first, setup second.
`),

  // ----------------------------------------------------------------- KEY LEVELS
  L("key-levels", "support-resistance", "Support & Resistance", "Areas where the auction previously flipped — memory, not magic.", 10, ["support", "resistance", "zone", "level"], `
# Support & Resistance

**Support** is an area *below* price where buyers previously showed up and pushed price back up. **Resistance** is an area *above* price where sellers previously took control and pushed price down. They are **memory of order flow** — nothing more mystical than that.

## Why they work (when they do)
At a level where price reversed hard before, three groups act at once when price returns:
1. Traders who profited there add again.
2. Traders who missed it the first time enter now.
3. Traders trapped on the wrong side bail out.

Their combined action *can* reproduce the reversal. But it's a **probability, not a promise** — which is why the level is a place to *watch*, not a place to blindly click.

## The thinking upgrade
> ❌ BAD: "3720 is support, therefore BUY."
> ✅ GOOD: "3720 is an area price reacted to before. If price returns, I'll **watch how it behaves** — does it reject (long lower wicks, quick bounce) or slice through? I act on the *reaction*, not the *arrival*."

The level tells you **where** to pay attention. **Price action at the level** tells you *whether* to act and *which direction*.

## Roles flip
Broken **support becomes resistance**, and broken **resistance becomes support**. When price breaks below a floor and later returns to it from underneath, that old floor often acts as a new ceiling — one of the most reliable and tradeable behaviours in all of price action (the **retest**).

> Practise marking zones in the **Support / Resistance Lab.**
`, "/labs/support-resistance"),

  L("key-levels", "zones-vs-lines", "Zones vs Exact Lines", "Why a thin line will fake you out — and a zone won't.", 7, ["zone", "level", "support", "resistance"], `
# Zones vs Exact Lines

Beginners draw support as a **single pixel-perfect line** at 3720.00 and then feel betrayed when price reverses at 3718.40. The market doesn't respect your line to the cent — it respects an **area**.

## Draw zones, not lines
A level is a **band**, because:
- Different participants placed orders at slightly different prices.
- Spreads and slippage smear fills.
- Round numbers and prior wicks create a *cluster*, not a point.

A good gold intraday zone might be **3–5 dollars wide** (e.g. 3717–3722), sometimes wider on higher timeframes.

## How to build a zone
1. Find where price reacted strongly (sharp reversal, or a candle with a big rejection wick).
2. Draw the box from the **candle bodies** to the **wick extremes** of that reaction.
3. Extend it right, into the future, as an area to watch.

## Payoff
Zones let you:
- **Wait patiently** — you don't chase; you let price come into the box.
- **Place stops sensibly** — beyond the *far side* of the zone, not one cent past a line where noise stops you out.
- **Stay calm** — a poke into the zone isn't a failure; it's expected.
`, "/labs/support-resistance"),

  L("key-levels", "reference-levels", "Reference Levels: PDH/PDL, Session H/L, Round Numbers", "The objective levels every gold trader watches.", 9, ["pdh", "pdl", "session-high", "session-low", "round-number", "liquidity"], `
# Reference Levels: PDH/PDL, Session H/L, Round Numbers

Some levels matter because *everyone* is watching them. They become self-fulfilling reference points and, crucially, **liquidity pools** (where stops cluster).

## Previous Day High / Low (PDH / PDL)
The **highest and lowest price of the prior day.** Institutions and algos use these as reference. Gold frequently:
- **Rejects** at PDH/PDL (fade opportunity), or
- **Sweeps** them to grab stops, then reverses (a classic trap-and-reverse), or
- **Breaks and retests** them (continuation).

## Session highs & lows
The high/low of the **Asian**, **London**, or **New York** session. The **Asian range** in particular (a quiet, tight range) is watched heavily — London often *sweeps* the Asian high or low then reverses. (More in **Trading Sessions**.)

## Round numbers
Big psychological figures — **3700, 3750, 3800** — attract orders because humans place targets and stops at round numbers. The "double-zero" and "double-double" (3700.00, 3750.00) levels see outsized reactions.

## How to use them
1. **Mark them before the session** as part of your routine.
2. Treat them as **decision zones**: expect a *reaction* (reject or break-and-go), and let price action tell you which.
3. Know that **stops sit just beyond them** — so a quick spike *through* a level that immediately reverses is often a **liquidity sweep**, not a real breakout.
`),

  // -------------------------------------------------------------------- SESSIONS
  L("sessions", "why-sessions-matter", "Why Sessions Matter", "Gold has a personality that changes across the trading day.", 8, ["session", "liquidity", "volatility"], `
# Why Sessions Matter

The gold market trades ~24 hours on weekdays, but it is **not the same market** all day. Liquidity and volatility rise and fall with the world's financial centres. Trading the right setup at the wrong time is a common, invisible mistake.

## The three sessions (approximate, London time)
- **Asia** (~00:00–08:00): typically **quiet, ranging**, lower liquidity. Builds the "Asian range".
- **London** (~08:00–16:00): **volatility ramps up**; often sets the day's direction; loves to *sweep* the Asian range.
- **New York** (~13:00–21:00): high volatility, driven by US data and the USD; the **London/NY overlap (~13:00–16:00)** is the most active window of the day.

> ⚠️ These times shift with **daylight saving** (which changes on different dates in Europe and the US), so the overlaps drift by an hour a few times a year. Never hard-code times — learn the *relationships* and re-anchor to your platform clock.

## Why it changes your tactics
- Range/fade tactics fit **Asia**'s quiet drift.
- Breakout/continuation tactics fit **London/NY**'s expansion.
- The **overlap** is where the biggest, cleanest moves *and* the nastiest news whips happen.

The rest of this module breaks down each session's typical behaviour so you can match tactic to time.
`),

  L("sessions", "asia-session", "Asian Session", "The quiet range-builder that sets up the London move.", 6, ["asia-session", "asian-range", "range"], `
# Asian Session

**Character:** low liquidity, low volatility, often a **tight range**. Tokyo/Sydney lead; gold usually drifts rather than trends.

## What actually happens
Price tends to coil into a **range** with a defined **Asian high** and **Asian low**. This range becomes a key reference for the rest of the day — because London traders will often **hunt the stops** resting just beyond it.

## How to use it
1. **Mark the Asian range** (high and low) toward the end of the session.
2. Don't force trend trades inside it — chop will grind you down.
3. Prepare a **scenario for London**: "If London sweeps the Asian high then closes back inside, I'll look for shorts back toward the Asian low."

## Beginner mistake
Treating a quiet Asian breakout as a real trend move. Low-liquidity breakouts frequently fail the moment London arrives with real volume. Patience beats participation here.
`),

  L("sessions", "london-session", "London Session", "The day's engine — expansion, direction and stop hunts.", 7, ["london-session", "liquidity-sweep", "breakout"], `
# London Session

**Character:** liquidity and volatility surge. London frequently **sets or reveals the day's direction** and is famous for the **"London sweep"** — pushing through the Asian high or low to trigger stops before reversing.

## Typical playbook
1. **The sweep-and-reverse:** London spikes above the Asian high (grabbing buy-stops / trapping breakout buyers), then reverses down. Or spikes below the Asian low then reverses up. This is one of gold's most repeatable behaviours.
2. **The expansion/trend:** on strong-conviction days (often macro-driven), London simply breaks a key level and trends cleanly for hours.

## How to trade around it
- Have **both** a sweep scenario and a breakout scenario ready — let price pick.
- Respect that the **first move can be a fake**. Waiting for the sweep to *reclaim* the level (close back inside) is a higher-probability entry than chasing the initial spike.
- Volatility is your friend for reward but your enemy for stop placement — size down if stops must be wide.
`),

  L("sessions", "ny-session-overlap", "New York Session & the Overlap", "US data, the dollar, and the most active window of the day.", 7, ["ny-session", "overlap", "news", "usd"], `
# New York Session & the Overlap

**Character:** high volatility driven by **US economic data** and the **US dollar**. Because gold is priced in USD, the NY session is where macro news hits hardest.

## The London/NY overlap
For a few hours (~13:00–16:00 London time) **both** major centres are open. This overlap has:
- the **deepest liquidity** of the day,
- the **largest, cleanest trends**, and
- the **most dangerous news spikes** (US data drops at the NY open).

## Trading it
- The overlap is prime time for **continuation** of the London move *or* a decisive reversal.
- **Respect the calendar.** High-impact US releases (CPI, NFP, FOMC) land in this window and can move gold \$30–\$50 in seconds with wild spreads and slippage. Either be **flat** into the release or have an explicit, pre-planned news approach.
- After the initial news chaos settles (15–30 min), a *clearer* directional move often develops — many pros wait for that instead of trading the spike.

> Cross-reference the **Economic Calendar** module: knowing *when* the overlap coincides with a red-folder release is half the battle.
`),

  // ------------------------------------------------------------- FUNDAMENTALS
  L("fundamentals", "gold-drivers-overview", "What Actually Moves Gold", "The macro map: USD, real yields, risk sentiment.", 9, ["usd", "real-yield", "safe-haven", "risk-sentiment"], `
# What Actually Moves Gold

You don't need a PhD, but you must know **why** gold moves so news doesn't blindside you. Three big levers:

## 1. The US Dollar (inverse)
Gold is priced *in* dollars. A **stronger dollar** makes gold more expensive for the rest of the world → demand falls → gold tends **down**. A **weaker dollar** → gold tends **up**. Watch the **DXY (dollar index)** as gold's frequent mirror.

## 2. Real yields & interest rates (inverse)
Gold pays **no interest**. When "real yields" (interest rates minus inflation, seen via US Treasuries/TIPS) **rise**, holding cash-like assets becomes more attractive than holding gold → gold tends **down**. When real yields **fall**, gold becomes relatively more attractive → **up**. This is why **Fed** decisions and **rate expectations** are gold's biggest long-term driver.

## 3. Risk sentiment / safe-haven demand
When markets are **fearful** (war, banking stress, crashes), money flees to gold → **up**. When markets are calm and greedy ("risk-on"), gold can drift or fall as money chases stocks. This is why **geopolitics** can spike gold instantly.

## How the levers interact
They often align (weak dollar + falling yields + fear = strong gold), but sometimes fight (fear pushing gold up while a spiking dollar pushes it down). When drivers **conflict**, expect choppier, less predictable price — a reason to trade smaller or stand aside.

The following lessons unpack the specific events that move these levers.
`),

  L("fundamentals", "usd-yields-fed", "USD, Yields & the Fed", "The rate-expectation machine that dominates gold.", 9, ["usd", "treasury-yield", "real-yield", "fed", "fomc"], `
# USD, Yields & the Fed

Most of gold's *big* moves trace back to one question: **what will the US Federal Reserve do with interest rates?**

## The chain of logic
1. Markets constantly price **expectations** of future Fed rate moves.
2. Higher expected rates → higher **Treasury yields** → stronger **dollar** → **gold down.**
3. Lower expected rates (or rate *cuts*) → lower yields → weaker dollar → **gold up.**

## Real yields — the cleanest signal
"Real yield" = nominal yield − expected inflation. Gold tracks **real yields inversely** more tightly than almost anything else. If you only watch one macro variable, watch the direction of **US real yields**.

## What flips expectations
- **FOMC meetings** (8/year): the rate decision + the press conference + the "dot plot". The *tone* ("hawkish" = leaning to higher rates, bad for gold; "dovish" = leaning to cuts, good for gold) often matters more than the decision itself.
- **Fed speeches** between meetings — a single hawkish comment can move gold.
- **Inflation & jobs data** (next lessons) because they *change* what the Fed is expected to do.

## Practical takeaway
You are not forecasting the Fed. You are respecting that **around Fed events, gold's usual technical behaviour is overridden by macro.** Know when they occur (Economic Calendar) and manage risk accordingly.
`),

  L("fundamentals", "inflation-data", "Inflation: CPI & PCE", "The reports that reset rate expectations — and gold.", 7, ["cpi", "pce", "inflation", "real-yield"], `
# Inflation: CPI & PCE

Inflation data matters because it **drives what the Fed does**, which drives yields and the dollar, which drives gold.

## CPI (Consumer Price Index)
The headline monthly inflation report. Markets compare it to the **forecast**:
- **Hotter than expected** (higher inflation) → market expects the Fed to keep rates high → yields/dollar up → **gold often down** (initial reaction).
- **Cooler than expected** → expectations of cuts rise → yields/dollar down → **gold often up.**

CPI is one of the highest-volatility events for gold. Expect a violent spike in *both* directions within seconds of release.

## PCE (Personal Consumption Expenditures)
The Fed's **preferred** inflation gauge. Less market drama than CPI but taken seriously by policymakers.

## The nuance that catches beginners
The **first spike can reverse.** Gold might drop on a hot CPI, then rip higher minutes later as traders reassess. Trading the *instant* of release is closer to gambling (huge spreads, slippage, whipsaw). Professionals typically either sit flat and let the dust settle, then trade the *clearer* post-news move — or have a very specific, pre-defined news plan with sizing to match.
`),

  L("fundamentals", "jobs-data", "Jobs Data: NFP", "The first-Friday shockwave.", 6, ["nfp", "employment", "usd"], `
# Jobs Data: NFP

**Non-Farm Payrolls (NFP)** is the monthly US jobs report, released on the **first Friday** of each month (13:30 London time typically). It is one of the single most volatile scheduled events for gold.

## Why it moves gold
A strong labour market lets the Fed keep rates **high** (bad for gold); a weak one pressures the Fed toward **cuts** (good for gold). So:
- **Strong jobs (beat forecast)** → hawkish → dollar/yields up → **gold often down.**
- **Weak jobs (miss)** → dovish → **gold often up.**

But it's multi-dimensional: the **unemployment rate** and **average hourly earnings** (wage inflation) in the same report can contradict the headline number, causing wild two-way whips.

## How to handle NFP
- It routinely moves gold **\$20–\$40 in seconds**, spreads blow out, slippage is severe.
- Safest for developing traders: **be flat into the release.** Mark the levels, watch the reaction, and trade the *structure* that forms afterwards, not the spike.
- If you must be in around it, your position size must assume a worst-case slippage far beyond your normal stop.
`),

  L("fundamentals", "geopolitics-sentiment", "Geopolitics & Risk Sentiment", "The unscheduled driver that can spike gold anytime.", 6, ["geopolitics", "safe-haven", "risk-sentiment"], `
# Geopolitics & Risk Sentiment

Unlike scheduled data, **geopolitical risk** strikes without a calendar entry. Wars, attacks, banking crises, and political shocks trigger a **flight to safety**, and gold is the classic safe haven.

## Typical behaviour
- **Sudden fear** → sharp gold **spike up** (sometimes hundreds of dollars over days).
- **De-escalation / calm returning** → gold gives some back as money rotates back to risk assets.

## Risk-on vs risk-off
- **Risk-off** (fear): stocks down, gold & USD & bonds up. Gold shines.
- **Risk-on** (greed): stocks up, gold can drift or fall.

## What this means for a day trader
1. You **can't predict** the shock — but you can **respect** it. A safe-haven spike can obliterate a technically perfect short in seconds.
2. Keep **half an eye on headlines**, especially over weekends (gold gaps on Sunday open after weekend news).
3. When a geopolitical bid is *in play*, treat downside setups with extra caution and size — the "pain of surprise" is asymmetric against shorts.

> Sentiment is context, not a trigger. It tells you which direction has *tailwind*; your technical process still decides *where and whether* to act.
`),

  // ------------------------------------------------------------- PRICE ACTION
  L("price-action", "impulse-pullback", "Impulse & Pullback", "The two-stroke engine of every trend.", 8, ["impulse", "pullback", "trend", "momentum"], `
# Impulse & Pullback

Trends move in a **two-stroke rhythm**:

- **Impulse (the drive):** a strong, directional move with big candle bodies and momentum. This is the "real" money flow — the market showing its hand.
- **Pullback (the retrace):** a slower, choppier counter-move as early traders take profit and price catches its breath.

## Why this is the core of trading
The professional's favourite entry is **"buy the pullback in an uptrend / sell the pullback (rally) in a downtrend."** You let the impulse *prove* direction, then enter on the pullback at a *better price* with a *tighter stop*, riding the next impulse.

## Reading the difference
- **Impulse:** large bodies, small wicks, few opposing candles, covers ground fast → *conviction*.
- **Pullback:** small overlapping candles, lots of wicks, slow drift against the trend → *profit-taking, not reversal*.

When a "pullback" suddenly turns *impulsive against* the trend (big bodies, fast), that's a warning the trend may be breaking — the pullback is becoming a reversal.

## The trap to avoid
Entering *during* the impulse (chasing) means a terrible price and a far-away stop. Entering *on the pullback* means patience is rewarded with a defined, low-cost risk. **The money is made by waiting for the pullback, not chasing the impulse.**
`),

  L("price-action", "highs-lows-recap", "HH / HL / LH / LL in Action", "Apply structure labels to live-style price paths.", 7, ["higher-high", "higher-low", "lower-high", "lower-low", "market-structure"], `
# HH / HL / LH / LL in Action

You met these in Chart Reading. Here we make them **operational** — the labels you'll actually narrate to yourself in real time.

## The running commentary a pro keeps
As each swing completes, silently label it:
- "New **HH** — uptrend confirming."
- "Pullback held above the last low → **HL** — I want longs."
- "That was a **LH**... and now a **LL** — structure has flipped, I stop looking for longs."

This continuous labelling *is* discretionary trading. It keeps you aligned with control and stops you fighting the tape.

## Turning labels into decisions
- **HH + HL forming** → bias long; wait for the next HL to buy.
- **LH + LL forming** → bias short; wait for the next LH to sell.
- **Mixed / equal highs & lows** → range; fade edges or stand aside.

## Where beginners go wrong
1. Labelling every micro-wiggle → analysis paralysis. Use *significant* swings.
2. Refusing to update the label when structure breaks (ego). The chart doesn't care about your last idea — **re-label honestly.**

> The **Market Structure Lab** will quiz you on exactly these, at rising difficulty.
`, "/labs/market-structure"),

  L("price-action", "breakout-retest", "Breakout & Retest", "The highest-quality continuation entry.", 8, ["breakout", "retest", "support", "resistance", "confirmation"], `
# Breakout & Retest

A **breakout** is price pushing decisively through a level (support/resistance, range edge, swing point). A **retest** is price coming *back* to that broken level and holding — old resistance becoming new support (or vice-versa).

## Why the retest beats the breakout
Raw breakouts fail *constantly* (see next lesson on false breakouts). The **retest** is the market's confirmation:
1. Price **breaks** resistance at 3720 with a strong close → potential.
2. Price **pulls back** to 3720.
3. If 3720 now **holds as support** (rejection, higher low forms) → the breakout is *validated*, and you enter long with your stop just below the retest.

You give up some of the initial move, but you gain **confirmation** and a **tight, logical stop** — dramatically better risk/reward and win rate than chasing the break.

## Anatomy of a clean retest long
- Break: strong bullish close above the level.
- Retest: price returns to the level, prints a **rejection** (long lower wick / bullish reversal candle).
- Entry: on the confirmation candle close; **Stop:** below the retest low (invalidation = level failed).
- Target: next resistance / measured move.

## Beginner mistake
Fear of "missing it" → chasing the initial breakout candle. You end up buying the high tick right before the retest dips into your stop. **Let it come back.** If it never retests, that's fine — one missed trade beats a chased loss.
`),

  L("price-action", "false-breakout-sweep", "False Breakouts & Liquidity Sweeps", "How the market traps the impatient — and how to trade with it.", 9, ["false-breakout", "liquidity-sweep", "stop-hunt", "rejection", "trap"], `
# False Breakouts & Liquidity Sweeps

A **false breakout** is when price pokes *through* a level, lures traders in, then snaps back — trapping them. A **liquidity sweep** (or stop hunt) is the same move seen from the other side: price is *deliberately drawn* to where stops rest (just beyond an obvious level), triggers them, then reverses.

## Why this happens constantly on gold
Stops cluster in predictable places — just above swing highs, below swing lows, beyond PDH/PDL and round numbers. Those clustered stops are **resting liquidity**. Large players need liquidity to fill big orders, so price gets pushed *into* those pools, triggering the stops, before moving the "real" direction.

## The trap sequence (bearish example)
1. Obvious resistance / swing high at 3740. Breakout buyers pile in above; stops of shorts sit above.
2. Price **spikes above 3740** — breakout buyers get long, trapped shorts get stopped.
3. Price **immediately reverses** back below 3740 and closes back inside. The breakout was fuel, not a trend.
4. Trapped longs now bail (selling), accelerating the drop → a strong short opportunity.

## How to trade WITH sweeps (not get caught)
- **Don't chase** the initial poke through an obvious level.
- Wait for the **reclaim**: price closing back *inside* the level after the sweep. That failure-to-hold is your signal.
- Entry: on the reclaim; **Stop:** just beyond the sweep's extreme (if it truly breaks out again, you're wrong — small loss).
- This "sweep → reclaim → reverse" is one of the most reliable gold intraday setups, especially at the **London open** sweeping the **Asian range**.

## The mindset shift
> Stop seeing an obvious level break as "the move starting." Start asking: *"is this a real breakout, or is the market grabbing stops before going the other way?"* The reclaim answers it. Patience turns you from the *prey* into the *predator*.
`),

  L("price-action", "rejection", "Rejection", "Reading who lost control at a level, from the wicks.", 6, ["rejection", "wick", "support", "resistance"], `
# Rejection

**Rejection** is price attempting to go somewhere and being forcefully pushed back — recorded as a **long wick**. It's the clearest single-candle evidence that one side defended an area.

## What it looks like
- At **support**: a candle drives *down* into the zone but closes near its high, leaving a **long lower wick**. Sellers pushed down; buyers overwhelmed them and reclaimed the range → **bullish rejection.**
- At **resistance**: a candle spikes *up* into the zone but closes near its low, leaving a **long upper wick**. Buyers pushed up; sellers slammed it back → **bearish rejection.**

## Why location is everything
The *same* long-wicked candle means:
- **A lot** at a major level you were already watching (context + rejection = high-quality signal).
- **Almost nothing** floating in the middle of a range (random noise).

## Using rejection in a plan
Rejection is a **trigger**, not a reason on its own. The reason is the **level + bias**; the rejection is the market *confirming* your scenario is playing out, giving you a candle to act on and a wick extreme to place your stop beyond.

> In the **Candlestick Lab** you'll practise spotting which side got rejected — the single most useful candle-reading skill.
`, "/labs/candlestick"),

  // ------------------------------------------------------------------ SCENARIOS
  L("scenarios", "scenario-thinking", "Scenario Thinking", "Replace prediction with conditional 'if-then' plans.", 10, ["scenario", "hypothesis", "if-then", "context", "trigger", "invalidation"], `
# Scenario Thinking

This is the mental shift that turns a gambler into a trader. You do **not** predict what gold *will* do. You prepare **conditional scenarios** — "if X happens, then I do Y, invalid at Z" — and let the market choose which one fires.

## The anatomy of a scenario
A complete scenario names every part of the process *before* anything happens:

1. **Context / bias:** e.g. "Higher timeframe is bullish (HH/HL on 4H)."
2. **Location:** e.g. "Price is pulling back into support at 3705–3710."
3. **Trigger:** e.g. "If I get a bullish rejection + a 5m higher low off the zone..."
4. **Action:** "...then I go long on the confirmation close."
5. **Invalidation:** "...invalid if 5m closes below 3702 (zone failed)."
6. **Target:** "...targeting the prior swing high at 3735 (≈2R)."

## Always prepare BOTH sides
Great traders write the **bullish and bearish** scenario for the *same* level:
- "**If** price rejects 3710 support → long toward 3735."
- "**If** price closes decisively below 3702 → short toward 3685."

Now you can't be "wrong" — one scenario simply activates. You react to *your own plan* instead of to fear.

## Why this works
- Removes prediction pressure (you don't need to be a fortune teller).
- Pre-commits your actions when you're **calm**, so you execute mechanically when it's **fast**.
- Makes every outcome a **data point** you can journal and evaluate, not an emotional event.

> This is the process the whole academy is built around: **context → location → scenario → trigger → invalidation → size → execute → manage → journal → review.**
`),

  L("scenarios", "building-scenarios", "Building Scenarios on the Chart", "A repeatable routine to draft your daily if-then map.", 8, ["scenario", "top-down", "level", "bias"], `
# Building Scenarios on the Chart

A practical routine to turn your morning analysis into a concrete set of if-then plans.

## Step-by-step
1. **Get the bias** (top-down): what is the Daily/4H doing? Bullish, bearish, or ranging? This filters which scenarios you'll *prefer*.
2. **Mark the battlegrounds:** 2–4 key levels where a decision is likely today (PDH/PDL, session extremes, major S/R, round numbers).
3. **For each level, write both scenarios:**
   - *Reaction (fade):* "If price reaches [level] and shows rejection → trade back into range."
   - *Break (continuation):* "If price closes through [level] and retests → trade the breakout."
4. **Define the trigger + invalidation + target** for each so it's ready to execute.
5. **Rank them:** which scenario best aligns with your higher-timeframe bias? That's your **A+ setup** — the one worth full attention (and size).

## Keep it small
Two or three well-formed scenarios beat ten vague ones. You want to walk into the session thinking: *"I'm mainly watching 3710 and 3740. Here's exactly what I'll do at each."*

> Use the **Top-Down Analysis** workspace to record your reads, then draft these scenarios in your **Playbook** and **Journal**.
`, "/top-down"),

  // -------------------------------------------------------------------- ENTRIES
  L("entries", "entry-models-overview", "Entry Models Overview", "Turn 'it looks good' into a precise, repeatable trigger.", 9, ["entry", "trigger", "confirmation", "confluence"], `
# Entry Models Overview

An **entry model** is a *precise, written rule* for when you're allowed to click. "It looked bullish" is not an entry model — it can't be journaled, back-tested, or improved. A real model can.

## What every entry model specifies
- **Where** (the location/level from your scenario).
- **What must happen** (the exact trigger: a candle close, a break, a rejection).
- **Precise entry price/order type** (market on close? limit at the level? stop on break?).
- **Invalidation** (the stop, defined by structure — next module).

## Three core models you'll use on gold
1. **Rejection / reversal at a level** — price reaches a key zone and prints rejection (long wick / reversal candle). Enter on confirmation. Best in ranges and at higher-timeframe levels.
2. **Break-and-retest** — price breaks a level, returns, and holds. Enter on the retest confirmation. Best for trend continuation.
3. **Sweep-and-reclaim** — price sweeps beyond an obvious level (grabbing stops) then closes back inside. Enter on the reclaim. Best at session opens / obvious liquidity.

## Confluence — stacking the odds
The best entries have **multiple reasons** to be there at once ("confluence"):
- a key level **+** higher-timeframe bias **+** a clean rejection **+** a session timing edge.

One reason = a coin flip. Three aligned reasons = an **A+ setup**. But beware *over*-confluence-hunting: waiting for 10 perfect stars means you never trade. Two or three solid, independent reasons is the sweet spot.
`),

  L("entries", "confirmation-vs-anticipation", "Confirmation vs Anticipation", "The trade-off between a better price and a safer entry.", 7, ["confirmation", "limit-order", "market-order", "risk-reward"], `
# Confirmation vs Anticipation

There are two philosophies for *when* to pull the trigger, and mature traders use both deliberately.

## Anticipation (limit into the level)
Place a **limit order** at your level and let price come to *you*.
- ✅ Best possible price → tightest stop → highest reward-to-risk.
- ✅ No chasing, no emotion.
- ❌ No confirmation — you're betting the level holds. Lower win rate; you'll be filled on some losers that slice straight through.

## Confirmation (wait for the reaction)
Wait for price to reach the level **and** print a trigger (rejection candle, structure shift, reclaim), then enter.
- ✅ Higher win rate — the market has "shown its hand."
- ❌ Worse price → wider stop → lower reward-to-risk; sometimes you miss the move entirely if it doesn't pull back.

## How to choose
- **Strong, clear higher-timeframe level + you want R:** lean **anticipation** (limit), accept lower win rate.
- **Messy conditions, counter-trend idea, or news risk:** demand **confirmation.**
- **A+ confluence:** many pros *split* — a partial limit for price + add on confirmation.

There's no universally "right" answer — only what fits the setup and what you can execute *consistently*. Pick one per scenario, write it down, and journal the results to learn your own edge.
`),

  // ---------------------------------------------------------------------- STOPS
  L("stops", "invalidation-first", "Invalidation First", "Define where you're wrong before you think about profit.", 9, ["invalidation", "stop-loss", "structure", "risk"], `
# Invalidation First

Before you calculate a single dollar of profit, answer one question: **"At what price is my trade idea simply wrong?"** That price is your **invalidation** — and your stop-loss goes just beyond it.

## Invalidation is structural, not arbitrary
A stop is not "20 dollars because that feels okay." It's the price at which your *reason for the trade no longer exists*:
- Long off support at 3710 because it should **hold** → you're wrong if it **breaks and closes below** the zone (say 3702). Stop below 3702.
- Short off a resistance rejection at 3740 → you're wrong if price **reclaims** above 3742. Stop above 3742.

The market structure tells you where invalidation lives. Your job is to *find* it, not invent it.

## Why "invalidation first" is non-negotiable
1. It defines your **risk per unit** (|entry − stop|), which is the input to position sizing.
2. It makes the trade **falsifiable** — you'll *know* when to be out, unemotionally.
3. It stops the deadliest habit: moving your stop *away* to avoid being wrong, turning a small planned loss into an account-threatening one.

## The professional sequence
> Find invalidation → measure risk-per-unit → *then* decide size → *then* check if the target offers enough reward. If a logical stop makes the reward-to-risk poor, **the trade doesn't qualify.** No trade is better than a bad-structure trade with a hopeful stop.
`),

  L("stops", "stop-placement", "Stop Placement", "Give the trade room to breathe without giving away the account.", 8, ["stop-loss", "atr", "volatility", "liquidity-sweep"], `
# Stop Placement

A stop must sit where being hit **truly means you're wrong** — not so tight that normal noise kills a good idea, not so wide that the loss is unacceptable.

## Place stops beyond structure, not on it
Stops resting *exactly* on the obvious swing low get **swept**. Put them a sensible buffer **beyond** the structure / the far side of the zone, so a routine liquidity poke doesn't stop you before the real move.

## Account for gold's volatility
Gold's candles are large. A 15m gold candle can easily range \$3–\$8. A \$2 stop on a 15m setup is *inside the noise* — you'll be stopped constantly. Use volatility (e.g. recent candle ranges, or an ATR read) to sanity-check that your stop is beyond ordinary wiggle.

## The tension to manage
- **Too tight:** high strike rate of being stopped by noise; you're "right" but keep losing.
- **Too wide:** each loss is large; forces tiny position size or unacceptable risk.

The resolution is **entry quality**: a better entry (via confirmation, retest, or sweep-reclaim) lets you place a *logical* stop that is *also* tight, because your entry is close to invalidation. **Good entries and good stops are the same skill.**

## Never do this
- Don't trade **without** a stop.
- Don't **widen** a stop as price approaches it ("it'll come back"). That is how small losses become catastrophic.
- Don't set stops at the *exact* round number or exact swing — assume everyone else did too.
`),

  // --------------------------------------------------------------------- SIZING
  L("sizing", "risk-per-trade", "Risk Per Trade", "The percentage rule that keeps you in the game.", 9, ["risk-per-trade", "position-size", "risk-percent", "drawdown"], `
# Risk Per Trade

This is the most important lesson in the entire academy. **Survival first.** You cannot have an edge if you're not in the game, and sizing is what keeps you in the game through inevitable losing streaks.

## The rule
Risk a **small, fixed fraction** of your account on each trade — commonly **0.5%–1%** for developing traders. "Risk" means the dollars you lose *if your stop is hit*.

- \$5,000 account, 1% risk = **\$50 max loss** per trade. Full stop.

## Why so small? The math of survival
Losing streaks are **guaranteed**, even with a great strategy. Watch how risk-per-trade governs survival through a 10-loss streak:

| Risk/trade | Account after 10 straight losses |
|-----------|----------------------------------|
| 1% | ~90% remaining |
| 2% | ~82% remaining |
| 5% | ~60% remaining |
| 10% | ~35% remaining |
| 20% | ~11% remaining (effectively wiped) |

And recovering from a drawdown is brutally asymmetric: a **50% loss requires a 100% gain** just to get back to even. Small risk keeps drawdowns shallow and recoverable.

## The reframe
> Your #1 job is not to make money — it's to **not blow up.** Amateurs ask "how much can I make on this trade?" Professionals ask "how much can I lose, and can my account easily survive a string of these?" Get sizing right and *time* lets your edge compound. Get it wrong and no edge can save you.
`),

  L("sizing", "sizing-formula", "The Position Sizing Formula", "Turn risk dollars + stop distance into an exact lot size.", 8, ["position-size", "lot", "risk-per-trade", "stop-loss"], `
# The Position Sizing Formula

Sizing is not a feeling — it's arithmetic. Do it *every* trade, in this order, **after** you've found your invalidation.

## The formula
\`\`\`
Risk $  = Account × Risk%
Stop distance ($ of price) = | Entry − Stop |
Value per $1 move per lot   = $100   (since 1 lot = 100 oz)
Lots = Risk $ / (Stop distance × $100)
\`\`\`

## Worked example
- Account **\$5,000**, risk **1%** → Risk \$ = **\$50**.
- Setup: long entry **3710.0**, stop **3705.0** → stop distance = **\$5.0**.
- \$ risk per lot = 5.0 × \$100 = **\$500 per lot**.
- Lots = 50 / 500 = **0.10 lots.**

So you buy **0.10 lots**. If stopped, you lose ~\$50 (1%). If the trade runs to a 2R target at 3720.0 (+\$10.0 move), you make 10.0 × \$100 × 0.10 = **\$100** (2%).

## The magic of this method
Notice: the **stop distance decides the size**, not your mood. A **wider** stop → **smaller** lots (to keep the loss at \$50). A **tighter** stop → **larger** lots for the *same* \$50 risk. Your dollar risk stays constant regardless of the setup — that's the whole point.

> The **Position Sizing calculator** in Settings/Tools does this for you, but do it by hand a dozen times until it's instinct. A trader who can't size a trade in their head has no business clicking buy.
`),

  L("sizing", "leverage-margin-safety", "Leverage, Margin & Sizing Together", "How the pieces fit — and why leverage is almost irrelevant if you size right.", 6, ["leverage", "margin", "position-size", "risk-per-trade"], `
# Leverage, Margin & Sizing Together

Beginners obsess over leverage. Once you size by **risk**, leverage becomes almost a footnote. Here's how it all connects.

## The correct order of operations
1. **Risk %** decides your **risk dollars** (\$50 on a \$5k account at 1%).
2. **Invalidation** decides your **stop distance** (\$5.0).
3. The **formula** decides your **lot size** (0.10 lots).
4. **Leverage** only needs to be *enough* to permit that 0.10-lot position's margin. It is a permission, not a driver.

## Why this makes you safe
If you always size by risk, you will typically use a **tiny fraction** of available leverage and keep huge **free margin**. Margin calls become almost impossible, because your planned stop closes the trade long before margin is ever threatened.

## The failure mode to avoid forever
Sizing off leverage/margin instead of risk: "I have \$5k and can afford 3 lots, so I'll trade 3 lots." A normal \$5 adverse move = \$1,500 = 30% of the account **on one trade**. A few of those in a row and you're done. **Never let available margin set your size. Let risk set your size, and let margin merely permit it.**
`),

  // ------------------------------------------------------------------------- RR
  L("rr", "reward-to-risk", "Reward-to-Risk & R-Multiples", "Measure every trade in R, and think in expectancy.", 9, ["risk-reward", "r-multiple", "expectancy", "win-rate"], `
# Reward-to-Risk & R-Multiples

Standardise every trade to a single unit: **R**, your risk on the trade. If you risk \$50, then **1R = \$50.** A trade that makes \$100 is **+2R**; one that loses the full stop is **−1R**.

## Reward-to-risk (RR)
Before entering, compare the distance to target vs the distance to stop:
- Entry 3710, stop 3705 (5.0 risk), target 3725 (15.0 reward) → **RR = 3:1 (a 3R trade).**

Thinking in R frees you from dollar amounts and account size, and makes trades **comparable** across time.

## Why win rate alone is a lie
A high win rate can still lose money, and a low win rate can be very profitable. What matters is **expectancy**:

\`\`\`
Expectancy (in R) = (Win% × avg win R) − (Loss% × avg loss R)
\`\`\`

Two traders:
- **A:** 70% win rate, but wins +0.5R and loses −1R → (0.7×0.5) − (0.3×1) = **+0.05R** (barely positive).
- **B:** 40% win rate, wins +3R, loses −1R → (0.4×3) − (0.6×1) = **+0.6R** (excellent).

Trader **B** loses more often but makes far more, because **reward-to-risk** does the heavy lifting.

## The professional standard
Favour setups offering **≥ 2R** so you can be *wrong more than half the time and still profit.* This single discipline — refusing sub-2R trades unless there's a strong reason — quietly separates profitable traders from the rest.
`),

  L("rr", "expectancy-sample", "Expectancy & Sample Size", "Why you judge a strategy over dozens of trades, not one.", 7, ["expectancy", "sample-size", "variance", "edge"], `
# Expectancy & Sample Size

One trade tells you **nothing** about your strategy. A great setup can lose; a terrible one can win. Only a **sample** reveals your edge.

## Variance vs edge
- **Edge** = your positive expectancy (the true, long-run average R per trade).
- **Variance** = the random scatter around it. In small samples, variance dominates and can completely mask (or fake) an edge.

You can flip a fair coin and get 7 heads in a row. Likewise a positive-expectancy strategy can lose 5 of 6 trades by luck. **Judging your strategy on 5 trades is like judging a coin on 5 flips.**

## How many trades?
Rules of thumb for a *first read* on a discretionary setup: **at least 20–30 trades**, ideally 50–100, all taken by the *same rules*. Fewer than that and you're reacting to noise.

## The discipline this demands
1. **Follow the plan for a full sample before judging it.** Changing rules every 3 trades means you never learn anything — you just chase noise forever.
2. Track results in **R**, not dollars, so the sample is clean.
3. Separate "did I follow my process?" from "did the trade win?" A well-executed loss is a **good** trade. A rule-breaking win is a **bad** trade that got lucky.

> The **Statistics** page computes your expectancy, win rate, average R and equity curve across your journaled sample — so you evaluate like a researcher, not a gambler.
`, "/statistics"),

  // ------------------------------------------------------------------ MANAGEMENT
  L("management", "trade-management", "Trade Management", "What to do once you're in — the plan continues.", 9, ["trade-management", "breakeven", "trailing-stop", "partial", "take-profit"], `
# Trade Management

Your job isn't over when you enter. **Management** is executing the *rest* of the plan you wrote before entry — not improvising under emotional pressure.

## Core management tools
- **Fixed target (set-and-forget):** SL and TP set at entry; you don't touch it. Removes emotion; best while you're learning because it *forces* discipline and produces clean data.
- **Move to breakeven:** once the trade travels a defined amount in your favour (e.g. +1R), move the stop to entry. Now the trade can't lose. Use carefully — moving to BE too early gets you stopped by normal noise for zero gain.
- **Partial profit (scaling out):** close part of the position at a first target (e.g. take half at +1R), let the rest run to a further target. Banks some profit, reduces stress, keeps upside.
- **Trailing stop:** as price makes new structure (new HL in an uptrend), trail your stop beneath each new HL to ride a trend while protecting gains.

## The golden rule of management
> **Decide your management rules *before* you enter, and write them into the scenario.** Managing on the fly — moving stops out of fear, taking profit too early from greed, "hoping" past your invalidation — is where planned edges go to die.

## The two deadliest management mistakes
1. **Moving your stop *further away*** as price approaches it. This converts a small planned loss into a catastrophe. Never do it. Ever.
2. **Cutting winners early / letting losers run** — the exact opposite of what edge requires. Your losers should be capped at ~1R by your stop; your winners should be *allowed* to reach their multi-R targets.
`),

  L("management", "after-the-trade", "After the Trade", "Close it, then capture it — the loop that compounds skill.", 6, ["journal", "review", "process"], `
# After the Trade

The trade is closed. For an amateur, it's over. For a professional, the *most valuable* part begins: **capturing** it so it improves the next hundred trades.

## Immediately after closing
1. **Screenshot** the chart (entry, stop, target, exit marked). Memory distorts within minutes.
2. **Journal** the trade *honestly* — not just the result, but the **process**: was the context right? did I follow my entry model? did I move my stop? what did I feel?
3. **Grade the process, not the outcome.** Rate "did I follow my plan?" separately from "did it win?" A disciplined loss is a *win* for your development; a lucky, rule-breaking win is a *warning*.

## Why this loop is the whole game
> Trading skill compounds only through honest **feedback**. Without a journal you repeat the same mistakes with new money and call it "experience." With a journal, patterns emerge — *"I lose most when I trade the New York open without waiting for the sweep"* — and *those* patterns are where your improvement (and money) actually come from.

> Use the **Trading Journal** to capture each trade, the **Mistake Library** to log recurring errors and their fixes, and **Statistics** to review the sample. This close→capture→review loop is the engine of the entire academy.
`, "/journal"),

  // -------------------------------------------------------------------- ROUTINE
  L("routine", "daily-routine", "The Daily Routine", "The repeatable pre-, during-, and post-session process.", 9, ["routine", "preparation", "top-down", "journal"], `
# The Daily Routine

Consistency of *process* produces consistency of *results*. Professionals run essentially the same routine every day so that decisions are made in a calm, prepared state — not reactively.

## Pre-session (preparation)
1. **Top-down analysis:** Daily → 4H → 1H. Establish bias and mark key levels (PDH/PDL, session extremes, major S/R, round numbers).
2. **Check the economic calendar:** note red-folder events and their times. Decide in advance how you'll handle them (flat / wait / specific plan).
3. **Build 2–3 scenarios** (both directions) at your key levels, each with trigger + invalidation + target.
4. **Set your risk** for the day (risk %, and a **max daily loss** limit — e.g. stop trading after −2R or −3R).

## During the session (execution)
- **Wait** for a scenario to actually trigger. If nothing sets up, do **nothing** — no-trade is a valid, professional outcome.
- Execute mechanically: size by risk, place SL/TP, manage per the pre-written rules.
- One clean A+ trade beats five forced ones.

## Post-session (review)
- Journal every trade + screenshots.
- Note rule violations honestly.
- Weekly: review the sample in **Statistics**, update the **Playbook** and **Mistake Library.**

> Explore the **"A Day Trading XAU/USD"** timeline for a stage-by-stage walkthrough of exactly what to look at, what question to answer, and what *not* to do at each hour.
`, "/day-in-the-life"),

  L("routine", "risk-limits-rules", "Daily Risk Limits & Trading Rules", "The guardrails that protect you from yourself.", 7, ["risk-limits", "max-daily-loss", "rules", "discipline"], `
# Daily Risk Limits & Trading Rules

Even with a great process, *you* are the biggest risk on a bad day. Hard rules — set when calm — protect you from the trader you become when you're tilted.

## Essential guardrails
- **Max daily loss:** stop trading for the day after losing a set amount (e.g. **−2R or −3R**, or 3% of the account). This single rule prevents the "revenge trading" spiral that destroys accounts in an afternoon.
- **Max trades per day:** a cap (e.g. 3) forces selectivity and prevents overtrading out of boredom.
- **No trading X minutes around red-folder news** unless it's a pre-planned news setup.
- **Only A/A+ setups:** if it's not one of your defined, high-confluence scenarios, you don't touch it.

## Why write them down
When you're up money you feel invincible; when you're down you feel desperate. Both states produce terrible decisions. Rules made in a **neutral** state and followed **mechanically** are how you keep your calm-state judgment in charge of your emotional-state self.

## Build your own rule set
The **Playbook** lets you write and edit your personal trading rules and setup checklists. Review and refine them weekly based on what your **Mistake Library** and **Statistics** reveal. Rules aren't a cage — they're the *structure* within which a discretionary edge can actually express itself.
`, "/playbook"),

  // ----------------------------------------------------------------- PSYCHOLOGY
  L("psychology", "trading-psychology", "Trading Psychology", "Manage fear, greed and ego — the market's real opponents.", 9, ["psychology", "discipline", "fomo", "tilt", "process"], `
# Trading Psychology

Your technical analysis can be flawless and you can still lose — because trading pressure hijacks decision-making. Psychology isn't a soft add-on; it's where most edges are *lost*.

## The four horsemen
- **Fear:** closing winners too early ("I don't want to give it back"), or not taking valid setups after a loss. Fear shrinks your winners and skips your edges.
- **Greed:** oversizing, moving targets further in hope, chasing extended moves. Greed converts good trades into bad ones.
- **FOMO (fear of missing out):** chasing a move you didn't plan, entering with no edge because "it's running." The single most expensive emotion.
- **Ego / revenge:** needing to be *right*, refusing to accept a stop, "winning back" losses with oversized revenge trades → **tilt**, the account-killer.

## The antidote is *process*
> You cannot control outcomes; you can only control **process.** Shift your entire sense of success from "did I win?" to **"did I follow my plan?"** When your self-worth is tied to *execution* rather than *results*, the emotional charge drains out of any single trade — because one trade is just one sample in a long process.

## Concrete tactics
- **Pre-commit** everything (scenario, size, SL/TP) while calm; execute mechanically when live.
- **Hard daily loss limit** to cap tilt damage.
- **Journal emotions**, not just prices — you'll spot your personal triggers.
- **Smaller size** if a trade makes you anxious — anxiety usually means you're risking too much or the setup isn't clean.
- **Step away** after a big win *or* loss; both distort the next decision.
`),

  L("psychology", "process-over-outcome", "Process Over Outcome", "The mindset that makes losses survivable and wins repeatable.", 6, ["process", "outcome", "variance", "discipline"], `
# Process Over Outcome

In a probabilistic game, **good decisions sometimes lose and bad decisions sometimes win.** If you judge yourself by outcomes, you'll learn the wrong lessons — punishing good process after an unlucky loss, and rewarding recklessness after a lucky win.

## The 2×2 that reframes everything

| | Good process | Bad process |
|---|---|---|
| **Won** | ✅ Deserved success — repeat it | ⚠️ Got lucky — dangerous lesson |
| **Lost** | ✅ Correct trade, bad luck — repeat it | ❌ Deserved loss — fix the process |

The only quadrants you can *control* are the ones about **process**. Aim to live in the left column (good process) and accept that variance decides which *row* you land in on any given trade.

## What this looks like in practice
- After a **loss**: first ask *"did I follow my plan?"* If yes, log it as a good trade and move on — no revenge, no rule changes. If no, that's the real lesson.
- After a **win**: same question. If you broke rules and won, flag it as a **warning**, not a template. Lucky wins teach expensive habits.

## Why it's the master skill
Every professional's edge is small and only shows up over a **large sample**. Process-focus is what lets you *keep executing the edge* through the inevitable losing stretches that would make an outcome-focused trader quit or blow up right before the edge reasserts. **Protect the process, and the outcomes take care of themselves.**
`),

  // ------------------------------------------------------------------- CALENDAR
  L("calendar", "using-the-calendar", "Using the Economic Calendar", "Plan around scheduled volatility instead of being ambushed.", 8, ["economic-calendar", "cpi", "fomc", "nfp", "news"], `
# Using the Economic Calendar

The economic calendar lists scheduled data releases and their expected impact. For a gold trader it's not optional reading — it tells you *when* your technical analysis is likely to be **overridden by macro**.

## How to read it
Each event shows:
- **Time** (convert to your platform's timezone!).
- **Impact** (low/medium/**high** — the "red folder" events).
- **Forecast vs Previous** — the market has *already priced the forecast*; the move comes from the **surprise** (actual vs forecast).

## The events that matter most for gold
- **FOMC** rate decision & press conference (highest impact).
- **CPI** (inflation) — massive gold volatility.
- **NFP** (jobs, first Friday) — massive gold volatility.
- **PCE**, retail sales, Fed speeches, PPI — medium-to-high.

## How to actually use it in your routine
1. **Each morning, note the day's high-impact events and their exact times.**
2. Decide your policy **in advance** for each:
   - *Be flat* into the release (safest while learning), **or**
   - a **specific pre-planned** news approach with sizing that assumes worst-case slippage.
3. **Avoid opening new "normal" technical trades** in the minutes before a red-folder release — spreads widen, stops get slipped, and price whips both ways.
4. After the dust settles (often 15–30 min), a **cleaner directional move** frequently forms — many pros trade *that*, not the spike.

> The **Economic Calendar** page in this app lets you record upcoming events, tag their impact, and note your pre-planned policy for each — turning the calendar from a source of ambushes into a source of *preparation.*
`, "/calendar"),

  // --------------------------------------------------------------- A GOLD TRADER'S DAY
  L("trading-day", "day-overview", "A Day in the Life of a Gold Trader", "The shape of a professional's day — and why prep, not prediction, is the job.", 10, ["top-down", "session", "economic-calendar", "risk-per-trade", "scenario"], `
# A Day in the Life of a Gold Trader

Before any of the mechanics in the rest of this academy, it helps to see the **whole day** a serious XAU/USD day trader actually runs — because the surprising truth is that *most of the work happens before a single trade is placed, and most of the day is spent waiting.*

> ⚠️ **Educational only.** This chapter describes *how* many gold day traders structure their work — it is **not** a recommendation to trade, a signal, or a promise that any of this makes money. Trading is risky and most retail traders lose. Read it to understand the process, not to copy a "system".

## The one-sentence version of the whole day
> **Prepare in the calm, so you can execute mechanically in the chaos.**

A professional's day is not "stare at charts → feel a hunch → click." It is a repeatable **process**:

**context → key levels → economic calendar → scenarios → wait → trigger → size → execute → manage → journal → review.**

That process is the spine of this entire app, and this chapter walks through a real day along it.

## The five acts of a trading day
1. **Pre-market prep** — review overnight moves, mark the levels, check the news calendar, write the day's plan. (Next lesson.)
2. **Reading the chart** — top-down analysis to set a bias and spot where a decision is likely. (Lesson 3.)
3. **Deciding the entry** — waiting for a *specific* trigger at a *specific* level, in the *right* session. (Lesson 4.)
4. **Managing the exit** — stop as invalidation, a defined target, and pre-planned management. (Lesson 5.)
5. **Closing the day** — journal honestly, review the process, protect tomorrow. (Lesson 5.)

## The realistic rhythm of the day (roughly, London time)
Gold trades nearly 24 hours on weekdays (the underlying CME gold futures run Sun–Fri, ~23 hours a day), but it has a **daily personality**:

- **Asian session** (~00:00–07:00) — quiet, low volume, often a tight range. Little trading; it *builds a reference range* for later.
- **Pre-London prep** (~06:00–07:00) — the 30–60 minute routine: review the overnight range, mark levels, check the calendar, glance at the dollar and yields.
- **London open** (~07:00–13:00) — volume and volatility ramp; the first real setups appear.
- **London / New York overlap** (~13:00–17:00) — **prime time**: deepest liquidity, tightest spreads, biggest clean moves — and the riskiest news (US data drops here).
- **New York afternoon** (~17:00–21:00) — activity fades; fewer clean setups.
- **End of day** — journal and review.

> These times **shift with daylight saving** and are approximate. Learn the *rhythm* (quiet Asia → London expansion → NY overlap → fade), then re-anchor to your platform clock. The interactive **"A Day Trading XAU/USD"** timeline breaks this into an expandable, hour-by-hour walkthrough.

## The mindset that separates professionals
- They treat **"no trade" as a valid, professional outcome.** Most of the day is waiting.
- They decide **what they'll do before it happens**, so live decisions are mechanical.
- They judge themselves on **process, not the result of one trade.**

## Sources
- CME Group — *Gold Futures* (near-23-hour trading, gold's sensitivity to economic events): https://www.cmegroup.com/markets/metals/precious/gold-futures.html
- BabyPips — *Forex Trading Sessions* (session structure, London/NY overlap as the busiest window): https://www.babypips.com/learn/forex/forex-trading-sessions
- OANDA — *When is the best time for forex trading?* (overlap = highest liquidity/volatility): https://www.oanda.com/us-en/skills-and-insights/education/trading-asset-classes/forex/when-is-the-best-time-for-forex-trading/
- RoboForex — *Gold Trading Explained (XAUUSD)* (gold's peak hours ~13:00–17:00 GMT, session behaviour): https://roboforex.com/blog/education/gold-trading-xauusd/
`, "/day-in-the-life"),

  L("trading-day", "premarket-prep", "Pre-Market Prep: How the Day Starts", "The 30–60 minute routine a trader runs before touching the buy button.", 11, ["top-down", "economic-calendar", "usd", "real-yield", "pdh", "pdl", "session-high"], `
# Pre-Market Prep: How the Day Starts

Ask a professional gold trader how their day starts and you'll rarely hear "I look for a trade." You'll hear a **checklist** run in the calm *before* the session — typically 30–60 minutes of preparation so that when volatility arrives, every decision is already half-made.

## Step 1 — Review the overnight action
Open the chart and see what happened while you slept: did Asia drift in a tight range, or did something (news, a geopolitical headline) move gold? Note yesterday's close and the **Asian range** (its high and low), because those become reference points for the London session.

## Step 2 — Check the economic calendar *first*
Before marking a single level, professionals screen the day's **scheduled news**, so they know *when* volatility is coming. A calendar (e.g. [FXStreet's](https://www.fxstreet.com/economic-calendar)) flags each release's expected impact (high-impact "red-folder" events are the ones that move gold). The ones that matter most for gold:

- **FOMC** rate decisions (8×/year), **CPI** (inflation), and **NFP** (jobs, first Friday).

You note the **exact time** of each in your platform's timezone and decide your **policy in advance** — most commonly, *be flat into the release and trade the cleaner move afterwards* (more in Lesson 5).

## Step 3 — Glance at gold's macro dashboard: the dollar & yields
Gold is priced in dollars and pays no interest, so two screens sit next to the XAU/USD chart:

- **US Dollar Index (DXY)** — gold usually moves **inversely** to the dollar.
- **US Treasury yields (e.g. 10-year / real yields)** — when yields rise, holding zero-yield gold costs more, which tends to pressure gold; when they fall, gold tends to be supported.

You're not forecasting these — you're noting which way the *macro wind* is blowing today.

## Step 4 — Mark the key levels (the battlegrounds)
Now draw the small number of places where a decision is likely today:

- **Previous Day High / Low (PDH / PDL).**
- **The Asian / overnight range** high and low.
- **Major support/resistance zones** and big **round numbers** (3700, 3750…).

Draw **zones, not pixel lines**, and keep it to a handful — if everything is "near a level", nothing is.

## Step 5 — Write the day's plan (scenarios + risk)
Finally, turn analysis into a plan you can execute mechanically:

- **2–3 if-then scenarios** at your key levels, *both directions* (Lesson 3 & 4).
- Your **risk settings**: risk per trade (commonly 0.5–1%) and a **max daily loss** limit that ends your day if hit.

> The output of prep is a one-page plan: *"Bias is X. I'm watching levels A and B. Here's exactly what I'll do at each, and here's the news that could override it."* Record your reads in the **Top-Down Analysis** workspace and your rules in the **Playbook**.

## Sources
- Pro Trader Dashboard — *Morning Trading Routine* (pre-market checklist, 30–60 min before session): https://protraderdashboard.com/blog/morning-trading-routine/
- United Daytraders — *Building a Trading Routine* (mark PDH/PDL & overnight range pre-session): https://united-daytraders.com/blog/building-trading-routine/
- FXStreet — *Economic Calendar* (impact ratings; check high-impact events pre-market): https://www.fxstreet.com/economic-calendar
- RoboForex — *Gold Trading Explained* (USD & interest-rate inverse relationship with gold): https://roboforex.com/blog/education/gold-trading-xauusd/
- CME Group — *Gold Futures* (CPI and the 8×/year FOMC as key gold drivers): https://www.cmegroup.com/markets/metals/precious/gold-futures.html
`, "/top-down"),

  L("trading-day", "reading-the-setup", "Reading the Chart & Spotting the Setup", "Top-down analysis, market structure, and the patterns gold traders watch.", 12, ["top-down", "market-structure", "support", "resistance", "liquidity-sweep", "breakout", "retest"], `
# Reading the Chart & Spotting the Setup

With prep done, the trader reads the chart to answer two questions: **which way is the wind blowing (bias)?** and **where is a decision likely (the setup)?** The professional method is **top-down**.

## Top-down (multi-timeframe) analysis
Read from high timeframe to low, each with a different job:

1. **Daily / 4H — the narrative.** What's the dominant trend and structure? This sets your **bias**.
2. **1H — the structure & levels.** Where are the key zones price is respecting right now?
3. **15m / 5m — the timing.** Where, precisely, will you enter *once price arrives*?

The rule: **trade with the higher-timeframe bias, and use the lower timeframe only to time entries.** Fighting the higher timeframe with a 5-minute signal is how traders get repeatedly stopped out.

## Reading market structure
Structure is the sequence of swing highs and lows:

- **Uptrend** = higher highs + higher lows → favour longs.
- **Downtrend** = lower highs + lower lows → favour shorts.
- A **break of structure** (price breaking the swing point that defined the prior trend) is the market's hint that control may be shifting.

## The patterns gold traders specifically watch
At the marked levels, a few recurring behaviours come up again and again on gold:

- **Break-and-retest** — price breaks a clean level, comes *back* to it, and it holds (old resistance becomes support). A mainstream, widely-accepted continuation pattern.
- **Rejection at a level** — a long-wicked candle (pin bar / engulfing) showing one side defended the zone.
- **Liquidity sweep / stop-hunt** — price spikes *through* an obvious level (a swing high/low, PDH/PDL, or the Asian range) to trigger the stops resting there, then reverses. The classic gold example is the **"London sweep"**: London takes out the Asian range high or low, then turns.

> 🧭 **Methodology, not gospel.** Break-and-retest and multi-timeframe analysis are broadly accepted. "Liquidity sweeps", "order blocks" and the "London sweep of the Asian range" come from **Smart Money Concepts (SMC)** — a *very popular* framework in the retail gold community, but a teaching methodology, **not** an academically validated fact. Use it as one lens, and let your own journaled results (not a guru) tell you whether it has an edge *for you*.

## Confluence — stacking reasons
The setups worth waiting for have **several independent reasons** to be there at once:

> higher-timeframe bias **+** a key level **+** a price-action trigger **+** the right session.

One reason is a coin flip; three aligned reasons is an **A+ setup**. But don't wait for ten perfect stars — two or three solid, independent reasons is the sweet spot.

> Record each read in the **Top-Down Analysis** workspace so your bias is written down and filters every trade for the day.

## Sources
- Investopedia — *Multiple Time Frames Can Multiply Returns* (top-down higher→lower timeframe method): https://www.investopedia.com/articles/trading/07/timeframes.asp
- BabyPips — *Multiple Time Frame Analysis* (define trend on higher TF, time entries on lower): https://www.babypips.com/forexpedia/multiple-time-frame-analysis
- FXOpen — *Break and Retest Strategy* (break → return → hold pattern): https://fxopen.com/blog/en/how-can-you-use-a-break-and-retest-strategy-in-trading/
- ACY — *How to Trade Metals with SMC and Fundamentals* (multi-timeframe gold stack, structure, liquidity — SMC methodology): https://acy.com/en/market-news/education/how-to-trade-metals-with-smc-and-fundamentals-j-o-20251024-094909/
- LiquidityFinder — *Day Trading Gold (XAU/USD) with SMC* (liquidity sweeps, London sweep of the Asian range — popular methodology): https://liquidityfinder.com/news/complete-step-by-step-guide-to-day-trading-gold-xau-usd-with-smart-money-concepts-smc-2ccd7
`, "/top-down"),

  L("trading-day", "deciding-the-entry", "Deciding the Entry", "Turning a setup into a click: trigger, timing, and confirmation vs anticipation.", 10, ["session", "confirmation", "confluence", "trigger", "liquidity-sweep", "retest"], `
# Deciding the Entry

A level is *not* an entry. The professional waits for three things to line up: the **right place**, the **right trigger**, and the **right time**.

## Timing: the session is part of the setup
The single most-cited entry window for gold is the **London / New York overlap** (~13:00–17:00 GMT / 8am–12pm ET) — the deepest liquidity, tightest spreads and cleanest moves of the day (roughly **70% of daily FX volume** happens in this overlap). The same setup that's high-quality during the overlap can be noise in thin, late-Asia liquidity.

## The trigger: a written rule, not a feeling
"It looked bullish" can't be journaled, tested, or improved. A **trigger** is a precise, pre-written event that gives you permission to click. The three core gold entry models:

1. **Rejection at a level** — price reaches your zone and prints a rejection candle (long wick / engulfing). Enter on the confirming close.
2. **Break-and-retest** — price breaks a level, returns, and the level *holds*. Enter on the retest confirmation, stop just beyond the retest.
3. **Sweep-and-reclaim** — price sweeps beyond an obvious level (grabbing stops), then *closes back inside*. Enter on the reclaim, stop just beyond the sweep's extreme.

## The real debate: confirmation vs anticipation
There's a genuine split among professionals here — know both:

- **Confirmation (wait for the reaction):** let price reach the level *and* print the trigger before entering.
  - ✅ Higher win rate — the market has "shown its hand."
  - ❌ Worse price, wider stop, and sometimes you miss the move. *(Break-and-retest teachers lean this way.)*
- **Anticipation (act into the level):** place a limit at the level and let price come to you.
  - ✅ Best price → tightest stop → highest reward-to-risk.
  - ❌ No confirmation; you'll be filled on some losers that slice straight through. *(Many SMC/liquidity traders anticipate the reversal at the swept level.)*

> Neither is "correct." Messy conditions, counter-trend ideas, and news risk argue for **confirmation**; a strong, clean higher-timeframe level argues for leaning toward **anticipation**. Pick one *per scenario*, write it down, and let your journal reveal which fits you.

## Confluence gate before the click
Right before entering, the professional silently checks: *"Do I have my level + my bias + my trigger + acceptable timing — and has my exact trigger actually happened, or am I forcing it?"* **No trigger = no trade.**

> Build these entry models as reusable checklists in your **Playbook**, so live entries are a matter of ticking boxes, not summoning courage.

## Sources
- OANDA — *When is the best time for forex trading?* (London/NY overlap = peak liquidity/volatility): https://www.oanda.com/us-en/skills-and-insights/education/trading-asset-classes/forex/when-is-the-best-time-for-forex-trading/
- BabyPips — *Forex Trading Sessions* (the overlap is the busiest window): https://www.babypips.com/learn/forex/forex-trading-sessions
- FXOpen — *Break and Retest Strategy* (retest as confirmation entry): https://fxopen.com/blog/en/how-can-you-use-a-break-and-retest-strategy-in-trading/
- ACY — *Price Action: Retest vs Pullback Confirmation Guide* (rejection candles as triggers): https://acy.com/en/market-news/education/market-education-price-action-retest-vs-pullback-confirmation-guide-j-o-20250715-main-110718/
- RoboForex — *Gold Trading Explained* (gold's peak window ~13:00–17:00 GMT): https://roboforex.com/blog/education/gold-trading-xauusd/
`, "/playbook"),

  L("trading-day", "managing-the-exit", "Managing the Exit & Closing the Day", "Stops, targets, trade management, daily risk rules, and the journal that compounds skill.", 11, ["invalidation", "stop-loss", "risk-reward", "risk-per-trade", "position-size", "breakeven", "trailing-stop"], `
# Managing the Exit & Closing the Day

Amateurs obsess over entries. Professionals know the **exit and the risk framework** are where accounts are actually made or lost. Every part of this is decided *before* the trade, so the live decisions are mechanical.

## The stop is your invalidation, not a dollar figure
Your stop-loss goes at the price where **your trade idea is simply wrong** — below the structure you bought from, above the level you sold from — *not* at an arbitrary dollar amount. Because gold is volatile (it routinely travels 1–2% in a session), stops are placed **wider** and positions sized **smaller** than in FX majors, so normal noise doesn't stop you out. Many traders size the stop to current volatility (e.g. using ATR).

## Position size is derived from the stop — never guessed
The professional order of operations:

> **Risk% → risk dollars → stop distance → position size.**
>
> \`Position size = (Account × Risk%) ÷ (Stop distance × $ per point)\`

Risk a **small, fixed fraction** per trade — the widely-taught **1% rule** (many day traders use 0.5–1%). The stop *distance* decides the size; a wider stop simply means fewer lots for the same fixed dollar risk.

## The target: think in reward-to-risk
Set a defined target and compare it to the stop *before* entering. The common standard is a **minimum 1:2** reward-to-risk, with **1:3** considered ideal — a 1:2 setup only needs roughly a **33% win rate** to break even before costs. This is why *reward-to-risk*, not win rate, is what pays you.

## Trade management — the professional sequence
Once in, you execute the *pre-written* plan, not your emotions. A common sequence:

1. **Partial + breakeven:** at ~1R take part of the position off and move the remaining stop to **breakeven**, so the trade can no longer lose.
2. **Trail the runner:** trail the stop beneath each new higher-low (in a long) to ride an extended move.

> ⚠️ The most common management mistake is moving to breakeven **too early** — you get stopped out on a normal retracement for zero gain. And the deadliest mistake of all: **moving your stop *further away*** as price approaches it. Never do it.

## The daily risk guardrails
Your process is only as good as the rules that stop *you* on a bad day:

- **Max daily loss** — stop trading for the day after e.g. −2R/−3R. This single rule kills the revenge-trading spiral.
- **Stand aside around major news.** A common approach is *no new entries in a window around CPI/NFP/FOMC* (e.g. the "15-minute rule" — nothing in the first 15 minutes after a red-folder release), letting the spread-widening and whipsaw pass, then trading the cleaner structured move. Some traders *do* trade the news — for a developing trader, **stand aside / reduce size** is the more defensible default.

## Closing the day: the journal
The trade is closed — for a professional the most valuable part begins:

1. **Screenshot** the chart (entry, stop, target, exit).
2. **Journal honestly** — the process, not just the result: was the context right, did I follow my trigger, did I move my stop, what did I feel?
3. **Grade process over outcome.** A disciplined loss is a *good* trade; a lucky, rule-breaking win is a *warning*.

> This close → capture → review loop is the engine of skill. Use the **Trading Journal** to log each trade, the **Mistake Library** for recurring errors, and **Statistics** to review your sample. That's where your edge is actually found.

## Sources
- Investopedia — *Stop-Loss Order* (stop as a pre-defined technical exit / invalidation): https://www.investopedia.com/terms/s/stop-lossorder.asp
- Investopedia — *Risk/Reward Ratio* (RR definition and calculation): https://www.investopedia.com/terms/r/riskrewardratio.asp
- RoboForex — *Gold Trading Explained* (wider stops / smaller size on gold; 1:2–1:3 RR; 0.5–2% risk): https://roboforex.com/blog/education/gold-trading-xauusd/
- DayTrading.com — *The 1% Rule* (risk ≤1% of equity per trade; caps loss not capital): https://www.daytrading.com/one-percent-rule
- The Trapped Trader — *Trade Management: Trailing Stops, Partials & Breakeven* (partial-at-1R → BE → trail): https://thetrappedtrader.com/learn/foundations/risk-management/9
- Trading Heroes — *Move Your Stop Loss to Breakeven* (when to move to BE; the "too early" pitfall): https://www.tradingheroes.com/move-stoploss-breakeven/
- FXNX — *Mastering NFP & CPI* (stand-aside / reduce-size / 15-minute approach to major news): https://fxnx.com/en/blog/mastering-nfp-cpi-anti-gambler-guide
`, "/journal"),

  // ----------------------------------------------------------- TRADING STRATEGIES
  L("strategies", "oc-zone-strategy", "OC Zone Strategy (Institutional Anchor)", "Use the daily Open–Close zone of an anchor candle as a fixed daily reference: premium/discount, a 50% equilibrium, and zone edges you trade with a trigger.", 15, ["oc-zone", "institutional-anchor", "equilibrium", "premium-discount", "market-structure", "rejection", "liquidity-sweep", "confirmation", "invalidation"], `
# OC Zone Strategy (Institutional Anchor)

The **OC Zone** ("Open–Close Zone") is a daily reference box drawn from a single **anchor candle** — usually the candle at a key session open (Midnight open, London open, or your broker's daily open). Once that candle closes, the box is **locked for the rest of the day** and becomes a fixed map of *premium*, *discount* and *fair value* to trade around.

> **Reminder:** this is a *reference framework*, not a signal. It tells you **where** to look and how to frame bias — it never tells you to buy or sell a specific price. Numbers below are illustrative.

## What the zone is
Pick an **anchor candle** at a chosen open hour (set the UTC offset so the hour matches *your broker's* clock — this matters a lot). From that one candle you draw a rectangle:

- **Body mode (O→C):** top & bottom = the candle's **Open and Close**. This is the "real move" — where the session actually settled, ignoring wick noise.
- **Range mode (H→L):** top & bottom = the candle's **High and Low**. This captures the full liquidity/volatility envelope.
- **Equilibrium (50% midline):** the exact centre of the box — the **"fair value" / mean threshold**. This line is the heart of the whole method.

The zone is **non-repainting**: after the anchor hour closes it never moves, so everyone referencing it sees the same box all day.

## Why traders use it — premium / discount / fair value
Think of the box as the day's **dealing range**:

- Price **above equilibrium** = **premium** (relatively expensive) → in a bearish day you look to **sell**.
- Price **below equilibrium** = **discount** (relatively cheap) → in a bullish day you look to **buy**.
- Price **at equilibrium** = fair value — often a decision point where the day's move resumes or reverses.

This is the same logic as the golden zone in the [Fibonacci lesson](/learn?m=strategies&l=fibonacci-retracement) — a disciplined *location* to look for a trade — just anchored to the day's open instead of an impulse leg.

## The two interactions to watch
1. **Equilibrium touch** — price trades back to the 50% midline. Either it **rejects** (bias continues) or it **reclaims/holds** (bias may flip). A clean rejection at equilibrium in the direction of your bias is a classic place to look.
2. **Boundary breach** — price taps or pushes through a zone **edge**. Two readings, and you must decide which with *confirmation*, not hope:
   - **Rejection** off the edge back into the zone → fade it (mean-revert toward equilibrium / opposite edge).
   - **Accept/breakout** (closes and holds beyond the edge) → the day is expanding; the breached edge can become support/resistance on a retest.

## The flow (same discipline as every setup here)

| Step | What you do |
|---|---|
| 1. Anchor | Mark the OC zone from the chosen open candle; let it lock. Note equilibrium. |
| 2. Bias | Which side of equilibrium is price on? Combine with higher-timeframe [structure](/learn?m=chart-reading&l=market-structure). Premium → hunt sells; discount → hunt buys. |
| 3. Location | Wait for price to reach a *decision* spot: an edge, or the 50% equilibrium. |
| 4. Trigger | Demand confirmation there — a rejection candle, a [liquidity sweep](/learn?m=price-action&l=false-breakout-sweep) of the edge, or a lower-timeframe break of structure. The level alone is **not** an entry. |
| 5. Invalidation | Stop just beyond the zone edge / anchor-candle extreme you're trading from — if price trades there, your read is wrong. |
| 6. Manage | Target the opposite boundary, equilibrium, or the next structural level. Only take it if reward-to-risk clears your minimum; size from the stop. |

## Confluence & context
- **Nested zones:** yesterday's (and the prior days') OC zones still matter. Where today's edge lines up with a previous day's zone or equilibrium, the level is stronger.
- **Weekly cycle:** Monday's anchor often frames the week; note where the current day sits inside the larger weekly range.
- **Sessions & news:** the zone is cleanest during liquid hours (London / NY overlap). Around high-impact news it can be swept violently — size down or stand aside (see [Economic Calendar](/learn?m=calendar&l=using-the-calendar)).

## Common mistakes
- **Wrong anchor hour.** If your UTC offset doesn't match your broker's daily open, the whole box is off. Verify it once.
- **Trading the touch, not the trigger.** Reaching an edge or equilibrium is a *location*, never a reason to click.
- **Ignoring bias.** Buying premium in a bearish day (or selling discount in a bullish day) is fighting the range.
- **No invalidation.** If you can't say where the idea is wrong (beyond which edge), you don't have a trade.

## Practice it, don't trust it
The OC zone is popular partly because many traders watch the same session opens, which can make these levels mildly self-fulfilling — but it is **not magic and carries no guaranteed edge**. Treat it as one clean way to frame the day. Prove *your* version on chart history in **Backtesting**, save the rules as a **Playbook** setup, and let **Statistics** tell you whether it actually has positive expectancy over a real sample.

## Sources
- Credit — concept based on *The Institutional Anchor (Daily OC Zone)* indicator by its TradingView author: https://www.tradingview.com/script/rg8g9p3i-The-Institutional-Anchor-Daily-OC-Zone/
- Investopedia — *Opening Range* (using the session open as an intraday reference): https://www.investopedia.com/terms/o/opening-range.asp
- Investopedia — *Mean Reversion* (why price often returns toward a central/fair value): https://www.investopedia.com/terms/m/meanreversion.asp
`, "/top-down"),

  L("strategies", "fibonacci-retracement", "Fibonacci Retracement Strategy", "A top-down, trend-following setup: read bias on the higher timeframe, draw the Fib on the impulse, and wait for a trigger in the golden zone.", 14, ["fibonacci-retracement", "golden-zone", "impulse", "pullback", "market-structure", "trend", "rejection", "confirmation", "invalidation"], `
# Fibonacci Retracement Strategy

This is a **complete, repeatable chart setup**, not a signal. It bolts together everything you've learned so far — higher-timeframe context, a precise location, a scenario, a trigger, and a pre-defined invalidation — into one play you can run the same way every day.

> **Reminder:** this lesson teaches you a *process*. It never tells you to buy or sell a specific price. The levels below are illustrative numbers to make the mechanics concrete.

## The idea in one sentence
> In a higher-timeframe **trend**, price moves in bursts (**impulses**) and then **pulls back** against the trend before continuing. Fibonacci retracement measures *how deep* a pullback is, so you can plan a **trend-following entry** at a sensible location — then wait for a trigger to confirm the trend is resuming.

Fibonacci is a **location tool**, nothing more. It does not predict. It gives you a disciplined place to *look* for a setup — the rest is structure, a trigger, and risk.

## Step 1 — Get your bias from the higher timeframe
Start on the **4H** (or Daily) and read the **market structure**, exactly as in [Chart Reading](/learn?m=chart-reading&l=market-structure):

- **Bearish** = a sequence of **Lower Highs and Lower Lows**. You will only look for **shorts**.
- **Bullish** = **Higher Highs and Higher Lows**. You will only look for **longs**.
- **Ranging / unclear** = no trade. Fibonacci retracement is a *trend-continuation* tool; it has no edge in a range.

You trade **with** the higher-timeframe trend, never against it. This single filter removes most bad Fib trades.

## Step 2 — Find the most recent impulse on the lower timeframe
Drop to the **1H**. Identify the most recent clean **impulse** leg *in the direction of your 4H bias* — the sharp, decisive move, not the slow grind.

- Bearish bias → find the most recent sharp **drop** (a strong down-leg).
- Bullish bias → find the most recent sharp **rally** (a strong up-leg).

## Step 3 — Draw the Fib on the impulse (not the pullback)
This is the step beginners get backwards. **You draw the Fibonacci across the impulse leg itself**, from where it started to where it ended:

- In a **bearish** setup: drag from the **swing high (start of the drop → level 0)** down to the **swing low (end of the drop → level 1)**.
- In a **bullish** setup: drag from the **swing low (start of the rally → 0)** up to the **swing high (end of the rally → 1)**.

Your tool then paints the retracement levels — **0.382, 0.5, 0.618, 0.705, 0.786** — in between. These mark *how far back* a pullback has travelled into the impulse.

#### Worked bearish example (illustrative)
> Price drops hard on 1H from **$3,800 → $3,740** — that's your impulse. You draw the Fib from **$3,800 (0)** down to **$3,740 (1)**. Price then retraces **up** into the zone around **$3,777 (≈0.618)**. That upward pullback is what you were waiting for — it is *not* a sign of more buying, it is the counter-trend bounce you plan to **sell into**, back in the direction of the 4H downtrend.

## Step 4 — Wait for price to reach the "golden zone"
The high-probability pocket is the **0.5 – 0.705** region, often called the **golden zone** (the 0.618 and 0.705 levels are the heart of it).

- **Bearish:** price pulls **back up** into the zone.
- **Bullish:** price pulls **back down** into the zone.

A shallow pullback (price barely reaches 0.382 and keeps trending) often means the trend is too strong to wait for — that's fine, you simply don't get a trade. A pullback that blows past **0.786** is a warning the impulse may be failing.

## Step 5 — Demand a trigger (the zone alone is not an entry)
**Reaching the Fib level is not a reason to enter.** Price touches these levels and keeps going all the time. You wait for the trend to *show* it's resuming, with a confirmation at the zone — for example:

- A **rejection** candle in your direction (e.g. a bearish engulfing or pin bar in a bearish setup).
- A **liquidity sweep** of a nearby swing, then a snap back.
- A **break of structure** on a lower timeframe (e.g. 5m) confirming the pullback is over.

Confluence makes it stronger: a golden-zone level that lines up with a **support/resistance zone**, a round number, or a session level is a better location than the Fib alone.

## Step 6 — Invalidation, stop and target (risk first)
Define where you are **wrong** *before* you enter — see [Stops & Invalidation](/learn?m=stops&l=invalidation-first):

- **Stop:** just **beyond the zone** — above the pullback high (bearish) or below the pullback low (bullish). If price trades there, your idea that the trend resumed from the zone is simply wrong. The **0.786** level and the impulse's origin (0) are common invalidation anchors.
- **Target:** the next structural level — commonly a retest of the impulse's extreme (the swing low in a bearish setup) or the next higher-timeframe level.
- **Reward-to-risk:** only take it if it clears your minimum (e.g. **≥ 1:2**). A beautiful Fib setup with a 1:1 RR is still a pass.
- **Size:** from your stop distance, never the other way round — \`lots = (account × risk%) / (stop distance × $100)\`.

## The corrected flow at a glance

| Step | What you do |
|---|---|
| 1. 4H bias | Read structure. Bearish = Lower Highs & Lower Lows → look only for shorts |
| 2. 1H impulse | Find the most recent sharp leg *in the trend's direction* |
| 3. Draw Fib | Across the **impulse** (high→low for bearish; low→high for bullish) |
| 4. Wait | Let price retrace **into the 0.5–0.705 golden zone** |
| 5. Trigger | Demand confirmation at the zone (rejection / sweep / break of structure) |
| 6. Execute & manage | Stop beyond the zone, target the next structure, RR ≥ your minimum, size from the stop |

## Common mistakes
- **Drawing the Fib on the pullback instead of the impulse.** Always measure the strong leg, not the correction.
- **Entering the moment price "touches" a level.** The level is a *place to look*, not a trigger.
- **Trading against the higher-timeframe trend** because "it reached 0.618." Fib is a continuation tool — respect the bias.
- **Forcing a trade in a range.** No trend, no edge.
- **Moving the stop to "give it room."** The stop *is* your invalidation. Move it and you've abandoned the plan.

## Practice this, don't trust it
Fibonacci is popular partly because many traders watch the same levels, which can make them mildly self-fulfilling — but it is **not magic and has no guaranteed edge**. Treat it as one disciplined way to find a *location*. Prove it on your own chart history in **Backtesting**, save the rules as a setup in your **Playbook**, and let **Statistics** tell you whether *your* version of it actually has positive expectancy over a real sample.

## Sources
- Investopedia — *Fibonacci Retracement Levels* (what the levels are and how they're used as support/resistance): https://www.investopedia.com/terms/f/fibonacciretracement.asp
- Investopedia — *How to Use Fibonacci Retracements* (drawing across a trending leg; using levels with other signals): https://www.investopedia.com/articles/technical/04/033104.asp
- BabyPips — *How to Use Fibonacci Retracement* (trend bias first; the 50–61.8% pocket; combine with confirmation): https://www.babypips.com/learn/forex/fibonacci-retracement
`, "/top-down"),
  // ----------------------------------------------------------- GOLD RESEARCH LAB
  L("gold-research", "do-key-levels-hold", "Do Gold's Key Levels Actually Hold? A 23-Year Test", "A pre-registered study of 23 years of gold bid/ask data: do round numbers, previous-day/week/month extremes and swing points make price bounce more than ordinary prices do?", 14, ["support-resistance", "placebo-level", "key-level", "stop-cluster"], `
# Do Gold's Key Levels Actually Hold? A 23-Year Test

A successful gold trader once told a student: *"Don't predict the price. Learn the levels where gold **reacts**."* That is a sensible idea. This lesson asks the next question honestly: **does gold actually react at those levels, more than it does at any random price?**

> This is a **history lesson, not a signal**. It describes what happened to prices in the past. It does not say what price will do next.

## How the test was built (in plain English)
1. **Data:** Dukascopy XAU/USD one-minute **bid and ask** prices, 2003 to September 2026. We use the **mid** price (halfway between bid and ask) and keep the real gaps (weekends, daily break) instead of filling them.
2. **Levels tested:** round numbers ($100 steps such as 4,400; and halfway points such as 4,450), the **previous day / week / month high and low**, **daily swing highs and lows**, and the 200-day average.
3. **A "touch":** price arrives at the level from at least a small distance away, and the level was *not* touched in the previous 24 hours (so we look at first visits, not noise).
4. **Outcome within 24 hours:** a **bounce** means price moves away from the level (back the way it came) by 0.35 x the daily range before it moves the same distance *through* the level. A **break** is the opposite order.
5. **The key trick, a placebo:** the same test run on **ordinary prices that are not levels** (for example $25 above a round number, or a fixed distance off a previous high). If real levels do not beat these, they are not special.
6. **Rules written before running:** the settings, the three time periods (2003-2012, 2013-2019, and a **locked** 2020-2026 era run only once) and the pass/fail gates were saved in advance, so nothing could be tuned after seeing results.

## What came out
| Level type | Bounce rate at real levels | Bounce rate at placebo prices |
|---|---|---|
| Round $100 numbers | about 38-40% | about 52% |
| Round $50 midpoints | about 40-45% | about 52% |
| Previous day/week/month extremes | about 43% | about 49% |
| Daily swing highs/lows | about 44% | about 47% |

- In **every era and almost every family**, real levels were **bounced from less often** than ordinary prices. In plain words: gold tended to **run through** these levels more than it turned at them.
- On the **locked** period (2020-2026) the numbers pointed the same way but were **not statistically convincing** once corrected for running many tests (smallest p-value 0.11; the corrected bar was about 0.005). Officially: **not confirmed.**
- The 200-day average produced too few clean touches to test at all.

## What this does and does not mean
- It does **not** show levels are useless. They are still how humans organise a chart, and they tell you **where something is likely to happen** (a fast move either way).
- A reasonable reading, consistent with the finance literature (see the reading list): many traders place **stop orders just beyond round numbers**, so once price pushes through, those stops add fuel. A level can be **a place where price accelerates**, not a wall.
- The practical lesson for a learner: **never treat a level as a guarantee of a bounce.** Treat it as a *zone to watch*, wait for a reaction **you can see**, and always define where you are wrong (your stop) before entering.
- One unconfirmed hint appeared (following a break of a round $100 level seemed slightly positive after costs in all three eras), but there were only about 8 such events per year. It is a **question for further research**, not a method.

## Try it yourself (safely)
- In the **Support/Resistance lab**, mark a round number and note whether price rejected it or ran through it.
- Log each first touch of a level in your **Journal** for a month: bounce, break, or neither. After 30-50 touches, you have your own small version of this study. Compare it to the table above.

## Honest limits of this study
Small samples on the locked period (about 50 round-number events), one fixed set of settings, an imperfect placebo for previous-high/low and swing levels, and mid-price bars. Full detail, the exact rules and the code are in the research repository (file: gold_levels_study_results_2026-10-07.md).

## Sources
- Osler, C. (2000), *Support for Resistance: Technical Analysis and Intraday Exchange Rates*, Federal Reserve Bank of New York Economic Policy Review 6(2).
- Osler, C. (2003), *Currency Orders and Exchange Rate Dynamics*, Journal of Finance 58(5): stop-loss orders cluster at round numbers.
- Aronson, D. (2006), *Evidence-Based Technical Analysis*, Wiley.
`, "/labs/support-resistance"),

  L("gold-research", "gold-reading-list", "The Gold Research Reading List", "Highly cited academic papers and books on gold, technical analysis, and honest testing, with a one-line takeaway for each. Read these before any YouTube strategy.", 12, ["buy-and-hold-benchmark", "placebo-level", "stop-cluster"], `
# The Gold Research Reading List

Chasing YouTubers is how accounts get blown up. Peer-reviewed work is slower but it lets you ask the right question. Below is a starter set, grouped by what it helps you understand. Citations are given from memory of the standard references; **check each title and DOI on Google Scholar before relying on a detail.**

## 1. What kind of asset is gold?
- Baur, D. & Lucey, B. (2010), *Is Gold a Hedge or a Safe Haven?*, The Financial Review 45(2). Gold tends to hold value against stocks in extreme stress, for a short time.
- Baur, D. & McDermott, T. (2010), *Is Gold a Safe Haven? International Evidence*, Journal of Banking & Finance 34(8).
- Erb, C. & Harvey, C. (2013), *The Golden Dilemma*, Financial Analysts Journal 69(4). Why the "gold = inflation hedge" story is weaker over short horizons than people think.
- O'Connor, Lucey, Batten & Baur (2015), *The Financial Economics of Gold: A Survey*, International Review of Financial Analysis 41. The best single overview.
- Barsky, R. & Summers, L. (1988), *Gibson's Paradox and the Gold Standard*, Journal of Political Economy 96(3). Gold and **real interest rates**.

## 2. Does technical analysis work? Where do levels come from?
- Brock, Lakonishok & LeBaron (1992), *Simple Technical Trading Rules and the Stochastic Properties of Stock Returns*, Journal of Finance 47(5). A landmark pro-technical result, later debated.
- Lo, Mamaysky & Wang (2000), *Foundations of Technical Analysis*, Journal of Finance 55(4). Some chart patterns carry small amounts of information.
- Park, C.-H. & Irwin, S. (2007), *What Do We Know About the Profitability of Technical Analysis?*, Journal of Economic Surveys 21(4). Survey: profits were larger before the 1990s and shrink after costs.
- Osler, C. (2000), *Support for Resistance*, FRBNY Economic Policy Review 6(2). Published support/resistance levels were followed by more trend interruptions than chance in intraday FX.
- Osler, C. (2003), *Currency Orders and Exchange Rate Dynamics*, Journal of Finance 58(5). **Stop-loss orders cluster just beyond round numbers**, which helps explain why levels get run through.
- Neely, Weller & Dittmar (1997), *Is Technical Analysis in the Foreign Exchange Market Profitable?*, JFQA 32(4).
- Aronson, D. (2006), *Evidence-Based Technical Analysis*, Wiley. How to test a rule without fooling yourself.

## 3. Trends and predictability
- Moskowitz, Ooi & Pedersen (2012), *Time Series Momentum*, Journal of Financial Economics 104(2). Trend-following across many markets.
- Lo, A. & MacKinlay, C. (1988), *Stock Market Prices Do Not Follow Random Walks*, Review of Financial Studies 1(1). The variance-ratio test.

## 4. How not to fool yourself
- Bailey, D. & Lopez de Prado, M. (2014), *The Deflated Sharpe Ratio*, Journal of Portfolio Management 40(5). The more variants you try, the higher the best one looks by luck alone.
- Harvey, Liu & Zhu (2016), *...and the Cross-Section of Expected Returns*, Review of Financial Studies 29(1). Most "discoveries" in finance are probably false; use a higher bar.
- Chan, E. (2009/2013), *Quantitative Trading* and *Algorithmic Trading*, Wiley. Practical backtesting, costs and risk for a small account.

## How to read a paper in 15 minutes
1. Read the abstract and conclusion first.
2. Find the **sample period** and whether the result held **out of sample**.
3. Ask: **after costs?** and **versus simply holding the asset?**
4. Check how many things the authors tried before finding this.

## Educational note
None of these papers is a trading recommendation. Use them to build better questions and to judge claims.
`),

  L("gold-research", "what-we-tested-on-gold", "What We Tested on Gold (and What Died)", "A plain-English scoreboard of the pre-registered gold tests so far: what failed, the two benchmark facts that explain it, and why 'exposure, not alpha' is the working conclusion.", 10, ["buy-and-hold-benchmark", "placebo-level", "spread", "slippage"], `
# What We Tested on Gold (and What Died)

This chapter is the **research notebook** behind the Academy. Each test was **pre-registered** (rules written down before running), costs were charged, and failures are reported as clearly as successes.

## Two facts to know before any gold idea
1. **Gold buy-and-hold, 2022-2026, had a Sharpe ratio of about 1.02** (roughly +146%, worst drop about -27%). A strategy scoring 1.0 on that window has **no edge over just holding gold**. Gold went up; most "winning" backtests were riding that.
2. **No linear structure at tradeable horizons.** Variance-ratio tests from 4 hours to 40 days, on both a 4.7-year window and 23 years of data, found nothing beyond what chance produces (largest z about 1.35).

## Scoreboard
| Idea | Result |
|---|---|
| 16 trend, breakout, mean-reversion, macro and cross-asset (silver, dollar index) hypotheses | None beat buy-and-hold after costs |
| Dollar index as a predictor | No predictive information (lag-1 z at most 0.8) |
| Zero-fee scalping on one-minute gold | About 0 basis points per trade, ~52% win rate |
| **Key-level reaction (this chapter, lesson 1)** | **Not confirmed**; levels are broken more often than ordinary prices |
| A popular community gold breakout strategy | Reproduced on our data, but still an unvalidated observation (tuned on the same period) |

## Costs matter, but carefully
- At today's price (about $4,400), a broker spread of $0.25 is only about **0.6 basis points round trip**, far smaller than older estimates calibrated on $1,800 gold.
- **Swap (overnight financing) is the real hidden cost** on a CFD: a long held overnight cost roughly 1.8 basis points per night at one broker, about three times the whole spread round trip, while shorts earned a small credit.

## What "exposure, not alpha" means for a learner
Gold is useful for diversification and as a store of value, but a retail trader should not assume that a chart pattern gives an edge over holding it. If you trade it, the honest goals are **small risk per trade, journal everything, and let a real sample size (dozens of trades) tell you whether your own method has positive expectancy**.

## Process lessons you can reuse
- Write the rules and pass/fail bar **before** you look at results.
- Always compare to **buy-and-hold**.
- A strong backtest with a weak significance test is a **hypothesis**, not a result.
- Beware of data that has been **forward-filled** (fake candles) and prices that are **bid-only**.
- Paper-trade first; the account you protect is the one that lets you keep learning.

> Educational only. Nothing here predicts gold or recommends a trade.
`),

  // ---------------------------------------------------------------- FOUNDATIONS (new lessons)
  L("foundations", "passive-aggressive-liquidity", "Passive vs Aggressive Liquidity", "Two types of orders — one provides liquidity, the other takes it. This is what actually moves price.", 8, ["liquidity", "market-order", "limit-order", "order-flow"], `
# Passive vs Aggressive Liquidity

Every transaction involves two roles: one side **provides** liquidity, the other **takes** it. Understanding which does which is the foundation of order-flow thinking.

## The two roles

**Passive liquidity — limit orders.**
A limit order rests in the order book at a specific price, waiting. "I'll buy at 3,710 and not a cent more." Passive orders don't move price; they create the supply or demand that other orders trade against.

**Aggressive liquidity — market orders.**
A market order says: "Fill me *now* at whatever price is available." It sweeps through the resting limits on the opposing side. This is what moves price tick by tick. Every upward tick happens because an aggressive buyer hit the lowest available sell limit.

## The intuition: a market stall

Imagine a stall with price tags. The stall-keeper is passive — she named her price and waits. A customer who walks up, accepts the tag, and buys is aggressive. The moment the customer transacts, the available inventory at that price is gone; the next customer pays whatever the next tag says. Price moves.

## Why price moves directionally

When aggressive buyers consistently outnumber the passive sell orders at the current level, the cheapest available ask gets swept, and price moves up to the next ask. This continues until either aggressive buying stops or enough passive supply materialises to absorb it.

**Strong impulsive candles** (large bodies, small wicks, consistent direction) often reflect aggressive orders dominating. **Choppy, wicky candles** often reflect balanced passive orders on both sides absorbing every attempt.

## What this means on the chart

You cannot directly observe aggressor vs passive split from OHLC alone. The interpretation is a mental model, not a certifiable fact. True order-flow data requires footprint charts or Level 2 depth — not available on most retail spot-gold platforms.

**Use conditional language:** "This impulsive candle *may* reflect aggressive buyers overwhelming passive supply" — not "buyers are definitely dominating."

## Exercise

On a 15m gold chart, find one impulsive move and one choppy range. For each, narrate which side (aggressive or passive) the balance appears to favour, using "may" language. Practise the habit of probabilistic description over assertive claims.

> **Sources:** Harris, L. (2003), *Trading and Exchanges: Market Microstructure for Practitioners*, Oxford University Press — the definitive reference on order types, passivity, and how prices form.
`),

  L("foundations", "price-discovery", "Price Discovery", "How markets find the price that clears both sides — the auction mechanism behind every chart.", 8, ["auction", "price-discovery"], `
# Price Discovery

"Price discovery" sounds academic but it answers a simple question: *how does a market figure out what something is worth right now?*

## The mechanism

No authority sets the gold price. Buyers and sellers interact continuously, each with their own view of value and urgency. The price at any moment is the most recent agreed transaction — the point where a willing seller and a willing buyer crossed.

When new information arrives (a Fed statement, a geopolitical shock), participants update their estimate of value. Those who believe gold is now underpriced become aggressive buyers; those who think it's overpriced become aggressive sellers. The imbalance moves price until it finds a new level where two-sided trade can resume.

**Every candlestick records the short auction that took place during its time period and where it settled.**

## Acceptance vs rejection

Markets don't just discover price — they test whether it's **accepted**:

- **Acceptance:** price moves to a level and *stays*, trade occurs at that level, participants transact freely. Shows up as time and volume *at* the level.
- **Rejection:** price moves to a level and snaps back — the auction found no willing counterparty there. Shows up as a **wick**: price explored that territory and closed away from it.

This framework underlies Auction Market Theory (covered in the Volume module). The core idea: **a long wick is a rejected price.** The market attempted that level and couldn't sustain it.

## Why key levels matter

Support and resistance levels are past *acceptance zones* — prices where significant two-sided trade previously occurred. Participants remember and reference them. They're rational starting points for watching for a new auction to begin, not guaranteed turning points.

## Exercise

Find five significant wicks on a 1H gold chart. For each, narrate: "The market *attempted* to trade at [high/low of wick]. That level was *rejected* — the close tells me where the auction actually settled." Repeat on different timeframes. Notice how the same price path produces larger or smaller wicks depending on the timeframe.

> **Sources:** Steidlmayer, J.P. & Koy, K. (1986), *Markets and Market Logic* — original Market Profile / Auction Market Theory framework. Pring, M. (2002), *Technical Analysis Explained*, McGraw-Hill.
`),

  // ---------------------------------------------------------------- CHART READING (new lessons)
  L("chart-reading", "inside-outside-bars", "Inside Bars & Outside Bars", "One signals compression before an explosive move; the other signals a range expansion with no winner.", 7, ["candlestick", "volatility", "momentum"], `
# Inside Bars & Outside Bars

Two patterns built entirely on *range* — one contracts it, one expands it.

## Inside Bar

An inside bar is a candle whose entire range (high to low) fits *within* the range of the previous "mother" bar.

\`\`\`
Mother bar:  Low ──────────────────── High
Inside bar:       Low ──────── High
\`\`\`

The inside bar is a **compressed auction**: the session traded entirely within the prior session's extremes. Neither buyers nor sellers pushed beyond the previous range. The market paused.

**What it suggests:** energy is being compressed. Compression commonly precedes expansion. Inside bars at key levels or after strong impulses are "coil" setups — a break of the mother bar's range can signal the next directional leg.

**Caution:** quiet periods (late Asian session, pre-news) produce many small inside bars that are pure noise. The pattern only has weight when the *context* is significant: at a meaningful level, or after a large directional candle.

## Outside Bar

An outside bar exceeds both the prior high *and* the prior low.

\`\`\`
Prior candle:     Low ──────── High
Outside bar:  Low ──────────────────────── High
\`\`\`

Both sides were explored and neither won. Volatility expanded but produced no decisive resolution.

**What it suggests:** active two-way trade with no dominant side. Context determines implication — at a turning point it may signal exhaustion; in a range it's often noise.

**Key distinction:** an outside bar is about full-range expansion, not about the colour (close location). A bearish-closing outside bar at resistance in a downtrend means something different from the same shape in the middle of a range.

## Exercise

On a 1H gold chart, mark 3 inside bars and 2 outside bars. For each, note: (1) what was the context — trend, range, near a level? (2) what happened in the next 5 candles? Record outcomes *before* interpreting — let the data speak.
`),

  L("chart-reading", "engulfing-pin-bars", "Engulfing & Pin Bar Candles", "What these candles represent in auction terms — and why location determines whether they mean anything.", 8, ["candlestick", "rejection", "momentum"], `
# Engulfing & Pin Bar Candles

Two of the most discussed candle shapes. Understand what they *record*, not just what they look like.

## Bullish Engulfing

A bearish candle is followed by a bullish candle whose **body** completely covers the prior body.

**What it records:** sellers controlled the prior session. The next session opened and buyers drove price above the prior open — completely reversing the prior session's work. The body-engulf means buyers absorbed and overcame the prior selling pressure within one period.

**When it carries weight:** at a key support level after a pullback in a larger uptrend; at a significant higher-timeframe zone after a sustained move. At these locations, it can be a valid trigger.

**When it doesn't:** in the middle of a trend (just a pullback candle); on a low timeframe in choppy conditions; at resistance in a downtrend — where a bullish engulfing is a *potential trap*, not a buy.

The candle is neutral by itself. Context activates it.

## Bearish Engulfing

Mirror image: a bullish candle followed by a bearish candle whose body engulfs the prior. Sellers fully reversed the prior session's buying in one period.

## Pin Bar (Rejection Candle)

A pin bar has a long wick (typically 2–3× the body or more) on one side and a small body on the other.

- **Bullish pin (hammer):** long lower wick. Price drove down hard but closed near the top — sellers tried, buyers overwhelmed them back.
- **Bearish pin (shooting star):** long upper wick. Price drove up hard but closed near the bottom — buyers tried, sellers rejected them.

**What a long upper wick proves:** price reached that high, could not sustain it, and the auction closed lower. That's all.

**What it does not prove:** "smart money" specifically caused it; a reversal is guaranteed; there is intent behind the wick. It is evidence of price rejection at that level, nothing more.

**The decisive test:** put the same pin bar in two places — at a major HTF resistance zone vs. floating in the middle of a trend. It is a strong signal in the first case and almost meaningless in the second.

## Exercise

Find 5 bullish pin bars on a 15m gold chart without cherry-picking — take the first 5 scanning left to right. For each, record: (1) was a key level nearby? (2) what was the 4H structure? (3) what happened in the next 10 candles? Tally successes and failures honestly.

> **Sources:** Nison, S. (1991), *Japanese Candlestick Charting Techniques*, New York Institute of Finance — the reference on candle anatomy and names.
`),

  L("chart-reading", "doji-indecision", "Doji & Indecision Candles", "What a near-zero body actually records — and why the candle after the doji matters more than the doji itself.", 6, ["candlestick", "momentum", "auction"], `
# Doji & Indecision Candles

A doji forms when the open and close are at approximately the same price. The body is minimal or absent; wicks can vary.

## What a doji records

The session's auction **ended where it started.** Regardless of how far price travelled intra-period, buyers and sellers cancelled each other out by the close. No progress in either direction was sustained.

## Types

**Standard doji** (small body, moderate wicks both sides): balanced indecision. Neither side held ground.

**Long-legged doji** (long wicks both sides): high volatility with no decision — large exploration, no resolution. Common around news events.

**Dragonfly doji** (long lower wick, close near high): price drove down hard; buyers completely recovered it. Functionally similar to a bullish pin bar.

**Gravestone doji** (long upper wick, close near low): price drove up hard; sellers pushed it fully back. Functionally similar to a bearish pin bar.

## The honest interpretation

A doji is a **question mark**, not an answer. It records unresolved tension. What it means depends entirely on context:

- **At a key level after a strong trend:** possible exhaustion — worth watching for a reversal trigger.
- **In the middle of a range:** noise — the range itself is already indecision.
- **Before a major news event:** participants are flat, waiting — volatility expansion likely incoming.

## The most important rule

**The candle after the doji matters more than the doji.** A doji at support followed by a strong bullish close is a two-candle confirmation. A doji at support followed by another bearish close means the level is still being tested.

Never act on a doji alone. Always wait for the next candle's resolution.

## Exercise

Find 5 doji candles on a 1H gold chart. For each, record what happened on the *next two candles*. Tally bullish vs bearish resolutions. The exercise will demonstrate that a doji alone resolves about 50/50 — confirming that context and follow-through create the edge, not the shape.
`),

  L("chart-reading", "candle-sequences", "Reading Candle Sequences", "Individual candles are words. Sequences are sentences. The meaning is in the narrative, not any single character.", 8, ["candlestick", "momentum", "market-structure"], `
# Reading Candle Sequences

Rather than naming individual patterns, ask: **what story is this sequence telling?**

## The core skill

Every 3–5 candle group can be narrated: "Sellers drove price down with a large bearish candle. The next two candles were small with wicks on both sides — neither side dominated. Then a large bullish candle reclaimed most of the prior move. Story: the initial sell-off was absorbed; buyers are attempting to take control."

This narrative approach — reading intent rather than naming patterns — is what distinguishes discretionary skill from mechanical pattern-matching.

## Momentum within sequences

Sequences reveal momentum shifts before they appear on the chart:

- **Increasing momentum:** successive candles in one direction grow larger — conviction building.
- **Fading momentum:** candles in the trend direction are shrinking; wicks are growing. The dominant side is losing energy.
- **Exhaustion:** a large candle followed by a much smaller candle of the same colour, or a doji — the push is stalling. This often precedes a reversal or consolidation.

These momentum clues frequently appear *before* a structural break on the chart, giving alert readers an early warning.

## The three-candle read drill

For any three consecutive candles, ask:
1. Who controlled candle 1?
2. Did the same side maintain control in candle 2, or did control shift?
3. What does candle 3 confirm or deny?

Practise this continuously until it becomes automatic.

## Why pattern names can mislead

The same visual sequence ("three white soldiers," "morning star") means different things in different contexts. Three bullish candles in a downtrend = likely a pullback. Three bullish candles at a support hold in an uptrend = continuation. The shape is identical; the meaning is near-opposite. Context first, shape second.

## Sequences and higher timeframes

A 15m sequence *is* a single 1H candle viewed with more granularity. Understanding this builds multi-timeframe intuition: when you study a 1H candle with a rejection wick, you can imagine the 15m sequence of sell-off and recovery that produced it.

## Exercise

Pick any 40-candle segment of historical XAUUSD 15m data. Narrate it aloud, candle by candle, without using any pattern names — only words like "buyers," "sellers," "control shifted," "momentum fading," "absorption." Do this for 5 minutes without stopping. This is the root skill of discretionary reading.

> **Sources:** Elder, A. (1993), *Trading for a Living*, Wiley — Chapter on candlesticks and pattern context. Murphy, J. (1999), *Technical Analysis of the Financial Markets*, NYIF.
`),

  // ---------------------------------------------------------------- LIQUIDITY & ORDER FLOW (new module)
  L("pa-liquidity", "what-is-liquidity", "What is Liquidity?", "Market liquidity, resting orders, and why liquidity depth determines how far a single order can move price.", 7, ["liquidity", "order-flow", "spread"], `
# What is Liquidity?

Liquidity is how easy it is to buy or sell a given size without significantly moving the price.

## Two forms of liquidity

**Market liquidity** — the overall depth of the market. How much can trade near the current price without a large move? Gold during the London/NY overlap is highly liquid. Gold at 3 AM Sunday is thin.

**Resting liquidity** — the limit orders sitting in the order book above and below current price, waiting to be filled. This is the pool that aggressive orders trade *into*.

## Why depth matters

In a deep market, large orders execute smoothly because many passive counterparties exist at nearby prices. In a thin market, even a modest market order can push price through several levels because fewer resting orders stand in the way. This explains why the same "setup" behaves very differently at different times of day.

## Liquidity concentrations as price magnets

Because most traders use the same chart landmarks, resting orders cluster at predictable locations: round numbers, prior swing highs and lows, previous day/week reference levels. These clusters are **price magnets** — price is often drawn toward them because that's where the supply of orders exists to fill incoming demand, and vice versa.

## The two trading implications

1. **You need liquidity to execute.** If you're trying to sell, you need a buyer. Thin liquidity = worse fills, wider spreads, more slippage.
2. **Liquidity concentrations are trade locations.** Understanding where orders likely cluster helps anticipate where price may move toward (to find the fills) and where it may reverse (once the orders are absorbed).

## What you can and cannot see

On a standard OHLC chart, the order book is **invisible.** You can infer where orders are likely clustered by reading the chart, but you cannot observe it directly. True depth visibility requires Level 2 order book data, which most retail spot-gold platforms do not provide.

Everything in this module is educated inference from price behaviour — not direct observation.

> **Sources:** Harris, L. (2003), *Trading and Exchanges*, Oxford University Press — Chapters 3–5 on liquidity, order types, and market depth.
`),

  L("pa-liquidity", "stop-clusters", "Stop-Loss Clusters", "Where retail stops concentrate on a gold chart, and why those concentrations make certain price levels behave predictably.", 8, ["stop-loss", "liquidity", "swing-high", "swing-low"], `
# Stop-Loss Clusters

Most retail traders follow nearly identical logic when placing stops. This predictability creates predictable concentrations of resting orders.

## Where stops cluster

- **Just below recent swing lows** — stops for long positions.
- **Just above recent swing highs** — stops for short positions.
- **Below/above previous day high and low** — widely-watched reference points.
- **Below/above round numbers** ($3,700, $3,750, $3,800) — psychological clustering.
- **Beyond obvious double tops/bottoms** — pattern-based placements.

Because thousands of traders use the same chart and the same logic, their stops pile up at the same locations. These clusters are **concentrations of waiting market orders.**

## Why clusters matter to price

When a stop-loss is triggered it becomes a market order — an instant aggressive order that pushes price further in the same direction. A cluster of stops is therefore a cluster of waiting momentum orders. When price reaches the zone:

1. Stops trigger → burst of same-direction aggressive orders.
2. Price moves through the level briefly.
3. The liquidity from stopped-out traders fills the opposing side's resting limits.

This is why price frequently "overshoots" obvious levels before reversing: the overshoot is the mechanism that exhausts the stop cluster and fills the opposing orders.

## What this looks like on the chart

A **wick** beyond a prior swing high or low, followed by a close back inside the prior range, is the visual signature of a stop-hunt completing. The wick = price found the stops, triggered them, and the reversal began once that liquidity was absorbed.

## The critical caveat

Not every overshoot is a deliberate stop-hunt. Other causes:
- Thin liquidity periods cause natural overshoot on modest volume.
- Algorithmic breakout systems buy new highs; their exits create apparent reversals later.
- News events cause overshoots independent of stop positioning.

The stop-cluster framework is a useful reading tool, not a verified explanation of who caused the move.

> **Sources:** Osler, C. (2003), "Currency Orders and Exchange Rate Dynamics," *Journal of Finance* 58(5) — empirical evidence that stop-loss orders cluster at round numbers and just beyond technical levels.
`),

  L("pa-liquidity", "liquidity-sweeps-mechanics", "Liquidity Sweeps", "The mechanics of a price spike that grabs clustered stops and then reverses — one of gold's most repeatable patterns.", 9, ["liquidity-sweep", "false-breakout", "stop-loss", "rejection"], `
# Liquidity Sweeps

A liquidity sweep is when price moves aggressively beyond a well-known level, triggers the resting orders there, then reverses.

## The mechanics

When price pushes into a known stop cluster:
1. Stops trigger → burst of market orders in the direction of the push.
2. Those orders fill the opposing side (large resting limit orders absorb the flow).
3. Once the available stops are exhausted, the pressure reverses.
4. Price snaps back, often with momentum.

You don't need to invoke "institutional targeting" as the cause. The mechanics are emergent: predictable stop placement + order-flow dynamics = predictable sweep behaviour.

## Identifying a sweep on the chart

- A **sharp, fast spike** beyond a swing high or low — often only one or two candles.
- A **long wick** reaching into the stop zone.
- A **close back inside** the prior range — the decisive element.
- The spike is impulsive; the return is too.

**The close is the key.** A close beyond the level = potential real breakout (or failed breakout — see below). A wick that spikes through then closes back = sweep signature.

## The trade setup

After a confirmed sweep (wick beyond level, candle closes back inside):
1. The obvious stop orders have largely been triggered.
2. Participants positioned in that direction have been shaken out.
3. The path of least resistance often shifts.

Entry: on the candle that closes back inside the level (the "reclaim"). Stop: just beyond the sweep wick extreme. Target: next key level in the reversal direction, minimum 2R.

## The failure mode

Sometimes what looks like a sweep is the start of a real breakout. Price sweeps, consolidates briefly above/below, then continues. The tell: if price cannot close back inside the level within 1–3 candles, treat it as a real breakout and step aside.

## Epistemic note

The candle pattern is observable. The cause (who swept whom and why) is not verifiable from OHLC. The pattern is tradeable regardless of its cause.

> **Sources:** Osler (2000, 2003) as above. Schwager, J. (1992), *The New Market Wizards*, HarperCollins — multiple interviews touching on stop-placement behaviour.
`),

  L("pa-liquidity", "absorption-order-flow", "Absorption & Order Flow", "When significant aggressive flow meets larger passive resistance — and why price barely moves despite the volume.", 7, ["order-flow", "absorption", "liquidity"], `
# Absorption & Order Flow

Absorption occurs when significant aggressive order flow meets even larger passive resistance — and price fails to move as much as the volume would suggest.

## The concept

Imagine aggressive sellers flooding the market with market orders. Normally this pushes price down. But if equally large buyers are waiting with limit bids at that level, every sell order gets absorbed — the resting bids take the other side of every aggressive sell. Price barely moves despite the heavy activity.

**Buy absorption** (at support): aggressive selling absorbed by large passive buying → potential strength, possible reversal.
**Sell absorption** (at resistance): aggressive buying absorbed by large passive selling → potential weakness, possible reversal.

Absorption signals hidden intent — the absorbing side is defending the level without revealing themselves through aggressive orders.

## What you might see on the chart

True absorption is difficult to identify from OHLC alone. Contextual clues include:

- **Repeated rejection at the same exact level** — consistent refusal to sustain above or below.
- **High-range candles that close near the middle** — aggressive attempts in both directions, neither holding.
- **Price "stalling"** at a level despite what looks like pressure — multiple candles touching the level without decisively breaking it.

## The important limitation for retail gold traders

Full absorption analysis requires **footprint chart data** — volume traded at each price tick within a candle. This is not available on standard retail spot-gold CFD platforms. Tick volume (price changes per period) does not reveal absorption.

What you observe from OHLC are *clues*, not proof. Use them to strengthen a hypothesis, not as standalone signals.

## Practical application

When price stalls at a level despite multiple candle attempts — consider absorption as a hypothesis. Look for a confirmation trigger (rejection candle, structural break in the reversal direction) before acting. The hypothesis + trigger together provide a more robust entry than either alone.

> **Sources:** Steidlmayer & Koy (1986) as above. Dalton, J., Jones, E. & Dalton, R. (1990), *Mind Over Markets*, Probus — the classic Auction Market Theory / Market Profile reference.
`),

  L("pa-liquidity", "what-charts-dont-show", "What the Chart Cannot Show You", "The honest limits of OHLC analysis — and why conditional language is accuracy, not weakness.", 8, ["order-flow", "liquidity", "auction"], `
# What the Chart Cannot Show You

This may be the most important lesson in this module.

## What OHLC actually records

A candlestick chart records exactly four data points per period: Open, High, Low, Close. **That is all.** Everything else is inference.

## What you cannot see on a standard chart

| Claim | What it asserts | What the chart shows |
|-------|----------------|---------------------|
| "Institutions bought here" | Who traded and why | Only that price rose |
| "Stop hunt by market makers" | Specific intent | Price spiked and reversed |
| "Order block" | Where institutions rested orders | A candle that preceded a move |
| "Smart money accumulation" | A specific actor accumulating | A period of sideways price action |
| "Demand zone" | Where buy orders are waiting | A prior reaction area |

None of the above can be verified from OHLC data. They are *interpretations* — sometimes useful heuristics, but interpretations nonetheless.

## The volume problem on gold

Retail spot gold uses **tick volume** (count of price changes per period), not real centralized exchange volume. COMEX gold futures have true reported volume. Spot CFD brokers do not. Tick volume correlates with activity but is not the same thing. Volume-based claims that presuppose real volume are built on shaky ground for retail spot gold.

## The productive attitude

Hold every OHLC-based observation as a **hypothesis**:
- "Price *may* have swept stops here" — not "smart money definitely ran stops"
- "This level *may* attract a reaction" — not "price will reverse here"
- "Volume *appears* elevated, suggesting activity" — not "institutions are buying"

Conditional language is **accuracy**, not timidity. It separates traders who improve by testing hypotheses against outcomes from those who defend narratives.

## Why this matters for learning

Many popular trading frameworks (SMC, ICT, order blocks) extrapolate strongly from OHLC to claims about market participant intent. Some describe patterns that genuinely repeat. But the mechanism they claim cannot be verified from a chart. Use them as pattern-recognition tools; test them statistically; don't mistake a useful heuristic for a proven market law.

> **Sources:** Aronson, D. (2006), *Evidence-Based Technical Analysis*, Wiley — the definitive work on distinguishing testable claims from untestable narratives in technical analysis.
`),

  // ---------------------------------------------------------------- VOLUME & AUCTION THEORY (new module)
  L("pa-volume", "volume-on-gold", "Volume on Gold: What You're Actually Seeing", "Tick volume vs real volume, why spot gold has no centralized exchange, and what you can and cannot infer.", 8, ["volume", "tick-volume", "comex"], `
# Volume on Gold: What You're Actually Seeing

Before using volume in any analysis, understand exactly what "volume" means on a retail gold chart.

## The volume source problem

**COMEX gold futures** (CME Group) trade on a centralized exchange with reported volume — every contract that changes hands is recorded. This is genuine traded volume.

**Spot gold** and most retail gold CFDs trade **over-the-counter (OTC)** — between banks, brokers, and dealers globally, with no single exchange recording every transaction. There is no centralized spot gold volume figure.

What your retail broker calls "volume" on a gold spot chart is almost always **tick volume**: a count of how many price changes occurred in the period. More activity = more ticks = larger tick-volume bar. This correlates reasonably with overall market activity but is not the same as actual ounces of gold traded.

## Why this matters

- Tick-volume figures are **broker-specific**: different client pools, different server activity.
- You **cannot compare** volume across brokers.
- Volume-analysis techniques designed for centralized equity markets (NYSE, CME) apply more cleanly to COMEX gold futures than to spot gold.

## What you CAN reasonably use volume for

Despite its limitations, tick volume provides useful context:

**Expanding volume during a trend move:** consistent with genuine participation — more price changes per period as the move accelerates.

**Contracting volume during a pullback:** consistent with a low-conviction counter-move — fewer participants fighting the trend.

**Volume spike at a key level:** suggests heightened activity at that point, which is consistent with the level mattering.

**Breakout on elevated volume vs. low volume:** a breakout with elevated tick volume is more credible than the same breakout in near-silence.

## The honest framing

Volume is one contextual signal among many. When it aligns with your price-action read, confidence increases. When it contradicts, pause. But never let a volume reading override a clear structural observation.

> **Sources:** CME Group, *Gold Futures Contract Specifications* — COMEX as the centralized venue. Steenbarger, B. (2009), *The Daily Trading Coach*, Wiley — practical discussion of volume interpretation for active traders.
`),

  L("pa-volume", "volume-profile-basics", "Volume Profile Explained", "POC, Value Area High/Low, HVN, LVN — what each level represents and how to use them without making absolute claims.", 9, ["volume-profile", "poc", "hvn", "lvn", "value-area"], `
# Volume Profile Explained

Volume Profile shows how much volume (or tick activity) traded at each **price level** over a given period — horizontal bars on the price axis, with longer bars indicating more activity.

## Key concepts

**Point of Control (POC):** the price level with the highest volume in the period. The most two-sided trade occurred here — where buyers and sellers most agreed on value.

**Value Area (VA):** the range containing approximately 70% of the period's volume. The **Value Area High (VAH)** and **Value Area Low (VAL)** are its edges.

**High-Volume Nodes (HVN):** price levels with significant volume. The market spent considerable time here and accepted this as fair value. Price tends to *rotate* within HVNs rather than racing through them.

**Low-Volume Nodes (LVN):** price levels with little volume. The market moved through quickly — no equilibrium found there. Price tends to pass through LVNs rapidly when it returns to them.

## The intuition

Imagine a party venue. The POC is the dance floor — where most activity happened, where the crowd gathered. The LVNs are the hallways that people briefly walked through but never stayed in. In market terms: HVNs = acceptance zones; LVNs = fast-transit zones.

## What Volume Profile is NOT

A POC or HVN does not guarantee that price will return there or react there. It means that level *was significant* during the measurement period. Whether it remains relevant depends on:
- **Recency of the profile:** a 6-month-old POC may be less relevant than yesterday's POC.
- **Regime changes:** a strong trend may blast through prior balance areas without pause.

**Never say price "must" return to the POC.** Treat it as a hypothesis about where equilibrium may be re-sought, given that context still warrants it.

## Practical use on gold

For day trading, **session profiles** (today's or yesterday's activity) are more actionable than multi-month composites.

Watch for:
- Price above the VAH → market may be perceived as "premium"; rotations back toward the VA are possible.
- Price below the VAL → market may be "discount"; recoveries toward VA are possible.
- Price at an LVN → expect faster movement through it.
- Price at an HVN → expect acceptance behaviour, possible rotation.

Always combine Volume Profile context with structural analysis and a price-action trigger before acting.

> **Sources:** Dalton, Jones & Dalton (1990), *Mind Over Markets* — original Market Profile / Volume Profile framework. Steidlmayer & Koy (1986) as above.
`),

  L("pa-volume", "auction-market-theory", "Auction Market Theory", "The conceptual framework that explains why markets trend, balance, and produce the structures you see on every chart.", 9, ["auction", "auction-market-theory", "balance", "imbalance"], `
# Auction Market Theory

Auction Market Theory (AMT) is the conceptual framework underlying Volume Profile — and much of how professional traders think about market dynamics.

## The core idea

A financial market is a **continuous two-way auction** with one purpose: to find the price that facilitates the most trade between buyers and sellers. This is the "fair value" zone.

**Markets do two things:**

1. **Trend (imbalance):** when the current price is broadly perceived as too cheap or too expensive, price moves away, searching for the level where two-sided trade can resume. This is directional movement.

2. **Balance (consolidation):** when price is within the range that buyers and sellers accept as fair value, the market rotates — it oscillates within the range without breaking out.

## Acceptance vs rejection (in AMT terms)

A market "accepts" a price when it:
- Spends significant time at that level (multiple candles trading there).
- Produces high volume at that level.
- Returns to it after moving away.

A market "rejects" a price when it:
- Moves away quickly.
- Produces a sharp reversal (wick).
- Fails to return.

**The wick on a candlestick is the visual mark of rejected price.** The body marks accepted price.

## Why trends start and stop

A trend begins when the market perceives current price as significantly unfair (undervalued = buyers dominate; overvalued = sellers dominate). A trend ends when the market reaches a new price area where two-sided trade can resume — a new "value area" forms, and the market balances.

## Using AMT as a framework

AMT doesn't give entries. It gives better questions:
- "Is this price being *accepted* (time + volume at level) or *probed* (quick in, quick out)?"
- "Are we in balance (range) or imbalance (trend) right now?"
- "Is this pullback a return-to-value move, or an early reversal?"

Better questions = better context = better trade decisions.

> **Sources:** Steidlmayer, J.P. & Koy, K. (1986), *Markets and Market Logic* — the original AMT text. Dalton, Jones & Dalton (1990), *Mind Over Markets*. Seidenberg, C. (2010), *The Handbook of Market Profile*, Marketplace Books.
`),

  L("pa-volume", "volume-as-context", "Volume as Context, Not Signal", "How volume confirms or weakens a price-action read — and the hierarchy: structure first, price action second, volume third.", 7, ["volume", "confirmation", "order-flow"], `
# Volume as Context, Not Signal

The most common volume mistake is treating it as a standalone signal. Volume is **context** — it weights a price-action observation; it does not replace it.

## What volume can confirm

**Breakout credibility:** a strong directional close through a key level on elevated volume is more credible than the same breakout in near-silence. Low-volume breakouts fail more frequently because fewer participants committed to the direction.

**Trend conviction:** in a healthy trend, impulse legs (in the trend direction) should ideally show more activity than the pullbacks. This is consistent with the dominant side having more participation.

**Exhaustion signal:** a large move accompanied by a climactic volume spike, immediately followed by a loss of momentum, may signal that all available buyers (or sellers) have entered. Nobody left to push further.

## What volume cannot do

- **Replace price-action confirmation.** A bullish volume spike at support means nothing if price immediately makes a lower low. Always wait for the price reaction.
- **Override fundamental change.** Trends can persist on "weak" volume for extended periods, especially in gold's trending environments.
- **Give a precise entry.** "Volume is elevated here" is an observation. The entry decision requires structure and trigger analysis.

## The practical hierarchy

When reading a chart, apply three layers:

1. **Structure** — where is price relative to key levels and market structure? (Primary)
2. **Price action** — what is price doing at those levels? (Primary)
3. **Volume** — does the volume context support the price-action read? (Confirmation)

If layers 1 and 2 give a clear picture and layer 3 aligns, confidence is higher. If layer 3 contradicts, pause. But layer 3 alone, without 1 and 2, is not a trade.

> **Sources:** Elder, A. (1993), *Trading for a Living*, Wiley — Chapter on volume interpretation. Wyckoff, R. (1930s), collected works — the original articulation of price-volume relationships.
`),

  L("pa-volume", "volume-delta", "Volume Delta & the Absorption Hypothesis", "What delta reveals about aggressive buying vs selling within a candle — and why this requires data most retail gold traders don't have.", 8, ["volume", "order-flow", "absorption"], `
# Volume Delta & the Absorption Hypothesis

Volume delta attempts to read *directionality* within a candle's volume — which side was the aggressor.

## What is Volume Delta?

In true centralized volume data (footprint charts, COMEX futures), each transaction can be classified:
- **Buyer-initiated (up-tick):** aggressive buyer hit the ask → bullish aggression.
- **Seller-initiated (down-tick):** aggressive seller hit the bid → bearish aggression.

**Volume Delta = Buy Volume − Sell Volume** for a given period.

Positive delta = more aggressive buying. Negative delta = more aggressive selling.

## The absorption case

The most powerful signal: **negative delta on a bullish candle.** Price went up, but more aggressive selling than buying occurred. This means passive buyers absorbed every sell order with their resting limit bids, keeping price from falling. This is buy absorption — potential accumulation at a support level.

Conversely, **positive delta on a bearish candle**: price fell despite aggressive buying. Passive sellers (limit orders above price) absorbed all buys, preventing a rise. Potential distribution.

These divergences between delta direction and candle direction are among the highest-quality signals in professional order-flow analysis.

## The critical limitation for retail gold traders

Footprint chart data requires tick-by-tick transaction records. This is:
- **Not available** on most retail spot-gold CFD platforms.
- Available on some platforms using COMEX gold futures data (Bookmap, Sierra Chart, etc.).
- **Not applicable** to broker tick volume, which doesn't distinguish buyer vs seller initiation.

If you're trading retail spot gold CFDs, you **cannot calculate true volume delta.**

## Why cover it here?

Understanding delta makes you a more sophisticated market reader. When you progress to COMEX futures or access footprint data, this framework applies immediately. And even now, the concept — that aggressive directional flow can decouple from price direction — refines how you think about absorption, candle bodies, and what price action alone can and cannot tell you.

File this under "I understand why this matters" and revisit when the tools are available.

> **Sources:** Volman, B. (2011), *Forex Price Action Scalping*, Self-published — practical footprint/delta usage. Bookmap educational resources (bookmap.com) — modern tools for order-flow analysis.
`),

  // ---------------------------------------------------------------- MULTI-TIMEFRAME ANALYSIS (new module)
  L("pa-mtf", "why-multiple-timeframes", "Why Multiple Timeframes?", "Different timeframes answer different questions — and using the wrong one for the wrong question is a silent source of most trading errors.", 7, ["timeframe", "higher-timeframe", "lower-timeframe", "top-down"], `
# Why Multiple Timeframes?

A chart is a question. Different timeframes answer different questions. The skill of multi-timeframe analysis is knowing which timeframe to ask which question.

## The hierarchy of questions

**Daily:** What is the macro swing structure? Where are the major levels that institutional participants reference? Is gold broadly bullish, bearish, or ranging over recent weeks?

**4-Hour:** What is the current trend within the larger picture? Where are the significant levels for this week? What is today's probable bias before it starts?

**1-Hour:** What is the intraday structure? Where are the key levels — today's session high/low, prior day reference, significant intraday swings?

**15-Minute:** Where is the precise entry zone? What is price doing at the level I'm watching? Where does a logical, tight stop sit?

**5-Minute:** What is the trigger candle? Where is the exact confirmation? (Used for precision, not narrative.)

## The fundamental rule

**Higher timeframes set context. Lower timeframes provide precision.**

Never trade a lower-timeframe signal that contradicts a clear higher-timeframe structure. A bullish engulfing on the 5m in the middle of a 4H downtrend is a fade opportunity, not a buy.

## What happens without multi-timeframe awareness

- A clean 15m uptrend is a pullback in a 4H downtrend — you just bought the high.
- A "strong" 5m breakout breaks a minor 5m level that the 1H shows is the middle of a range.
- A "perfect" setup on the 15m runs straight into massive 4H resistance you never checked.

Multi-timeframe awareness prevents these traps by ensuring your trade has the higher picture's support before it triggers on the lower.

## The two-timeframe minimum rule

For any entry, you should be able to answer:
1. What does the **higher** timeframe say about direction and context?
2. What does the **entry** timeframe say about timing and precision?

If you can only answer one, you're missing critical information.

> **Sources:** Murphy, J. (1999), *Technical Analysis of the Financial Markets*, NYIF — Chapter on multi-timeframe analysis. Investopedia — "Multiple Time Frames Can Multiply Returns" (Investopedia.com).
`),

  L("pa-mtf", "top-down-process-mtf", "The Top-Down Analysis Process", "A structured five-step routine for reading the market from the largest relevant timeframe down to your entry frame.", 8, ["timeframe", "top-down", "bias", "scenario"], `
# The Top-Down Analysis Process

Top-down analysis is a structured routine for reading the market from the highest relevant timeframe down to your entry frame — preventing tunnel vision and anchoring every trade in its proper context.

## The five-step process

### Step 1 — Daily: establish macro context
- Is the Daily chart in an uptrend (HH/HL), downtrend (LH/LL), or range?
- Where are the major Daily levels — prior week/month highs/lows, significant swing points?
- **This step tells you the overall direction filter.** It eliminates whole categories of trades.

### Step 2 — 4H: find current structure
- Within the Daily structure, what is the 4H doing?
- Where is price relative to its recent 4H swing points?
- Where are the significant 4H support/resistance zones?
- **This step tells you today's probable bias.**

### Step 3 — 1H: locate decision points
- What are the key intraday levels? Session highs/lows, prior day reference, significant 1H swings.
- **This step tells you where something is likely to happen today.**

### Step 4 — 15m/5m: build scenarios
- At each key level, write both scenarios: reaction and breakout.
- What trigger confirms each? What invalidates each?
- **This step converts context into actionable if-then plans.**

### Step 5 — Wait for the trigger
- Execute only when a pre-planned scenario fires.
- The setup comes to you. You do not chase.

## Why this order matters

Starting at the 5m is like reading a book by randomly opening pages. Starting at the Daily gives you the chapter; the 4H gives you the page; the 15m gives you the sentence. Without the chapter, the sentence makes no sense.

## Time requirement

Done properly: 15–30 minutes before London open, 5-minute update at NY open. Use the **Top-Down Analysis workspace** in this app to record your reads and build the discipline into a daily habit.

> **Sources:** Murphy (1999) as above. Schwager, J. (1993), *Market Wizards*, HarperCollins — multiple interviewed traders describe top-down routines.
`),

  L("pa-mtf", "conflicting-signals", "When Timeframes Conflict", "Three types of timeframe conflict and the hierarchy rule for resolving each — plus the one 'conflict' that is actually your best entry.", 8, ["timeframe", "higher-timeframe", "lower-timeframe", "bias"], `
# When Timeframes Conflict

Timeframes rarely all align perfectly. Knowing what to do when they disagree separates analysts who get paralysed from traders who act decisively.

## Type 1: HTF neutral, LTF has a clear setup

The Daily and 4H are ranging, but the 15m shows a clean breakout.

**Resolution:** treat it as lower-conviction, reduced-size. The lack of HTF confirmation means the setup has less tailwind. Target only a nearby LTF level, not a large HTF objective. If you miss it, you don't chase.

## Type 2: HTF trend opposes the LTF signal

4H is in a clear downtrend (LH/LL), but price is at a 15m support and "looks like a buy."

**Resolution:** generally skip it. Counter-trend setups at LTF levels have lower probability. To justify trading it, you need extraordinary confluence (major HTF support + very strong rejection) and significantly reduced size. Most of the time, pass.

## Type 3: HTF is bullish but price is at HTF resistance

Daily is trending up; price has reached a major Daily resistance zone; 4H is showing weakness at that resistance.

**Resolution:** this is not a true conflict — it's a normal tactical situation. The HTF trend tells you the overall direction; the resistance tells you to wait for either a breakout + retest (to rejoin the trend) or a deep pullback to HTF support. Short-term shorts at the resistance are tactical, counter-trend; approach them as small, time-limited plays only.

## The hierarchy rule

**Higher timeframe wins on direction; lower timeframe provides entry timing.**

When in doubt: do not override a clear HTF trend based on a LTF signal. Use the LTF to find the precise entry *within* the HTF direction.

## The productive "conflict"

The most powerful setup is actually an alignment that looks like a conflict: a HTF level combined with a LTF structural break. A 4H resistance zone + a 15m bearish structure forming at that zone. Use the HTF to define the *area*, the LTF to define the *trigger*. This is top-down execution at its best — not a conflict, but a two-level confirmation.
`),

  L("pa-mtf", "one-candle-many-stories", "One 4H Candle, Many 15m Stories", "Understanding that every higher-timeframe candle contains a full narrative on the lower timeframe — and how to use this for precise entries.", 8, ["timeframe", "candlestick", "entry"], `
# One 4H Candle, Many 15m Stories

This is one of the most practically useful insights in multi-timeframe analysis.

## The aggregation fact

A 4-hour candlestick contains exactly **sixteen 15-minute candles.** Both representations show the same price action — but they tell very different stories.

## A demonstration

Consider a 4H candle that closes slightly bullish with a moderate body and wicks on both sides. You might read it as: "indecision, mild buying."

Inside that same 4H candle, the 15m story might be:
- A sharp bearish drop for the first 45 minutes.
- Slow sideways consolidation for an hour.
- A strong recovery and new high for two hours.
- A small fade in the final 15 minutes.

That "indecision" 4H candle hides two strong directional moves that cancelled each other. The 15m trader who caught the recovery saw a clean uptrend. The 4H trader saw indecision.

## Why this matters for entries

You cannot time a precise entry on a 4H candle — by the time it closes, 4 hours have passed. But you can use the 4H candle's *context* (near resistance, shows rejection) to watch the 15m for a trigger *while the 4H is still forming.*

**The 4H gives you the destination. The 15m gives you the platform.**

## The practical process

1. On the 4H, identify you're near a key level and expect a potential reaction.
2. Drop to the 15m.
3. Watch for the 15m to form a structure break, rejection candle, or sweep that confirms the 4H expectation.
4. Enter on the 15m trigger with a stop that fits inside the 4H level's buffer.

Your entry is now precise, your stop tight relative to reward, and your trade aligned with both timeframes.

## The two-timeframe formula

- **4H/1H:** the *why* and the *where.*
- **15m/5m:** the *when* and the *exactly.*

Higher frame = conviction. Lower frame = precision.

> **Sources:** Williams, L. (1999), *Long-Term Secrets to Short-Term Trading*, Wiley — multi-timeframe entry refinement. Elder (1993) as above — the "triple screen" multi-timeframe system.
`),

  // ---------------------------------------------------------------- READING A FULL CHART (new module)
  L("pa-integration", "ten-questions", "The 10 Questions", "The ten specific questions a professional answers before any trading decision — making chart reading systematic, not impressionistic.", 10, ["scenario", "market-structure", "bias", "top-down"], `
# The 10 Questions

Before any trading decision, answer a specific set of questions. This lesson gives you those questions and what to look for in each answer. Applied consistently, they turn chart reading from an impressionistic exercise into a structured discipline.

## The 10 questions

**1. What is the current market structure?**
Uptrend (HH/HL), downtrend (LH/LL), or range? Answer on both 4H and 1H.

**2. Is the market trending or ranging?**
A market can show structure but be in transition. Is the structure *active and clean*, or is it churning with overlapping candles?

**3. Where are the important price levels?**
List the 2–4 most significant levels: session high/low, previous day high/low, a major HTF swing, a round number. These are your potential trade locations today.

**4. Where might liquidity be concentrated?**
Where are stops likely sitting? Above obvious swing highs, below obvious swing lows, beyond round numbers. These are potential sweep targets before the real move.

**5. What does recent candle behaviour reveal?**
In the last 5–10 candles: fading momentum? Rejection at a level? Acceptance? Breakout? Indecision before news?

**6. What does volume suggest, if reliable data is available?**
Is there volume confirmation? Any notable divergence? Apply appropriate scepticism (recall the volume module).

**7. What is the higher-timeframe context?**
Is the current 1H structure a continuation or a counter-move within the 4H? What would the 4H structure logically lead to from here?

**8. What are the plausible bullish and bearish scenarios?**
Write one of each at your key levels — each with a specific trigger, a stop, and a target.

**9. What would invalidate each scenario?**
Bullish: "invalid if price closes below X." Bearish: "invalid if price closes above Y." Pre-commit the invalidation before the session starts.

**10. Is the evidence sufficient to justify a trade, or should I wait?**
Be honest. Is there a real A+ setup, or are you searching for a reason to click? "No trade today" is a valid and professional outcome.

## Making this a habit

These 10 questions become automatic over time. You won't consciously list them — your mind will cover them organically. But the path to that automaticity requires deliberate, explicit practice every session. Use the **Top-Down Analysis workspace** to record your answers and build the habit.
`),

  L("pa-integration", "both-scenarios-always", "Both Scenarios, Always", "Why preparing both a bullish and a bearish plan before every session eliminates prediction pressure and kills confirmation bias.", 8, ["scenario", "bias", "confirmation-bias", "if-then"], `
# Both Scenarios, Always

Professionals never walk into a session with only one idea. They always have both a bullish and a bearish scenario — because the market decides which fires, not them.

## Why both scenarios?

**Confirmation bias is your biggest enemy as a chart reader.** Once you've decided gold is going up today, you'll find bullish signals everywhere and dismiss bearish ones. Preparing both scenarios forces you to take the opposing view seriously and prevents you from marrying your first read.

**Markets don't know your opinion.** Gold doesn't care that you believe it "should" reach 3,800. Your job is to react to what price actually does.

**One scenario = prediction. Two scenarios = preparation.** The difference is the gap between retail and professional.

## How to write both

At each key level:

**Bullish scenario:**
"IF price pulls back to [level] AND shows [trigger: rejection candle / sweep-and-reclaim / structural break upward], THEN I go long targeting [next resistance]. Invalid if [price closes below X]."

**Bearish scenario:**
"IF price pushes up to [level] AND shows [trigger: rejection / sweep-and-reclaim / structural break downward], THEN I go short targeting [next support]. Invalid if [price closes above Y]."

Both written. One fires (or neither does — you wait).

## When only one makes strong sense

When evidence strongly favours one direction (Daily + 4H both trending clearly, strong macro catalyst), keep the opposing scenario on paper but mark it "low confidence." You still want a plan if an unexpected development shifts the picture — even a low-confidence plan beats pure improvisation.

## The emotional benefit

When you have both scenarios, neither outcome feels like a failure. You had a plan for each. A loss was a scenario that fired — not an analytical failure. This is how composure is maintained through losing trades and the next setup is executed without emotional baggage.

## Exercise

Before your next market observation session, write a bullish and a bearish scenario for two key levels you identify. Include specific trigger, stop, and target for each. Notice how this exercise forces you to think clearly about what you actually believe vs. what the chart structure logically suggests.

> **Sources:** Douglas, M. (1990), *The Disciplined Trader*, NYIF — the core text on probabilistic thinking in trading.
`),

  L("pa-integration", "when-not-to-trade", "When Not to Trade", "The six conditions that should stop you from clicking — and why the ability to identify no-trade conditions is as valuable as finding entries.", 8, ["discipline", "routine", "risk-management", "psychology"], `
# When Not to Trade

The ability to identify no-trade conditions is equal in value to the ability to find entries. This lesson defines the conditions that should stop you from acting.

## Condition 1: No clear structure

If you cannot answer "is this an uptrend, downtrend, or range?" without hesitation — you don't have enough structure to trade. Trend tactics in a range, or range tactics in a trend, produce consistently poor results. Wait for structure to clarify.

## Condition 2: No confluence

A single reason to trade is rarely sufficient. "Price is at a round number" is an observation, not a setup. "Price is at a round number that aligns with a previous swing high, showing a bearish pin bar at the London open, in a 4H downtrend" — that's a setup. If you cannot identify two or three independent reasons, the setup likely doesn't meet the bar.

## Condition 3: High-impact news imminent

Within 15–30 minutes of a major release (CPI, NFP, FOMC), normal technical patterns become unreliable. Spreads widen, algorithms reposition, and price can move $20–$50 in seconds regardless of what the chart shows. The correct action: be flat, mark your levels, wait for structure to reform after the initial chaos settles.

## Condition 4: Daily loss limit hit

If you've pre-set a maximum daily loss (e.g. −2R or a fixed dollar amount) and reached it — stop. Your worst trading is almost always done while trying to recover. The daily limit exists precisely for this moment. Respect it every time, without negotiation.

## Condition 5: Choppy, overlapping price action

If the last 10–15 candles show overlapping bodies with wicks on both sides and no directional progress — you're in chop. There is no clean structure to trade. Only clean setups deserve capital.

## Condition 6: Your mind is off

If you're distracted, emotionally compromised (fresh big win or loss), tired, or rushed — execution quality drops. You'll see setups that aren't there, size them wrong, and move stops under pressure. The most honest action is to identify these states and not trade. One focused session is worth three distracted ones.

## The "no trade is a trade" reframe

Every session you correctly identify as a no-trade day is a session where you did not lose money. Over a full year, the sessions where you stayed out of bad conditions often contribute more to total P&L than sessions where you forced trades. The goal is not to be in the market. The goal is to be in the market only when the odds are clearly in your favour.

> **Sources:** Douglas (1990, 2000) — *The Disciplined Trader* and *Trading in the Zone*, both NYIF. Steenbarger (2009) as above — on psychological conditions affecting execution quality.
`),

  // ---------------------------------------------------------------- EXTRA STRATEGIES (existing)
  // The user's in-app "Top 20 Chart-Based Trading Strategies for Gold" set,
  // baked into the seed so it ships to every device/visitor (see extra-strategies.ts).
  ...extraStrategyLessons,
];

// A tiny quiz bank — extendable; keyed by lessonId.
export const seedQuizzes = [
  {
    id: "q-what-is-xauusd",
    lessonId: "what-is-xauusd",
    prompt: "XAU/USD at 3720.50 means:",
    options: [
      "One US dollar buys 3720.50 ounces of gold",
      "One troy ounce of gold costs 3720.50 US dollars",
      "Gold will rise to 3720.50",
      "The spread is 3720.50",
    ],
    correctIndex: 1,
    explanation: "XAU/USD is dollars per ounce — the market is quoting the price of one troy ounce of gold in USD.",
  },
  {
    id: "q-lots",
    lessonId: "lots-contract-size",
    prompt: "On 0.10 lots, how much is a $1.00 move in gold worth?",
    options: ["$1.00", "$10.00", "$100.00", "$0.10"],
    correctIndex: 1,
    explanation: "1 lot = 100 oz → $100 per $1 move. 0.10 lots = 10 oz → $10 per $1 move.",
  },
  {
    id: "q-sizing",
    lessonId: "sizing-formula",
    prompt: "Account $5,000, risk 1%, entry 3710, stop 3705. Correct size?",
    options: ["1.00 lot", "0.50 lot", "0.10 lot", "0.01 lot"],
    correctIndex: 2,
    explanation: "Risk $50; stop distance $5 → $500 risk/lot → 50/500 = 0.10 lots.",
  },
  {
    id: "q-rr",
    lessonId: "reward-to-risk",
    prompt: "A trader wins only 40% of the time but averages +3R on wins and −1R on losses. Their expectancy is:",
    options: ["Negative — they lose too often", "About +0.6R per trade (profitable)", "Exactly breakeven", "Impossible to know"],
    correctIndex: 1,
    explanation: "(0.4 × 3) − (0.6 × 1) = 1.2 − 0.6 = +0.6R. Reward-to-risk beats win rate.",
  },
  {
    id: "q-day-overview",
    lessonId: "day-overview",
    prompt: "For most of a professional gold trader's day, the correct action is usually to:",
    options: [
      "Be in a trade at all times to maximise opportunity",
      "Wait — most of the day is preparation and patience, and 'no trade' is a valid outcome",
      "Trade the quiet Asian session hardest",
      "Predict the day's close and hold to it",
    ],
    correctIndex: 1,
    explanation: "The job is prepare-then-wait. Most of the day is spent waiting for a planned scenario to trigger; no-trade is a professional outcome.",
  },
  {
    id: "q-premarket",
    lessonId: "premarket-prep",
    prompt: "Which is the highest-liquidity window most gold day traders focus on?",
    options: [
      "The Asian session",
      "The London / New York overlap (~13:00–17:00 GMT)",
      "The New York afternoon after London closes",
      "The Sunday futures open",
    ],
    correctIndex: 1,
    explanation: "The London/NY overlap has the deepest liquidity, tightest spreads and cleanest moves — roughly 70% of daily FX volume.",
  },
  {
    id: "q-exit-rr",
    lessonId: "managing-the-exit",
    prompt: "A widely-taught minimum reward-to-risk for a trade is:",
    options: ["1:1", "1:2 (with 1:3 considered ideal)", "3:1 against you", "It doesn't matter if win rate is high"],
    correctIndex: 1,
    explanation: "A common standard is a minimum 1:2 RR (1:3 ideal). A 1:2 setup only needs ~33% win rate to break even before costs.",
  },
  {
    id: "q-sweep",
    lessonId: "false-breakout-sweep",
    prompt: "Price spikes above an obvious swing high, then immediately closes back below it. This is most likely:",
    options: [
      "A confirmed breakout — chase the long",
      "A liquidity sweep / false breakout — watch for a short on the reclaim",
      "Irrelevant noise",
      "A guaranteed reversal — short immediately at the high",
    ],
    correctIndex: 1,
    explanation: "A poke through an obvious level that fails to hold is a classic sweep. Wait for the reclaim (close back inside) rather than chasing.",
  },
];
