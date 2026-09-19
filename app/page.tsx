"use client";

import Link from "next/link";
import { useAcademy, computeStats } from "@/lib/store";
import { Card, Button, Icon, Stat, ClientOnly, Badge } from "@/components/ui";
import { PriceWidget } from "@/components/price-widget";

function ProgressRing({ pct, size = 68 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--border))" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="rgb(var(--accent))" strokeWidth={6} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)}
      />
    </svg>
  );
}

function DashboardInner() {
  const { modules, lessons, trades, snapshots, screenshots, mistakes, setups, progress, settings, glossary } = useAcademy();

  const completed = lessons.filter((l) => l.completed).length;
  const pct = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
  const mastered = lessons.filter((l) => l.status === "mastered").length;
  const review = lessons.filter((l) => l.status === "review").length;
  const stats = computeStats(trades);

  // next unfinished lesson
  const ordered = [...lessons].sort((a, b) => a.order - b.order);
  const next = ordered.find((l) => !l.completed);
  const nextModule = next ? modules.find((m) => m.id === next.moduleId) : null;

  const quizAttempts = Object.values(progress.quizScores);
  const quizPct = quizAttempts.length
    ? Math.round((quizAttempts.reduce((a, q) => a + q.correct, 0) / quizAttempts.reduce((a, q) => a + q.total, 0)) * 100)
    : null;

  const recentShots = [...screenshots].slice(0, 4);
  const studying = setups.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero / where am I */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Icon name="LayoutDashboard" size={16} /> Dashboard
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            {settings.learnerName ? `Welcome back, ${settings.learnerName}.` : "Where am I in my development as a trader?"}
          </h1>
          <p className="mt-2 max-w-2xl text-muted">
            A serious, honest picture of your progress. Trading skill compounds through deliberate practice and honest review —
            not badges. Keep the loop turning: learn → practise → journal → evaluate.
          </p>
        </div>
        <PriceWidget />
      </div>

      {/* Progress + Continue */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex items-center gap-4 p-5">
          <div className="relative flex items-center justify-center">
            <ProgressRing pct={pct} />
            <span className="absolute text-lg font-semibold tabular-nums">{pct}%</span>
          </div>
          <div>
            <div className="text-sm font-medium">Course completion</div>
            <div className="text-xs text-muted">{completed} of {lessons.length} lessons complete</div>
            <div className="mt-2 flex gap-2">
              <Badge tone="bull">{mastered} mastered</Badge>
              {review > 0 && <Badge tone="warn">{review} to review</Badge>}
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2 p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wide text-subtle">Continue learning</div>
            <Icon name="ArrowRight" size={16} className="text-subtle" />
          </div>
          {next ? (
            <Link href={`/learn?m=${next.moduleId}&l=${next.id}`} className="mt-3 block rounded-lg border border-border p-4 transition-colors hover:border-accent/50 hover:bg-elevated">
              <div className="text-xs text-accent">{nextModule?.title}</div>
              <div className="mt-0.5 text-lg font-medium">{next.title}</div>
              <div className="mt-1 text-sm text-muted line-clamp-2">{next.summary}</div>
              <div className="mt-2 text-xs text-subtle">~{next.estMinutes} min · click to open</div>
            </Link>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed border-border p-4 text-sm text-muted">
              🎉 You've completed every lesson. Now the real work: practise the labs, journal trades, and review your statistics.
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/start-here"><Button variant="primary" size="sm"><Icon name="Sparkles" size={14} /> The Mental Model</Button></Link>
            <Link href="/day-in-the-life"><Button size="sm"><Icon name="Sun" size={14} /> A Day Trading Gold</Button></Link>
            <Link href="/top-down"><Button size="sm"><Icon name="Layers" size={14} /> Top-Down Analysis</Button></Link>
          </div>
        </Card>
      </div>

      {/* Metric row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Concepts mastered" value={mastered} sub={`${glossary.length} in glossary`} tone="accent" />
        <Stat label="Simulated trades" value={stats.total} sub={`${stats.open} open · ${stats.closed} closed`} />
        <Stat label="Expectancy" value={`${stats.expectancy >= 0 ? "+" : ""}${stats.expectancy.toFixed(2)}R`} sub={`${(stats.winRate * 100).toFixed(0)}% win rate`} tone={stats.expectancy >= 0 ? "bull" : "bear"} />
        <Stat label="Rule violations" value={stats.violations} sub="honesty > ego" tone={stats.violations > 0 ? "warn" : undefined} />
      </div>

      {/* Two column: today's practice + review */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Icon name="Target" size={16} className="text-accent" />
            <h2 className="font-semibold">Today's Practice</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <PracticeCard href="/labs/market-structure" icon="Waypoints" title="Market Structure drill" hint="Classify HH/HL/LH/LL on synthetic charts of rising difficulty." />
            <PracticeCard href="/labs/candlestick" icon="CandlestickChart" title="Read a candle" hint="Find the open, close and rejected side — context over patterns." />
            <PracticeCard href="/top-down" icon="Layers" title="Log a top-down read" hint="Record Daily→5m bias and let the app summarise your bias." />
            <PracticeCard href="/journal" icon="NotebookPen" title="Journal a trade" hint="Capture context → trigger → invalidation → outcome honestly." />
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Icon name="RefreshCw" size={16} className="text-warn" />
            <h2 className="font-semibold">Needs review</h2>
          </div>
          {review > 0 ? (
            <div className="space-y-2">
              {lessons.filter((l) => l.status === "review").slice(0, 6).map((l) => (
                <Link key={l.id} href={`/learn?m=${l.moduleId}&l=${l.id}`} className="block rounded-lg border border-border px-3 py-2 text-sm hover:border-warn/50 hover:bg-elevated">
                  {l.title}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">
              Nothing flagged for review. Mark a lesson “Review” from inside it whenever a concept hasn't fully clicked — spaced repetition beats cramming.
            </p>
          )}
          {quizPct !== null && (
            <div className="mt-4 rounded-lg bg-elevated p-3">
              <div className="text-xs text-subtle">Quiz performance</div>
              <div className="text-xl font-semibold tabular-nums">{quizPct}%</div>
              <div className="text-xs text-muted">{quizAttempts.length} quizzes attempted</div>
            </div>
          )}
        </Card>
      </div>

      {/* Setups being studied + recent screenshots */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2"><Icon name="BookMarked" size={16} className="text-accent" /><h2 className="font-semibold">Setups being studied</h2></div>
            <Link href="/playbook" className="text-xs text-accent hover:underline">Playbook →</Link>
          </div>
          {studying.length ? (
            <div className="space-y-2">
              {studying.map((s) => (
                <Link key={s.id} href="/playbook" className="block rounded-lg border border-border px-3 py-2 hover:bg-elevated">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-muted line-clamp-1">{s.thesis || "No thesis yet"}</div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No setups yet. Build your first in the <Link href="/playbook" className="text-accent hover:underline">Playbook</Link>.</p>
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2"><Icon name="Images" size={16} className="text-accent" /><h2 className="font-semibold">Recent screenshots</h2></div>
            <Link href="/screenshots" className="text-xs text-accent hover:underline">Library →</Link>
          </div>
          {recentShots.length ? (
            <div className="grid grid-cols-4 gap-2">
              {recentShots.map((s) => (
                <img key={s.id} src={s.dataUrl} alt={s.title} className="aspect-video w-full rounded-md border border-border object-cover" />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No chart screenshots yet. Add them from the <Link href="/screenshots" className="text-accent hover:underline">Screenshot Library</Link> or attach to a trade.</p>
          )}
        </Card>
      </div>

      {/* Rules footer */}
      <Card className="border-accent/30 bg-accent/[0.04] p-5">
        <div className="flex items-start gap-3">
          <Icon name="ShieldCheck" size={20} className="mt-0.5 text-accent" />
          <div>
            <h2 className="font-semibold">Your current trading rules</h2>
            <p className="mt-1 text-sm text-muted">
              Risking <b className="text-fg">{settings.riskPercent}%</b> per trade on a <b className="text-fg">{settings.currency} {settings.accountBalance.toLocaleString()}</b> account
              = <b className="text-fg">{settings.currency} {((settings.riskPercent / 100) * settings.accountBalance).toFixed(2)}</b> max risk per trade.
              Edit these and your daily limits in <Link href="/settings" className="text-accent hover:underline">Settings</Link> and <Link href="/playbook" className="text-accent hover:underline">Playbook</Link>.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PracticeCard({ href, icon, title, hint }: { href: string; icon: string; title: string; hint: string }) {
  return (
    <Link href={href} className="group flex gap-3 rounded-lg border border-border p-3 transition-colors hover:border-accent/50 hover:bg-elevated">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"><Icon name={icon} size={18} /></div>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted">{hint}</div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  return (
    <ClientOnly fallback={<div className="text-muted">Loading your workspace…</div>}>
      <DashboardInner />
    </ClientOnly>
  );
}
