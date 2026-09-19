"use client";

import { useRef, useState } from "react";
import { useAcademy } from "@/lib/store";
import { Card, Button, Icon, PageHeader, EmptyState, ClientOnly, EditableText, Badge } from "@/components/ui";

function ScreenshotsInner() {
  const { screenshots, addScreenshot, updateScreenshot, deleteScreenshot } = useAcademy();
  const fileRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [zoom, setZoom] = useState<string | null>(null);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => addScreenshot({ title: file.name.replace(/\.[^.]+$/, ""), dataUrl: String(reader.result), note: "", tags: [] });
      reader.readAsDataURL(file);
    });
  };

  const filtered = screenshots.filter((s) => !q || s.title.toLowerCase().includes(q.toLowerCase()) || s.note.toLowerCase().includes(q.toLowerCase()) || s.tags.some((t) => t.toLowerCase().includes(q.toLowerCase())));
  const zoomed = screenshots.find((s) => s.id === zoom);

  return (
    <div>
      <PageHeader
        icon="Images"
        title="Screenshot Library"
        subtitle="Annotate and store chart screenshots locally. Capture entries, exits, mistakes and A+ setups — memory distorts within minutes, images don't."
        actions={<Button variant="primary" onClick={() => fileRef.current?.click()}><Icon name="Upload" size={16} /> Add images</Button>}
      />
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />

      {screenshots.length > 0 && (
        <div className="relative mb-5 max-w-sm">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, note, tag…" className="w-full rounded-lg border border-border bg-elevated py-2 pl-9 pr-3 text-sm outline-none focus:border-accent/60" />
        </div>
      )}

      {screenshots.length === 0 ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
        >
          <EmptyState
            icon="ImagePlus"
            title="No screenshots yet"
            hint="Drag & drop chart images here, or click 'Add images'. Everything is stored locally in your browser."
            action={<Button variant="primary" onClick={() => fileRef.current?.click()}><Icon name="Upload" size={16} /> Add images</Button>}
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <Card key={s.id} className="group overflow-hidden">
              <div className="relative">
                <img src={s.dataUrl} alt={s.title} className="aspect-video w-full cursor-zoom-in object-cover" onClick={() => setZoom(s.id)} />
                <button onClick={() => { if (confirm("Delete this screenshot?")) deleteScreenshot(s.id); }} className="absolute right-2 top-2 rounded-md bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-bear"><Icon name="Trash2" size={14} /></button>
              </div>
              <div className="p-3">
                <div className="font-medium"><EditableText value={s.title} onChange={(v) => updateScreenshot(s.id, { title: v })} inputClassName="font-medium" /></div>
                <div className="mt-1 text-sm text-muted"><EditableText as="textarea" value={s.note} onChange={(v) => updateScreenshot(s.id, { note: v })} placeholder="Add an observation…" /></div>
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {s.tags.map((t) => <Badge key={t} tone="muted">{t}</Badge>)}
                  <EditableText value="" onChange={(v) => { if (v.trim()) updateScreenshot(s.id, { tags: [...s.tags, v.trim()] }); }} placeholder="+ tag" className="text-xs text-accent" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {zoomed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-8" onClick={() => setZoom(null)}>
          <div className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={zoomed.dataUrl} alt={zoomed.title} className="max-h-[80vh] rounded-lg" />
            <div className="mt-2 text-center text-white">
              <div className="font-medium">{zoomed.title}</div>
              {zoomed.note && <div className="text-sm text-white/70">{zoomed.note}</div>}
            </div>
          </div>
          <button className="absolute right-4 top-4 text-white/70 hover:text-white" onClick={() => setZoom(null)}><Icon name="X" size={24} /></button>
        </div>
      )}
    </div>
  );
}

export default function ScreenshotsPage() {
  return <ClientOnly fallback={<div className="text-muted">Loading…</div>}><ScreenshotsInner /></ClientOnly>;
}
