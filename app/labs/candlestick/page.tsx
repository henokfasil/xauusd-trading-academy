"use client";

import { useMemo, useState } from "react";
import { Card, Button, Icon, PageHeader, Badge } from "@/components/ui";

interface Candle {
  o: number; h: number; l: number; c: number;
}

// A gallery of candles at different "locations" with teaching notes.
interface CandleCase {
  id: string;
  candle: Candle;
  location: string;
  context: string;
  rejectedSide: "buyers" | "sellers" | "none";
  justifiesEntry: boolean;
  teaching: string;
}

const CASES: CandleCase[] = [
  {
    id: "reject-support", candle: { o: 3712, h: 3714, l: 3702, c: 3713 },
    location: "At a key support zone (3705–3710), higher timeframe bullish",
    context: "Price sold into established support during a HTF uptrend.",
    rejectedSide: "sellers", justifiesEntry: true,
    teaching: "Long lower wick INTO support in an uptrend: sellers pushed down to 3702 and were overwhelmed — buyers reclaimed and closed near the high. This is a bullish rejection AT A MEANINGFUL LOCATION, so it's a high-quality trigger.",
  },
  {
    id: "reject-nowhere", candle: { o: 3722, h: 3724, l: 3712, c: 3723 },
    location: "Middle of a range, no nearby level",
    context: "The identical candle shape, but floating in no-man's-land.",
    rejectedSide: "sellers", justifiesEntry: false,
    teaching: "SAME long-lower-wick shape, but here there's no level and no context. Sellers were rejected, yes — but a rejection of nothing means almost nothing. Location is what turns a candle into a signal.",
  },
  {
    id: "reject-resistance", candle: { o: 3738, h: 3748, l: 3737, c: 3739 },
    location: "At resistance (yesterday's high 3740)",
    context: "Price rallied into resistance and stalled.",
    rejectedSide: "buyers", justifiesEntry: true,
    teaching: "Long UPPER wick at resistance: buyers pushed to 3748 and were slammed back to close near the low. Sellers defended the level — a bearish rejection at a meaningful location, a valid short trigger (with the rest of your plan).",
  },
  {
    id: "big-bull", candle: { o: 3700, h: 3719, l: 3699, c: 3718 },
    location: "Breaking out of consolidation on the London open",
    context: "A large-bodied candle with small wicks.",
    rejectedSide: "none", justifiesEntry: false,
    teaching: "A big body, tiny wicks = strong momentum / conviction. But this is the IMPULSE — entering here means chasing, with a far-away stop. Note the strength for direction, then wait for the pullback rather than buying the extended candle.",
  },
  {
    id: "doji-news", candle: { o: 3725, h: 3735, l: 3715, c: 3726 },
    location: "During a CPI release",
    context: "Huge range, tiny body, wicks both sides.",
    rejectedSide: "none", justifiesEntry: false,
    teaching: "Both sides fought violently and neither won (indecision). During news the spread and slippage are brutal. Neither buyers nor sellers were decisively rejected — this candle is noise, not a trigger. Wait for structure after the dust settles.",
  },
];

// SVG candle drawing
function CandleSVG({ candle, highlight, onPick, picked }: { candle: Candle; highlight?: "high" | "low" | "close" | "open" | null; onPick?: (part: "high" | "low" | "close" | "open") => void; picked?: string | null }) {
  const W = 220, H = 300, cx = W / 2, bw = 54;
  const vals = [candle.o, candle.h, candle.l, candle.c];
  const max = Math.max(...vals), min = Math.min(...vals);
  const pad = 40;
  const toY = (v: number) => pad + (1 - (v - min) / (max - min || 1)) * (H - 2 * pad);
  const bull = candle.c >= candle.o;
  const bodyTop = toY(Math.max(candle.o, candle.c));
  const bodyBot = toY(Math.min(candle.o, candle.c));
  const color = bull ? "rgb(var(--bull))" : "rgb(var(--bear))";

  const Dot = ({ v, part, label }: { v: number; part: "high" | "low" | "close" | "open"; label: string }) => (
    <g onClick={() => onPick?.(part)} className={onPick ? "cursor-pointer" : ""}>
      <circle cx={cx + bw / 2 + 10} cy={toY(v)} r={picked === part ? 7 : 5} fill={picked === part ? "rgb(var(--accent))" : "rgb(var(--surface))"} stroke="rgb(var(--accent))" strokeWidth={2} className={highlight === part ? "animate-pulse" : ""} />
      <text x={cx + bw / 2 + 22} y={toY(v) + 4} fontSize={11} fill="rgb(var(--muted))">{label} {v}</text>
    </g>
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[240px]">
      {/* wick */}
      <line x1={cx} x2={cx} y1={toY(candle.h)} y2={toY(candle.l)} stroke={color} strokeWidth={2.5} />
      {/* body */}
      <rect x={cx - bw / 2} y={bodyTop} width={bw} height={Math.max(2, bodyBot - bodyTop)} fill={bull ? color : color} opacity={bull ? 0.9 : 0.9} rx={2} />
      {/* open/close ticks left */}
      <line x1={cx - bw / 2 - 8} x2={cx - bw / 2} y1={toY(candle.o)} y2={toY(candle.o)} stroke="rgb(var(--muted))" strokeWidth={1.5} />
      <line x1={cx - bw / 2 - 8} x2={cx - bw / 2} y1={toY(candle.c)} y2={toY(candle.c)} stroke="rgb(var(--muted))" strokeWidth={1.5} />
      {onPick && (
        <>
          <Dot v={candle.h} part="high" label="H" />
          <Dot v={candle.l} part="low" label="L" />
          <Dot v={candle.o} part="open" label="O" />
          <Dot v={candle.c} part="close" label="C" />
        </>
      )}
    </svg>
  );
}

export default function CandlestickLab() {
  const [idx, setIdx] = useState(0);
  const c = CASES[idx];
  const [step, setStep] = useState<0 | 1 | 2>(0); // 0: find high, 1: rejected side, 2: justify entry
  const [pickPart, setPickPart] = useState<string | null>(null);
  const [pickReject, setPickReject] = useState<string | null>(null);
  const [pickEntry, setPickEntry] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // step 0 question: which part is asked? rotate: high/close/low
  const partAsked = useMemo(() => (["high", "close", "low"] as const)[idx % 3], [idx]);

  const reset = (ni: number) => {
    setIdx(ni); setStep(0); setPickPart(null); setPickReject(null); setPickEntry(null);
  };

  return (
    <div>
      <PageHeader
        icon="CandlestickChart"
        title="Candlestick Lab"
        subtitle="Learn candles as a record of the auction — not magic named patterns. Find the OHLC, read which side was rejected, and decide whether the candle alone justifies an entry (hint: it's about context)."
        actions={<Badge tone={score.correct === score.total ? "bull" : "warn"}>Score {score.correct}/{score.total}</Badge>}
      />

      {/* Anatomy primer */}
      <Card className="mb-6 p-4">
        <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex justify-center">
            <CandleSVG candle={{ o: 30, h: 60, l: 10, c: 50 }} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Anatomy title="Open / Close" desc="The body spans open→close. Close above open = buyers won the period (shown here); close below = sellers won." />
            <Anatomy title="High / Low" desc="The wick tips. Prices that were reached but not held — territory the auction rejected." />
            <Anatomy title="Body" desc="Size = conviction. Big body, small wicks = strong momentum. Small body = indecision." />
            <Anatomy title="Wick / Shadow" desc="A long wick shows one side pushed hard and got forcefully rejected. WHERE it happens decides if it matters." />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* the candle */}
        <div className="space-y-3">
          <Card className="flex flex-col items-center p-4">
            <CandleSVG
              candle={c.candle}
              highlight={step === 0 ? (partAsked as any) : null}
              onPick={step === 0 ? (p) => { if (pickPart) return; setPickPart(p); setScore((s) => ({ correct: s.correct + (p === partAsked ? 1 : 0), total: s.total + 1 })); } : undefined}
              picked={pickPart}
            />
            <div className="mt-2 text-center">
              <Badge tone="accent">{c.location}</Badge>
            </div>
          </Card>
          <div className="flex flex-wrap gap-1.5">
            {CASES.map((cc, i) => (
              <button key={cc.id} onClick={() => reset(i)} className={`h-2 flex-1 rounded-full transition-colors ${i === idx ? "bg-accent" : "bg-border hover:bg-subtle"}`} title={cc.location} />
            ))}
          </div>
        </div>

        {/* exercises */}
        <div className="space-y-4">
          {/* Step 0 */}
          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-xs text-accent">1</span> Click the <span className="text-accent uppercase">{partAsked}</span> on the candle</div>
            {pickPart && (
              <p className={`mt-2 text-sm ${pickPart === partAsked ? "text-bull" : "text-bear"}`}>
                {pickPart === partAsked ? `✓ Correct — that's the ${partAsked}.` : `✗ That's the ${pickPart}. The ${partAsked} is the highlighted point.`}
              </p>
            )}
            {pickPart && step === 0 && <Button className="mt-3" size="sm" variant="outline" onClick={() => setStep(1)}>Next question <Icon name="ArrowDown" size={13} /></Button>}
          </Card>

          {/* Step 1 */}
          {step >= 1 && (
            <Card className="p-5 animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-semibold"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-xs text-accent">2</span> Which side got rejected?</div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["buyers", "sellers", "none"] as const).map((opt) => {
                  const correct = c.rejectedSide === opt;
                  let cls = "border-border hover:bg-elevated";
                  if (pickReject) { if (correct) cls = "border-bull/50 bg-bull/10 text-bull"; else if (pickReject === opt) cls = "border-bear/50 bg-bear/10 text-bear"; }
                  return (
                    <button key={opt} disabled={!!pickReject} onClick={() => { setPickReject(opt); setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 })); }} className={`rounded-lg border px-2 py-2 text-sm capitalize transition-colors ${cls}`}>
                      {opt === "none" ? "Neither / indecision" : `${opt} rejected`}
                    </button>
                  );
                })}
              </div>
              {pickReject && <Button className="mt-3" size="sm" variant="outline" onClick={() => setStep(2)}>Next question <Icon name="ArrowDown" size={13} /></Button>}
            </Card>
          )}

          {/* Step 2 */}
          {step >= 2 && (
            <Card className="p-5 animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-semibold"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-xs text-accent">3</span> Does this candle <i>alone</i> justify entering?</div>
              <div className="mt-3 flex gap-2">
                {[true, false].map((opt) => {
                  const correct = c.justifiesEntry === opt;
                  let cls = "border-border hover:bg-elevated";
                  if (pickEntry !== null) { if (correct) cls = "border-bull/50 bg-bull/10 text-bull"; else if (pickEntry === opt) cls = "border-bear/50 bg-bear/10 text-bear"; }
                  return (
                    <button key={String(opt)} disabled={pickEntry !== null} onClick={() => { setPickEntry(opt); setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 })); }} className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${cls}`}>
                      {opt ? "Yes — it's a valid trigger here" : "No — not on its own"}
                    </button>
                  );
                })}
              </div>
              {pickEntry !== null && (
                <div className="mt-3 rounded-lg border border-accent/30 bg-accent/[0.05] p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-accent"><Icon name="Lightbulb" size={13} /> The lesson</div>
                  <p className="text-sm text-muted">{c.teaching}</p>
                </div>
              )}
              {pickEntry !== null && (
                <Button className="mt-3" variant="primary" size="sm" onClick={() => reset((idx + 1) % CASES.length)}>Next candle <Icon name="ArrowRight" size={13} /></Button>
              )}
            </Card>
          )}

          <Card className="border-warn/30 bg-warn/[0.05] p-4">
            <div className="flex items-start gap-2 text-sm">
              <Icon name="Info" size={16} className="mt-0.5 shrink-0 text-warn" />
              <span className="text-muted">The recurring answer to “does this candle justify entering?” is almost always <b className="text-fg">it depends on context</b>. A perfect-looking candle in the wrong location is a trap; an ordinary candle at a great location can be an A+ trigger.</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Anatomy({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-border bg-elevated p-3">
      <div className="text-sm font-medium text-accent">{title}</div>
      <div className="mt-0.5 text-xs text-muted">{desc}</div>
    </div>
  );
}
