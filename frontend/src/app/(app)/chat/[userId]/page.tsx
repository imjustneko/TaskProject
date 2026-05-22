"use client";

import { useState, useRef, useEffect } from "react";
import { useDMs, useSendDM } from "@/hooks/useMessages";
import { useAuthStore } from "@/stores/authStore";
import { Avatar } from "@/components/ui/avatar";
import { useT } from "@/hooks/useT";

export default async function DMPage({ params }: PageProps<"/chat/[userId]">) {
  const { userId } = await params;
  return <DMChat userId={userId} />;
}

function DMChat({ userId }: { userId: string }) {
  const { user: me } = useAuthStore();
  const { t } = useT();
  const { data: messages = [], isLoading } = useDMs(userId);
  const send = useSendDM(userId);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || send.isPending) return;
    send.mutate(text.trim());
    setText("");
  };

  const otherUser = messages.find(m => m.senderId !== me?.id)?.sender;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 14 }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
        {otherUser ? (
          <>
            <Avatar user={{ displayName: otherUser.displayName, avatarUrl: otherUser.avatarUrl }} size={36} status />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{otherUser.displayName}</div>
              <div className="muted" style={{ fontSize: 12 }}>@{otherUser.username}</div>
            </div>
          </>
        ) : (
          <div style={{ fontWeight: 600, fontSize: 14 }}>{t("direct_msg")}</div>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
        {isLoading ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>{t("dm_loading")}</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13, marginTop: "auto" }}>
            {t("dm_empty")}
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.senderId === me?.id;
            const showAvatar = !isMe && (i === 0 || messages[i - 1].senderId !== msg.senderId);
            return (
              <div key={msg.id} style={{
                display: "flex", gap: 10, alignItems: "flex-end",
                flexDirection: isMe ? "row-reverse" : "row",
                marginTop: showAvatar && !isMe ? 12 : 2,
              }}>
                {!isMe && (
                  <div style={{ width: 28, flexShrink: 0 }}>
                    {showAvatar && <Avatar user={{ displayName: msg.sender.displayName, avatarUrl: msg.sender.avatarUrl }} size={28} />}
                  </div>
                )}
                <div style={{
                  maxWidth: "70%",
                  padding: "8px 12px",
                  borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                  background: isMe ? "var(--accent)" : "var(--bg-subtle)",
                  color: isMe ? "#fff" : "var(--text)",
                  fontSize: 14,
                  lineHeight: 1.45,
                }}>
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{
        padding: "12px 16px", borderTop: "1px solid var(--border)",
        display: "flex", gap: 8, alignItems: "center",
      }}>
        <input
          className="input"
          placeholder={t("message_ph")}
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ flex: 1 }}
          autoComplete="off"
        />
        <button type="submit" className="btn btn-accent btn-sm btn-icon" disabled={!text.trim() || send.isPending}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 16-8-6 18-3-7-7-3z"/></svg>
        </button>
      </form>
    </div>
  );
}
