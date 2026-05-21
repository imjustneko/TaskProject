"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, { title: string; emoji?: string }> = {
  "/dashboard":     { title: "Home", emoji: "🏠" },
  "/feed":          { title: "Feed", emoji: "📣" },
  "/tasks/today":   { title: "Today", emoji: "☀️" },
  "/tasks/plans":   { title: "Plans", emoji: "📅" },
  "/tasks/report":  { title: "Report", emoji: "📊" },
  "/friends":       { title: "Friends", emoji: "👥" },
  "/partners":      { title: "Partners", emoji: "🤝" },
  "/rooms":         { title: "Rooms", emoji: "🏠" },
  "/profile/edit":  { title: "Profile", emoji: "✏️" },
  "/profile/labels":{ title: "Labels", emoji: "🏷️" },
};

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();

  const info = PAGE_TITLES[pathname];

  return (
    <div className="topbar">
      {info && (
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:14, fontWeight:700, color:"var(--text)", letterSpacing:"-0.01em" }}>
            {info.title}
          </span>
        </div>
      )}
      <div className="topbar-spacer" />
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        {/* Search */}
        <div className="input-search" style={{ width:200 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ left:9 }}>
            <circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/>
          </svg>
          <input
            className="input"
            placeholder="Search…"
            style={{ height:30, fontSize:12.5, paddingLeft:28, borderRadius:8 }}
          />
        </div>

        {/* Theme toggle */}
        <button
          className="btn btn-ghost btn-sm btn-icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          title={resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
          style={{ color:"var(--text-muted)" }}
        >
          {resolvedTheme === "dark" ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
