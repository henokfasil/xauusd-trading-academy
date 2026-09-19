"use client";

import { useMemo, useRef, useState } from "react";
import { Card, Button, Icon, PageHeader, Badge } from "@/components/ui";

// Synthetic price series with intentional reaction areas.
// Values are "price"; the chart plots them as a line with candles-ish bars.
const SERIES = [
  62, 60, 58, 55, 52, 54, 57, 55, 52, 50, // dips to ~50 (support)
  53, 57, 62, 66, 70, 72, 70, 68, 71, 73, // pushes to ~72 (resistance)
  70, 66, 61, 56, 52, 51, 50, 52, 55, 59, // back to ~50 (support retest)
  63, 68, 72, 71, 73, 72, 74, 78, 82, 85, // breaks 72, runs to ~85
  83, 80, 76, 73, 72, 74, 77, 80, 84, 88, // retest of old 72 resistance as support
];

// True reaction zones (center price, half-height). Educational "answer key".
const TRUE_ZONES = [
  { center: 51, half: 2.5, label: "Support ~50–52", note: "Price reversed up here three separate times — a clear demand zone. Note it's an area, not one price." },
  { center: 72, half: 2.5, label: "Resistance → support ~70–74", note: "First a ceiling (rejected twice), later broken and RETESTED as support. Broken resistance becoming support is one of the most reliable behaviours." },
  { center: 85, half: 2.5, label: "Prior high ~85", note: "The most recent swing high — a fresh resistance / reference for the next decision." },
];

const W = 720, H = 340, PAD = 36;

export default function SupportResistanceLab() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [userZones, setUserZones] = useState<number[]>([]); // price centers
  const [revealed, setRevealed] = useState(false);

  const max = Math.max(...SERIES) + 4, min = Math.min(...SERIES) - 4;
  const toX = (i: number) => PAD + (i / (SERIES.length - 1)) * (W - 2 * PAD);
  const toY = (v: number) => PAD + (1 - (v - min) / (max - min)) * (H - 2 * PAD);
  const yToPrice = (y: number) => min + (1 - (y - PAD) / (H - 2 * PAD)) * (max - min);
  const path = SERIES.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`).join(" ");

  const handleClick = (e: React.MouseEvent) => {
    if (revealed) return;
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * H;
    const price = yToPrice(y);
    if (price < min || price > max) return;
    setUserZones((z) => [...z, Number(price.toFixed(1))]);
  };

  // score: for each true zone, is there a user zone within tolerance?
  const score = useMemo(() => {
    if (!revealed) return null;
    const tol = 4;
    const hits = TRUE_ZONES.filter((tz) => userZones.some((uz) => Math.abs(uz - tz.center) <= tol)).length;
    const falsePos = userZones.filter((uz) => !TRUE_ZONES.some((tz) => Math.abs(uz - tz.center) <= tol)).length;
    return { hits, total: TRUE_ZONES.length, falsePos };
  }, [revealed, userZones]);

  return (
    <div>
      <PageHeader
        icon="Ruler"
        title="Support / Resistance Lab"
        subtitle="Click on the chart to mark the price areas where you think buyers or sellers are likely to react. Then reveal reasonable zones and compare. The goal is to see levels as ZONES and as places to WATCH — not automatic buy/sell buttons."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => { setUserZones([]); setRevealed(false); }}><Icon name="RotateCcw" size={14} /> Reset</Button>
            <Button size="sm" variant="primary" onClick={() => setRevealed(true)} disabled={revealed}><Icon name="Eye" size={14} /> Reveal zones</Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <Card className="p-4">
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full cursor-crosshair" onClick={handleClick}>
              {/* grid */}
              {[0, 0.25, 0.5, 0.75, 1].map((g) => (
                <line key={g} x1={PAD} x2={W - PAD} y1={PAD + g * (H - 2 * PAD)} y2={PAD + g * (H - 2 * PAD)} stroke="rgb(var(--border))" strokeDasharray="3 6" />
              ))}
              {/* revealed true zones */}
              {revealed && TRUE_ZONES.map((tz, i) => (
                <g key={i}>
                  <rect x={PAD} width={W - 2 * PAD} y={toY(tz.center + tz.half)} height={toY(tz.center - tz.half) - toY(tz.center + tz.half)} fill="rgb(var(--accent))" opacity={0.12} />
                  <line x1={PAD} x2={W - PAD} y1={toY(tz.center)} y2={toY(tz.center)} stroke="rgb(var(--accent))" strokeWidth={1} strokeDasharray="4 4" opacity={0.6} />
                  <text x={W - PAD - 4} y={toY(tz.center + tz.half) - 4} textAnchor="end" fontSize={10} fill="rgb(var(--accent))" fontWeight={600}>{tz.label}</text>
                </g>
              ))}
              {/* user zones */}
              {userZones.map((uz, i) => {
                const good = revealed && TRUE_ZONES.some((tz) => Math.abs(uz - tz.center) <= 4);
                const color = revealed ? (good ? "rgb(var(--bull))" : "rgb(var(--bear))") : "rgb(var(--fg))";
                return (
                  <g key={i}>
                    <line x1={PAD} x2={W - PAD} y1={toY(uz)} y2={toY(uz)} stroke={color} strokeWidth={1.5} />
                    <circle cx={PAD} cy={toY(uz)} r={4} fill={color} />
                  </g>
                );
              })}
              {/* price line */}
              <path d={path} fill="none" stroke="rgb(var(--fg))" strokeWidth={2} strokeLinejoin="round" />
              {/* points */}
              {SERIES.map((v, i) => <circle key={i} cx={toX(i)} cy={toY(v)} r={1.6} fill="rgb(var(--muted))" />)}
            </svg>
            <div className="mt-1 text-center text-xs text-subtle">
              {revealed ? "Gold bands = reasonable reaction zones. Your green lines matched, red lines didn't." : `Click anywhere to drop a horizontal level. You've marked ${userZones.length}.`}
            </div>
          </Card>

          {score && (
            <Card className={`p-4 ${score.hits === score.total && score.falsePos === 0 ? "border-bull/30 bg-bull/[0.05]" : "border-warn/30 bg-warn/[0.05]"}`}>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Icon name="Target" size={15} className="text-accent" />
                You identified {score.hits} of {score.total} reasonable zones{score.falsePos > 0 ? `, with ${score.falsePos} that didn't line up with a clear reaction area` : ""}.
              </div>
              <p className="mt-1.5 text-xs text-muted">
                There's no single “correct” chart — reasonable traders draw slightly different zones. What matters is that each zone has a <b>story</b> (multiple reactions, a broken level flipping role) and is drawn as an <b>area</b>, not a hairline.
              </p>
            </Card>
          )}
        </div>

        {/* right rail */}
        <div className="space-y-4">
          {revealed && (
            <Card className="p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle">Why these zones</div>
              <div className="space-y-3">
                {TRUE_ZONES.map((tz, i) => (
                  <div key={i}>
                    <Badge tone="accent">{tz.label}</Badge>
                    <p className="mt-1 text-xs text-muted">{tz.note}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-4">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-subtle"><Icon name="Brain" size={13} /> The thinking upgrade</div>
            <div className="space-y-3">
              <div className="rounded-lg border border-bear/30 bg-bear/[0.05] p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-bear"><Icon name="X" size={13} /> Bad thinking</div>
                <p className="text-sm text-muted">“3720 is support, therefore BUY.” — treating a level as an automatic trade button.</p>
              </div>
              <div className="rounded-lg border border-bull/30 bg-bull/[0.05] p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-bull"><Icon name="Check" size={13} /> Better thinking</div>
                <p className="text-sm text-muted">“3720 is an area price reacted to before. If price returns, I’ll <b>watch how participants behave</b> — does it reject and hold, or slice through? I act on the reaction, not the arrival.”</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-subtle"><Icon name="GraduationCap" size={13} /> How to draw zones</div>
            <ul className="space-y-1.5 text-xs text-muted">
              <li>Find where price <b>reversed sharply</b> or left a big rejection wick.</li>
              <li>Draw a <b>band</b> from candle bodies to wick extremes — not a single line.</li>
              <li>Prefer areas touched <b>multiple times</b> or where a broken level <b>flips role</b>.</li>
              <li>Place stops <b>beyond the far side</b> of the zone, not one cent past a hairline.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
