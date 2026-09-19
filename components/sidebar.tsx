"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { clsx } from "clsx";
import { Icon } from "./ui";
import { useTheme } from "./theme";
import { topNav, toolNav, workspaceNav, referenceNav } from "@/lib/nav";
import { useAcademy } from "@/lib/store";
import { PriceWidget } from "./price-widget";

function NavLink({ href, icon, label, active, depth = 0 }: { href: string; icon?: string; label: string; active: boolean; depth?: number }) {
  return (
    <Link
      href={href}
      className={clsx(
        "group flex items-center gap-2.5 rounded-lg py-1.5 text-sm transition-colors",
        depth === 0 ? "px-2.5" : "px-2.5 pl-8",
        active ? "bg-accent/12 text-accent font-medium" : "text-muted hover:bg-elevated hover:text-fg"
      )}
    >
      {icon && <Icon name={icon} size={16} className={clsx("shrink-0", active ? "text-accent" : "text-subtle group-hover:text-fg")} />}
      <span className="truncate">{label}</span>
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-2.5 pt-4 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-subtle">{children}</div>;
}

export function Sidebar() {
  const pathname = usePathname();
  const search = useSearchParams();
  const activeLessonId = pathname === "/learn" ? search.get("l") : null;
  const { theme, toggle } = useTheme();
  const modules = useAcademy((s) => s.modules);
  const lessons = useAcademy((s) => s.lessons);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  return (
    <aside
      className={clsx(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-surface transition-all",
        collapsed ? "w-[60px]" : "w-[268px]"
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-warn text-accent-fg font-bold">
          Au
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold leading-tight">XAU/USD Academy</div>
            <div className="truncate text-[11px] text-subtle leading-tight">Zero → Systematic Gold Trading</div>
          </div>
        )}
      </div>

      {!collapsed && (
        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          <div className="px-1 pb-2">
            <PriceWidget compact />
          </div>
          {topNav.map((n) => (
            <NavLink key={n.href} {...n} active={isActive(n.href)} />
          ))}

          <SectionLabel>Curriculum</SectionLabel>
          {sortedModules.map((m) => {
            const modLessons = lessons.filter((l) => l.moduleId === m.id).sort((a, b) => a.order - b.order);
            const done = modLessons.filter((l) => l.completed).length;
            const open = openModules[m.id] ?? false;
            const anyActive = modLessons.some((l) => activeLessonId === l.id);
            return (
              <div key={m.id}>
                <button
                  onClick={() => setOpenModules((o) => ({ ...o, [m.id]: !open }))}
                  className={clsx(
                    "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                    anyActive ? "text-fg" : "text-muted hover:bg-elevated hover:text-fg"
                  )}
                >
                  <Icon name={m.icon} size={16} className="shrink-0 text-subtle group-hover:text-fg" />
                  <span className="flex-1 truncate text-left">{m.title}</span>
                  <span className="text-[10px] tabular-nums text-subtle">{done}/{modLessons.length}</span>
                  <Icon name={open ? "ChevronDown" : "ChevronRight"} size={14} className="text-subtle" />
                </button>
                {open && (
                  <div className="mt-0.5 mb-1">
                    {modLessons.map((l) => (
                      <NavLink
                        key={l.id}
                        href={`/learn?m=${m.id}&l=${l.id}`}
                        label={l.title}
                        active={activeLessonId === l.id}
                        depth={1}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <SectionLabel>{toolNav.label}</SectionLabel>
          {toolNav.items.map((n) => (
            <NavLink key={n.href} {...n} active={isActive(n.href)} />
          ))}

          <SectionLabel>{workspaceNav.label}</SectionLabel>
          {workspaceNav.items.map((n) => (
            <NavLink key={n.href} {...n} active={isActive(n.href)} />
          ))}

          <SectionLabel>{referenceNav.label}</SectionLabel>
          {referenceNav.items.map((n) => (
            <NavLink key={n.href} {...n} active={isActive(n.href)} />
          ))}
        </nav>
      )}

      {collapsed && (
        <nav className="flex-1 overflow-y-auto px-2">
          {[...topNav, ...toolNav.items, ...workspaceNav.items, ...referenceNav.items].map((n) => (
            <Link
              key={n.href}
              href={n.href}
              title={n.label}
              className={clsx(
                "my-0.5 flex items-center justify-center rounded-lg py-2 transition-colors",
                isActive(n.href) ? "bg-accent/12 text-accent" : "text-subtle hover:bg-elevated hover:text-fg"
              )}
            >
              <Icon name={n.icon} size={18} />
            </Link>
          ))}
        </nav>
      )}

      {/* Footer controls */}
      <div className="flex items-center gap-1 border-t border-border p-2">
        <button onClick={toggle} title="Toggle theme" className="flex h-8 w-8 items-center justify-center rounded-lg text-subtle hover:bg-elevated hover:text-fg">
          <Icon name={theme === "dark" ? "Sun" : "Moon"} size={17} />
        </button>
        <button onClick={() => setCollapsed((c) => !c)} title="Collapse" className="flex h-8 w-8 items-center justify-center rounded-lg text-subtle hover:bg-elevated hover:text-fg">
          <Icon name={collapsed ? "PanelLeftOpen" : "PanelLeftClose"} size={17} />
        </button>
      </div>
    </aside>
  );
}
