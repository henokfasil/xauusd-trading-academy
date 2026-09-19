// Static navigation for the special (non-lesson) pages.
// Lesson modules are appended dynamically from the store.

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const topNav: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { label: "Start Here", href: "/start-here", icon: "Sparkles" },
];

export const toolNav: NavSection = {
  label: "Interactive Tools",
  items: [
    { label: "A Day Trading XAU/USD", href: "/day-in-the-life", icon: "Sun" },
    { label: "Top-Down Analysis", href: "/top-down", icon: "Layers" },
    { label: "Market Structure Lab", href: "/labs/market-structure", icon: "Waypoints" },
    { label: "Candlestick Lab", href: "/labs/candlestick", icon: "CandlestickChart" },
    { label: "Support / Resistance Lab", href: "/labs/support-resistance", icon: "Ruler" },
  ],
};

export const workspaceNav: NavSection = {
  label: "Workspace",
  items: [
    { label: "Trading Journal", href: "/journal", icon: "NotebookPen" },
    { label: "Playbook", href: "/playbook", icon: "BookMarked" },
    { label: "Backtesting", href: "/backtesting", icon: "History" },
    { label: "Statistics", href: "/statistics", icon: "BarChart3" },
    { label: "Mistake Library", href: "/mistakes", icon: "TriangleAlert" },
    { label: "Screenshot Library", href: "/screenshots", icon: "Images" },
    { label: "Economic Calendar", href: "/calendar", icon: "CalendarClock" },
  ],
};

export const referenceNav: NavSection = {
  label: "Reference",
  items: [
    { label: "Glossary", href: "/glossary", icon: "BookA" },
    { label: "Resources", href: "/resources", icon: "Link2" },
    { label: "Settings", href: "/settings", icon: "Settings" },
  ],
};
