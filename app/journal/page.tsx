"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAcademy, computeStats } from "@/lib/store";
import { JournalTrade } from "@/lib/types";
import { Card, Button, Icon, PageHeader, Badge, EmptyState, ClientOnly, Field, Select, Stat } from "@/components/ui";

const LOT_VALUE_PER_DOLLAR = 100; // 1 lot = 100oz => $100 per $1 move

function computeDerived(t: JournalTrade, settings: { accountBalance: number; riskPercent: number }) {
  const risk = t.entry != null && t.stop != null ? Math.abs(t.entry - t.stop) : null;
  const rr =
    t.entry != null && t.stop != null && t.target != null && risk
      ? Math.abs(t.target - t.entry) / risk
      : null;
  const suggestedRiskAmount = (settings.riskPercent / 100) * settings.accountBalance;
  const suggestedLots = risk && risk > 0 ? suggestedRiskAmount / (risk * LOT_VALUE_PER_DOLLAR) : null;
  return { risk, rr, suggestedRiskAmount, suggestedLots };
}

function JournalInner() {
  const { trades, setups, settings, addTrade, updateTrade, deleteTrade } = useAcademy();
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "win" | "loss">("all");
  const stats = computeStats(trades);

  const filtered = useMemo(
    () => trades.filter((t) => (filter === "all" ? true : filter === "open" ? t.outcome === "open" : t.outcome === filter)),
    [trades, filter]
  );

  const create = () => {
    const id = addTrade({ riskAmount: (settings.riskPercent / 100) * settings.accountBalance });
    setOpenId(id);
  };

  return (
    <div>
      <PageHeader
        icon="NotebookPen"
        title="Trading Journal"
        subtitle="Capture every (simulated or live) trade as a full process: context → location → scenario → trigger → invalidation → size → outcome. Grade the process, not just the result."
        actions={<Button variant="primary" onClick={create}><Icon name="Plus" size={16} /> New trade</Button>}
      />

      {trades.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Trades" value={stats.total} sub={`${stats.open} open`} />
          <Stat label="Win rate" value={`${(stats.winRate * 100).toFixed(0)}%`} sub={`${stats.wins}W / ${stats.losses}L`} />
          <Stat label="Expectancy" value={`${stats.expectancy >= 0 ? "+" : ""}${stats.expectancy.toFixed(2)}R`} tone={stats.expectancy >= 0 ? "bull" : "bear"} />
          <Stat label="Followed plan" value={`${stats.closed ? Math.round((stats.followed / stats.closed) * 100) : 0}%`} sub={`${stats.violations} violations`} tone="accent" />
        </div>
      )}

      {trades.length === 0 ? (
        <EmptyState
          icon="NotebookPen"
          title="Your journal is empty"
          hint="Log your first trade. Even a paper trade counts — the habit of honest recording is the engine of improvement."
          action={<Button variant="primary" onClick={create}><Icon name="Plus" size={16} /> Log a trade</Button>}
        />
      ) : (
        <>
          <div className="mb-3 flex gap-1.5">
            {(["all", "open", "win", "loss"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${filter === f ? "border-accent/50 bg-accent/10 text-accent" : "border-border text-muted hover:bg-elevated"}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map((t) => {
              const d = computeDerived(t, settings);
              const open = openId === t.id;
              return (
                <Card key={t.id} className={open ? "border-accent/40" : ""}>
                  <button onClick={() => setOpenId(open ? null : t.id)} className="flex w-full items-center gap-3 p-3 text-left hover:bg-elevated/40">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${t.direction === "long" ? "bg-bull/10 text-bull" : "bg-bear/10 text-bear"}`}>
                      <Icon name={t.direction === "long" ? "TrendingUp" : "TrendingDown"} size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{t.date}</span>
                        <Badge tone="muted">{t.session}</Badge>
                        {t.setupId && <Badge tone="accent">{setups.find((s) => s.id === t.setupId)?.name ?? "setup"}</Badge>}
                        {!t.followedPlan && <Badge tone="bear">rule break</Badge>}
                      </div>
                      <div className="truncate text-xs text-muted">{t.scenario || t.context || "No scenario recorded"}</div>
                    </div>
                    <div className="text-right">
                      <OutcomeBadge t={t} />
                      {d.rr != null && <div className="text-[11px] text-subtle">plan {d.rr.toFixed(1)}R</div>}
                    </div>
                    <Icon name="ChevronDown" size={16} className={`text-subtle transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>

                  {open && <TradeEditor t={t} onChange={(patch) => updateTrade(t.id, patch)} onDelete={() => { deleteTrade(t.id); setOpenId(null); }} />}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function OutcomeBadge({ t }: { t: JournalTrade }) {
  if (t.outcome === "open") return <Badge tone="warn">Open</Badge>;
  if (t.outcome === "win") return <Badge tone="bull">+{t.rMultiple?.toFixed(1) ?? "?"}R</Badge>;
  if (t.outcome === "loss") return <Badge tone="bear">{t.rMultiple?.toFixed(1) ?? "?"}R</Badge>;
  return <Badge tone="muted">BE</Badge>;
}

function TradeEditor({ t, onChange, onDelete }: { t: JournalTrade; onChange: (patch: Partial<JournalTrade>) => void; onDelete: () => void }) {
  const { settings, setups } = useAcademy();
  const d = computeDerived(t, settings);
  const num = (v: string) => (v === "" ? null : Number(v));

  return (
    <div className="border-t border-border p-4 space-y-5 animate-fade-in">
      {/* meta row */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Field label="Date" type="date" value={t.date} onChange={(v) => onChange({ date: v })} />
        <Select label="Direction" value={t.direction} onChange={(v) => onChange({ direction: v as any })} options={[{ value: "long", label: "Long (buy)" }, { value: "short", label: "Short (sell)" }]} />
        <Select label="Session" value={t.session} onChange={(v) => onChange({ session: v })} options={["Asia", "London", "New York", "Overlap"].map((s) => ({ value: s, label: s }))} />
        <Select label="Setup" value={t.setupId ?? ""} onChange={(v) => onChange({ setupId: v || undefined })} options={[{ value: "", label: "— none —" }, ...setups.map((s) => ({ value: s.id, label: s.name }))]} />
      </div>

      {/* the process */}
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">The process</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="1. Market context / HTF bias" value={t.context} onChange={(v) => onChange({ context: v })} textarea placeholder="e.g. 4H bullish HH/HL, pulling back" />
          <Field label="2. Important location" value={t.location} onChange={(v) => onChange({ location: v })} textarea placeholder="e.g. 3705–3710 support + round number" />
          <Field label="3. Scenario (if-then)" value={t.scenario} onChange={(v) => onChange({ scenario: v })} textarea placeholder="e.g. If 3708 rejects → long to 3735" />
          <Field label="4. Trigger (what fired)" value={t.trigger} onChange={(v) => onChange({ trigger: v })} textarea placeholder="e.g. 5m sweep + reclaim close" />
          <Field label="5. Invalidation (why it's wrong)" value={t.invalidation} onChange={(v) => onChange({ invalidation: v })} textarea placeholder="e.g. 5m closes below 3702" />
        </div>
      </div>

      {/* numbers + sizing calc */}
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">Execution & sizing</div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Entry" type="number" value={t.entry ?? ""} onChange={(v) => onChange({ entry: num(v) })} />
          <Field label="Stop" type="number" value={t.stop ?? ""} onChange={(v) => onChange({ stop: num(v) })} />
          <Field label="Target" type="number" value={t.target ?? ""} onChange={(v) => onChange({ target: num(v) })} />
          <Field label="Size (lots)" type="number" value={t.size ?? ""} onChange={(v) => onChange({ size: num(v) })} />
        </div>
        <div className="mt-2 grid gap-2 rounded-lg border border-border bg-elevated p-3 text-xs sm:grid-cols-4">
          <div><span className="text-subtle">Risk / unit:</span> <b>{d.risk != null ? `$${d.risk.toFixed(2)}` : "—"}</b></div>
          <div><span className="text-subtle">Planned RR:</span> <b className={d.rr && d.rr >= 2 ? "text-bull" : d.rr ? "text-warn" : ""}>{d.rr != null ? `${d.rr.toFixed(2)}R` : "—"}</b></div>
          <div><span className="text-subtle">Suggested risk $:</span> <b>${d.suggestedRiskAmount.toFixed(2)}</b> <span className="text-subtle">({settings.riskPercent}%)</span></div>
          <div><span className="text-subtle">Suggested size:</span> <b>{d.suggestedLots != null ? `${d.suggestedLots.toFixed(2)} lots` : "—"}</b></div>
        </div>
        {d.rr != null && d.rr < 2 && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-warn"><Icon name="TriangleAlert" size={12} /> Planned reward-to-risk below 2R — is there a strong reason to take a sub-2R trade?</p>
        )}
      </div>

      {/* outcome */}
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">Outcome & review</div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Select label="Outcome" value={t.outcome} onChange={(v) => onChange({ outcome: v as any })} options={[{ value: "open", label: "Open" }, { value: "win", label: "Win" }, { value: "loss", label: "Loss" }, { value: "breakeven", label: "Breakeven" }]} />
          <Field label="Realized R" type="number" value={t.rMultiple ?? ""} onChange={(v) => onChange({ rMultiple: num(v) })} hint="e.g. 2 or -1" />
          <Field label="P&L (currency)" type="number" value={t.pnl ?? ""} onChange={(v) => onChange({ pnl: num(v) })} />
          <Select label="Followed plan?" value={t.followedPlan ? "yes" : "no"} onChange={(v) => onChange({ followedPlan: v === "yes" })} options={[{ value: "yes", label: "Yes ✓" }, { value: "no", label: "No — rule break" }]} />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Emotions during the trade" value={t.emotions} onChange={(v) => onChange({ emotions: v })} textarea placeholder="Calm? Anxious? FOMO? Revenge?" />
          <Field label="Lessons / what I'd repeat or change" value={t.lessons} onChange={(v) => onChange({ lessons: v })} textarea placeholder="Honest post-trade note" />
        </div>
        <div className="mt-3">
          <Field label="Rule violations (comma-separated)" value={t.ruleViolations.join(", ")} onChange={(v) => onChange({ ruleViolations: v.split(",").map((x) => x.trim()).filter(Boolean) })} placeholder="e.g. moved stop, oversized, no trigger" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <Link href="/screenshots" className="text-xs text-accent hover:underline">Attach screenshots in the Screenshot Library →</Link>
        <Button size="sm" variant="danger" onClick={() => { if (confirm("Delete this trade?")) onDelete(); }}><Icon name="Trash2" size={14} /> Delete trade</Button>
      </div>
    </div>
  );
}

export default function JournalPage() {
  return <ClientOnly fallback={<div className="text-muted">Loading journal…</div>}><JournalInner /></ClientOnly>;
}
