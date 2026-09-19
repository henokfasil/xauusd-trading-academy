"use client";

import { useState } from "react";
import { useAcademy } from "@/lib/store";
import { TrendState, StructureState, TimeframeRead } from "@/lib/types";
import { Card, Button, Icon, PageHeader, Badge, EmptyState, ClientOnly, Field } from "@/components/ui";

const TIMEFRAMES = ["Daily", "4H", "1H", "15m", "5m"];

const TREND_OPTS: { v: TrendState; label: string; active: string }[] = [
  { v: "bullish", label: "Bullish", active: "border-bull/50 bg-bull/10 text-bull" },
  { v: "bearish", label: "Bearish", active: "border-bear/50 bg-bear/10 text-bear" },
  { v: "range", label: "Range", active: "border-warn/50 bg-warn/10 text-warn" },
  { v: "unclear", label: "Unclear", active: "border-accent/40 bg-accent/10 text-accent" },
];
const STRUCT_OPTS: { v: StructureState; label: string }[] = [
  { v: "hh_hl", label: "HH / HL" },
  { v: "lh_ll", label: "LH / LL" },
  { v: "mixed", label: "Mixed" },
];

function trendTone(t: TrendState) {
  return t === "bullish" ? "bull" : t === "bearish" ? "bear" : t === "range" ? "warn" : "muted";
}

// The educational reasoning engine — describes, does NOT signal buy/sell.
function interpret(reads: Record<string, TimeframeRead>): { headline: string; detail: string; tone: "bull" | "bear" | "warn" | "muted" } {
  const htf = [reads["Daily"], reads["4H"]].filter(Boolean);
  const ltf = [reads["1H"], reads["15m"], reads["5m"]].filter(Boolean);
  const htfBull = htf.filter((r) => r.trend === "bullish").length;
  const htfBear = htf.filter((r) => r.trend === "bearish").length;
  const ltfBull = ltf.filter((r) => r.trend === "bullish").length;
  const ltfBear = ltf.filter((r) => r.trend === "bearish").length;

  let htfBias: "bullish" | "bearish" | "range/unclear";
  if (htfBull > htfBear) htfBias = "bullish";
  else if (htfBear > htfBull) htfBias = "bearish";
  else htfBias = "range/unclear";

  let ltfLean: "up" | "down" | "mixed";
  if (ltfBull > ltfBear) ltfLean = "up";
  else if (ltfBear > ltfBull) ltfLean = "down";
  else ltfLean = "mixed";

  if (htfBias === "range/unclear") {
    return {
      tone: "warn",
      headline: "Higher timeframe is unclear or ranging — no directional edge.",
      detail: "When the Daily/4H don't agree on a direction, trend-following setups have poor odds. Consider range tactics (fade the edges) or, more often, stand aside until the higher timeframe resolves. No trade is a valid, professional outcome.",
    };
  }

  const aligned = (htfBias === "bullish" && ltfLean === "up") || (htfBias === "bearish" && ltfLean === "down");
  const pullback = (htfBias === "bullish" && ltfLean === "down") || (htfBias === "bearish" && ltfLean === "up");

  if (aligned) {
    return {
      tone: htfBias === "bullish" ? "bull" : "bear",
      headline: `Higher timeframe ${htfBias}; lower timeframes aligned in the same direction.`,
      detail: `Trend and timing agree. This is trend-continuation territory — but chasing an extended move gives a poor entry. The higher-probability play is to wait for a lower-timeframe PULLBACK into a key level, then a confirmed trigger in the ${htfBias === "bullish" ? "long" : "short"} direction. Alignment is context, not a trigger.`,
    };
  }

  if (pullback) {
    return {
      tone: htfBias === "bullish" ? "bull" : "bear",
      headline: `Higher timeframe ${htfBias}; lower timeframes currently pulling back.`,
      detail: `This is the classic setup window. The counter-move on the LTF is a pullback WITHIN the ${htfBias} higher-timeframe trend. Wait for price to reach a predefined level and for your lower-timeframe confirmation (rejection / structure shift back with the trend) before any entry. No entry until that confirmation occurs.`,
    };
  }

  return {
    tone: "muted",
    headline: `Higher timeframe ${htfBias}; lower timeframes mixed.`,
    detail: "Direction on the higher timeframe is set, but the lower timeframes haven't organised yet. Be patient: mark your levels and wait for the LTF to either pull back cleanly or align before committing.",
  };
}

function TopDownInner() {
  const { snapshots, addSnapshot, updateSnapshot, deleteSnapshot } = useAcademy();
  const [activeId, setActiveId] = useState<string | null>(snapshots[0]?.id ?? null);
  const active = snapshots.find((s) => s.id === activeId) ?? snapshots[0] ?? null;

  const create = () => {
    const id = addSnapshot();
    setActiveId(id);
  };

  const setRead = (tf: string, patch: Partial<TimeframeRead>) => {
    if (!active) return;
    updateSnapshot(active.id, { reads: { ...active.reads, [tf]: { ...active.reads[tf], ...patch } } });
  };

  const summary = active ? interpret(active.reads) : null;

  return (
    <div>
      <PageHeader
        icon="Layers"
        title="Top-Down Analysis"
        subtitle="Record your read of each timeframe from Daily down to 5m. The workspace synthesises your reads into a plain-English bias — a reasoning aid, NOT a buy/sell signal."
        actions={<Button variant="primary" onClick={create}><Icon name="Plus" size={16} /> New read</Button>}
      />

      {!active ? (
        <EmptyState
          icon="Layers"
          title="No top-down reads yet"
          hint="Create your first analysis. You'll record trend, structure, levels and observations for each timeframe, then get an automatic interpretation of your bias."
          action={<Button variant="primary" onClick={create}><Icon name="Plus" size={16} /> Start a read</Button>}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          {/* saved reads list */}
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle">Saved reads</div>
            <div className="space-y-1">
              {snapshots.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors ${s.id === active.id ? "border-accent/50 bg-accent/10" : "border-border hover:bg-elevated"}`}
                >
                  <span className="truncate">{s.title}</span>
                  <span className="text-[10px] text-subtle">{s.date.slice(5)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0 space-y-5">
            {/* header row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  value={active.title}
                  onChange={(e) => updateSnapshot(active.id, { title: e.target.value })}
                  className="rounded-lg border border-transparent bg-transparent px-1 text-lg font-semibold outline-none hover:bg-elevated focus:border-accent/50 focus:bg-elevated"
                />
                <input
                  type="date"
                  value={active.date}
                  onChange={(e) => updateSnapshot(active.id, { date: e.target.value })}
                  className="rounded-lg border border-border bg-elevated px-2 py-1 text-xs text-muted outline-none"
                />
              </div>
              <Button size="sm" variant="danger" onClick={() => { if (confirm("Delete this read?")) { deleteSnapshot(active.id); setActiveId(null); } }}>
                <Icon name="Trash2" size={14} /> Delete
              </Button>
            </div>

            {/* timeframe grid */}
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="grid grid-cols-[70px_1fr] divide-y divide-border">
                {TIMEFRAMES.map((tf) => {
                  const r = active.reads[tf];
                  return (
                    <div key={tf} className="contents">
                      <div className="flex items-center justify-center border-r border-border bg-elevated font-mono text-sm font-semibold">
                        {tf}
                      </div>
                      <div className="p-3 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1">
                            {TREND_OPTS.map((o) => (
                              <button
                                key={o.v}
                                onClick={() => setRead(tf, { trend: o.v })}
                                className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
                                  r.trend === o.v ? o.active : "border-border text-muted hover:bg-elevated"
                                }`}
                              >
                                {o.label}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-1">
                            {STRUCT_OPTS.map((o) => (
                              <button
                                key={o.v}
                                onClick={() => setRead(tf, { structure: o.v })}
                                className={`rounded-md border px-2 py-1 text-[11px] font-mono transition-colors ${
                                  r.structure === o.v ? "border-accent/50 bg-accent/10 text-accent" : "border-border text-muted hover:bg-elevated"
                                }`}
                              >
                                {o.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                          <input
                            value={r.levels}
                            onChange={(e) => setRead(tf, { levels: e.target.value })}
                            placeholder="Key levels…"
                            className="rounded-md border border-border bg-elevated px-2 py-1 text-xs outline-none focus:border-accent/50"
                          />
                          <input
                            value={r.observations}
                            onChange={(e) => setRead(tf, { observations: e.target.value })}
                            placeholder="Observations…"
                            className="rounded-md border border-border bg-elevated px-2 py-1 text-xs outline-none focus:border-accent/50 sm:col-span-2"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Auto summary */}
            <Card className="overflow-hidden">
              <div className="border-b border-border bg-elevated px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-subtle">
                  <Icon name="Sparkles" size={13} /> Synthesised interpretation
                </div>
              </div>
              <div className="p-4">
                {/* stacked bias readout */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {TIMEFRAMES.map((tf) => (
                    <div key={tf} className="flex items-center gap-1.5 rounded-lg border border-border bg-elevated px-2.5 py-1">
                      <span className="font-mono text-xs font-semibold">{tf}:</span>
                      <Badge tone={trendTone(active.reads[tf].trend) as any}>{active.reads[tf].trend}</Badge>
                    </div>
                  ))}
                </div>
                {summary && (
                  <div className={`rounded-lg border p-4 ${
                    summary.tone === "bull" ? "border-bull/30 bg-bull/[0.05]" :
                    summary.tone === "bear" ? "border-bear/30 bg-bear/[0.05]" :
                    summary.tone === "warn" ? "border-warn/30 bg-warn/[0.05]" : "border-border bg-elevated"
                  }`}>
                    <div className="font-semibold">{summary.headline}</div>
                    <p className="mt-1.5 text-sm text-muted">{summary.detail}</p>
                  </div>
                )}
                <div className="mt-3 flex items-start gap-1.5 text-xs text-subtle">
                  <Icon name="ShieldAlert" size={13} className="mt-0.5 shrink-0" />
                  This tool describes your reads to build reasoning discipline. It never issues BUY/SELL calls — your trigger, invalidation and sizing decide any trade.
                </div>
              </div>
            </Card>

            {/* Overall interpretation notes */}
            <Field
              label="My overall interpretation & plan"
              value={active.interpretation}
              onChange={(v) => updateSnapshot(active.id, { interpretation: v })}
              textarea
              placeholder="e.g. HTF bullish, 15m pulling back into 3705–3710 support. No long until a 5m bullish rejection close. Invalid below 3702."
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function TopDownPage() {
  return <ClientOnly fallback={<div className="text-muted">Loading…</div>}><TopDownInner /></ClientOnly>;
}
