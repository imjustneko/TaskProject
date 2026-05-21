"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/ui/page-header";
import { useToast } from "@/components/ui/toast";
import api from "@/lib/api";
import type { StatusType } from "@/types";
import { STATUS_META } from "@/types";

const STATUSES: StatusType[] = ["PLAYING","COOKING","WALKING","STUDYING","READING","WORKING"];

function Toggle({ value }: { value: boolean }) {
  const [v, setV] = useState(value);
  return (
    <button onClick={() => setV(!v)} style={{
      width: 36, height: 22, borderRadius: 999, border: 0, padding: 0,
      background: v ? "var(--accent)" : "var(--border-strong)",
      position: "relative", cursor: "default", transition: "background 150ms",
      flexShrink: 0,
    }}>
      <span style={{
        position: "absolute", top: 2, left: v ? 16 : 2,
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 150ms",
      }} />
    </button>
  );
}

export default function ProfileEditPage() {
  const { user, updateUser } = useAuthStore();
  const toast = useToast();
  const [name, setName] = useState(user?.displayName ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [dirty, setDirty] = useState(false);
  const [activeStatus, setActiveStatus] = useState<StatusType | null>((user?.status?.type as StatusType) ?? null);
  const [customText, setCustomText] = useState(user?.status?.customText ?? "");
  const [hoverAvatar, setHoverAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const updateProfile = useMutation({
    mutationFn: (data: { displayName: string; bio?: string }) =>
      api.patch("/users/me", data).then(r => r.data),
    onSuccess: (updated) => {
      updateUser(updated);
      setDirty(false);
      toast.show("Profile saved!");
    },
  });

  const uploadAvatar = useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return api.post("/users/me/avatar", form).then(r => r.data);
    },
    onSuccess: (updated) => { updateUser(updated); toast.show("Photo updated!"); },
    onError: () => { toast.show("Upload failed", "error"); setAvatarPreview(null); },
  });

  const removeAvatar = useMutation({
    mutationFn: () => api.patch("/users/me", { avatarUrl: null }).then(r => r.data),
    onSuccess: (updated) => { updateUser(updated); setAvatarPreview(null); toast.show("Photo removed"); },
  });

  const setStatusMutation = useMutation({
    mutationFn: (type: StatusType) =>
      api.put("/status", { type, customText: customText || undefined }).then(r => r.data),
    onSuccess: (status) => { updateUser({ status }); setActiveStatus(status.type); },
  });

  const clearStatus = useMutation({
    mutationFn: () => api.delete("/status"),
    onSuccess: () => { updateUser({ status: undefined }); setActiveStatus(null); setCustomText(""); },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    uploadAvatar.mutate(file);
  };

  const avatarUrl = avatarPreview ?? user?.avatarUrl;
  const userForAvatar = user
    ? { displayName: user.displayName, avatarUrl, status: user.status }
    : null;

  return (
    <div>
      <PageHeader eyebrow="You" title="Profile" subtitle="How you appear to friends in Taskyy." />

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>

        {/* ── LEFT — identity + status (sticky) ── */}
        <div style={{ position: "sticky", top: 0, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Avatar card */}
          <div className="card" style={{ padding: 22, textAlign: "center" }}>
            <div
              style={{ position: "relative", width: 112, height: 112, margin: "4px auto 14px", cursor: "default" }}
              onMouseEnter={() => setHoverAvatar(true)}
              onMouseLeave={() => setHoverAvatar(false)}
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar user={userForAvatar} size={112} status onBg="elevated" />
              {/* Upload overlay */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "rgba(0,0,0,0.52)",
                display: "grid", placeItems: "center",
                opacity: hoverAvatar || uploadAvatar.isPending ? 1 : 0,
                transition: "opacity 160ms var(--ease-out)",
                color: "#fff", flexDirection: "column", gap: 4,
              }}>
                {uploadAvatar.isPending ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 0.8s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                ) : (
                  <>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m4 18 5-5 4 4 3-3 4 4"/>
                    </svg>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>Change</div>
                  </>
                )}
              </div>
            </div>

            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.012em" }}>{user?.displayName}</div>
            <div className="muted" style={{ fontSize: 12.5, marginBottom: 14 }}>@{user?.username}</div>

            <div className="row gap-2" style={{ justifyContent: "center" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => fileInputRef.current?.click()} disabled={uploadAvatar.isPending}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>
                Upload
              </button>
              {avatarUrl && (
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--status-busy)" }}
                  onClick={() => removeAvatar.mutate()} disabled={removeAvatar.isPending}>
                  Remove
                </button>
              )}
            </div>

            <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)" }}>
              <div className="row gap-2" style={{ justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>
                Joined {new Date(user?.createdAt ?? Date.now()).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
              </div>
            </div>
          </div>

          {/* Status card */}
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>
              Current status
            </div>
            <div style={{
              padding: 12, borderRadius: 10, background: "var(--bg-subtle)",
              border: "1px solid var(--border)", marginBottom: 10,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ fontSize: 22 }}>
                {activeStatus ? STATUS_META[activeStatus]?.emoji ?? "😶" : "😶"}
              </div>
              <div className="flex1" style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }} className="truncate">
                  {customText || (activeStatus ? STATUS_META[activeStatus]?.label : "No status")}
                </div>
                <div className="muted" style={{ fontSize: 11.5 }}>
                  {user?.status?.presence ? user.status.presence.toLowerCase() : "offline"}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 10 }}>
              {STATUSES.map(s => {
                const m = STATUS_META[s];
                return (
                  <button key={s} className="btn" onClick={() => setStatusMutation.mutate(s)} style={{
                    flexDirection: "column", height: 64, gap: 5, padding: 6,
                    borderColor: activeStatus === s ? "var(--accent)" : "var(--border-strong)",
                    background: activeStatus === s ? "var(--accent-tint)" : "var(--bg-elevated)",
                  }}>
                    <span style={{ fontSize: 18 }}>{m.emoji}</span>
                    <span style={{ fontSize: 10, color: "var(--text-soft)" }}>{m.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="row gap-2" style={{ marginBottom: 8 }}>
              <input className="input" style={{ fontSize: 12.5 }}
                placeholder="Or write your own…"
                value={customText}
                onFocus={() => setActiveStatus("CUSTOM")}
                onChange={e => setCustomText(e.target.value)}
              />
              <button className="btn btn-sm btn-accent" onClick={() => setStatusMutation.mutate("CUSTOM")} disabled={!customText.trim()}>Set</button>
            </div>

            {activeStatus && (
              <button className="btn btn-ghost btn-sm" style={{ width: "100%", color: "var(--status-busy)" }}
                onClick={() => clearStatus.mutate()}>
                Clear status
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT — form cards ── */}
        <div className="col gap-4">
          <div className="card">
            <div className="card-hd"><h3>Public details</h3></div>
            <div className="col gap-4">
              <div className="grid-2">
                <div className="field">
                  <label className="field-label">Display name</label>
                  <input className="input" value={name}
                    onChange={e => { setName(e.target.value); setDirty(true); }} />
                </div>
                <div className="field">
                  <label className="field-label">Handle</label>
                  <input className="input" value={"@" + (user?.username ?? "")} disabled style={{ opacity: 0.55 }} />
                </div>
              </div>
              <div className="field">
                <label className="field-label">Bio</label>
                <textarea className="textarea" value={bio} maxLength={160}
                  onChange={e => { setBio(e.target.value); setDirty(true); }} />
                <div className="muted mono" style={{ fontSize: 11, textAlign: "right" }}>{bio.length}/160</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-hd">
              <h3>Privacy</h3>
              <span className="muted" style={{ fontSize: 12 }}>Control what friends see</span>
            </div>
            <div className="col">
              {[
                { k: "status",  label: "Show my live status",     val: true,  hint: "Friends can see what you're up to right now." },
                { k: "tasks",   label: "Share marked-public tasks", val: true,  hint: "Tasks marked shared appear on your profile." },
                { k: "photos",  label: "Daily memory photos",      val: false, hint: "Photos attached to tasks stay private unless turned on." },
                { k: "online",  label: "Show online indicator",    val: true,  hint: "A green dot next to your avatar when you're active." },
              ].map((p, i, arr) => (
                <div key={p.k} className="row gap-4" style={{
                  padding: "14px 0",
                  borderBottom: i === arr.length - 1 ? "none" : "1px solid var(--border)",
                }}>
                  <div className="flex1">
                    <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 2 }}>{p.label}</div>
                    <div className="muted" style={{ fontSize: 12, lineHeight: 1.45 }}>{p.hint}</div>
                  </div>
                  <Toggle value={p.val} />
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-hd"><h3>Danger zone</h3></div>
            <div className="row gap-4">
              <div className="flex1">
                <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 2 }}>Delete account</div>
                <div className="muted" style={{ fontSize: 12, lineHeight: 1.45 }}>Permanently delete your account and all data. This can&apos;t be undone.</div>
              </div>
              <button className="btn btn-sm" style={{ color: "var(--status-busy)", borderColor: "rgba(255,69,58,0.3)", flexShrink: 0 }}>Delete…</button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky save bar */}
      {dirty && (
        <div style={{
          position: "sticky", bottom: 20, marginTop: 24,
          display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8,
          padding: "10px 14px", background: "var(--bg-elevated)",
          border: "1px solid var(--border)", borderRadius: 12,
          boxShadow: "var(--shadow-3)",
          animation: "slide-up 200ms var(--ease-out)",
        }}>
          <span className="muted" style={{ fontSize: 12.5, flex: 1 }}>Хадгалаагүй өөрчлөлт байна</span>
          <button className="btn" onClick={() => { setName(user?.displayName ?? ""); setBio(user?.bio ?? ""); setDirty(false); }}>
            Буцаах
          </button>
          <button className="btn btn-accent" onClick={() => updateProfile.mutate({ displayName: name, bio })}
            disabled={updateProfile.isPending}>
            {updateProfile.isPending ? "Хадгалж байна…" : "Хадгалах"}
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
