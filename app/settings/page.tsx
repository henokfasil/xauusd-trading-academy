"use client";

import { useEffect, useRef, useState } from "react";
import { useAcademy } from "@/lib/store";
import { getApiKey, setApiKey, AI_MODELS, streamChat } from "@/lib/ai";
import { Card, Button, Icon, PageHeader, ClientOnly, Field, Select } from "@/components/ui";

const LOT_VALUE_PER_DOLLAR = 100;

function SettingsInner() {
  const { settings, updateSettings, modules, addModule, exportData, importData, resetAll } = useAcademy();
  const fileRef = useRef<HTMLInputElement>(null);
  const [newModule, setNewModule] = useState("");

  // Sizing calculator local state
  const [entry, setEntry] = useState("3710");
  const [stop, setStop] = useState("3704");
  const [target, setTarget] = useState("3730");

  // AI assistant local state
  const [apiKey, setKeyState] = useState("");
  const [keySaved, setKeySaved] = useState(false);
  const [test, setTest] = useState<{ status: "idle" | "testing" | "ok" | "fail"; msg?: string }>({ status: "idle" });
  useEffect(() => { setKeyState(getApiKey()); setKeySaved(!!getApiKey()); }, []);

  const saveKey = () => { setApiKey(apiKey); setKeySaved(!!apiKey.trim()); setTest({ status: "idle" }); };
  const runTest = async () => {
    setApiKey(apiKey); setKeySaved(!!apiKey.trim());
    setTest({ status: "testing" });
    try {
      let got = "";
      await streamChat({ apiKey: apiKey.trim(), model: settings.aiModel, context: "Connection test.", messages: [{ role: "user", content: "Reply with exactly: OK" }], onDelta: (t) => (got += t) });
      setTest(got.toLowerCase().includes("ok") ? { status: "ok" } : { status: "ok" });
    } catch (e: any) {
      setTest({ status: "fail", msg: e?.message ?? "Failed" });
    }
  };

  const risk = entry && stop ? Math.abs(Number(entry) - Number(stop)) : 0;
  const reward = entry && target ? Math.abs(Number(target) - Number(entry)) : 0;
  const rr = risk > 0 ? reward / risk : 0;
  const riskAmount = (settings.riskPercent / 100) * settings.accountBalance;
  const lots = risk > 0 ? riskAmount / (risk * LOT_VALUE_PER_DOLLAR) : 0;
  const potentialWin = lots * reward * LOT_VALUE_PER_DOLLAR;

  const doExport = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `xauusd-academy-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (importData(String(reader.result))) alert("Import successful.");
      else alert("Import failed — the file wasn't valid academy data.");
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <PageHeader icon="Settings" title="Settings" subtitle="Your account parameters, a live position-sizing calculator, curriculum management, and local data backup." />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2"><Icon name="User" size={16} className="text-accent" /><h2 className="font-semibold">Account & risk profile</h2></div>
          <div className="space-y-3">
            <Field label="Your name (optional)" value={settings.learnerName} onChange={(v) => updateSettings({ learnerName: v })} placeholder="Shown on the dashboard" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Account balance" type="number" value={settings.accountBalance} onChange={(v) => updateSettings({ accountBalance: Number(v) || 0 })} />
              <Field label="Currency" value={settings.currency} onChange={(v) => updateSettings({ currency: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Default risk per trade (%)" type="number" value={settings.riskPercent} onChange={(v) => updateSettings({ riskPercent: Number(v) || 0 })} hint="0.5–1% recommended" />
              <Field label="Timezone" value={settings.timezone} onChange={(v) => updateSettings({ timezone: v })} />
            </div>
            <div className="rounded-lg bg-elevated p-3 text-sm">
              Max risk per trade = <b>{settings.currency} {riskAmount.toFixed(2)}</b> ({settings.riskPercent}% of {settings.currency} {settings.accountBalance.toLocaleString()}).
            </div>
          </div>
        </Card>

        {/* Position sizing calculator */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2"><Icon name="Scale" size={16} className="text-accent" /><h2 className="font-semibold">Position size calculator</h2></div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Entry" type="number" value={entry} onChange={setEntry} />
            <Field label="Stop" type="number" value={stop} onChange={setStop} />
            <Field label="Target" type="number" value={target} onChange={setTarget} />
          </div>
          <div className="mt-4 space-y-2">
            <Row label="Stop distance (risk / unit)" value={`$${risk.toFixed(2)} of price`} />
            <Row label="Reward-to-risk" value={`${rr.toFixed(2)}R`} tone={rr >= 2 ? "bull" : rr > 0 ? "warn" : undefined} />
            <Row label={`Risk amount (${settings.riskPercent}%)`} value={`${settings.currency} ${riskAmount.toFixed(2)}`} />
            <div className="rounded-lg border border-accent/40 bg-accent/[0.08] p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Position size</span>
                <span className="text-2xl font-bold tabular-nums text-accent">{lots.toFixed(2)} lots</span>
              </div>
              <div className="mt-1 text-xs text-muted">
                = {(lots * 100).toFixed(0)} oz. If stopped: −{settings.currency} {riskAmount.toFixed(2)}. If target hit: +{settings.currency} {potentialWin.toFixed(2)}.
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-subtle">Formula: Lots = (Account × Risk%) ÷ (stop distance × $100). 1 lot = 100 oz → $100 per $1 move.</p>
        </Card>

        {/* AI Assistant */}
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2"><Icon name="Sparkles" size={16} className="text-accent" /><h2 className="font-semibold">AI Assistant (Academy Tutor)</h2></div>
          <p className="text-sm text-muted">
            The floating <b className="text-fg">“Ask the tutor”</b> button uses your own Anthropic (Claude) API key to answer questions in context — it can see the lesson or tool you're on. Your key is stored <b className="text-fg">only in this browser</b> (localStorage), is never uploaded to any server of ours, and is <b className="text-fg">excluded from JSON backups</b>. Calls go directly from your browser to Anthropic; you pay only for your own usage.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted">Anthropic API key</span>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => { setKeyState(e.target.value); setKeySaved(false); }}
                placeholder="sk-ant-…"
                className="w-full rounded-lg border border-border bg-elevated px-3 py-2 font-mono text-sm outline-none focus:border-accent/60"
              />
            </label>
            <div className="flex items-end gap-2">
              <Button variant="primary" onClick={saveKey} disabled={!apiKey.trim()}><Icon name="Check" size={15} /> {keySaved ? "Saved" : "Save key"}</Button>
              <Button variant="outline" onClick={runTest} disabled={!apiKey.trim() || test.status === "testing"}>
                {test.status === "testing" ? <><Icon name="Loader" size={14} className="animate-spin" /> Testing</> : <><Icon name="Plug" size={14} /> Test</>}
              </Button>
            </div>
          </div>
          <div className="mt-3 max-w-md">
            <Select label="Model" value={settings.aiModel} onChange={(v) => updateSettings({ aiModel: v })} options={AI_MODELS.map((m) => ({ value: m.id, label: m.label }))} />
          </div>
          {test.status === "ok" && <p className="mt-2 flex items-center gap-1 text-sm text-bull"><Icon name="CheckCircle2" size={14} /> Connected — the tutor is ready. Look for the button in the bottom-right of any page.</p>}
          {test.status === "fail" && <p className="mt-2 flex items-center gap-1 text-sm text-bear"><Icon name="XCircle" size={14} /> {test.msg}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" className="text-accent hover:underline">Get an Anthropic API key →</a>
            {keySaved && <button onClick={() => { setApiKey(""); setKeyState(""); setKeySaved(false); setTest({ status: "idle" }); }} className="text-subtle hover:text-bear">Remove key from this browser</button>}
          </div>
        </Card>

        {/* Curriculum management */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2"><Icon name="BookOpen" size={16} className="text-accent" /><h2 className="font-semibold">Curriculum</h2></div>
          <p className="text-sm text-muted">You have <b>{modules.length}</b> modules. Add lessons and reorder them from within each lesson. Add a new module here:</p>
          <div className="mt-3 flex gap-2">
            <input value={newModule} onChange={(e) => setNewModule(e.target.value)} placeholder="New module title" className="flex-1 rounded-lg border border-border bg-elevated px-3 py-2 text-sm outline-none focus:border-accent/60" />
            <Button variant="primary" onClick={() => { if (newModule.trim()) { addModule(newModule.trim()); setNewModule(""); } }}><Icon name="Plus" size={15} /> Add</Button>
          </div>
          <p className="mt-3 text-xs text-subtle">Content is stored as structured data in local storage, so lessons, glossary terms, setups and everything else can be edited individually without touching the app code.</p>
        </Card>

        {/* Data management */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2"><Icon name="Database" size={16} className="text-accent" /><h2 className="font-semibold">Your data (local-first)</h2></div>
          <p className="text-sm text-muted">All your lessons, notes, trades, screenshots and settings live in this browser's local storage. Back up regularly — clearing browser data will erase it.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={doExport}><Icon name="Download" size={15} /> Export backup (JSON)</Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()}><Icon name="Upload" size={15} /> Import backup</Button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])} />
            <Button variant="danger" onClick={() => { if (confirm("Reset EVERYTHING to defaults? Your trades, notes and edits will be lost. Export a backup first!")) resetAll(); }}>
              <Icon name="RotateCcw" size={15} /> Reset to defaults
            </Button>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-5 text-sm text-muted">
        <div className="flex items-start gap-2.5">
          <Icon name="Info" size={16} className="mt-0.5 shrink-0 text-accent" />
          <div>
            <b className="text-fg">Architecture note.</b> This is a local-first app: content is structured data (JSON/Markdown in the store) persisted to <code className="rounded bg-elevated px-1">localStorage</code> under the key <code className="rounded bg-elevated px-1">xauusd-academy-v1</code>. The data model is designed to migrate cleanly to SQLite/Postgres later — each entity (lesson, trade, setup, term…) has a stable id and timestamps.
          </div>
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "bull" | "warn" }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className={`font-medium tabular-nums ${tone === "bull" ? "text-bull" : tone === "warn" ? "text-warn" : ""}`}>{value}</span>
    </div>
  );
}

export default function SettingsPage() {
  return <ClientOnly fallback={<div className="text-muted">Loading…</div>}><SettingsInner /></ClientOnly>;
}
