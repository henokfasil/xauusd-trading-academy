"use client";

import { useEffect, useRef, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase, buildSyncPayload, pushToSupabase, pullFromSupabase, debounce } from "@/lib/supabase";
import { useAcademy } from "@/lib/store";

// Debounce interval for pushing to Supabase after a store change
const SYNC_DEBOUNCE_MS = 3000;

// Lightweight sync-status indicator shown in the top-right corner
type SyncStatus = "idle" | "syncing" | "synced" | "offline";

export function SyncProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<SyncStatus>("idle");
  const importData = useAcademy((s) => s.importData);
  const didLoad = useRef(false);

  // Build and push — called debounced from the store subscription
  const doPush = useRef(
    debounce(async (snapshot: Record<string, unknown>) => {
      setStatus("syncing");
      const ok = await pushToSupabase(buildSyncPayload(snapshot));
      setStatus(ok ? "synced" : "offline");
    }, SYNC_DEBOUNCE_MS)
  ).current;

  // Load from Supabase and merge into local store
  const doLoad = async () => {
    const remote = await pullFromSupabase();
    if (!remote) return;
    // importData merges settings over defaults and restores all user data
    // We add `version: 1` so the importer doesn't reject it
    importData(JSON.stringify({ version: 1, ...remote }));
    setStatus("synced");
  };

  // Auth listener + initial load
  useEffect(() => {
    // Get current session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user && !didLoad.current) {
        didLoad.current = true;
        doLoad();
      }
    });

    // Listen for sign-in / sign-out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u && !didLoad.current) {
        didLoad.current = true;
        doLoad();
      }
      if (!u) { didLoad.current = false; setStatus("idle"); }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe to store changes → debounced push
  useEffect(() => {
    if (!user) return;
    const unsub = useAcademy.subscribe((state) => {
      // Snapshot the syncable slice of state
      doPush(state as unknown as Record<string, unknown>);
    });
    return unsub;
  }, [user, doPush]);

  // Sync status pill — only visible when signed in
  if (!user) return null;

  const pillClass: Record<SyncStatus, string> = {
    idle:    "bg-border text-muted",
    syncing: "bg-warn/20 text-warn",
    synced:  "bg-bull/15 text-bull",
    offline: "bg-bear/15 text-bear",
  };
  const pillLabel: Record<SyncStatus, string> = {
    idle:    "•  Cloud sync",
    syncing: "↑  Syncing…",
    synced:  "✓  Synced",
    offline: "✕  Offline",
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${pillClass[status]}`}
      title={`Signed in as ${user.email ?? "anonymous"}`}
    >
      {pillLabel[status]}
    </div>
  );
}
