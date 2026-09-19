"use client";

import { useEffect, useRef, useState } from "react";
import { Card, Icon, Badge } from "./ui";

interface PriceState {
  price: number;
  prev: number | null;
  updatedAt: string;
  status: "loading" | "ok" | "error";
}

// Free, key-less, CORS-enabled gold spot endpoint (USD per troy ounce).
const ENDPOINT = "https://api.gold-api.com/price/XAU";

export function PriceWidget({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<PriceState>({ price: 0, prev: null, updatedAt: "", status: "loading" });
  const prevRef = useRef<number | null>(null);

  const fetchPrice = async () => {
    try {
      const res = await fetch(ENDPOINT, { cache: "no-store" });
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      const price = Number(data.price);
      if (!isFinite(price) || price <= 0) throw new Error("bad price");
      setState((s) => ({ price, prev: prevRef.current, updatedAt: new Date().toLocaleTimeString(), status: "ok" }));
      prevRef.current = price;
    } catch {
      setState((s) => ({ ...s, status: s.price ? "ok" : "error" }));
    }
  };

  useEffect(() => {
    fetchPrice();
    const id = setInterval(fetchPrice, 30_000);
    return () => clearInterval(id);
  }, []);

  const change = state.prev != null ? state.price - state.prev : 0;
  const up = change >= 0;

  if (state.status === "error") {
    return (
      <Card className={compact ? "p-3" : "p-4"}>
        <div className="flex items-center gap-2 text-sm text-muted">
          <Icon name="WifiOff" size={15} className="text-subtle" />
          Live gold price unavailable (offline or blocked). The academy works fully without it.
        </div>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5">
        <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-accent opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-accent" /></span>
        <span className="text-xs font-medium text-subtle">XAU/USD</span>
        <span className="font-mono text-sm font-semibold tabular-nums">
          {state.status === "loading" ? "…" : state.price.toFixed(2)}
        </span>
      </div>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-warn text-accent-fg font-bold">Au</div>
          <div>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              XAU/USD <span className="flex h-1.5 w-1.5 rounded-full bg-bull" title="live" />
            </div>
            <div className="text-xs text-subtle">Live spot gold · USD / troy ounce</div>
          </div>
        </div>
        <Badge tone="muted">read-only</Badge>
      </div>

      <div className="mt-4 flex items-end gap-3">
        <div className="font-mono text-3xl font-semibold tabular-nums">
          {state.status === "loading" ? "…" : state.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        {state.prev != null && change !== 0 && (
          <div className={`mb-1 flex items-center gap-1 text-sm font-medium ${up ? "text-bull" : "text-bear"}`}>
            <Icon name={up ? "ArrowUp" : "ArrowDown"} size={14} />
            {up ? "+" : ""}{change.toFixed(2)} <span className="text-xs text-subtle">since last tick</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-subtle">
        <span className="flex items-center gap-1"><Icon name="RefreshCw" size={11} /> Updated {state.updatedAt || "…"} · auto every 30s</span>
      </div>

      <p className="mt-3 rounded-lg bg-elevated p-2.5 text-xs text-muted">
        <b className="text-fg">Context only, not a signal.</b> Use this to anchor your reading — the price alone tells you nothing about whether to trade.
        Run it through your process: top-down bias → key location → scenario → trigger.
      </p>
    </Card>
  );
}
