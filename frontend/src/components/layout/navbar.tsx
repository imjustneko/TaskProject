"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { STATUS_META } from "@/types";
import type { StatusType } from "@/types";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Home", "/feed": "Feed",
  "/tasks/today": "Today", "/tasks/plans": "Plans", "/tasks/report": "Report",
  "/friends": "Friends", "/partners": "Partners", "/rooms": "Rooms",
  "/profile/edit": "Profile", "/profile/labels": "Labels",
};

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const title = PAGE_TITLES[pathname] ?? (
    pathname.startsWith("/rooms/") ? "Room" :
    pathname.startsWith("/users/") ? "Profile" : "Taskyy"
  );

  const statusMeta = user?.status ? STATUS_META[user.status.type as StatusType] : null;
  const statusText = user?.status
    ? (user.status.customText ?? statusMeta?.label ?? "")
    : null;

  return (
    <div className="topbar">
      <div className="row gap-2">
        <span className="topbar-title">{title}</span>
      </div>
      <div className="topbar-spacer" />
      <div className="row" style={{ gap: 8 }}>

        {/* Status chip */}
        {user?.status && statusMeta && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0 10px", height: 28, borderRadius: 999,
            background: "var(--bg-subtle)", border: "1px solid var(--border)",
            fontSize: 12, color: "var(--text-soft)", cursor: "default",
            maxWidth: 180, overflow: "hidden",
          }}>
            <span style={{ fontSize: 13 }}>{statusMeta.emoji}</span>
            <span className="truncate">{statusText}</span>
          </div>
        )}

        {/* Search */}
        <div className="input-search" style={{ width: 200 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ left: 9 }}>
            <circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/>
          </svg>
          <input
            className="input"
            placeholder="Search…"
            style={{ height: 28, fontSize: 12.5, paddingLeft: 28, borderRadius: 8 }}
          />
        </div>

        {/* Theme toggle */}
        <button
          className="btn btn-ghost btn-sm btn-icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          title={resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
        >
          {resolvedTheme === "dark" ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
