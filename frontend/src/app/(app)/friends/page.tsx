"use client";

import { useState } from "react";
import {
  useFriends,
  useIncomingRequests,
  useSearchUsers,
  useSendFriendRequest,
  useAcceptRequest,
  useDeclineRequest,
} from "@/hooks/useFriends";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/status-pill";
import { useDebounce } from "@/hooks/useDebounce";

function SearchIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/>
    </svg>
  );
}

function SendIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 12 16-8-6 18-3-7-7-3z"/>
    </svg>
  );
}

export default function FriendsPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "online">("all");
  const debouncedQ = useDebounce(q, 400);

  const { data: friends = [] } = useFriends();
  const { data: requests = [] } = useIncomingRequests();
  const { data: searchResults = [] } = useSearchUsers(debouncedQ);
  const accept = useAcceptRequest();
  const decline = useDeclineRequest();
  const sendReq = useSendFriendRequest();

  const filtered = friends.filter(
    (f) =>
      !q ||
      f.displayName.toLowerCase().includes(q.toLowerCase()) ||
      f.username.toLowerCase().includes(q.toLowerCase())
  );
  const online = filtered.filter((f) => f.status);
  const list = tab === "online" ? online : filtered;

  return (
    <div>
      <PageHeader eyebrow="Friends" title="Your circle" subtitle="People you do tasks and rooms with.">
        <button className="btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Add by handle
        </button>
      </PageHeader>

      {/* Search + tabs */}
      <div className="row gap-3" style={{ marginBottom: 20 }}>
        <div className="input-search flex1">
          <SearchIcon size={14} />
          <input
            className="input"
            placeholder="Search by name or @handle"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div style={{
          display: "inline-flex",
          background: "var(--bg-subtle)",
          borderRadius: 8,
          padding: 2,
          border: "1px solid var(--border)",
        }}>
          {[
            { k: "all" as const, label: `All · ${filtered.length}` },
            { k: "online" as const, label: `Online · ${online.length}` },
          ].map((t) => (
            <button
              key={t.k}
              className="btn btn-sm"
              style={{
                border: 0,
                height: 26,
                padding: "0 10px",
                background: tab === t.k ? "var(--bg-elevated)" : "transparent",
                color: tab === t.k ? "var(--text)" : "var(--text-muted)",
                boxShadow: tab === t.k ? "var(--shadow-1)" : "none",
              }}
              onClick={() => setTab(t.k)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search results (when query is active) */}
      {debouncedQ.length >= 2 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-hd">
            <h3>Search results</h3>
          </div>
          <div className="col gap-3">
            {searchResults.length === 0 ? (
              <div className="muted" style={{ fontSize: 13 }}>No users found for &quot;{debouncedQ}&quot;</div>
            ) : (
              searchResults.map((u) => (
                <div key={u.id} className="row gap-3">
                  <Avatar user={{ displayName: u.displayName, avatarUrl: u.avatarUrl }} size={36} />
                  <div className="flex1">
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{u.displayName}</div>
                    <div className="muted" style={{ fontSize: 12 }}>@{u.username}</div>
                  </div>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => sendReq.mutate(u.id)}
                    disabled={sendReq.isPending}
                  >
                    Add friend
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Friend requests */}
      {requests.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-hd">
            <h3>Requests</h3>
            <Badge tone="accent">{requests.length} pending</Badge>
          </div>
          <div className="col gap-3">
            {requests.map((r) => (
              <div key={r.id} className="row gap-3">
                <Avatar user={{ displayName: r.requester.displayName, avatarUrl: r.requester.avatarUrl }} size={36} />
                <div className="flex1">
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>
                    {r.requester.displayName}{" "}
                    <span className="muted" style={{ fontWeight: 400 }}>@{r.requester.username}</span>
                  </div>
                  {r.requester.bio && (
                    <div className="muted" style={{ fontSize: 12 }}>{r.requester.bio}</div>
                  )}
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => accept.mutate(r.id)}>Accept</button>
                <button className="btn btn-sm" onClick={() => decline.mutate(r.id)}>Decline</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {list.map((f) => (
          <div key={f.id} className="card" style={{ padding: 18, cursor: "default" }}>
            <div className="row gap-3" style={{ marginBottom: 12 }}>
              <Avatar
                user={{
                  displayName: f.displayName,
                  avatarUrl: f.avatarUrl,
                  presence: f.status ? "online" : "offline",
                  status: f.status ? { presence: "online" } : undefined,
                }}
                size={40}
                status
                onBg="bg"
              />
              <div className="flex1 truncate">
                <div style={{ fontSize: 14, fontWeight: 600 }}>{f.displayName}</div>
                <div className="muted truncate" style={{ fontSize: 12 }}>@{f.username}</div>
              </div>
            </div>
            {f.bio && (
              <div className="muted" style={{ fontSize: 12.5, marginBottom: 12, minHeight: 36 }}>{f.bio}</div>
            )}
            <div className="row" style={{ justifyContent: "space-between" }}>
              <StatusPill
                status={f.status ? {
                  emoji: f.status.emoji,
                  label: f.status.customText ?? f.status.type,
                } : null}
                compact
              />
              <button className="btn btn-sm btn-ghost btn-icon">
                <SendIcon size={13} />
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && debouncedQ.length < 2 && (
          <div style={{
            gridColumn: "1 / -1",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 10, padding: "40px 20px", color: "var(--text-muted)",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center",
              background: "var(--bg-subtle)",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="9" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 11a3 3 0 1 0 0-6M22 20a5 5 0 0 0-4.5-5"/>
              </svg>
            </div>
            <div style={{ fontWeight: 600, color: "var(--text)" }}>No friends yet</div>
            <div style={{ fontSize: 12.5, textAlign: "center", maxWidth: 320 }}>
              {tab === "online" ? "No friends are online right now." : "Search for people to add as friends."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
