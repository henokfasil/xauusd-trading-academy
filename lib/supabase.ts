"use client";

import { createClient } from "@supabase/supabase-js";

// ── Client ────────────────────────────────────────────────────────────────────
// Supabase anon key is intentionally public — security is enforced by RLS.
// All rows in academy_data are scoped to auth.uid() = user_id.
const SUPABASE_URL = "https://cjsasjycoeagccwsnvmb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqc2Fzanljb2VhZ2Njd3Nudm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDYzNzgsImV4cCI6MjA5MDAyMjM3OH0.sd5lLPDlYhlb9LGm0XPp4fBxM6GEqW5AlXJcYzjEr7M";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});

// ── Auth helpers ──────────────────────────────────────────────────────────────

export async function signInWithEmail(email: string): Promise<{ error: string | null }> {
  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/xauusd-trading-academy/`
      : undefined;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  return { error: error?.message ?? null };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ── Sync ──────────────────────────────────────────────────────────────────────

// Build a sync payload from the current store state.
// Excludes screenshots (base64 blobs that bloat the payload).
export function buildSyncPayload(storeState: Record<string, unknown>) {
  return {
    trades:      storeState.trades      ?? [],
    setups:      storeState.setups      ?? [],
    snapshots:   storeState.snapshots   ?? [],
    mistakes:    storeState.mistakes    ?? [],
    backtests:   storeState.backtests   ?? [],
    calendar:    storeState.calendar    ?? [],
    resources:   storeState.resources   ?? [],
    settings:    storeState.settings    ?? {},
    progress:    storeState.progress    ?? {},
    // Per-lesson overrides — notes and user-edited bodies keyed by lesson id
    lesson_notes: Object.fromEntries(
      ((storeState.lessons as any[]) ?? [])
        .filter((l: any) => l.notes?.trim())
        .map((l: any) => [l.id, l.notes])
    ),
    lesson_bodies: Object.fromEntries(
      ((storeState.lessons as any[]) ?? [])
        .filter((l: any) => l._userEdited)
        .map((l: any) => [l.id, l.body])
    ),
    // Full export for safe restore — screenshots excluded
    full_export: {
      trades:     storeState.trades,
      setups:     storeState.setups,
      snapshots:  storeState.snapshots,
      mistakes:   storeState.mistakes,
      backtests:  storeState.backtests,
      calendar:   storeState.calendar,
      resources:  storeState.resources,
      settings:   storeState.settings,
      progress:   storeState.progress,
      lessons:    ((storeState.lessons as any[]) ?? []).map((l: any) => ({
        id: l.id, moduleId: l.moduleId, notes: l.notes,
        completed: l.completed, status: l.status,
        // Only include body if user edited it (saves ~200KB)
        ...(l._userEdited ? { body: l.body } : {}),
      })),
    },
  };
}

export async function pushToSupabase(payload: ReturnType<typeof buildSyncPayload>): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;
  const { error } = await supabase
    .from("academy_data")
    .upsert({ user_id: user.id, ...payload }, { onConflict: "user_id" });
  return !error;
}

export async function pullFromSupabase(): Promise<Record<string, unknown> | null> {
  const user = await getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("academy_data")
    .select("full_export, lesson_notes, lesson_bodies")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error || !data) return null;
  // Merge lesson-level overrides back into full_export
  const fe = data.full_export ?? {};
  const notes: Record<string, string> = data.lesson_notes ?? {};
  const bodies: Record<string, string> = data.lesson_bodies ?? {};
  if (fe.lessons && (Object.keys(notes).length || Object.keys(bodies).length)) {
    fe.lessons = (fe.lessons as any[]).map((l: any) => ({
      ...l,
      ...(notes[l.id]  ? { notes: notes[l.id]  } : {}),
      ...(bodies[l.id] ? { body:  bodies[l.id], _userEdited: true } : {}),
    }));
  }
  return fe;
}

// Simple debounce utility (not imported from elsewhere to keep tree-shaking clean)
export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
