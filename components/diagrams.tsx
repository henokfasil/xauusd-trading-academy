"use client";

// Schematic SVG diagrams for key trading concepts.
// All diagrams use the app's CSS variable color system and contain no real price data.

import React from "react";

const C = {
  bull:   "rgb(var(--bull))",
  bear:   "rgb(var(--bear))",
  fg:     "rgb(var(--fg))",
  muted:  "rgb(var(--muted))",
  subtle: "rgb(var(--subtle))",
  accent: "rgb(var(--accent))",
  border: "rgb(var(--border))",
  warn:   "rgb(var(--warn))",
};

function Frame({ title, caption, vb = "0 0 560 240", children }: {
  title: string; caption?: string; vb?: string; children: React.ReactNode;
}) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-elevated">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <span className="text-[9px] font-bold uppercase tracking-widest text-accent/80">Chart Diagram</span>
        <span className="text-xs text-muted">{title}</span>
      </div>
      <div className="px-4 pt-4 pb-3">
        <svg viewBox={vb} width="100%" style={{ display: "block" }}>
          <defs>
            <marker id="ah-acc" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill={C.accent} />
            </marker>
            <marker id="ah-bull" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill={C.bull} />
            </marker>
            <marker id="ah-bear" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill={C.bear} />
            </marker>
            <marker id="ah-muted" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill={C.muted} />
            </marker>
          </defs>
          {children}
        </svg>
        {caption && <p className="mt-2 text-center text-[11px] italic text-muted">{caption}</p>}
      </div>
    </div>
  );
}

// Single OHLC candle (higher price = smaller y value)
function Cv({ x, o, c, h, l, w = 16, bull }: {
  x: number; o: number; c: number; h: number; l: number; w?: number; bull: boolean;
}) {
  const col = bull ? C.bull : C.bear;
  const top = Math.min(o, c), ht = Math.max(Math.abs(c - o), 2);
  return (
    <g>
      <line x1={x} y1={h} x2={x} y2={l} stroke={col} strokeWidth={1.5} />
      <rect x={x - w / 2} y={top} width={w} height={ht} fill={col} rx={1.5} />
    </g>
  );
}

function DH({ y, x1 = 0, x2 = 560, col = C.border, dash = "5,4" }: {
  y: number; x1?: number; x2?: number; col?: string; dash?: string;
}) {
  return <line x1={x1} y1={y} x2={x2} y2={y} stroke={col} strokeWidth={1} strokeDasharray={dash} />;
}

function T({ x, y, s, a = "middle", sz = 10, col = C.muted, bold = false }: {
  x: number; y: number; s: string; a?: "middle" | "start" | "end";
  sz?: number; col?: string; bold?: boolean;
}) {
  return (
    <text x={x} y={y} textAnchor={a} fontSize={sz} fill={col}
      fontFamily="system-ui,sans-serif" fontWeight={bold ? 700 : 500}>
      {s}
    </text>
  );
}

function Arr({ x1, y1, x2, y2, mk = "ah-acc", sw = 1.5 }: {
  x1: number; y1: number; x2: number; y2: number; mk?: string; sw?: number;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={mk.includes("bull") ? C.bull : mk.includes("bear") ? C.bear : mk.includes("muted") ? C.muted : C.accent}
      strokeWidth={sw} markerEnd={`url(#${mk})`} />
  );
}

function ZoneRect({ y1, y2, x1 = 0, x2 = 560, col = C.accent, op = 0.13 }: {
  y1: number; y2: number; x1?: number; x2?: number; col?: string; op?: number;
}) {
  return <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill={col} fillOpacity={op} />;
}

// ── 1. Candlestick Anatomy ───────────────────────────────────────────────────

export function CandlestickAnatomy() {
  const cx = 280, w = 52;
  const h = 30, cl = 82, op = 182, l = 232;
  return (
    <Frame title="Candlestick anatomy — what each part records" vb="0 0 560 270"
      caption="Every candle records four prices: open, high, low, close — the complete story of the auction during that period.">
      <Cv x={cx} o={op} c={cl} h={h} l={l} w={w} bull />
      {/* Left: high + low */}
      <DH y={h} x2={cx - w / 2 - 6} col={C.fg} dash="4,3" />
      <T x={6} y={h + 4} s="HIGH" a="start" col={C.fg} bold sz={11} />
      <T x={6} y={h + 16} s="Highest price reached" a="start" sz={9} />
      <DH y={l} x2={cx - w / 2 - 6} col={C.fg} dash="4,3" />
      <T x={6} y={l + 4} s="LOW" a="start" col={C.fg} bold sz={11} />
      <T x={6} y={l + 16} s="Lowest price reached" a="start" sz={9} />
      {/* Right: close + open */}
      <DH y={cl} x1={cx + w / 2 + 6} x2={380} col={C.bull} dash="4,3" />
      <T x={386} y={cl + 4} s="CLOSE" a="start" col={C.bull} bold sz={11} />
      <T x={386} y={cl + 16} s="Last price (buyers won)" a="start" sz={9} />
      <DH y={op} x1={cx + w / 2 + 6} x2={380} col={C.fg} dash="4,3" />
      <T x={386} y={op + 4} s="OPEN" a="start" col={C.fg} bold sz={11} />
      <T x={386} y={op + 16} s="First price of the period" a="start" sz={9} />
      {/* Wick labels */}
      <T x={cx - w / 2 - 10} y={(h + cl) / 2 + 4} s="Upper wick" a="end" sz={9} />
      <T x={cx - w / 2 - 10} y={(op + l) / 2 + 4} s="Lower wick" a="end" sz={9} />
      {/* Body bracket */}
      <line x1={cx + w / 2 + 20} y1={cl} x2={cx + w / 2 + 20} y2={op} stroke={C.bull} strokeWidth={1.5} />
      <line x1={cx + w / 2 + 16} y1={cl} x2={cx + w / 2 + 24} y2={cl} stroke={C.bull} strokeWidth={1.5} />
      <line x1={cx + w / 2 + 16} y1={op} x2={cx + w / 2 + 24} y2={op} stroke={C.bull} strokeWidth={1.5} />
    </Frame>
  );
}

// ── 2. Bullish vs Bearish Candles ────────────────────────────────────────────

export function BullBearCandles() {
  return (
    <Frame title="Bullish vs bearish candles"
      caption="The close relative to the open decides the candle colour. Buyers vs sellers — who ended the period in control?">
      {/* Bull candle */}
      <Cv x={155} o={180} c={75} h={48} l={210} w={52} bull />
      <T x={155} y={36} s="BULLISH" bold col={C.bull} sz={12} />
      <T x={155} y={225} s="Close above open" col={C.bull} sz={10} />
      <T x={155} y={238} s="Buyers won the period" col={C.muted} sz={9} />
      {/* Bear candle */}
      <Cv x={405} o={75} c={180} h={48} l={210} w={52} bull={false} />
      <T x={405} y={36} s="BEARISH" bold col={C.bear} sz={12} />
      <T x={405} y={225} s="Close below open" col={C.bear} sz={10} />
      <T x={405} y={238} s="Sellers won the period" col={C.muted} sz={9} />
      {/* Divider */}
      <line x1={280} y1={20} x2={280} y2={220} stroke={C.border} strokeWidth={1} strokeDasharray="4,4" />
    </Frame>
  );
}

// ── 3. Pin Bar / Rejection Candle ────────────────────────────────────────────

export function PinBar() {
  return (
    <Frame title="Pin bar (rejection candle) — the wick is the evidence"
      caption="The wick records a failed attempt. Price went there, found no agreement to stay, and closed away. Location determines whether it matters.">
      {/* Support zone left */}
      <ZoneRect y1={185} y2={205} x1={30} x2={270} col={C.bull} op={0.1} />
      <T x={150} y={218} s="Support zone" col={C.bull} sz={9} />
      {/* Bullish pin bar */}
      <Cv x={150} o={185} c={178} h={175} l={220} w={20} bull />
      <Arr x1={150} y1={158} x2={150} y2={172} mk="ah-bull" />
      <T x={150} y={148} s="Bullish pin bar" col={C.bull} bold sz={10} />
      <T x={150} y={138} s="Long lower wick = buyers defended" col={C.muted} sz={9} />
      {/* Resistance zone right */}
      <ZoneRect y1={45} y2={65} x1={290} x2={530} col={C.bear} op={0.1} />
      <T x={410} y={38} s="Resistance zone" col={C.bear} sz={9} />
      {/* Bearish pin bar */}
      <Cv x={410} o={72} c={78} h={28} l={88} w={20} bull={false} />
      <Arr x1={410} y1={108} x2={410} y2={92} mk="ah-bear" />
      <T x={410} y={120} s="Bearish pin bar" col={C.bear} bold sz={10} />
      <T x={410} y={131} s="Long upper wick = sellers rejected" col={C.muted} sz={9} />
      <line x1={280} y1={20} x2={280} y2={220} stroke={C.border} strokeWidth={1} strokeDasharray="4,4" />
    </Frame>
  );
}

// ── 4. Market Structure ──────────────────────────────────────────────────────

export function MarketStructure() {
  // Uptrend path (left) and downtrend path (right) drawn as polylines
  const upPoints = [30, 195, 80, 140, 110, 158, 165, 95, 195, 115, 250, 52].join(",");
  const dnPoints = [310, 55, 360, 110, 390, 90, 445, 150, 475, 128, 530, 195].join(",");
  return (
    <Frame title="Market structure — the language of trend and reversal"
      caption="Structure is the sequence of swing highs and lows. It tells you who is in control — and when control changes.">
      {/* Uptrend */}
      <polyline points={upPoints} fill="none" stroke={C.bull} strokeWidth={2} strokeLinejoin="round" />
      <T x={30} y={208} s="HL₁" col={C.bull} sz={9} bold />
      <T x={80} y={132} s="HH₁" col={C.bull} sz={9} bold />
      <T x={110} y={172} s="HL₂" col={C.bull} sz={9} bold />
      <T x={165} y={87} s="HH₂" col={C.bull} sz={9} bold />
      <T x={195} y={128} s="HL₃" col={C.bull} sz={9} bold />
      <T x={250} y={44} s="HH₃" col={C.bull} sz={9} bold />
      <T x={140} y={228} s="UPTREND — Higher Highs + Higher Lows" col={C.bull} sz={10} bold />
      {/* Downtrend */}
      <polyline points={dnPoints} fill="none" stroke={C.bear} strokeWidth={2} strokeLinejoin="round" />
      <T x={310} y={47} s="LH₁" col={C.bear} sz={9} bold />
      <T x={360} y={122} s="LL₁" col={C.bear} sz={9} bold />
      <T x={390} y={82} s="LH₂" col={C.bear} sz={9} bold />
      <T x={445} y={162} s="LL₂" col={C.bear} sz={9} bold />
      <T x={475} y={120} s="LH₃" col={C.bear} sz={9} bold />
      <T x={530} y={206} s="LL₃" col={C.bear} sz={9} bold />
      <T x={420} y={228} s="DOWNTREND — Lower Highs + Lower Lows" col={C.bear} sz={10} bold />
      <line x1={280} y1={20} x2={280} y2={215} stroke={C.border} strokeWidth={1} strokeDasharray="4,4" />
    </Frame>
  );
}

// ── 5. Break of Structure ────────────────────────────────────────────────────

export function BreakOfStructure() {
  // Uptrend HH/HL then a lower low (BOS)
  const pts = [30, 195, 75, 145, 105, 162, 155, 102, 185, 120, 230, 68, 270, 90, 330, 168].join(",");
  return (
    <Frame title="Break of Structure (BOS) — when the trend shows its first crack"
      caption="A Break of Structure alone is a warning, not a confirmed reversal. Wait for further evidence — a lower high and another lower low — before changing bias.">
      <polyline points={pts} fill="none" stroke={C.bull} strokeWidth={2} strokeLinejoin="round" />
      <T x={30} y={208} s="HL" col={C.bull} sz={9} bold />
      <T x={75} y={137} s="HH" col={C.bull} sz={9} bold />
      <T x={105} y={175} s="HL" col={C.bull} sz={9} bold />
      <T x={155} y={94} s="HH" col={C.bull} sz={9} bold />
      <T x={185} y={113} s="HL" col={C.bull} sz={9} bold />
      <T x={230} y={60} s="HH" col={C.bull} sz={9} bold />
      {/* Last HL level as dashed line */}
      <DH y={90} x1={220} x2={380} col={C.warn} dash="5,4" />
      <T x={395} y={94} s="Last HL" a="start" col={C.warn} sz={9} />
      {/* BOS line and label */}
      <polyline points="270,90 330,168" fill="none" stroke={C.bear} strokeWidth={2} />
      <T x={335} y={172} s="LL" col={C.bear} sz={9} bold />
      <rect x={275} y={125} width={140} height={26} rx={4} fill={C.bear} fillOpacity={0.12} />
      <T x={345} y={142} s="⚠ Break of Structure" col={C.bear} sz={10} bold />
      <T x={345} y={205} s="Price broke below the last Higher Low" col={C.muted} sz={9} />
      <T x={345} y={217} s="Uptrend is under threat" col={C.muted} sz={9} />
    </Frame>
  );
}

// ── 6. Support & Resistance Zone ─────────────────────────────────────────────

export function SupportResistanceZone() {
  return (
    <Frame title="Support and resistance — zones of interest, not guaranteed turning points"
      caption="A level matters because memory and orders cluster there. It is a place to watch, not a guarantee. Always let price action at the level decide.">
      {/* Zone */}
      <ZoneRect y1={115} y2={135} col={C.accent} op={0.15} />
      <DH y={115} col={C.accent} dash="5,3" />
      <DH y={135} col={C.accent} dash="5,3" />
      <T x={555} y={122} s="Zone" a="end" col={C.accent} sz={9} bold />
      {/* 3 bounces from below */}
      {[[90, 160, 30, 130], [170, 158, 50, 120], [245, 155, 70, 122]].map(([x, low, high, bodyO], i) => (
        <g key={i}>
          <Cv x={x} o={bodyO} c={bodyO - 15} h={high} l={low} w={18} bull />
        </g>
      ))}
      {/* Price moves away after 3rd bounce */}
      <polyline points="245,78 290,65 330,58" fill="none" stroke={C.bull} strokeWidth={1.5} />
      {/* Break through */}
      <Cv x={360} o={125} c={88} h={85} l={140} w={18} bull={false} />
      <Cv x={385} o={105} c={68} h={65} l={108} w={18} bull={false} />
      {/* Retest from above (role reversal) */}
      <ZoneRect y1={115} y2={135} x1={400} x2={560} col={C.bear} op={0.12} />
      <Cv x={430} o={100} c={118} h={80} l={148} w={18} bull />
      <T x={430} y={162} s="Retest from above" col={C.bear} sz={9} />
      <T x={430} y={173} s="Old support → resistance" col={C.bear} sz={9} bold />
      {/* Labels */}
      <T x={210} y={202} s="← Support: 3 bounces" col={C.bull} sz={9} />
      <T x={360} y={202} s="Break" col={C.muted} sz={9} />
    </Frame>
  );
}

// ── 7. Breakout & Retest ─────────────────────────────────────────────────────

export function BreakoutRetest() {
  return (
    <Frame title="Breakout and retest — the professional continuation entry"
      caption="The retest is the market confirming the breakout was real. You give up some of the move but gain a logical stop and higher win rate."
      vb="0 0 560 260">
      {/* Resistance zone */}
      <ZoneRect y1={90} y2={108} col={C.accent} op={0.15} />
      <DH y={90} col={C.accent} dash="5,3" />
      <DH y={108} col={C.accent} dash="5,3" />
      <T x={10} y={86} s="Resistance zone" a="start" col={C.accent} sz={9} bold />
      {/* Approaches (3 rejects) */}
      <Cv x={60}  o={165} c={130} h={105} l={180} w={16} bull />
      <Cv x={85}  o={140} c={155} h={125} l={162} w={16} bull={false} />
      <Cv x={130} o={160} c={115} h={108} l={175} w={16} bull />
      <Cv x={155} o={125} c={140} h={110} l={148} w={16} bull={false} />
      {/* Breakout candle */}
      <Cv x={210} o={130} c={62} h={55} l={138} w={18} bull />
      <T x={210} y={48} s="Breakout" col={C.bull} sz={9} bold />
      {/* Pullback */}
      <Cv x={245} o={68}  c={82}  h={60}  l={88}  w={16} bull={false} />
      <Cv x={268} o={75}  c={88}  h={70}  l={95}  w={16} bull={false} />
      <Cv x={290} o={82}  c={95}  h={76}  l={100} w={16} bull={false} />
      <T x={268} y={112} s="Pullback to zone" col={C.muted} sz={9} />
      {/* Rejection at retest */}
      <Cv x={315} o={95} c={82} h={78} l={115} w={18} bull />
      <T x={315} y={128} s="Rejection" col={C.bull} sz={9} bold />
      <T x={315} y={140} s="(stop below wick)" col={C.muted} sz={9} />
      {/* Continuation */}
      <polyline points="324,82 360,65 400,48 440,38" fill="none" stroke={C.bull} strokeWidth={2} strokeDasharray="6,3" />
      <T x={450} y={42} s="→ Target" a="start" col={C.bull} sz={9} bold />
      {/* Entry arrow */}
      <Arr x1={315} y1={155} x2={315} y2={90} mk="ah-bull" />
      <T x={315} y={168} s="Entry on rejection" col={C.accent} sz={10} bold />
    </Frame>
  );
}

// ── 8. Liquidity Sweep ───────────────────────────────────────────────────────

export function LiquiditySweep() {
  return (
    <Frame title="Liquidity sweep — the spike, the close back, and the reversal"
      caption="The wick pierced the level; the close tells the real story. Once the stops are triggered and the opposing orders absorbed, the path reverses."
      vb="0 0 560 270">
      {/* Swing high level */}
      <DH y={88} col={C.warn} dash="6,3" />
      <T x={10} y={83} s="Swing high (stops above)" a="start" col={C.warn} sz={9} bold />
      {/* Stop markers */}
      {[320, 340, 358, 376, 394].map(x => (
        <circle key={x} cx={x} cy={76} r={3} fill={C.bear} fillOpacity={0.7} />
      ))}
      <T x={355} y={68} s="Stop cluster" col={C.bear} sz={9} />
      {/* Consolidation candles below the level */}
      <Cv x={60}  o={148} c={132} h={118} l={160} w={14} bull />
      <Cv x={82}  o={130} c={142} h={120} l={152} w={14} bull={false} />
      <Cv x={104} o={140} c={128} h={116} l={152} w={14} bull />
      <Cv x={126} o={132} c={138} h={118} l={150} w={14} bull={false} />
      <Cv x={148} o={136} c={126} h={114} l={148} w={14} bull />
      <Cv x={170} o={130} c={140} h={116} l={152} w={14} bull={false} />
      {/* The sweep candle — wick pierces above level, closes below */}
      <Cv x={220} o={140} c={130} h={52} l={152} w={20} bull={false} />
      <rect x={195} y={118} width={50} height={35} rx={4} fill={C.bear} fillOpacity={0.12} />
      <T x={220} y={166} s="Sweep candle" col={C.bear} sz={9} bold />
      <T x={220} y={177} s="Wick above level" col={C.bear} sz={9} />
      <T x={220} y={188} s="Close BACK below" col={C.bear} sz={9} />
      {/* Arrow pointing to wick */}
      <Arr x1={280} y1={65} x2={232} y2={62} mk="ah-bear" />
      <T x={295} y={68} s="Stops triggered here" a="start" col={C.bear} sz={9} bold />
      {/* Reversal candles */}
      <Cv x={268} o={128} c={148} h={122} l={158} w={16} bull={false} />
      <Cv x={292} o={148} c={172} h={140} l={182} w={16} bull={false} />
      <Cv x={316} o={168} c={195} h={160} l={205} w={18} bull={false} />
      <Cv x={342} o={192} c={215} h={185} l={225} w={18} bull={false} />
      <Cv x={370} o={210} c={232} h={202} l={240} w={18} bull={false} />
      <T x={335} y={255} s="Reversal — trapped longs exit, accelerating the move" col={C.muted} sz={9} />
      {/* Entry annotation */}
      <Arr x1={256} y1={205} x2={256} y2={162} mk="ah-acc" />
      <T x={256} y={218} s="Entry: reclaim below level" col={C.accent} sz={10} bold />
    </Frame>
  );
}

// ── 9. Impulse & Pullback ────────────────────────────────────────────────────

export function ImpulsePullback() {
  return (
    <Frame title="Impulse and pullback — the two-stroke engine of every trend"
      caption="Entering on the pullback, not the impulse, gives a better price, a tighter stop, and aligns you with the dominant flow — not against it.">
      {/* Three cycles */}
      {/* Cycle 1 impulse */}
      {[40, 62, 84, 106].map((x, i) => <Cv key={x} x={x} o={200 - i * 12} c={185 - i * 15} h={168 - i * 14} l={205 - i * 8} w={16} bull />)}
      {/* Cycle 1 pullback */}
      {[130, 150, 170].map((x, i) => <Cv key={x} x={x} o={142 + i * 6} c={148 + i * 6} h={138 + i * 4} l={155 + i * 6} w={14} bull={false} />)}
      {/* Cycle 2 impulse */}
      {[198, 220, 242, 264].map((x, i) => <Cv key={x} x={x} o={162 - i * 12} c={148 - i * 14} h={132 - i * 14} l={168 - i * 8} w={16} bull />)}
      {/* Cycle 2 pullback */}
      {[292, 312, 332].map((x, i) => <Cv key={x} x={x} o={104 + i * 6} c={110 + i * 6} h={100 + i * 4} l={116 + i * 6} w={14} bull={false} />)}
      {/* Cycle 3 impulse */}
      {[360, 382, 404, 426].map((x, i) => <Cv key={x} x={x} o={124 - i * 12} c={110 - i * 14} h={94 - i * 14} l={130 - i * 8} w={16} bull />)}
      {/* Labels */}
      <T x={74}  y={225} s="Impulse" col={C.bull} sz={9} bold />
      <T x={150} y={225} s="Pullback" col={C.muted} sz={9} />
      <T x={230} y={225} s="Impulse" col={C.bull} sz={9} bold />
      <T x={312} y={225} s="Pullback" col={C.muted} sz={9} />
      <T x={392} y={225} s="Impulse" col={C.bull} sz={9} bold />
      {/* Buy here arrows */}
      <Arr x1={150} y1={210} x2={150} y2={175} mk="ah-acc" />
      <Arr x1={312} y1={210} x2={312} y2={138} mk="ah-acc" />
      <T x={205} y={215} s="← Enter on the pullback, not the impulse" col={C.accent} sz={9} bold />
    </Frame>
  );
}

// ── 10. Doji Types ───────────────────────────────────────────────────────────

export function DojiTypes() {
  return (
    <Frame title="Doji candles — the auction ended where it began"
      caption="A doji alone is a question mark. The candle that follows it provides the answer. Context (level? trend? news?) determines whether the question matters.">
      {/* Standard doji */}
      <Cv x={120} o={122} c={118} h={60} l={180} w={4} bull />
      <T x={120} y={48} s="Standard" col={C.fg} sz={10} bold />
      <T x={120} y={196} s="Equal wicks" col={C.muted} sz={9} />
      <T x={120} y={207} s="Pure indecision" col={C.muted} sz={9} />
      {/* Dragonfly doji */}
      <Cv x={280} o={90} c={88} h={86} l={195} w={4} bull />
      <T x={280} y={72} s="Dragonfly" col={C.bull} sz={10} bold />
      <T x={280} y={212} s="Long lower wick" col={C.bull} sz={9} />
      <T x={280} y={223} s="Buyers recovered fully" col={C.muted} sz={9} />
      {/* Gravestone doji */}
      <Cv x={440} o={155} c={153} h={55} l={158} w={4} bull={false} />
      <T x={440} y={42} s="Gravestone" col={C.bear} sz={10} bold />
      <T x={440} y={175} s="Long upper wick" col={C.bear} sz={9} />
      <T x={440} y={186} s="Sellers pushed back" col={C.muted} sz={9} />
      <line x1={186} y1={20} x2={186} y2={230} stroke={C.border} strokeWidth={1} strokeDasharray="4,4" />
      <line x1={358} y1={20} x2={358} y2={230} stroke={C.border} strokeWidth={1} strokeDasharray="4,4" />
    </Frame>
  );
}

// ── 11. Engulfing Candles ────────────────────────────────────────────────────

export function EngulfingCandles() {
  return (
    <Frame title="Engulfing candles — one side completely reversed the other"
      caption="Engulfing means the body of the second candle covers the body of the first. The new side didn't just match the prior move — they erased it.">
      {/* Bullish engulfing */}
      <Cv x={140} o={105} c={140} h={98}  l={148} w={18} bull={false} />
      <Cv x={175} o={150} c={88}  h={82}  l={158} w={28} bull />
      <T x={157} y={72} s="BULLISH ENGULFING" col={C.bull} sz={10} bold />
      <T x={157} y={172} s="Large green body" col={C.bull} sz={9} />
      <T x={157} y={183} s="fully covers the red body" col={C.muted} sz={9} />
      <T x={157} y={225} s="Sellers lost; buyers took over" col={C.bull} sz={10} />
      {/* Bearish engulfing */}
      <Cv x={385} o={140} c={105} h={98}  l={148} w={18} bull />
      <Cv x={420} o={88}  c={150} h={82}  l={158} w={28} bull={false} />
      <T x={402} y={72} s="BEARISH ENGULFING" col={C.bear} sz={10} bold />
      <T x={402} y={172} s="Large red body" col={C.bear} sz={9} />
      <T x={402} y={183} s="fully covers the green body" col={C.muted} sz={9} />
      <T x={402} y={225} s="Buyers lost; sellers took over" col={C.bear} sz={10} />
      <line x1={280} y1={20} x2={280} y2={230} stroke={C.border} strokeWidth={1} strokeDasharray="4,4" />
    </Frame>
  );
}

// ── 12. Inside & Outside Bars ────────────────────────────────────────────────

export function InsideOutsideBar() {
  return (
    <Frame title="Inside bar and outside bar — compression vs expansion"
      caption="The inside bar coils energy; the mother bar's range becomes the trigger. The outside bar expanded both extremes — no winner, volatile indecision.">
      {/* Inside bar: mother on left, inside on right */}
      <T x={140} y={32} s="INSIDE BAR" col={C.accent} sz={11} bold />
      <Cv x={115} o={172} c={68}  h={55}  l={185} w={30} bull />
      <T x={115} y={205} s="Mother bar" col={C.muted} sz={9} />
      <Cv x={165} o={148} c={98}  h={88}  l={162} w={20} bull={false} />
      <T x={165} y={205} s="Inside bar" col={C.muted} sz={9} />
      <rect x={154} y={82} width={22} height={72} fill="none" stroke={C.accent} strokeWidth={1} strokeDasharray="3,3" rx={2} />
      <T x={140} y={225} s="Contained within mother" col={C.muted} sz={9} />
      {/* Divider */}
      <line x1={280} y1={20} x2={280} y2={235} stroke={C.border} strokeWidth={1} strokeDasharray="4,4" />
      {/* Outside bar */}
      <T x={400} y={32} s="OUTSIDE BAR" col={C.warn} sz={11} bold />
      <Cv x={365} o={148} c={98}  h={88}  l={162} w={20} bull />
      <T x={365} y={205} s="Prior bar" col={C.muted} sz={9} />
      <Cv x={415} o={152} c={88}  h={58}  l={188} w={30} bull={false} />
      <T x={415} y={205} s="Outside bar" col={C.muted} sz={9} />
      <T x={400} y={225} s="Exceeds both high and low" col={C.muted} sz={9} />
    </Frame>
  );
}

// ── 13. Stop Clusters ────────────────────────────────────────────────────────

export function StopClusters() {
  return (
    <Frame title="Stop-loss clusters — where resting orders concentrate"
      caption="Because thousands of traders read the same chart with the same logic, their stops pile up at the same places. These clusters attract price." vb="0 0 560 260">
      {/* Downtrend context */}
      <polyline points="30,45 85,90 115,72 170,128 205,108 260,162 295,140 350,195"
        fill="none" stroke={C.bear} strokeWidth={1.5} />
      {/* Mark swing lows with stop dots */}
      {[[85, 90], [170, 128], [260, 162]].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={4} fill={C.bull} fillOpacity={0.7} />
          {/* Stop dots below */}
          {[-8, 0, 8].map(dx => (
            <circle key={dx} cx={x + dx} cy={y + 14} r={2.5} fill={C.bear} fillOpacity={0.6} />
          ))}
          <T x={x} y={y + 28} s="Stops below" col={C.bear} sz={8} />
        </g>
      ))}
      {/* Sweep arrow */}
      <Arr x1={350} y1={200} x2={350} y2={218} mk="ah-bear" sw={2} />
      <Cv x={390} o={192} c={215} h={185} l={240} w={20} bull={false} />
      <T x={390} y={254} s="Sweep" col={C.bear} sz={9} bold />
      {/* Explanation boxes */}
      <rect x={400} y={60} width={148} height={72} rx={5} fill={C.border} fillOpacity={0.3} />
      <T x={474} y={78} s="Stops sit below" col={C.fg} sz={9} bold />
      <T x={474} y={91} s="swing lows because" col={C.muted} sz={9} />
      <T x={474} y={104} s="longs put their stop" col={C.muted} sz={9} />
      <T x={474} y={117} s="just under support" col={C.muted} sz={9} />
    </Frame>
  );
}

// ── 14. Session Ranges ───────────────────────────────────────────────────────

export function SessionRanges() {
  return (
    <Frame title="Trading sessions — gold has a different personality every few hours" vb="0 0 560 220"
      caption="The same technical setup can produce very different results depending on which session is active. Liquidity changes everything.">
      {/* Timeline base */}
      <line x1={20} y1={130} x2={540} y2={130} stroke={C.border} strokeWidth={1.5} />
      {/* Session bands */}
      {/* Asia: x 20-170 */}
      <rect x={20} y={108} width={150} height={22} rx={3} fill={C.accent} fillOpacity={0.1} />
      <T x={95} y={124} s="ASIA" col={C.accent} sz={9} bold />
      <T x={95} y={105} s="00:00 – 08:00 GMT" col={C.muted} sz={8} />
      {/* London: x 170-360 */}
      <rect x={170} y={104} width={190} height={26} rx={3} fill={C.bull} fillOpacity={0.12} />
      <T x={265} y={122} s="LONDON" col={C.bull} sz={9} bold />
      <T x={265} y={101} s="08:00 – 16:00 GMT" col={C.muted} sz={8} />
      {/* NY/London overlap: x 310-390 */}
      <rect x={308} y={98} width={110} height={35} rx={3} fill={C.accent} fillOpacity={0.2} />
      <T x={363} y={119} s="OVERLAP" col={C.accent} sz={9} bold />
      <T x={363} y={94} s="13:00-16:00" col={C.accent} sz={8} bold />
      {/* NY: x 308-520 */}
      <rect x={308} y={133} width={210} height={20} rx={3} fill={C.warn} fillOpacity={0.1} />
      <T x={413} y={148} s="NEW YORK  13:00 – 21:00 GMT" col={C.warn} sz={9} bold />
      {/* Typical gold price path */}
      <polyline points="20,165 95,162 100,168 160,165 175,145 230,130 265,118 310,105 363,95 400,110 450,118 510,125 535,122"
        fill="none" stroke={C.fg} strokeWidth={1.5} />
      {/* Volatility arrows */}
      <T x={95} y={182} s="Quiet (range)" col={C.muted} sz={8} />
      <T x={265} y={182} s="Active (expand)" col={C.bull} sz={8} />
      <T x={363} y={182} s="Most active" col={C.accent} sz={8} bold />
      <T x={460} y={182} s="Fades" col={C.muted} sz={8} />
    </Frame>
  );
}

// ── 15. Volume Profile ───────────────────────────────────────────────────────

export function VolumeProfileDiagram() {
  // Horizontal volume bars, price on y-axis
  const bars = [
    { y: 35,  vol: 60,  label: "LVN — price passed through fast" },
    { y: 55,  vol: 105 },
    { y: 75,  vol: 140 },
    { y: 95,  vol: 175, label: "HVN — accepted area" },
    { y: 115, vol: 210, isPOC: true },
    { y: 135, vol: 190, label: "← POC" },
    { y: 155, vol: 160, label: "Value Area" },
    { y: 175, vol: 125 },
    { y: 195, vol: 70 },
    { y: 215, vol: 45,  label: "LVN — fast transit" },
  ];
  const maxVol = 210;
  const barScale = 200 / maxVol;
  return (
    <Frame title="Volume Profile — how much activity traded at each price level" vb="0 0 560 265"
      caption="The POC is where the most trade occurred — the market's best estimate of fair value for the period. LVNs are fast-transit zones; price tends to move through them quickly.">
      {/* Price axis */}
      <line x1={55} y1={25} x2={55} y2={235} stroke={C.border} strokeWidth={1.5} />
      <T x={28} y={35} s="Higher" col={C.muted} sz={8} />
      <T x={28} y={225} s="Lower" col={C.muted} sz={8} />
      {/* Volume bars */}
      {bars.map(({ y, vol, isPOC, label }) => (
        <g key={y}>
          <rect x={57} y={y - 7} width={vol * barScale} height={14}
            fill={isPOC ? C.accent : C.fg} fillOpacity={isPOC ? 0.7 : 0.2} rx={2} />
          {isPOC && <T x={57 + vol * barScale + 6} y={y + 4} s="POC — Point of Control" a="start" col={C.accent} sz={9} bold />}
        </g>
      ))}
      {/* VAH / VAL lines */}
      <DH y={83} x1={55} x2={420} col={C.warn} dash="6,3" />
      <T x={422} y={87} s="VAH (Value Area High)" a="start" col={C.warn} sz={9} />
      <DH y={167} x1={55} x2={420} col={C.warn} dash="6,3" />
      <T x={422} y={171} s="VAL (Value Area Low)" a="start" col={C.warn} sz={9} />
      {/* Value area bracket */}
      <line x1={47} y1={83} x2={47} y2={167} stroke={C.warn} strokeWidth={1.5} />
      <T x={12} y={130} s="VA" col={C.warn} sz={9} bold />
      {/* LVN labels */}
      <T x={130} y={50} s="LVN" col={C.muted} sz={8} bold />
      <T x={130} y={228} s="LVN" col={C.muted} sz={8} bold />
    </Frame>
  );
}

// ── 16. Multi-Timeframe ──────────────────────────────────────────────────────

export function MultiTimeframeDiagram() {
  return (
    <Frame title="One 4H candle — many 15m stories inside" vb="0 0 560 265"
      caption="The 4H candle is the aggregate of 16 fifteen-minute candles. Use the 4H for context and direction; drop to 15m for precise entry and stop placement.">
      {/* Left: 4H single candle */}
      <T x={100} y={30} s="4-HOUR CHART" col={C.fg} sz={11} bold />
      <T x={100} y={44} s="(What the 4H trader sees)" col={C.muted} sz={9} />
      <Cv x={100} o={195} c={70} h={52} l={210} w={56} bull />
      <T x={100} y={230} s="One candle — 4 hours" col={C.muted} sz={9} />
      {/* Arrow connecting */}
      <Arr x1={165} y1={130} x2={220} y2={130} mk="ah-acc" sw={2} />
      <T x={192} y={122} s="zoom in" col={C.accent} sz={9} />
      {/* Right: 16 × 15m candles */}
      <T x={390} y={30} s="15-MINUTE CHART" col={C.fg} sz={11} bold />
      <T x={390} y={44} s="(What the 15m trader sees)" col={C.muted} sz={9} />
      {/* 16 small candles, same net move but with variance */}
      {([
        [238, 200, 185, 195, 205, false],
        [255, 185, 170, 182, 192, false],
        [272, 175, 162, 168, 182, false],
        [289, 170, 158, 165, 175, false],
        [306, 162, 155, 160, 168, false],
        [323, 158, 148, 152, 164, false],
        [340, 152, 162, 145, 168, true],
        [357, 165, 152, 160, 170, true],
        [374, 155, 142, 148, 160, false],
        [391, 142, 130, 138, 148, false],
        [408, 132, 118, 126, 138, false],
        [425, 120, 108, 116, 126, false],
        [442, 110, 98,  106, 116, false],
        [459, 100, 88,  96,  106, false],
        [476, 90,  78,  86,  96,  false],
        [493, 80,  68,  74,  86,  false],
      ] as [number,number,number,number,number,boolean][]).map(([x, o, c, h, l, bear]) => (
        <Cv key={x} x={x} o={o} c={c} h={h} l={l} w={12} bull={!bear} />
      ))}
      <T x={390} y={230} s="16 candles — same 4 hours" col={C.muted} sz={9} />
      {/* Same range bracket */}
      <DH y={68} x1={60} x2={510} col={C.border} dash="3,4" />
      <DH y={210} x1={60} x2={510} col={C.border} dash="3,4" />
    </Frame>
  );
}

// ── Lesson → Diagrams map ─────────────────────────────────────────────────────

export type DiagramComponent = React.ComponentType;

export const LESSON_DIAGRAMS: Record<string, DiagramComponent[]> = {
  // Foundations
  "how-markets-work":          [CandlestickAnatomy],
  // Chart Reading
  "candlesticks":               [CandlestickAnatomy, BullBearCandles],
  "ohlc":                       [CandlestickAnatomy],
  "inside-outside-bars":        [InsideOutsideBar],
  "engulfing-pin-bars":         [EngulfingCandles, PinBar],
  "doji-indecision":            [DojiTypes],
  "candle-sequences":           [ImpulsePullback],
  // Market Structure
  "swing-points":               [MarketStructure],
  "market-structure":           [MarketStructure, BreakOfStructure],
  "trend-range-momentum":       [MarketStructure],
  // Key Levels
  "support-resistance":         [SupportResistanceZone],
  "zones-vs-lines":             [SupportResistanceZone],
  "reference-levels":           [SupportResistanceZone],
  // Price Behavior at Levels
  "impulse-pullback":           [ImpulsePullback],
  "highs-lows-recap":           [MarketStructure],
  "breakout-retest":            [BreakoutRetest],
  "false-breakout-sweep":       [LiquiditySweep],
  "rejection":                  [PinBar],
  // Liquidity
  "stop-clusters":              [StopClusters],
  "liquidity-sweeps-mechanics": [LiquiditySweep],
  "what-is-liquidity":          [StopClusters],
  "absorption-order-flow":      [LiquiditySweep],
  // Volume
  "volume-profile-basics":      [VolumeProfileDiagram],
  "auction-market-theory":      [VolumeProfileDiagram],
  // Sessions
  "why-sessions-matter":        [SessionRanges],
  "asia-session":               [SessionRanges],
  "london-session":             [SessionRanges],
  "ny-session-overlap":         [SessionRanges],
  // MTF
  "why-multiple-timeframes":    [MultiTimeframeDiagram],
  "one-candle-many-stories":    [MultiTimeframeDiagram],
  "top-down-process-mtf":       [MultiTimeframeDiagram],
  // Integration
  "both-scenarios-always":      [BreakoutRetest, LiquiditySweep],
  "ten-questions":              [MarketStructure, SupportResistanceZone],
};
