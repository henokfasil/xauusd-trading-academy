"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { useAcademy } from "@/lib/store";
import { PlaybookSetup } from "@/lib/types";
import { Card, Button, Icon, PageHeader, Badge, EmptyState, ClientOnly, Field } from "@/components/ui";

const STARTERS: Partial<PlaybookSetup>[] = [
  {
    name: "Sweep & Reclaim (London open)",
    thesis: "Fade the London stop-hunt of the Asian range.",
    context: "Quiet Asian range formed; HTF has a directional bias.",
    location: "Asian session high or low (obvious liquidity).",
    trigger: "Price sweeps the level, then a 5m candle closes back inside (reclaim).",
    invalidation: "A decisive close back beyond the swept extreme.",
    management: "Take partial at +1R, stop to breakeven, trail under new structure.",
    targets: "Opposite side of the Asian range / next key level (aim ≥2R).",
  },
  {
    name: "Break & Retest (continuation)",
    thesis: "Join the trend after a level breaks and holds on the retest.",
    context: "HTF trend intact; a clear level just broke with momentum.",
    location: "The broken level (old resistance→support or vice-versa).",
    trigger: "Pullback to the level + a rejection close holding it.",
    invalidation: "Price closes back through the level (break failed).",
    management: "Breakeven at +1R; hold remainder to target.",
    targets: "Measured move / next swing (aim ≥2R).",
  },
  {
    name: "Rejection at HTF level",
    thesis: "Fade price into a strong higher-timeframe level.",
    context: "Price extended into a major 4H/Daily S/R zone.",
    location: "The HTF zone (drawn as an area).",
    trigger: "Clear rejection candle (long wick) + LTF structure shift.",
    invalidation: "Close beyond the far side of the zone.",
    management: "Scale out into the move; trail.",
    targets: "Prior swing / mean (aim ≥2R).",
  },
];

function PlaybookInner() {
  const { setups, addSetup, updateSetup, deleteSetup } = useAcademy();
  const [openId, setOpenId] = useState<string | null>(setups[0]?.id ?? null);

  return (
    <div>
      <PageHeader
        icon="BookMarked"
        title="Playbook"
        subtitle="Your personal library of setups — each a written, checkable definition of an edge. If a trade isn't in your playbook, you don't take it."
        actions={<Button variant="primary" onClick={() => setOpenId(addSetup())}><Icon name="Plus" size={16} /> New setup</Button>}
      />

      {setups.length === 0 ? (
        <div>
          <EmptyState icon="BookMarked" title="No setups yet" hint="Start from a proven template below, or build your own from scratch." />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {STARTERS.map((s, i) => (
              <Card key={i} className="p-4">
                <div className="text-sm font-semibold">{s.name}</div>
                <p className="mt-1 text-xs text-muted">{s.thesis}</p>
                <Button className="mt-3" size="sm" variant="outline" onClick={() => setOpenId(addSetup(s))}><Icon name="Plus" size={13} /> Add this</Button>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {STARTERS.map((s, i) => (
              <Button key={i} size="sm" variant="ghost" onClick={() => setOpenId(addSetup(s))}><Icon name="Plus" size={13} /> {s.name}</Button>
            ))}
          </div>
          {setups.map((s) => {
            const open = openId === s.id;
            return (
              <Card key={s.id} className={open ? "border-accent/40" : ""}>
                <button onClick={() => setOpenId(open ? null : s.id)} className="flex w-full items-center gap-3 p-4 text-left hover:bg-elevated/40">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"><Icon name="BookMarked" size={18} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{s.name}</div>
                    <div className="truncate text-xs text-muted">{s.thesis || "No thesis yet"}</div>
                  </div>
                  <Badge tone="muted">{s.checklist.length} checks</Badge>
                  <Icon name="ChevronDown" size={16} className={`text-subtle transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                {open && <SetupEditor setup={s} onChange={(p) => updateSetup(s.id, p)} onDelete={() => { deleteSetup(s.id); setOpenId(null); }} />}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SetupEditor({ setup, onChange, onDelete }: { setup: PlaybookSetup; onChange: (p: Partial<PlaybookSetup>) => void; onDelete: () => void }) {
  const addCheck = () => onChange({ checklist: [...setup.checklist, { id: nanoid(6), text: "New checklist item" }] });
  const updateCheck = (id: string, text: string) => onChange({ checklist: setup.checklist.map((c) => (c.id === id ? { ...c, text } : c)) });
  const delCheck = (id: string) => onChange({ checklist: setup.checklist.filter((c) => c.id !== id) });

  return (
    <div className="border-t border-border p-4 space-y-4 animate-fade-in">
      <Field label="Setup name" value={setup.name} onChange={(v) => onChange({ name: v })} />
      <Field label="Thesis (the edge in one line)" value={setup.thesis} onChange={(v) => onChange({ thesis: v })} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Context (when it applies)" value={setup.context} onChange={(v) => onChange({ context: v })} textarea />
        <Field label="Location (where)" value={setup.location} onChange={(v) => onChange({ location: v })} textarea />
        <Field label="Trigger (entry condition)" value={setup.trigger} onChange={(v) => onChange({ trigger: v })} textarea />
        <Field label="Invalidation (stop logic)" value={setup.invalidation} onChange={(v) => onChange({ invalidation: v })} textarea />
        <Field label="Management" value={setup.management} onChange={(v) => onChange({ management: v })} textarea />
        <Field label="Targets (exit logic)" value={setup.targets} onChange={(v) => onChange({ targets: v })} textarea />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent">Pre-trade checklist</span>
          <Button size="sm" variant="ghost" onClick={addCheck}><Icon name="Plus" size={13} /> Add item</Button>
        </div>
        <div className="space-y-1.5">
          {setup.checklist.length === 0 && <p className="text-xs text-subtle italic">No checklist items. Add the conditions that MUST be true before you take this trade.</p>}
          {setup.checklist.map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <Icon name="CheckSquare" size={15} className="shrink-0 text-subtle" />
              <input value={c.text} onChange={(e) => updateCheck(c.id, e.target.value)} className="flex-1 rounded-md border border-border bg-elevated px-2 py-1 text-sm outline-none focus:border-accent/50" />
              <button onClick={() => delCheck(c.id)} className="text-subtle hover:text-bear"><Icon name="X" size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end border-t border-border pt-3">
        <Button size="sm" variant="danger" onClick={() => { if (confirm(`Delete "${setup.name}"?`)) onDelete(); }}><Icon name="Trash2" size={14} /> Delete setup</Button>
      </div>
    </div>
  );
}

export default function PlaybookPage() {
  return <ClientOnly fallback={<div className="text-muted">Loading playbook…</div>}><PlaybookInner /></ClientOnly>;
}
