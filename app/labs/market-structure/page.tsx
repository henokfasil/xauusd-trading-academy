"use client";

import { useMemo, useState } from "react";
import { Card, Button, Icon, PageHeader, Badge } from "@/components/ui";

type SwingType = "high" | "low";
type Label = "HH" | "HL" | "LH" | "LL" | "—";

interface Scenario {
  id: string;
  name: string;
  difficulty: 1 | 2 | 3;
  startType: SwingType; // type of first point
  values: number[]; // alternating high/low starting with startType
  teaching: string;
}

// Values chosen so the alternating swings tell a clear structural story.
const SCENARIOS: Scenario[] = [
  { id: "clean-up", name: "Clean uptrend", difficulty: 1, startType: "low",
    values: [20, 45, 32, 60, 48, 78, 66, 92], teaching: "A textbook uptrend: each high is a Higher High and each low is a Higher Low. Buyers keep winning; dips stop higher each time." },
  { id: "clean-down", name: "Clean downtrend", difficulty: 1, startType: "high",
    values: [92, 66, 80, 45, 60, 28, 42, 12], teaching: "A textbook downtrend: Lower Highs and Lower Lows. Rallies fail lower; sellers are in control." },
  { id: "range", name: "Range / consolidation", difficulty: 2, startType: "low",
    values: [30, 72, 33, 70, 29, 73, 31], teaching: "Highs are roughly equal and lows are roughly equal — no one is in control. Equal highs/lows are liquidity pools; trend tactics get chopped up here." },
  { id: "messy-up", name: "Messy uptrend", difficulty: 2, startType: "low",
    values: [22, 55, 40, 52, 34, 70, 58, 66, 50, 85], teaching: "Still an uptrend (net HH/HL) but with noisy pullbacks. Note the deep dip that still held above the prior low — a Higher Low — keeping the trend alive." },
  { id: "failed-break", name: "Failed breakout (bull trap)", difficulty: 3, startType: "low",
    values: [30, 70, 50, 88, 46, 62, 20], teaching: "Price made a Higher High (the breakout), then failed: the next low broke below the prior Higher Low, printing a Lower Low. The breakout was a trap — structure flipped bearish." },
  { id: "reversal", name: "Trend reversal (top)", difficulty: 3, startType: "low",
    values: [20, 50, 38, 75, 60, 72, 45, 58, 30], teaching: "An uptrend loses steam: a Lower High forms, then a Lower Low breaks structure. The sequence HH/HL → LH/LL marks the shift from uptrend to downtrend." },
];

function computeLabels(sc: Scenario): Label[] {
  const labels: Label[] = [];
  let prevHigh: number | null = null;
  let prevLow: number | null = null;
  sc.values.forEach((v, i) => {
    const type: SwingType = (i % 2 === 0) === (sc.startType === "high") ? "high" : "low";
    if (type === "high") {
      if (prevHigh === null) labels.push("—");
      else labels.push(v > prevHigh ? "HH" : "LH");
      prevHigh = v;
    } else {
      if (prevLow === null) labels.push("—");
      else labels.push(v > prevLow ? "HL" : "LL");
      prevLow = v;
    }
  });
  return labels;
}

const LABEL_INFO: Record<Label, { full: string; tone: string }> = {
  HH: { full: "Higher High", tone: "bull" },
  HL: { full: "Higher Low", tone: "bull" },
  LH: { full: "Lower High", tone: "bear" },
  LL: { full: "Lower Low", tone: "bear" },
  "—": { full: "First swing (no prior to compare)", tone: "muted" },
};

const W = 640, H = 320, PAD = 40;

export default function MarketStructureLab() {
  const [scIdx, setScIdx] = useState(0);
  const sc = SCENARIOS[scIdx];
  const labels = useMemo(() => computeLabels(sc), [scIdx]);

  // candidate points to quiz = swings with a real label (not "—")
  const candidates = useMemo(() => labels.map((l, i) => (l !== "—" ? i : -1)).filter((i) => i >= 0), [labels]);
  const [targetIdx, setTargetIdx] = useState<number>(candidates[Math.min(2, candidates.length - 1)] ?? candidates[0]);
  const [choice, setChoice] = useState<Label | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [revealAll, setRevealAll] = useState(false);

  const maxV = Math.max(...sc.values), minV = Math.min(...sc.values);
  const toX = (i: number) => PAD + (i / (sc.values.length - 1)) * (W - 2 * PAD);
  const toY = (v: number) => H - PAD - ((v - minV) / (maxV - minV || 1)) * (H - 2 * PAD);
  const path = sc.values.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`).join(" ");

  const answer = (l: Label) => {
    if (choice) return;
    setChoice(l);
    setScore((s) => ({ correct: s.correct + (l === labels[targetIdx] ? 1 : 0), total: s.total + 1 }));
  };

  const nextQuestion = () => {
    setChoice(null);
    setRevealAll(false);
    // pick a random candidate different from current
    const pool = candidates.filter((i) => i !== targetIdx);
    setTargetIdx(pool[Math.floor((pool.length) * ((score.total * 0.618) % 1))] ?? candidates[0]);
  };

  const nextScenario = () => {
    const ni = (scIdx + 1) % SCENARIOS.length;
    setScIdx(ni);
    const newLabels = computeLabels(SCENARIOS[ni]);
    const cand = newLabels.map((l, i) => (l !== "—" ? i : -1)).filter((i) => i >= 0);
    setTargetIdx(cand[Math.min(2, cand.length - 1)] ?? cand[0]);
    setChoice(null);
    setRevealAll(false);
  };

  return (
    <div>
      <PageHeader
        icon="Waypoints"
        title="Market Structure Lab"
        subtitle="Train your eye to read structure. A point is highlighted on each chart — classify it as a Higher High, Higher Low, Lower High or Lower Low. Difficulty rises from clean trends to traps and reversals."
        actions={<Badge tone={score.correct === score.total ? "bull" : "warn"}>Score {score.correct}/{score.total}</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {/* scenario selector */}
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setScIdx(i); const nl = computeLabels(s); const c = nl.map((l, j) => (l !== "—" ? j : -1)).filter((j) => j >= 0); setTargetIdx(c[Math.min(2, c.length - 1)] ?? c[0]); setChoice(null); setRevealAll(false); }}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${i === scIdx ? "border-accent/50 bg-accent/10 text-accent" : "border-border text-muted hover:bg-elevated"}`}
              >
                {s.name}
                <span className="ml-1.5 text-[10px] text-subtle">{"●".repeat(s.difficulty)}</span>
              </button>
            ))}
          </div>

          {/* chart */}
          <Card className="p-4">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
              {/* grid */}
              {[0, 0.25, 0.5, 0.75, 1].map((g) => (
                <line key={g} x1={PAD} x2={W - PAD} y1={PAD + g * (H - 2 * PAD)} y2={PAD + g * (H - 2 * PAD)} stroke="rgb(var(--border))" strokeWidth={1} strokeDasharray="3 5" />
              ))}
              {/* prior same-type reference line for the target */}
              {(() => {
                const type: SwingType = (targetIdx % 2 === 0) === (sc.startType === "high") ? "high" : "low";
                // find prior same-type index
                let prior = -1;
                for (let i = targetIdx - 2; i >= 0; i -= 2) { prior = i; break; }
                if (prior < 0) return null;
                return (
                  <line x1={PAD} x2={W - PAD} y1={toY(sc.values[prior])} y2={toY(sc.values[prior])} stroke="rgb(var(--accent))" strokeWidth={1} strokeDasharray="2 4" opacity={0.5} />
                );
              })()}
              {/* price path */}
              <path d={path} fill="none" stroke="rgb(var(--fg))" strokeWidth={2} strokeLinejoin="round" opacity={0.55} />
              {/* swing points */}
              {sc.values.map((v, i) => {
                const isTarget = i === targetIdx;
                const show = revealAll || (choice && isTarget);
                const type: SwingType = (i % 2 === 0) === (sc.startType === "high") ? "high" : "low";
                return (
                  <g key={i}>
                    <circle
                      cx={toX(i)} cy={toY(v)}
                      r={isTarget ? 8 : 4}
                      fill={isTarget ? "rgb(var(--accent))" : "rgb(var(--surface))"}
                      stroke={isTarget ? "rgb(var(--accent))" : "rgb(var(--muted))"}
                      strokeWidth={2}
                      className={isTarget ? "animate-pulse" : ""}
                    />
                    {isTarget && !choice && !revealAll && (
                      <text x={toX(i)} y={type === "high" ? toY(v) - 14 : toY(v) + 22} textAnchor="middle" fontSize={12} fontWeight={700} fill="rgb(var(--accent))">?</text>
                    )}
                    {show && labels[i] !== "—" && (
                      <text x={toX(i)} y={type === "high" ? toY(v) - 12 : toY(v) + 20} textAnchor="middle" fontSize={11} fontWeight={700}
                        fill={LABEL_INFO[labels[i]].tone === "bull" ? "rgb(var(--bull))" : "rgb(var(--bear))"}>
                        {labels[i]}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            <div className="mt-1 flex items-center justify-between text-xs text-subtle">
              <span>The dashed gold line marks the previous {(targetIdx % 2 === 0) === (sc.startType === "high") ? "high" : "low"} — compare the highlighted point to it.</span>
              <button onClick={() => setRevealAll((r) => !r)} className="hover:text-fg">{revealAll ? "Hide all labels" : "Reveal all labels"}</button>
            </div>
          </Card>
        </div>

        {/* Quiz panel */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-subtle">Classify the highlighted point</div>
            <p className="mt-1 text-sm text-muted">
              Is the pulsing point a…
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["HH", "HL", "LH", "LL"] as Label[]).map((l) => {
                const isAnswer = labels[targetIdx] === l;
                let cls = "border-border hover:bg-elevated";
                if (choice) {
                  if (isAnswer) cls = "border-bull/50 bg-bull/10 text-bull";
                  else if (choice === l) cls = "border-bear/50 bg-bear/10 text-bear";
                }
                return (
                  <button key={l} disabled={!!choice} onClick={() => answer(l)} className={`rounded-lg border px-3 py-3 text-left transition-colors ${cls}`}>
                    <div className="font-semibold">{l}</div>
                    <div className="text-[11px] text-muted">{LABEL_INFO[l].full}</div>
                  </button>
                );
              })}
            </div>

            {choice && (
              <div className={`mt-4 rounded-lg border p-3 ${choice === labels[targetIdx] ? "border-bull/30 bg-bull/[0.06]" : "border-bear/30 bg-bear/[0.06]"}`}>
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  <Icon name={choice === labels[targetIdx] ? "CheckCircle2" : "XCircle"} size={15} className={choice === labels[targetIdx] ? "text-bull" : "text-bear"} />
                  {choice === labels[targetIdx] ? "Correct" : `Not quite — it's a ${labels[targetIdx]}`}
                </div>
                <p className="mt-1.5 text-xs text-muted">{sc.teaching}</p>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={nextQuestion} disabled={!choice}>Another point <Icon name="RefreshCw" size={13} /></Button>
              <Button variant="primary" size="sm" onClick={nextScenario}>Next scenario <Icon name="ArrowRight" size={13} /></Button>
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-subtle"><Icon name="GraduationCap" size={13} /> How to reason</div>
            <ul className="space-y-1.5 text-xs text-muted">
              <li><b className="text-bull">HH / HL</b> = each new high/low is <i>above</i> the last one of its kind → uptrend.</li>
              <li><b className="text-bear">LH / LL</b> = each new high/low is <i>below</i> the last one of its kind → downtrend.</li>
              <li>Compare a <b>high to the previous high</b>, and a <b>low to the previous low</b> — never a high to a low.</li>
              <li>A break of structure (e.g. a <b>LL</b> in an uptrend) is your first warning the trend may be shifting.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
