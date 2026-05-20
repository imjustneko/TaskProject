"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/ui/page-header";
import api from "@/lib/api";
import type { StatusType } from "@/types";
import { STATUS_META } from "@/types";

const STATUSES: StatusType[] = ["PLAYING", "COOKING", "WALKING", "STUDYING", "READING", "WORKING"];

function Toggle({ value }: { value: boolean }) {
  const [v, setV] = useState(value);
  return (
    <button
      onClick={() => setV(!v)}
      style={{
        width: 36,
        height: 22,
        borderRadius: 999,
        border: 0,
        padding: 0,
        background: v ? "var(--accent)" : "var(--border-strong)",
        position: "relative",
        cursor: "default",
        transition: "background 150ms",
        flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute",
        top: 2,
        left: v ? 16 : 2,
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        transition: "left 150ms",
      }} />
    </button>
  );
}

export default function ProfileEditPage() {
  const { user, updateUser } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(user?.displayName ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [activeStatus, setActiveStatus] = useState<StatusType | null>(
    (user?.status?.type as StatusType) ?? null
  );
  const [customText, setCustomText] = useState(user?.status?.customText ?? "");

  const updateProfile = useMutation({
    mutationFn: (data: { displayName: string; bio?: string }) =>
      api.patch("/users/me", data).then((r) => r.data),
    onSuccess: (updated) => {
      updateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const setStatusMutation = useMutation({
    mutationFn: (type: StatusType) =>
      api.put("/status", { type, customText: customText || undefined }).then((r) => r.data),
    onSuccess: (status) => {
      updateUser({ status });
      setActiveStatus(status.type);
    },
  });

  const clearStatus = useMutation({
    mutationFn: () => api.delete("/status"),
    onSuccess: () => {
      updateUser({ status: undefined });
      setActiveStatus(null);
      setCustomText("");
    },
  });

  const userForAvatar = user
    ? { displayName: user.displayName, avatarUrl: user.avatarUrl, presence: "online" as const }
    : null;

  return (
    <div className="view-narrow">
      <PageHeader eyebrow="You" title="Profile" subtitle="How you appear to friends in Taskyy." />

      {/* Main profile card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="row gap-4" style={{ marginBottom: 22 }}>
          <Avatar user={userForAvatar} size={64} status onBg="bg" />
          <div className="flex1">
            <div style={{ fontSize: 15, fontWeight: 600 }}>{user?.displayName}</div>
            <div className="muted" style={{ fontSize: 12.5, marginBottom: 8 }}>
              @{user?.username} · Joined {new Date(user?.createdAt ?? Date.now()).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </div>
            <div className="row gap-2">
              <button className="btn btn-sm">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>
                Change photo
              </button>
              <button className="btn btn-sm btn-ghost">Remove</button>
            </div>
          </div>
          <div style={{ alignSelf: "flex-start" }}>
            <button className="btn" onClick={() => setStatusMutation.mutate(activeStatus ?? "WORKING")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v6M12 14v6M4 12h6M14 12h6M6 6l4 4M14 14l4 4M18 6l-4 4M10 14l-4 4"/></svg>
              Update status
            </button>
          </div>
        </div>

        <div className="col gap-4">
          <div className="grid-2">
            <div className="field">
              <label className="field-label">Display name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field-label">Handle</label>
              <input
                className="input"
                value={"@" + (user?.username ?? "")}
                disabled
                style={{ opacity: 0.6 }}
              />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Bio</label>
            <textarea
              className="textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
            />
          </div>
          <div className="row gap-2" style={{ justifyContent: "flex-end" }}>
            {saved && <span style={{ fontSize: 12, color: "var(--status-online)" }}>Saved!</span>}
            <button className="btn">Cancel</button>
            <button
              className="btn btn-primary"
              onClick={() => updateProfile.mutate({ displayName: name, bio })}
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Status card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="row" style={{ marginBottom: 16 }}>
          <h3 style={{ flex: 1 }}>Current status</h3>
          {activeStatus && (
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => clearStatus.mutate()}
              style={{ color: "var(--status-busy)" }}
            >
              Clear
            </button>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
          {STATUSES.map((s) => {
            const m = STATUS_META[s];
            return (
              <button
                key={s}
                className="btn"
                onClick={() => setStatusMutation.mutate(s)}
                style={{
                  flexDirection: "column",
                  height: 76,
                  gap: 6,
                  padding: 8,
                  borderColor: activeStatus === s ? "var(--accent)" : "var(--border-strong)",
                  background: activeStatus === s ? "var(--accent-tint)" : "var(--bg-elevated)",
                }}
              >
                <span style={{ fontSize: 22 }}>{m.emoji}</span>
                <span style={{ fontSize: 11.5, color: "var(--text-soft)" }}>{m.label}</span>
              </button>
            );
          })}
        </div>
        <div className="row gap-2">
          <input
            className="input"
            placeholder="Or write your own status…"
            value={customText}
            onFocus={() => setActiveStatus("CUSTOM")}
            onChange={(e) => setCustomText(e.target.value)}
          />
          <button
            className="btn btn-accent"
            onClick={() => setStatusMutation.mutate("CUSTOM")}
            disabled={!customText.trim()}
          >
            Set
          </button>
        </div>
      </div>

      {/* Privacy card */}
      <div className="card">
        <h3 style={{ marginBottom: 6 }}>Privacy</h3>
        <div className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
          Control what friends can see by default.
        </div>
        <div className="col gap-3">
          {[
            { k: "status",  label: "Show my live status",   val: true,  hint: "Friends can see what you're up to right now." },
            { k: "tasks",   label: "Share shared tasks",     val: true,  hint: "Tasks marked shared appear on your profile feed." },
            { k: "photos",  label: "Daily memory photos",    val: false, hint: "Photos attached to tasks stay private unless turned on." },
            { k: "online",  label: "Show online indicator",  val: true,  hint: "A green dot next to your avatar when you're active." },
          ].map((p) => (
            <div
              key={p.k}
              className="row"
              style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex1">
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{p.label}</div>
                <div className="muted" style={{ fontSize: 12 }}>{p.hint}</div>
              </div>
              <Toggle value={p.val} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
