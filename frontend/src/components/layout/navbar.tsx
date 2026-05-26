"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useLangStore } from "@/stores/langStore";
import { useT } from "@/hooks/useT";
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from "@/hooks/useNotifications";
import { STATUS_META } from "@/types";
import type { NotificationType, StatusType } from "@/types";

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

const NOTIF_ICONS: Record<NotificationType, string> = {
  FRIEND_REQUEST:  "👋",
  FRIEND_ACCEPTED: "🤝",
  ROOM_INVITE:     "🚪",
  TASK_REMINDER:   "⏰",
  MENTION:         "@",
};

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { lang, toggle } = useLangStore();
  const { t, tf } = useT();

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllRead();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  const notifText = (type: NotificationType, fromName: string): string => {
    if (type === "FRIEND_REQUEST") return tf("notif_friend_req", fromName);
    if (type === "FRIEND_ACCEPTED") return tf("notif_friend_acc", fromName);
    if (type === "ROOM_INVITE") return tf("notif_room_invite", fromName);
    if (type === "MENTION") return tf("notif_mention", fromName);
    return t("notif_reminder");
  };

  const titleMap: Record<string, string> = {
    "/dashboard":      t("nav_home"),
    "/feed":           t("nav_feed"),
    "/tasks/today":    t("nav_today"),
    "/tasks/plans":    t("nav_plans"),
    "/tasks/report":   t("nav_report"),
    "/friends":        t("nav_friends"),
    "/partners":       t("nav_partners"),
    "/rooms":          t("nav_rooms"),
    "/profile/edit":   t("nav_profile"),
    "/profile/labels": t("nav_labels"),
  };

  const title = titleMap[pathname] ?? (
    pathname.startsWith("/rooms/") ? t("nav_rooms") :
    pathname.startsWith("/users/") ? t("nav_profile") : "Taskyy"
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
            placeholder={t("search")}
            style={{ height: 28, fontSize: 12.5, paddingLeft: 28, borderRadius: 8 }}
          />
        </div>

        {/* Notification bell */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            className="btn btn-ghost btn-sm btn-icon"
            onClick={() => setNotifOpen(o => !o)}
            title={t("notif_title")}
            style={{ position: "relative" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: 2, right: 2,
                minWidth: 14, height: 14, borderRadius: 999,
                background: "var(--accent)", color: "#fff",
                fontSize: 9, fontWeight: 700, lineHeight: "14px",
                textAlign: "center", padding: "0 3px",
                pointerEvents: "none",
              }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              width: 320, maxHeight: 420, overflowY: "auto",
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              borderRadius: 12, boxShadow: "var(--shadow-3)", zIndex: 200,
            }}>
              {/* Header */}
              <div className="row" style={{ padding: "12px 14px 10px", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{t("notif_title")}</span>
                {unreadCount > 0 && (
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 11.5, padding: "2px 6px", height: "auto" }}
                    onClick={() => markAll.mutate()}
                    disabled={markAll.isPending}
                  >
                    {t("notif_mark_all")}
                  </button>
                )}
              </div>

              {/* List */}
              {notifications.length === 0 ? (
                <div className="muted" style={{ padding: "24px 14px", textAlign: "center", fontSize: 13 }}>
                  {t("notif_empty")}
                </div>
              ) : (
                notifications.map(n => {
                  const fromName = n.from?.displayName ?? "Someone";
                  return (
                    <button
                      key={n.id}
                      className="btn btn-ghost"
                      onClick={() => { if (!n.isRead) markRead.mutate(n.id); }}
                      style={{
                        width: "100%", borderRadius: 0, padding: "10px 14px",
                        display: "flex", alignItems: "flex-start", gap: 10,
                        background: n.isRead ? "transparent" : "var(--accent-tint)",
                        borderBottom: "1px solid var(--border)",
                        textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>
                        {NOTIF_ICONS[n.type]}
                      </span>
                      <div className="flex1" style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, lineHeight: 1.4, fontWeight: n.isRead ? 400 : 500 }}>
                          {notifText(n.type, fromName)}
                        </div>
                        <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>
                          {relTime(n.createdAt)}
                        </div>
                      </div>
                      {!n.isRead && (
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: "var(--accent)", flexShrink: 0, marginTop: 5,
                        }} />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Language toggle */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={toggle}
          title={lang === "en" ? "Switch to Mongolian" : "Англи хэл рүү солих"}
          style={{ gap: 5, fontSize: 12, fontWeight: 600, minWidth: 52, color: "var(--text-muted)" }}
        >
          <span style={{ fontSize: 14 }}>{lang === "en" ? "🇲🇳" : "🇺🇸"}</span>
          {lang === "en" ? "MN" : "EN"}
        </button>

        {/* Theme toggle */}
        <button
          className="btn btn-ghost btn-sm btn-icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          title={resolvedTheme === "dark" ? (lang === "mn" ? "Цайвар горим" : "Light mode") : (lang === "mn" ? "Харанхуй горим" : "Dark mode")}
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
