"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { Avatar, presenceToDot } from "@/components/ui/avatar";
import { useUserEmojis } from "@/hooks/useUserEmojis";
import api from "@/lib/api";
import type { StatusType, PresenceType } from "@/types";
import { STATUS_META } from "@/types";

const navMain = [
  { href: "/dashboard",      label: "Home",      icon: "home" },
  { href: "/feed",           label: "Feed",      icon: "globe" },
  { href: "/tasks/today",    label: "Today",     icon: "sun" },
  { href: "/tasks/plans",    label: "Plans",     icon: "calendar" },
  { href: "/tasks/report",   label: "Report",    icon: "chart" },
  { href: "/friends",        label: "Friends",   icon: "users" },
  { href: "/profile/edit",   label: "Profile",   icon: "edit" },
  { href: "/profile/labels", label: "Labels",    icon: "tag" },
];

const STATUS_LIST: StatusType[] = ["PLAYING","COOKING","WALKING","STUDYING","READING","WORKING"];

function SvgIcon({ name, size = 15 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none" as const, stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "home":     return <svg {...p}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-4v-6h-8v6H4a1 1 0 0 1-1-1z"/></svg>;
    case "sun":      return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>;
    case "calendar": return <svg {...p}><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>;
    case "users":    return <svg {...p}><circle cx="9" cy="9" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 11a3 3 0 1 0 0-6M22 20a5 5 0 0 0-4.5-5"/></svg>;
    case "edit":     return <svg {...p}><path d="m4 20 4-1 11-11-3-3L5 16l-1 4z"/></svg>;
    case "hash":     return <svg {...p}><path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/></svg>;
    case "plus":     return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case "chevron-right": return <svg {...p}><path d="m9 6 6 6-6 6"/></svg>;
    case "logout":   return <svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
    case "globe":    return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case "x":        return <svg {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case "sparkle":  return <svg {...p}><path d="M12 4v6M12 14v6M4 12h6M14 12h6M6 6l4 4M14 14l4 4M18 6l-4 4M10 14l-4 4"/></svg>;
    case "chart":    return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V9M12 17v-5M15 17v-8"/></svg>;
    case "tag":      return <svg {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
    default:         return null;
  }
}

const PRESENCE_OPTIONS: { value: PresenceType; label: string; dot: string; color: string; desc: string }[] = [
  { value: "ONLINE",    label: "Online",       dot: "online",    color: "#34c759", desc: "Бусдад онлайн харагдана" },
  { value: "IDLE",      label: "Idle",         dot: "idle",      color: "#ffb340", desc: "Идэвхгүй байгаа мэт" },
  { value: "DND",       label: "Do Not Disturb", dot: "dnd",    color: "#ff453a", desc: "Мэдэгдэл хааж байна" },
  { value: "INVISIBLE", label: "Invisible",    dot: "invisible", color: "#8a8a90", desc: "Оффлайн мэт харагдана" },
];

function StatusModal({ onClose, currentStatus, currentPresence }: {
  onClose: () => void;
  currentStatus?: StatusType | null;
  currentPresence?: PresenceType | null;
}) {
  const { updateUser } = useAuthStore();
  const [picked, setPicked] = useState<StatusType | null>(currentStatus ?? null);
  const [presence, setPresence] = useState<PresenceType>(currentPresence ?? "ONLINE");
  const [custom, setCustom] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const { data: myEmojis = [] } = useUserEmojis();
  const inputRef = useRef<HTMLInputElement>(null);

  const setStatus = useMutation({
    mutationFn: (type: StatusType) =>
      api.put("/status", { type, presence, customText: type === "CUSTOM" ? (custom || undefined) : undefined }).then(r => r.data),
    onSuccess: (status) => { updateUser({ status }); onClose(); },
  });

  const setPresenceMutation = useMutation({
    mutationFn: (p: PresenceType) => api.patch("/status/presence", { presence: p }).then(r => r.data),
    onSuccess: (status) => { updateUser({ status }); },
  });

  const clearStatus = useMutation({
    mutationFn: () => api.delete("/status"),
    onSuccess: () => { updateUser({ status: undefined }); onClose(); },
  });

  const insertEmoji = (name: string) => {
    setCustom(c => c + `:${name}: `);
    setPicked("CUSTOM");
    setShowEmojis(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" style={{ width: 460 }} onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <h2>Set your status</h2>
          <button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}><SvgIcon name="x" size={15} /></button>
        </div>

        {/* ── Presence section ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
            Холболтын байдал
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {PRESENCE_OPTIONS.map(p => (
              <button
                key={p.value}
                onClick={() => { setPresence(p.value); setPresenceMutation.mutate(p.value); }}
                className="btn"
                style={{
                  flexDirection: "column", height: 70, gap: 6, padding: 8,
                  borderColor: presence === p.value ? p.color : "var(--border-strong)",
                  background: presence === p.value ? `${p.color}15` : "var(--bg-elevated)",
                  position: "relative",
                }}
                title={p.desc}
              >
                {/* Presence dot preview */}
                <div style={{
                  width: 16, height: 16, borderRadius: "50%",
                  background: p.value === "INVISIBLE" ? "transparent" : p.color,
                  border: p.value === "INVISIBLE" ? `2px solid ${p.color}` : "none",
                }} />
                <span style={{ fontSize: 11, color: presence === p.value ? p.color : "var(--text-muted)", fontWeight: presence === p.value ? 600 : 400, lineHeight: 1.2, textAlign: "center" }}>
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Activity section ── */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
            Үйл ажиллагаа
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 10 }}>
            {STATUS_LIST.map((s) => {
              const m = STATUS_META[s];
              return (
                <button key={s} onClick={() => setPicked(s)} className="btn" style={{
                  height: 66, flexDirection: "column", gap: 5, padding: 8,
                  borderColor: picked === s ? "var(--accent)" : "var(--border-strong)",
                  background: picked === s ? "var(--accent-tint)" : "var(--bg-elevated)",
                }}>
                  <span style={{ fontSize: 20 }}>{m.emoji}</span>
                  <span style={{ fontSize: 10.5, color: "var(--text-soft)" }}>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Custom text + emoji picker */}
          <div style={{ position: "relative" }}>
            <div className="row gap-2">
              <input
                ref={inputRef}
                className="input"
                placeholder="Өөрийн статус бичих… (:emoji_name: ашиглаж болно)"
                value={custom}
                onChange={e => setCustom(e.target.value)}
                onFocus={() => setPicked("CUSTOM" as StatusType)}
                style={{ flex: 1 }}
              />
              {myEmojis.length > 0 && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm btn-icon"
                  onClick={() => setShowEmojis(v => !v)}
                  style={{ flexShrink: 0, color: showEmojis ? "var(--accent)" : "var(--text-muted)" }}
                  title="Custom emoji"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                </button>
              )}
            </div>
            {showEmojis && (
              <div style={{
                position: "absolute", bottom: "calc(100% + 6px)", left: 0, right: 0,
                background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10,
                padding: 8, display: "flex", flexWrap: "wrap", gap: 4, zIndex: 10,
                boxShadow: "var(--shadow-2)",
              }}>
                {myEmojis.map(em => (
                  <button key={em.id} title={`:${em.name}:`} onClick={() => insertEmoji(em.name)}
                    style={{ width: 34, height: 34, borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-subtle)", padding: 3, cursor: "default" }}>
                    <img src={em.imageUrl} alt={em.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="row" style={{ justifyContent: "space-between" }}>
          <button className="btn btn-ghost btn-sm" style={{ color: "var(--status-busy)" }}
            onClick={() => clearStatus.mutate()} disabled={clearStatus.isPending}>
            Статус арилгах
          </button>
          <div className="row gap-2">
            <button className="btn" onClick={onClose}>Болих</button>
            <button
              className="btn btn-accent"
              disabled={!picked || setStatus.isPending}
              onClick={() => picked && setStatus.mutate(picked)}
            >
              <SvgIcon name="sparkle" size={14} />
              {setStatus.isPending ? "Хадгалж байна…" : "Тохируулах"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [statusOpen, setStatusOpen] = useState(false);

  const handleLogout = () => { logout(); router.push("/login"); };

  const userForAvatar = user ? {
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    status: {
      presence: user.status?.presence ?? (user.status ? "ONLINE" : undefined),
    },
  } : null;

  const presenceOpt = PRESENCE_OPTIONS.find(p => p.value === (user?.status?.presence ?? "ONLINE"));

  const statusLabel = (() => {
    if (!user?.status) return "@" + (user?.username ?? "");
    const meta = STATUS_META[user.status.type as StatusType];
    const label = user.status.customText ?? meta?.label ?? user.status.type;
    const emoji = meta?.emoji ?? "";
    const activityText = `${emoji} ${label}`.trim();
    const presenceLabel = presenceOpt?.label ?? "Online";
    return `${activityText} · ${presenceLabel}`;
  })();

  return (
    <>
      <aside className="side">
        <div className="side-brand">
          <div className="side-brand-mark">T</div>
          <span>Taskyy</span>
        </div>

        <Link
          href="/tasks/today"
          className="btn btn-accent btn-sm"
          style={{ margin: "4px 4px 14px", justifyContent: "flex-start", height: 32, paddingLeft: 10, display: "flex" }}
        >
          <SvgIcon name="plus" size={14} />
          New task
          <span style={{ marginLeft: "auto" }}>
            <span className="kbd" style={{ background: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.85)" }}>N</span>
          </span>
        </Link>

        <div className="side-section">Personal</div>
        {navMain.map((n) => {
          const active = pathname === n.href || (n.href !== "/dashboard" && pathname.startsWith(n.href));
          return (
            <Link key={n.href} href={n.href} className="side-link" data-active={active ? "1" : "0"}>
              <SvgIcon name={n.icon} size={15} />
              <span>{n.label}</span>
            </Link>
          );
        })}

        <div className="side-section row" style={{ justifyContent: "space-between" }}>
          <span>Rooms</span>
          <SvgIcon name="plus" size={12} />
        </div>
        <Link href="/rooms" className="side-link" data-active={pathname.startsWith("/rooms") ? "1" : "0"}>
          <SvgIcon name="hash" size={15} />
          <span className="truncate">Browse rooms</span>
        </Link>

        {/* ── Profile footer — click to open status modal ── */}
        <div className="side-foot">
          <div
            className="side-me"
            onClick={() => setStatusOpen(true)}
            style={{ cursor: "default" }}
            title="Click to update your status"
          >
            <Avatar user={userForAvatar} size={30} status onBg="subtle" />
            <div className="flex1 truncate">
              <div className="side-me-name truncate">{user?.displayName ?? "User"}</div>
              <div className="side-me-status truncate">{statusLabel}</div>
            </div>
            <SvgIcon name="chevron-right" size={13} />
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleLogout}
            style={{ width: "100%", marginTop: 4, justifyContent: "flex-start", color: "var(--text-muted)", gap: 8, paddingLeft: 8 }}
          >
            <SvgIcon name="logout" size={14} />
            Sign out
          </button>
        </div>
      </aside>

      {statusOpen && (
        <StatusModal
          onClose={() => setStatusOpen(false)}
          currentStatus={user?.status?.type as StatusType ?? null}
          currentPresence={user?.status?.presence as PresenceType ?? "ONLINE"}
        />
      )}
    </>
  );
}
