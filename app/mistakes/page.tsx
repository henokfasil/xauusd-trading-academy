"use client";

import { useState } from "react";
import { useAcademy } from "@/lib/store";
import { MistakeEntry } from "@/lib/types";
import { Card, Button, Icon, PageHeader, EmptyState, ClientOnly, Field } from "@/components/ui";

const COMMON: Partial<MistakeEntry>[] = [
  { title: "Moved my stop further away", description: "Widened the stop as price approached it, hoping it would come back.", correction: "Never widen a stop. Accept the planned loss; a small −1R is the cost of doing business. Widening turns small losses into account-threatening ones." },
  { title: "Entered without a trigger (FOMO)", description: "Chased a move that was already running, with no confirmation, afraid of missing out.", correction: "No trigger = no trade. Let the setup come to you; a missed trade costs nothing, a chased one costs money and confidence." },
  { title: "Oversized the position", description: "Risked far more than my planned % because I felt confident.", correction: "Size by risk every time. Confidence is not a sizing input; a fixed % is. One oversized loss can undo weeks of discipline." },
  { title: "Revenge traded after a loss", description: "Immediately took a bigger, unplanned trade to win back a loss.", correction: "Enforce a max daily loss. After hitting it, stop for the day — no exceptions. Tilt is the account-killer." },
  { title: "Traded into high-impact news", description: "Held/opened a normal technical trade through CPI/NFP/FOMC and got slipped.", correction: "Check the calendar first. Be flat into red-folder events or use a specific pre-planned news approach with worst-case sizing." },
];

function MistakesInner() {
  const { mistakes, addMistake, updateMistake, deleteMistake } = useAcademy();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        icon="TriangleAlert"
        title="Mistake Library"
        subtitle="Turn errors into assets. Log each recurring mistake, its cost, and the professional correction — then review before every session. What you name, you can tame."
        actions={<Button variant="primary" onClick={() => setOpenId(addMistake())}><Icon name="Plus" size={16} /> Log mistake</Button>}
      />

      {mistakes.length === 0 ? (
        <div>
          <EmptyState icon="TriangleAlert" title="No mistakes logged yet" hint="Add from the common list below, or log your own. Honesty here is what compounds into skill." />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COMMON.map((m, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-2 text-sm font-semibold"><Icon name="AlertCircle" size={15} className="text-bear" /> {m.title}</div>
                <p className="mt-1 text-xs text-muted line-clamp-2">{m.description}</p>
                <Button className="mt-3" size="sm" variant="outline" onClick={() => setOpenId(addMistake(m))}><Icon name="Plus" size={13} /> Add</Button>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {COMMON.map((m, i) => (
              <Button key={i} size="sm" variant="ghost" onClick={() => setOpenId(addMistake(m))}><Icon name="Plus" size={13} /> {m.title}</Button>
            ))}
          </div>
          {mistakes.map((m) => {
            const open = openId === m.id;
            return (
              <Card key={m.id} className={open ? "border-bear/40" : ""}>
                <button onClick={() => setOpenId(open ? null : m.id)} className="flex w-full items-center gap-3 p-4 text-left hover:bg-elevated/40">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bear/10 text-bear"><Icon name="AlertCircle" size={18} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{m.title}</div>
                    <div className="truncate text-xs text-muted">{m.description || "No description"}</div>
                  </div>
                  <Icon name="ChevronDown" size={16} className={`text-subtle transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                  <div className="border-t border-border p-4 space-y-3 animate-fade-in">
                    <Field label="Title" value={m.title} onChange={(v) => updateMistake(m.id, { title: v })} />
                    <Field label="What happened" value={m.description} onChange={(v) => updateMistake(m.id, { description: v })} textarea />
                    <Field label="Cost (R / $ / qualitative)" value={m.cost} onChange={(v) => updateMistake(m.id, { cost: v })} />
                    <div className="rounded-lg border border-bull/30 bg-bull/[0.05] p-3">
                      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-bull"><Icon name="Check" size={13} /> The correction</div>
                      <Field label="" value={m.correction} onChange={(v) => updateMistake(m.id, { correction: v })} textarea placeholder="The professional fix — what you'll do instead." />
                    </div>
                    <Field label="Tags (comma-separated)" value={m.tags.join(", ")} onChange={(v) => updateMistake(m.id, { tags: v.split(",").map((x) => x.trim()).filter(Boolean) })} />
                    <div className="flex justify-end">
                      <Button size="sm" variant="danger" onClick={() => { if (confirm("Delete this entry?")) { deleteMistake(m.id); setOpenId(null); } }}><Icon name="Trash2" size={14} /> Delete</Button>
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

export default function MistakesPage() {
  return <ClientOnly fallback={<div className="text-muted">Loading…</div>}><MistakesInner /></ClientOnly>;
}
