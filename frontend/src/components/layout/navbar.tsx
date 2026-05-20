"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

function Icon({ name, size = 14 }: { name: string; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "search": return <svg {...props}><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/></svg>;
    case "bell":   return <svg {...props}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2.5h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>;
    case "sun":    return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>;
    case "moon":   return <svg {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>;
    default:       return null;
  }
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Home",
  "/tasks/today": "Today",
  "/tasks/plans": "Plans",
  "/friends": "Friends",
  "/profile/edit": "Profile",
  "/rooms": "Rooms",
};

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();

  const title = PAGE_TITLES[pathname] ?? "Taskyy";

  return (
    <div className="topbar">
      <div className="row gap-2">
        <span className="topbar-title">{title}</span>
      </div>
      <div className="topbar-spacer" />
      <div className="row gap-2">
        <div className="input-search" style={{ width: 220 }}>
          <Icon name="search" size={14} />
          <input className="input" placeholder="Search…" style={{ height: 32, fontSize: 13 }} />
        </div>
        <button className="btn btn-ghost btn-sm btn-icon">
          <Icon name="bell" size={14} />
        </button>
        <button
          className="btn btn-ghost btn-sm btn-icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          title="Toggle theme"
        >
          <Icon name={resolvedTheme === "dark" ? "sun" : "moon"} size={14} />
        </button>
      </div>
    </div>
  );
}
