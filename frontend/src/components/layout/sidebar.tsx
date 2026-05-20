"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { Avatar } from "@/components/ui/avatar";
import api from "@/lib/api";
import type { StatusType } from "@/types";
import { STATUS_META } from "@/types";

const navMain = [
  { href: "/dashboard",    label: "Home",    icon: "home" },
  { href: "/tasks/today",  label: "Today",   icon: "sun" },
  { href: "/tasks/plans",  label: "Plans",   icon: "calendar" },
  { href: "/friends",      label: "Friends", icon: "users" },
  { href: "/profile/edit", label: "Profile", icon: "edit" },
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
    case "x":        return <svg {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case "sparkle":  return <svg {...p}><path d="M12 4v6M12 14v6M4 12h6M14 12h6M6 6l4 4M14 14l4 4M18 6l-4 4M10 14l-4 4"/></svg>;
    default:         return null;
  }
}

function StatusModal({ onClose, currentStatus }: {
  onClose: () => void;
  currentStatus?: StatusType | null;
}) {
  const { updateUser } = useAuthStore();
  const [picked, setPicked] = useState<StatusType | null>(currentStatus ?? null);
  const [custom, setCustom] = useState("");

  const setStatus = useMutation({
    mutationFn: (type: StatusType) =>
      api.put("/status", { type, customText: type === "CUSTOM" ? (custom || undefined) : undefined }).then(r => r.data),
    onSuccess: (status) => { updateUser({ status }); onClose(); },
  });

  const clearStatus = useMutation({
    mutationFn: () => api.delete("/status"),
    onSuccess: () => { updateUser({ status: undefined }); onClose(); },
  });

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" style={{ width: 440 }} onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <h2>Update status</h2>
          <button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}>
            <SvgIcon name="x" size={15} />
          </button>
        </div>
        <div className="muted" style={{ fontSize: 13.5, marginBottom: 16 }}>
          What are you up to right now? Friends will see this.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
          {STATUS_LIST.map((s) => {
            const m = STATUS_META[s];
            return (
              <button key={s} onClick={() => setPicked(s)} className="btn" style={{
                height: 76, flexDirection: "column", gap: 6, padding: 8,
                borderColor: picked === s ? "var(--accent)" : "var(--border-strong)",
                background: picked === s ? "var(--accent-tint)" : "var(--bg-elevated)",
              }}>
                <span style={{ fontSize: 22 }}>{m.emoji}</span>
                <span style={{ fontSize: 11.5, color: "var(--text-soft)" }}>{m.label}</span>
              </button>
            );
          })}
        </div>
        <div className="field" style={{ marginBottom: 16 }}>
          <label className="field-label">Or write your own</label>
          <input
            className="input"
            placeholder="Doing my thing…"
            value={custom}
            onChange={e => setCustom(e.target.value)}
            onFocus={() => setPicked("CUSTOM" as StatusType)}
          />
        </div>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <button
            className="btn btn-ghost btn-sm"
            style={{ color: "var(--status-busy)" }}
            onClick={() => clearStatus.mutate()}
            disabled={clearStatus.isPending}
          >
            Clear status
          </button>
          <div className="row gap-2">
            <button className="btn" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-accent"
              disabled={!picked || setStatus.isPending}
              onClick={() => picked && setStatus.mutate(picked)}
            >
              <SvgIcon name="sparkle" size={14} />
              {setStatus.isPending ? "Saving…" : "Set status"}
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
    presence: user.status ? "online" : "offline",
    status: user.status ? { presence: "online" } : undefined,
  } : null;

  const statusLabel = (() => {
    if (!user?.status) return "@" + (user?.username ?? "");
    const meta = STATUS_META[user.status.type as StatusType];
    const label = user.status.customText ?? meta?.label ?? user.status.type;
    const emoji = meta?.emoji ?? "";
    return `${emoji} ${label}`.trim();
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
        />
      )}
    </>
  );
}
