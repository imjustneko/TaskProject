"use client";

import { useConversations } from "@/hooks/useMessages";
import { useFriends } from "@/hooks/useFriends";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types";

export default function ChatPage() {
  const { data: convos = [] } = useConversations();
  const { data: friends = [] } = useFriends();
  const { user: me } = useAuthStore();

  const friendsMap = new Map<string, User>(friends.map(f => [f.id, f]));

  return (
    <div style={{ height: "100%", display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 }}>
      {/* Left: conversation list */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14 }}>
          Мессежүүд
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Active conversations */}
          {convos.length > 0 && (
            <div>
              {convos.map(msg => {
                const otherId = msg.senderId === me?.id ? msg.recipientId! : msg.senderId;
                const other = friendsMap.get(otherId) ?? msg.sender;
                return (
                  <Link key={msg.id} href={`/chat/${otherId}`} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", textDecoration: "none",
                    borderBottom: "1px solid var(--border)",
                    transition: "background 120ms",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <Avatar user={{ displayName: other.displayName, avatarUrl: other.avatarUrl }} size={36} status />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 2 }}>{other.displayName}</div>
                      <div className="muted truncate" style={{ fontSize: 12 }}>{msg.content}</div>
                    </div>
                    <div className="muted" style={{ fontSize: 11, flexShrink: 0 }}>
                      {formatDate(msg.createdAt, { month: "short", day: "numeric" })}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Friends you can message */}
          {friends.length > 0 && (
            <div>
              <div style={{ padding: "8px 14px 4px", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-faint)" }}>
                Найзууд
              </div>
              {friends.map(f => (
                <Link key={f.id} href={`/chat/${f.id}`} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 14px",
                  textDecoration: "none", transition: "background 120ms",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <Avatar user={{ displayName: f.displayName, avatarUrl: f.avatarUrl, presence: f.status ? "online" : "offline", status: f.status ? { presence: "online" } : undefined }} size={28} status onBg="bg" />
                  <div className="flex1 truncate">
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{f.displayName}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {friends.length === 0 && convos.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>💬</div>
              Мессеж бичихийн тулд найз нэмнэ үү
            </div>
          )}
        </div>
      </div>

      {/* Right: empty state */}
      <div style={{
        background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 14,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        color: "var(--text-muted)", gap: 10,
      }}>
        <div style={{ fontSize: 36 }}>💬</div>
        <div style={{ fontWeight: 600, color: "var(--text)" }}>Яриа сонгох</div>
        <div style={{ fontSize: 13 }}>Чат эхлүүлэхийн тулд жагсаалтаас найзаа сонгоно уу.</div>
      </div>
    </div>
  );
}
