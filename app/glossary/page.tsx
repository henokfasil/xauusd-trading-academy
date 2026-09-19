"use client";

import { useMemo, useState } from "react";
import { useAcademy } from "@/lib/store";
import { Card, Button, Icon, PageHeader, Badge, ClientOnly, Field, EditableText } from "@/components/ui";

function GlossaryInner() {
  const { glossary, upsertTerm, deleteTerm } = useAcademy();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [editingId, setEditingId] = useState<string | null>(null);

  const categories = useMemo(() => ["All", ...Array.from(new Set(glossary.map((g) => g.category))).sort()], [glossary]);
  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    return glossary
      .filter((g) => (cat === "All" ? true : g.category === cat))
      .filter((g) => !ql || g.term.toLowerCase().includes(ql) || g.definition.toLowerCase().includes(ql))
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [glossary, q, cat]);

  const addNew = () => {
    upsertTerm({ term: "New term", definition: "", category: cat === "All" ? "General" : cat });
  };

  return (
    <div>
      <PageHeader
        icon="BookA"
        title="Glossary"
        subtitle={`${glossary.length} terms. Every definition is editable — click a term or definition to change it, or add your own.`}
        actions={<Button variant="primary" onClick={addNew}><Icon name="Plus" size={16} /> Add term</Button>}
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms and definitions…" className="w-full rounded-lg border border-border bg-elevated py-2 pl-9 pr-3 text-sm outline-none focus:border-accent/60" />
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${cat === c ? "border-accent/50 bg-accent/10 text-accent" : "border-border text-muted hover:bg-elevated"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((g) => (
          <Card key={g.id} className="group p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="font-semibold">
                <EditableText value={g.term} onChange={(v) => upsertTerm({ id: g.id, term: v })} inputClassName="font-semibold" />
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => setEditingId(editingId === g.id ? null : g.id)} className="text-subtle hover:text-accent" title="Edit details"><Icon name="Pencil" size={13} /></button>
                <button onClick={() => { if (confirm(`Delete "${g.term}"?`)) deleteTerm(g.id); }} className="text-subtle hover:text-bear" title="Delete"><Icon name="Trash2" size={13} /></button>
              </div>
            </div>
            <Badge tone="muted" className="mt-1">{g.category}</Badge>
            <p className="mt-2 text-sm text-muted">
              <EditableText as="textarea" value={g.definition} onChange={(v) => upsertTerm({ id: g.id, definition: v })} placeholder="Add a definition…" />
            </p>
            {(g.example || editingId === g.id) && (
              <p className="mt-2 border-t border-border pt-2 text-xs italic text-subtle">
                e.g. <EditableText as="textarea" value={g.example ?? ""} onChange={(v) => upsertTerm({ id: g.id, example: v })} placeholder="Add an example…" />
              </p>
            )}
            {editingId === g.id && (
              <div className="mt-3">
                <Field label="Category" value={g.category} onChange={(v) => upsertTerm({ id: g.id, category: v })} />
              </div>
            )}
          </Card>
        ))}
      </div>
      {filtered.length === 0 && <p className="py-16 text-center text-muted">No terms match your search.</p>}
    </div>
  );
}

export default function GlossaryPage() {
  return <ClientOnly fallback={<div className="text-muted">Loading glossary…</div>}><GlossaryInner /></ClientOnly>;
}
