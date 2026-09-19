"use client";

import { useMemo } from "react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell } from "recharts";
import { useAcademy, computeStats } from "@/lib/store";
import { Card, Icon, PageHeader, Stat, EmptyState, ClientOnly, Badge } from "@/components/ui";

function StatisticsInner() {
  const { trades } = useAcademy();
  const s = computeStats(trades);

  const rHistogram = useMemo(() => {
    const buckets: Record<string, number> = {};
    trades.filter((t) => typeof t.rMultiple === "number").forEach((t) => {
      const r = Math.round(t.rMultiple as number);
      const key = String(r);
      buckets[key] = (buckets[key] ?? 0) + 1;
    });
    return Object.entries(buckets)
      .map(([r, count]) => ({ r: Number(r), count }))
      .sort((a, b) => a.r - b.r);
  }, [trades]);

  const bySession = useMemo(() => {
    const m: Record<string, { r: number; n: number }> = {};
    trades.filter((t) => typeof t.rMultiple === "number").forEach((t) => {
      m[t.session] = m[t.session] || { r: 0, n: 0 };
      m[t.session].r += t.rMultiple as number;
      m[t.session].n += 1;
    });
    return Object.entries(m).map(([session, v]) => ({ session, r: Number(v.r.toFixed(2)), n: v.n }));
  }, [trades]);

  if (s.closed === 0) {
    return (
      <div>
        <PageHeader icon="BarChart3" title="Statistics" subtitle="Evaluate your strategy over a SAMPLE — expectancy, win rate, average R and your equity curve. One trade is noise; the sample reveals the edge." />
        <EmptyState
          icon="BarChart3"
          title="No closed trades yet"
          hint="Journal and close some trades (aim for 20–30 before judging a strategy). Then this page computes your expectancy and equity curve."
          action={<Link href="/journal"><Badge tone="accent" className="cursor-pointer px-3 py-1.5">Go to Journal →</Badge></Link>}
        />
      </div>
    );
  }

  const smallSample = s.closed < 20;

  return (
    <div>
      <PageHeader icon="BarChart3" title="Statistics" subtitle="Think like a researcher: judge the process across the sample, not any single outcome." />

      {smallSample && (
        <Card className="mb-6 border-warn/30 bg-warn/[0.05] p-4">
          <div className="flex items-start gap-2 text-sm">
            <Icon name="TriangleAlert" size={16} className="mt-0.5 shrink-0 text-warn" />
            <span className="text-muted"><b className="text-fg">Small sample ({s.closed} trades).</b> These numbers are dominated by variance right now. Aim for at least 20–30 trades by the same rules before drawing conclusions — judging a strategy on a handful of trades is like judging a coin on 5 flips.</span>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Expectancy" value={`${s.expectancy >= 0 ? "+" : ""}${s.expectancy.toFixed(2)}R`} sub="avg R per trade" tone={s.expectancy >= 0 ? "bull" : "bear"} />
        <Stat label="Win rate" value={`${(s.winRate * 100).toFixed(0)}%`} sub={`${s.wins}W / ${s.losses}L`} />
        <Stat label="Total R" value={`${s.totalR >= 0 ? "+" : ""}${s.totalR.toFixed(1)}R`} tone={s.totalR >= 0 ? "bull" : "bear"} />
        <Stat label="Avg win / loss" value={`+${s.avgWin.toFixed(1)} / ${s.avgLoss.toFixed(1)}`} sub="in R" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Net P&L" value={`${s.pnl >= 0 ? "+" : ""}${s.pnl.toFixed(0)}`} sub="account currency" tone={s.pnl >= 0 ? "bull" : "bear"} />
        <Stat label="Plan adherence" value={`${Math.round((s.followed / s.closed) * 100)}%`} tone="accent" />
        <Stat label="Rule violations" value={s.violations} tone={s.violations > 0 ? "warn" : undefined} />
        <Stat label="Sample size" value={s.closed} sub={`${s.open} still open`} />
      </div>

      {/* Equity curve */}
      <Card className="mt-6 p-5">
        <div className="mb-3 flex items-center gap-2"><Icon name="TrendingUp" size={16} className="text-accent" /><h2 className="font-semibold">Equity curve (cumulative R)</h2></div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={s.curve} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
              <XAxis dataKey="i" stroke="rgb(var(--subtle))" fontSize={11} tickLine={false} />
              <YAxis stroke="rgb(var(--subtle))" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "rgb(var(--surface))", border: "1px solid rgb(var(--border))", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "rgb(var(--muted))" }}
                formatter={(v: any) => [`${v}R`, "Cumulative"]}
              />
              <ReferenceLine y={0} stroke="rgb(var(--border))" />
              <Line type="monotone" dataKey="r" stroke="rgb(var(--accent))" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* R distribution */}
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2"><Icon name="BarChart3" size={16} className="text-accent" /><h2 className="font-semibold">R-multiple distribution</h2></div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rHistogram} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <XAxis dataKey="r" stroke="rgb(var(--subtle))" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}R`} />
                <YAxis stroke="rgb(var(--subtle))" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "rgb(var(--surface))", border: "1px solid rgb(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <ReferenceLine x={0} stroke="rgb(var(--border))" />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {rHistogram.map((d, i) => (
                    <Cell key={i} fill={d.r >= 0 ? "rgb(var(--bull))" : "rgb(var(--bear))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* By session */}
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2"><Icon name="Clock" size={16} className="text-accent" /><h2 className="font-semibold">Performance by session (total R)</h2></div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bySession} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <XAxis dataKey="session" stroke="rgb(var(--subtle))" fontSize={11} tickLine={false} />
                <YAxis stroke="rgb(var(--subtle))" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: "rgb(var(--surface))", border: "1px solid rgb(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: any, n: any, p: any) => [`${v}R (${p.payload.n} trades)`, p.payload.session]} />
                <ReferenceLine y={0} stroke="rgb(var(--border))" />
                <Bar dataKey="r" radius={[3, 3, 0, 0]}>
                  {bySession.map((d, i) => (
                    <Cell key={i} fill={d.r >= 0 ? "rgb(var(--bull))" : "rgb(var(--bear))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-6 border-accent/30 bg-accent/[0.04] p-5">
        <div className="flex items-start gap-3">
          <Icon name="Lightbulb" size={20} className="mt-0.5 text-accent" />
          <div className="text-sm">
            <b>How to read this like a pro:</b>
            <ul className="mt-1.5 list-disc pl-5 text-muted space-y-1">
              <li>Positive <b>expectancy</b> with a rising equity curve = a real edge worth scaling — slowly.</li>
              <li>High win rate but flat/negative curve = your losers are too big relative to winners (reward-to-risk problem).</li>
              <li>Look for <b>where</b> you make and lose R (session, setup). Cut what leaks; do more of what works.</li>
              <li>Separate <b>plan adherence</b> from results — fix process leaks first, they compound.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function StatisticsPage() {
  return <ClientOnly fallback={<div className="text-muted">Loading statistics…</div>}><StatisticsInner /></ClientOnly>;
}
