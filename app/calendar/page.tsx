"use client";

import { useMemo } from "react";
import { useAcademy } from "@/lib/store";
import { CalendarEvent } from "@/lib/store";
import { Card, Button, Icon, PageHeader, EmptyState, ClientOnly, Field, Select, Badge } from "@/components/ui";

const IMPACT_TONE: Record<string, "bear" | "warn" | "muted"> = { high: "bear", medium: "warn", low: "muted" };

const RECURRING = [
  { title: "FOMC Rate Decision", impact: "high", policy: "Be flat into it. Biggest driver of gold — trade the structured move after the presser settles." },
  { title: "CPI (Inflation)", impact: "high", policy: "Be flat into the print. Expect violent two-way whip; trade the post-news trend once spreads normalise." },
  { title: "NFP (Jobs, 1st Friday)", impact: "high", policy: "Be flat. $20–$40 spikes with severe slippage. Watch the reaction; trade the structure after." },
  { title: "PCE (Fed's preferred inflation)", impact: "medium", policy: "Reduce size around the release; less dramatic than CPI but respected." },
  { title: "Fed Speaker", impact: "medium", policy: "Watch for hawkish/dovish tone; can move gold intraday. Avoid fresh entries just before." },
];

function CalendarInner() {
  const { calendar, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useAcademy();

  const sorted = useMemo(() => [...calendar].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)), [calendar]);

  return (
    <div>
      <PageHeader
        icon="CalendarClock"
        title="Economic Calendar"
        subtitle="Plan around scheduled volatility instead of being ambushed. Record upcoming high-impact events and your PRE-PLANNED policy for each — decide when calm, execute mechanically."
        actions={<Button variant="primary" onClick={() => addCalendarEvent()}><Icon name="Plus" size={16} /> Add event</Button>}
      />

      <Card className="mb-6 border-warn/30 bg-warn/[0.05] p-4">
        <div className="flex items-start gap-2.5 text-sm">
          <Icon name="Info" size={16} className="mt-0.5 shrink-0 text-warn" />
          <span className="text-muted">This is your personal planning log, not a live data feed. Each morning, copy the day's high-impact events from your broker/calendar site here (in your platform's timezone) and set your policy. The point is to <b className="text-fg">decide your approach before the event</b>, never during it.</span>
        </div>
      </Card>

      <div className="mb-6">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle">Quick-add recurring gold movers</div>
        <div className="flex flex-wrap gap-2">
          {RECURRING.map((r, i) => (
            <Button key={i} size="sm" variant="ghost" onClick={() => addCalendarEvent({ title: r.title, impact: r.impact as any, policy: r.policy })}>
              <Icon name="Plus" size={13} /> {r.title}
            </Button>
          ))}
        </div>
      </div>

      {calendar.length === 0 ? (
        <EmptyState icon="CalendarClock" title="No events logged" hint="Add the day's high-impact releases and your plan for each. FOMC, CPI and NFP are gold's biggest scheduled movers." action={<Button variant="primary" onClick={() => addCalendarEvent()}><Icon name="Plus" size={16} /> Add event</Button>} />
      ) : (
        <div className="space-y-2">
          {sorted.map((e) => <EventRow key={e.id} e={e} onChange={(p) => updateCalendarEvent(e.id, p)} onDelete={() => deleteCalendarEvent(e.id)} />)}
        </div>
      )}
    </div>
  );
}

function EventRow({ e, onChange, onDelete }: { e: CalendarEvent; onChange: (p: Partial<CalendarEvent>) => void; onDelete: () => void }) {
  return (
    <Card className="p-4">
      <div className="grid gap-3 sm:grid-cols-[110px_110px_1fr_auto] sm:items-end">
        <Field label="Date" type="date" value={e.date} onChange={(v) => onChange({ date: v })} />
        <Field label="Time" value={e.time} onChange={(v) => onChange({ time: v })} placeholder="13:30" />
        <Field label="Event" value={e.title} onChange={(v) => onChange({ title: v })} />
        <Select label="Impact" value={e.impact} onChange={(v) => onChange({ impact: v as any })} options={[{ value: "high", label: "🔴 High" }, { value: "medium", label: "🟠 Medium" }, { value: "low", label: "🟡 Low" }]} />
      </div>
      <div className="mt-3">
        <Field label="My pre-planned policy" value={e.policy} onChange={(v) => onChange({ policy: v })} textarea />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-muted">
          <input type="checkbox" checked={e.done} onChange={(ev) => onChange({ done: ev.target.checked })} className="accent-[rgb(var(--accent))]" />
          Handled / passed
        </label>
        <div className="flex items-center gap-2">
          <Badge tone={IMPACT_TONE[e.impact]}>{e.impact} impact</Badge>
          <button onClick={() => { if (confirm("Delete event?")) onDelete(); }} className="text-subtle hover:text-bear"><Icon name="Trash2" size={14} /></button>
        </div>
      </div>
    </Card>
  );
}

export default function CalendarPage() {
  return <ClientOnly fallback={<div className="text-muted">Loading…</div>}><CalendarInner /></ClientOnly>;
}
