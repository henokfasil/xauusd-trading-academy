"use client";

import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";

// -- Icon helper: resolve a lucide icon by name string --------------------
export function Icon({ name, className, size = 18 }: { name: string; className?: string; size?: number }) {
  const Cmp = (Icons as any)[name] ?? Icons.Circle;
  return <Cmp className={className} size={size} strokeWidth={1.75} />;
}

// -- Card -----------------------------------------------------------------
export function Card({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("rounded-xl border border-border bg-surface", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

// -- Button ---------------------------------------------------------------
type BtnVariant = "primary" | "ghost" | "outline" | "danger" | "subtle";
export function Button({
  variant = "outline",
  size = "md",
  className,
  children,
  ...rest
}: {
  variant?: BtnVariant;
  size?: "sm" | "md";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<BtnVariant, string> = {
    primary: "bg-accent text-accent-fg hover:opacity-90 border-transparent",
    ghost: "bg-transparent hover:bg-elevated border-transparent text-muted hover:text-fg",
    outline: "bg-transparent hover:bg-elevated border-border text-fg",
    danger: "bg-transparent hover:bg-bear/10 border-border text-bear",
    subtle: "bg-elevated hover:bg-border/60 border-transparent text-fg",
  };
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 rounded-lg border font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-2 text-sm",
        variants[variant],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

// -- Badge ----------------------------------------------------------------
export function Badge({ children, tone = "muted", className }: { children: React.ReactNode; tone?: "muted" | "bull" | "bear" | "accent" | "warn"; className?: string }) {
  const tones = {
    muted: "bg-elevated text-muted border-border",
    bull: "bg-bull/10 text-bull border-bull/30",
    bear: "bg-bear/10 text-bear border-bear/30",
    accent: "bg-accent/10 text-accent border-accent/30",
    warn: "bg-warn/10 text-warn border-warn/30",
  };
  return <span className={clsx("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium", tones[tone], className)}>{children}</span>;
}

// -- Section header -------------------------------------------------------
export function PageHeader({ title, subtitle, actions, icon }: { title: string; subtitle?: string; actions?: React.ReactNode; icon?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-5 mb-6">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Icon name={icon} size={19} />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted max-w-2xl">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

// -- Inline editable text -------------------------------------------------
export function EditableText({
  value,
  onChange,
  placeholder = "Empty",
  className,
  as = "input",
  inputClassName,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  as?: "input" | "textarea";
  inputClassName?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      if (ref.current instanceof HTMLTextAreaElement) ref.current.selectionStart = ref.current.value.length;
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft !== value) onChange(draft);
  };

  if (editing) {
    const shared = {
      ref: ref as any,
      value: draft,
      onChange: (e: any) => setDraft(e.target.value),
      onBlur: commit,
      className: clsx(
        "w-full rounded-md border border-accent/50 bg-elevated px-2 py-1 text-fg outline-none ring-2 ring-accent/20",
        inputClassName
      ),
    };
    return as === "textarea" ? (
      <textarea
        {...shared}
        rows={4}
        onKeyDown={(e) => { if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
      />
    ) : (
      <input
        {...shared}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className={clsx(
        "group inline-flex cursor-text items-center gap-1 rounded-md px-1 -mx-1 hover:bg-elevated",
        !value && "text-subtle italic",
        className
      )}
      title="Click to edit"
    >
      {value || placeholder}
      <Icons.Pencil className="opacity-0 group-hover:opacity-50 transition-opacity" size={12} />
    </span>
  );
}

// -- Field (label + editable field for forms) -----------------------------
export function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-muted">{label}</span>
        {hint && <span className="text-[10px] text-subtle">{hint}</span>}
      </div>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-y rounded-lg border border-border bg-elevated px-3 py-2 text-sm outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/15"
        />
      ) : (
        <input
          value={value}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/15"
        />
      )}
    </label>
  );
}

export function Select({ label, value, onChange, options }: { label?: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-xs font-medium text-muted">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm outline-none focus:border-accent/60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

// -- Empty state ----------------------------------------------------------
export function EmptyState({ icon = "Inbox", title, hint, action }: { icon?: string; title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-elevated text-subtle">
        <Icon name={icon} size={22} />
      </div>
      <p className="font-medium">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-muted">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// -- Stat tile ------------------------------------------------------------
export function Stat({ label, value, sub, tone }: { label: string; value: React.ReactNode; sub?: string; tone?: "bull" | "bear" | "accent" | "warn" }) {
  const toneClass = tone === "bull" ? "text-bull" : tone === "bear" ? "text-bear" : tone === "warn" ? "text-warn" : tone === "accent" ? "text-accent" : "text-fg";
  return (
    <Card className="p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-subtle">{label}</div>
      <div className={clsx("mt-1.5 text-2xl font-semibold tabular-nums", toneClass)}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </Card>
  );
}

// -- Client-only guard (avoids SSR hydration mismatch for store data) -----
export function ClientOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children : fallback}</>;
}
