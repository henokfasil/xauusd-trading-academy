import { Module, Lesson } from "@/lib/types";

// ---------------------------------------------------------------------------
// Seed curriculum. This is the DEFAULT content the app loads on first run.
// After first load everything lives in local storage and is fully editable.
// Content is intentionally structured so a coding LLM can rewrite a single
// lesson body without touching the rest of the app.
// ---------------------------------------------------------------------------

export const modules: Module[] = [
  { id: "foundations", title: "Foundations", blurb: "The vocabulary and mechanics every trade rests on. Assume nothing.", order: 1, icon: "BookOpen" },
  { id: "chart-reading", title: "Chart Reading", blurb: "Turn a wall of candles into structure you can reason about.", order: 2, icon: "CandlestickChart" },
  { id: "key-levels", title: "Key Levels", blurb: "Where price is likely to react — and why zones beat exact lines.", order: 3, icon: "Ruler" },
  { id: "sessions", title: "Trading Sessions", blurb: "Gold behaves differently across Asia, London and New York.", order: 4, icon: "Clock" },
  { id: "fundamentals", title: "Gold Fundamentals", blurb: "The macro forces that move XAU/USD over days and hours.", order: 5, icon: "Landmark" },
  { id: "price-action", title: "Price Action", blurb: "Read intent from price: rejection, breakout, retest, sweep.", order: 6, icon: "Activity" },
  { id: "scenarios", title: "Trade Scenarios", blurb: "Convert analysis into conditional 'if-then' hypotheses.", order: 7, icon: "GitBranch" },
  { id: "entries", title: "Entry Models", blurb: "Precise, repeatable triggers instead of gut clicks.", order: 8, icon: "Crosshair" },
  { id: "stops", title: "Stops & Invalidation", blurb: "Define where you are wrong before you enter.", order: 9, icon: "ShieldAlert" },
  { id: "sizing", title: "Position Sizing", blurb: "The single most important survival skill.", order: 10, icon: "Scale" },
  { id: "rr", title: "Risk / Reward", blurb: "Why expectancy — not win rate — pays you.", order: 11, icon: "TrendingUp" },
  { id: "management", title: "Trade Management", blurb: "What to do after you are in the trade.", order: 12, icon: "Settings2" },
  { id: "routine", title: "Daily Routine", blurb: "The repeatable process professionals run every day.", order: 13, icon: "ListChecks" },
  { id: "psychology", title: "Trading Psychology", blurb: "Manage the one variable you can't chart: you.", order: 14, icon: "Brain" },
  { id: "calendar", title: "Economic Calendar", blurb: "Plan around CPI, FOMC and NFP instead of being ambushed.", order: 15, icon: "CalendarClock" },
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
