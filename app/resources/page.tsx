"use client";

import { useMemo } from "react";
import { useAcademy } from "@/lib/store";
import { Card, Button, Icon, PageHeader, ClientOnly, EditableText, Badge } from "@/components/ui";

function ResourcesInner() {
  const { resources, addResource, updateResource, deleteResource } = useAcademy();
  const grouped = useMemo(() => {
    const g: Record<string, typeof resources> = {};
    resources.forEach((r) => { (g[r.category] = g[r.category] || []).push(r); });
    return g;
  }, [resources]);

  return (
    <div>
      <PageHeader
        icon="Link2"
        title="Resources"
        subtitle="Your curated links — data feeds, calendars, charting tools, references. Fully editable; add your own as you find them."
        actions={<Button variant="primary" onClick={() => addResource()}><Icon name="Plus" size={16} /> Add resource</Button>}
      />

      <div className="space-y-6">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle">{cat}</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((r) => (
                <Card key={r.id} className="group p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium"><EditableText value={r.title} onChange={(v) => updateResource(r.id, { title: v })} inputClassName="font-medium" /></div>
                      <div className="mt-0.5 text-xs">
                        {r.url ? (
                          <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                            <Icon name="ExternalLink" size={11} /> {r.url.replace(/^https?:\/\//, "").slice(0, 40)}
                          </a>
                        ) : (
                          <EditableText value={r.url} onChange={(v) => updateResource(r.id, { url: v })} placeholder="Add URL…" className="text-xs" />
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button onClick={() => { const v = prompt("URL", r.url); if (v !== null) updateResource(r.id, { url: v }); }} className="text-subtle hover:text-accent" title="Edit URL"><Icon name="Pencil" size={13} /></button>
                      <button onClick={() => { if (confirm(`Delete "${r.title}"?`)) deleteResource(r.id); }} className="text-subtle hover:text-bear"><Icon name="Trash2" size={13} /></button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-muted"><EditableText as="textarea" value={r.note} onChange={(v) => updateResource(r.id, { note: v })} placeholder="Add a note…" /></div>
                  <div className="mt-2"><Badge tone="muted"><EditableText value={r.category} onChange={(v) => updateResource(r.id, { category: v })} /></Badge></div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Card className="mt-8 border-warn/30 bg-warn/[0.05] p-4">
        <div className="flex items-start gap-2.5 text-sm">
          <Icon name="ShieldAlert" size={16} className="mt-0.5 shrink-0 text-warn" />
          <span className="text-muted">A note on external content: this academy teaches a <b className="text-fg">process</b>, not signals. Treat signal groups, “gurus”, and get-rich content with heavy scepticism — the enduring edge is your own tested playbook and disciplined risk management, not someone else's calls.</span>
        </div>
      </Card>
    </div>
  );
}

export default function ResourcesPage() {
  return <ClientOnly fallback={<div className="text-muted">Loading…</div>}><ResourcesInner /></ClientOnly>;
}
