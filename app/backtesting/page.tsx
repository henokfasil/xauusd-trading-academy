"use client";

import { useState } from "react";
import Link from "next/link";
import { useAcademy, computeStats } from "@/lib/store";
import { Card, Button, Icon, PageHeader, EmptyState, ClientOnly, Field, Select, Badge, Stat } from "@/components/ui";

function BacktestInner() {
  const { backtests, trades, setups, addBacktest, updateBacktest, deleteBacktest } = useAcademy();
  const [openId, setOpenId] = useState<string | null>(backtests[0]?.id ?? null);

  return (
    <div>
      <PageHeader
        icon="History"
        title="Backtesting"
        subtitle="Test a setup against history before risking money. Define the hypothesis and period, log sample trades (in the Journal, tagged 'backtest'), then read the stats. A sample of 20–100 reveals whether the edge is real."
        actions={<Button variant="primary" onClick={() => setOpenId(addBacktest())}><Icon name="Plus" size={16} /> New backtest</Button>}
      />

      <Card className="mb-6 border-accent/30 bg-accent/[0.04] p-4">
        <div className="flex items-start gap-2.5 text-sm">
          <Icon name="Info" size={16} className="mt-0.5 shrink-0 text-accent" />
          <span className="text-muted">
            <b className="text-fg">How to backtest here:</b> create a session, then in the <Link href="/journal" className="text-accent hover:underline">Journal</Link> log each historical trade you'd have taken by the setup's exact rules and add the tag <code className="rounded bg-elevated px-1">backtest</code> (plus the session name). This page reads any trades tagged with the backtest's name so you get a clean, honest sample.
          </span>
        </div>
      </Card>

      {backtests.length === 0 ? (
        <EmptyState icon="History" title="No backtests yet" hint="Create your first backtest session to structure a disciplined study of a setup's edge." action={<Button variant="primary" onClick={() => setOpenId(addBacktest())}><Icon name="Plus" size={16} /> New backtest</Button>} />
      ) : (
        <div className="space-y-3">
          {backtests.map((b) => {
            const open = openId === b.id;
            const sample = trades.filter((t) => t.tags.map((x) => x.toLowerCase()).includes(b.name.toLowerCase()) || t.tags.map((x) => x.toLowerCase()).includes("backtest:" + b.name.toLowerCase()));
            const stats = computeStats(sample);
            return (
              <Card key={b.id} className={open ? "border-accent/40" : ""}>
                <button onClick={() => setOpenId(open ? null : b.id)} className="flex w-full items-center gap-3 p-4 text-left hover:bg-elevated/40">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"><Icon name="History" size={18} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{b.name}</div>
                    <div className="truncate text-xs text-muted">{b.hypothesis || "No hypothesis yet"}</div>
                  </div>
                  <Badge tone={stats.expectancy >= 0 ? "bull" : "bear"}>{sample.length ? `${stats.expectancy >= 0 ? "+" : ""}${stats.expectancy.toFixed(2)}R` : "no data"}</Badge>
                  <Icon name="ChevronDown" size={16} className={`text-subtle transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                  <div className="border-t border-border p-4 space-y-4 animate-fade-in">
                    <Field label="Name (also the tag to use in the Journal)" value={b.name} onChange={(v) => updateBacktest(b.id, { name: v })} />
                    <Select label="Setup being tested" value={b.setupId ?? ""} onChange={(v) => updateBacktest(b.id, { setupId: v || undefined })} options={[{ value: "", label: "— none —" }, ...setups.map((s) => ({ value: s.id, label: s.name }))]} />
                    <Field label="Hypothesis" value={b.hypothesis} onChange={(v) => updateBacktest(b.id, { hypothesis: v })} textarea placeholder="e.g. Sweep-and-reclaim of the Asian range in a trending market yields ≥2R with >45% win rate." />
                    <Field label="Period tested" value={b.period} onChange={(v) => updateBacktest(b.id, { period: v })} placeholder="e.g. Jan–Mar 2026, London session only" />

                    {sample.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <Stat label="Sample" value={sample.length} sub="tagged trades" />
                        <Stat label="Win rate" value={`${(stats.winRate * 100).toFixed(0)}%`} />
                        <Stat label="Expectancy" value={`${stats.expectancy >= 0 ? "+" : ""}${stats.expectancy.toFixed(2)}R`} tone={stats.expectancy >= 0 ? "bull" : "bear"} />
                        <Stat label="Total R" value={`${stats.totalR >= 0 ? "+" : ""}${stats.totalR.toFixed(1)}R`} tone={stats.totalR >= 0 ? "bull" : "bear"} />
                      </div>
                    ) : (
                      <p className="rounded-lg border border-dashed border-border p-3 text-xs text-muted">
                        No trades tagged <code className="rounded bg-elevated px-1">{b.name}</code> yet. Log historical trades in the Journal with that tag to populate this sample.
                      </p>
                    )}

                    <Field label="Notes / conclusions" value={b.notes} onChange={(v) => updateBacktest(b.id, { notes: v })} textarea placeholder="What did the sample show? Is the edge real? What one change will you test next?" />
                    <div className="flex justify-end">
                      <Button size="sm" variant="danger" onClick={() => { if (confirm("Delete this backtest?")) { deleteBacktest(b.id); setOpenId(null); } }}><Icon name="Trash2" size={14} /> Delete</Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function BacktestingPage() {
  return <ClientOnly fallback={<div className="text-muted">Loading…</div>}><BacktestInner /></ClientOnly>;
}
