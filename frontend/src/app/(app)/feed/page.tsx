"use client";

import { useState, useRef } from "react";
import {
  useFeed, useCreatePost, useToggleLike, useDeletePost,
  usePostComments, useAddComment, type FeedPost,
} from "@/hooks/useFeed";
import { useTodayTasks } from "@/hooks/useTasks";
import { useUserEmojis } from "@/hooks/useUserEmojis";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/ui/toast";
import { Avatar } from "@/components/ui/avatar";
import { STATUS_META } from "@/types";
import type { StatusType } from "@/types";

/* ── Time helper ── */
function timeAgo(date: string): string {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

/* ── Parse message with user emojis ── */
function parseWithEmojis(content: string, emojis: { name: string; imageUrl: string }[]): React.ReactNode[] {
  if (!emojis.length) return [content];
  const map = Object.fromEntries(emojis.map(e => [e.name, e.imageUrl]));
  const parts = content.split(/:([a-z0-9_]+):/g);
  return parts.map((p, i) => {
    if (i % 2 === 1 && map[p]) {
      return <img key={i} src={map[p]} alt={`:${p}:`} title={`:${p}:`} style={{ width:20,height:20,objectFit:"contain",verticalAlign:"middle",display:"inline" }} />;
    }
    return p;
  });
}

/* ── Compose box ── */
function ComposeBox() {
  const { user } = useAuthStore();
  const toast = useToast();
  const [text, setText] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [showImg, setShowImg] = useState(false);
  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const createPost = useCreatePost();
  const { data: myTasks = [] } = useTodayTasks();
  const { data: myEmojis = [] } = useUserEmojis();

  const selectedTask = myTasks.find(t => t.id === selectedTaskId);

  const insertEmoji = (name: string) => {
    setText(t => t + `:${name}: `);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const submit = () => {
    if (!text.trim() && !imgUrl.trim() && !selectedTaskId) return;
    createPost.mutate(
      { content: text.trim() || undefined, imageUrl: imgUrl.trim() || undefined, taskId: selectedTaskId || undefined },
      { onSuccess: () => { setText(""); setImgUrl(""); setShowImg(false); setSelectedTaskId(null); toast.show("Нийтлэв!"); } }
    );
  };

  return (
    <div className="card" style={{ marginBottom: 12, padding: 16 }}>
      <div className="row gap-3" style={{ alignItems: "flex-start" }}>
        <Avatar user={{ displayName: user?.displayName ?? "U", avatarUrl: user?.avatarUrl }} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Юу бодож байна вэ?"
            rows={text.length > 80 ? 4 : 2}
            maxLength={500}
            style={{
              width: "100%", border: "none", outline: "none", resize: "none",
              background: "transparent", font: "inherit", fontSize: 15,
              color: "var(--text)", lineHeight: 1.5,
            }}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
          />

          {/* Image URL input */}
          {showImg && (
            <div style={{ marginTop: 8 }}>
              <input className="input" style={{ fontSize: 13, height: 34 }}
                placeholder="Зургийн URL хаяг…" value={imgUrl} onChange={e => setImgUrl(e.target.value)} />
              {imgUrl && (
                <div style={{ marginTop: 8, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgUrl} alt="preview" style={{ width: "100%", maxHeight: 300, objectFit: "cover", display: "block" }}
                    onError={e => (e.currentTarget.style.display = "none")} />
                </div>
              )}
            </div>
          )}

          {/* Task picker */}
          {showTaskPicker && (
            <div style={{ marginTop: 8, border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", maxHeight: 200, overflowY: "auto" }}>
              {myTasks.length === 0 ? (
                <div style={{ padding: "12px 14px", fontSize: 13, color: "var(--text-muted)" }}>Өнөөдрийн таск байхгүй</div>
              ) : myTasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => { setSelectedTaskId(selectedTaskId === t.id ? null : t.id); setShowTaskPicker(false); }}
                  style={{
                    padding: "10px 14px", fontSize: 13.5, cursor: "default",
                    background: selectedTaskId === t.id ? "var(--accent-tint)" : "var(--bg-elevated)",
                    color: selectedTaskId === t.id ? "var(--accent)" : "var(--text)",
                    borderBottom: "1px solid var(--border)",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.isCompleted?"#16a34a":"var(--text-muted)"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    {t.isCompleted ? <path d="m4 12 5 5L20 6"/> : <circle cx="12" cy="12" r="9"/>}
                  </svg>
                  {t.title}
                  {t.isCompleted && <span style={{ marginLeft: "auto", fontSize: 10, color: "#16a34a", background: "rgba(34,197,94,0.12)", padding: "1px 6px", borderRadius: 4 }}>Дууссан</span>}
                </div>
              ))}
            </div>
          )}

          {/* Selected task preview */}
          {selectedTask && (
            <div style={{
              marginTop: 8, padding: "8px 12px", borderRadius: 8,
              background: "var(--bg-subtle)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={selectedTask.isCompleted?"#16a34a":"var(--accent)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {selectedTask.isCompleted ? <path d="m4 12 5 5L20 6"/> : <circle cx="12" cy="12" r="9"/>}
              </svg>
              <span style={{ fontSize: 13, flex: 1 }}>{selectedTask.title}</span>
              <span style={{ fontSize: 11, color: selectedTask.isCompleted?"#16a34a":"var(--accent)", fontWeight: 500 }}>
                {selectedTask.isCompleted ? "✓ Дууссан" : "Хийгдэж байна"}
              </span>
              <button className="btn btn-ghost btn-sm btn-icon" style={{ padding: 0, width: 18, height: 18 }}
                onClick={() => setSelectedTaskId(null)}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
              </button>
            </div>
          )}

          {/* Emoji picker */}
          {showEmojiPicker && myEmojis.length > 0 && (
            <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4, padding: "8px", background: "var(--bg-subtle)", borderRadius: 10, border: "1px solid var(--border)" }}>
              {myEmojis.map(em => (
                <button key={em.id} title={`:${em.name}:`} onClick={() => insertEmoji(em.name)}
                  style={{ width:32,height:32,borderRadius:6,border:"1px solid var(--border)",background:"var(--bg-elevated)",padding:3,cursor:"default" }}>
                  <img src={em.imageUrl} alt={em.name} style={{ width:"100%",height:"100%",objectFit:"contain" }} />
                </button>
              ))}
            </div>
          )}

          <div className="row" style={{ marginTop: 10, justifyContent: "space-between" }}>
            <div className="row gap-1">
              {/* Image */}
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowImg(v=>!v)} title="Зураг нэмэх"
                style={{ color: showImg?"var(--accent)":"var(--text-muted)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m4 18 5-5 4 4 3-3 4 4"/>
                </svg>
              </button>

              {/* Task attach */}
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => { setShowTaskPicker(v=>!v); setShowEmojiPicker(false); }} title="Таск хавсаргах"
                style={{ color: selectedTaskId?"var(--accent)":"var(--text-muted)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m4 12 5 5L20 6"/>
                </svg>
              </button>

              {/* Emoji */}
              {myEmojis.length > 0 && (
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => { setShowEmojiPicker(v=>!v); setShowTaskPicker(false); }} title="Custom emoji"
                  style={{ color: showEmojiPicker?"var(--accent)":"var(--text-muted)" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                </button>
              )}

              {text.length > 0 && (
                <span style={{ fontSize: 11, color: text.length > 450 ? "var(--status-busy)" : "var(--text-faint)", padding: "0 4px" }}>
                  {500 - text.length}
                </span>
              )}
            </div>

            <button
              className="btn btn-accent btn-sm"
              onClick={submit}
              disabled={(!text.trim() && !imgUrl.trim() && !selectedTaskId) || createPost.isPending}
              style={{ minWidth: 70 }}
            >
              {createPost.isPending ? "…" : "Нийтлэх"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Comment section ── */
function Comments({ postId, onClose }: { postId: string; onClose: () => void }) {
  const { user } = useAuthStore();
  const { data: comments = [] } = usePostComments(postId, true);
  const addComment = useAddComment(postId);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    if (!text.trim()) return;
    addComment.mutate(text.trim(), { onSuccess: () => setText("") });
  };

  return (
    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 8 }}>
      {comments.map(c => (
        <div key={c.id} className="row gap-2" style={{ marginBottom: 10, alignItems: "flex-start" }}>
          <Avatar user={{ displayName: c.user.displayName, avatarUrl: c.user.avatarUrl }} size={28} />
          <div style={{
            flex: 1, background: "var(--bg-subtle)", borderRadius: "4px 14px 14px 14px",
            padding: "8px 12px", fontSize: 13.5, lineHeight: 1.45,
          }}>
            <span style={{ fontWeight: 600, color: "var(--text)", marginRight: 6 }}>{c.user.displayName}</span>
            <span style={{ color: "var(--text-soft)" }}>{c.content}</span>
          </div>
        </div>
      ))}

      <div className="row gap-2" style={{ marginTop: 8 }}>
        <Avatar user={{ displayName: user?.displayName ?? "U", avatarUrl: user?.avatarUrl }} size={28} />
        <input
          ref={inputRef}
          className="input"
          style={{ flex: 1, height: 34, fontSize: 13, borderRadius: 20 }}
          placeholder="Сэтгэгдэл бичих…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          autoFocus
        />
        <button
          className="btn btn-accent btn-sm btn-icon"
          disabled={!text.trim() || addComment.isPending}
          onClick={submit}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="m4 12 16-8-6 18-3-7-7-3z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── Single Post card ── */
function PostCard({ post }: { post: FeedPost }) {
  const { user: me } = useAuthStore();
  const toggleLike = useToggleLike();
  const deletePost = useDeletePost();
  const [showComments, setShowComments] = useState(false);
  const isMe = post.userId === me?.id;

  const statusMeta = post.user.status
    ? STATUS_META[post.user.status.type as StatusType]
    : null;

  return (
    <div className="card" style={{ marginBottom: 8, padding: "16px 16px 12px" }}>
      <div className="row gap-3" style={{ alignItems: "flex-start", marginBottom: 10 }}>
        <Avatar
          user={{ displayName: post.user.displayName, avatarUrl: post.user.avatarUrl }}
          size={40}
          status={undefined}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row" style={{ gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{post.user.displayName}</span>
            <span className="muted" style={{ fontSize: 12.5 }}>@{post.user.username}</span>
            <span className="muted" style={{ fontSize: 12, marginLeft: "auto" }}>{timeAgo(post.createdAt)}</span>
            {isMe && (
              <button
                className="btn btn-ghost btn-sm btn-icon"
                onClick={() => deletePost.mutate(post.id)}
                style={{ color: "var(--text-faint)" }}
                title="Устгах"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                </svg>
              </button>
            )}
          </div>
          {statusMeta && (
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>
              {statusMeta.emoji} {post.user.status?.customText ?? statusMeta.label}
            </div>
          )}
        </div>
      </div>

      {/* Content with emoji support */}
      {post.content && (
        <div style={{ fontSize: 15, lineHeight: 1.55, color: "var(--text)", marginBottom: (post.imageUrl || post.task) ? 10 : 12, whiteSpace: "pre-wrap" }}>
          {parseWithEmojis(post.content, post.user.userEmojis ?? [])}
        </div>
      )}

      {/* Attached task */}
      {post.task && (
        <div style={{
          marginBottom: post.imageUrl ? 10 : 12,
          padding: "10px 14px", borderRadius: 10,
          border: "1px solid var(--border)", background: "var(--bg-subtle)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, flexShrink: 0,
            background: post.task.isCompleted ? "rgba(34,197,94,0.15)" : "var(--accent-tint)",
            display: "grid", placeItems: "center",
          }}>
            {post.task.isCompleted ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/></svg>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>{post.task.title}</div>
            <div style={{ fontSize: 11.5, color: post.task.isCompleted?"#16a34a":"var(--text-muted)", marginTop: 1 }}>
              {post.task.isCompleted ? "✓ Дууссан" : "Хийгдэж байна"}
            </div>
          </div>
        </div>
      )}

      {/* Image */}
      {post.imageUrl && (
        <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", marginBottom: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt="Post image"
            style={{ width: "100%", maxHeight: 400, objectFit: "cover", display: "block" }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="row gap-1" style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
        {/* Like */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => toggleLike.mutate(post.id)}
          style={{
            gap: 6, color: post.likedByMe ? "var(--status-busy)" : "var(--text-muted)",
            transition: "all 150ms",
          }}
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24"
            fill={post.likedByMe ? "var(--status-busy)" : "none"}
            stroke={post.likedByMe ? "var(--status-busy)" : "currentColor"}
            strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: "transform 150ms", transform: post.likedByMe ? "scale(1.2)" : "scale(1)" }}
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>
          </svg>
          {post.likesCount > 0 && (
            <span style={{ fontSize: 12.5, fontWeight: 500 }}>{post.likesCount}</span>
          )}
        </button>

        {/* Comment */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setShowComments(v => !v)}
          style={{ gap: 6, color: showComments ? "var(--accent)" : "var(--text-muted)" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {post.commentsCount > 0 && (
            <span style={{ fontSize: 12.5, fontWeight: 500 }}>{post.commentsCount}</span>
          )}
        </button>

        {/* Share */}
        <button
          className="btn btn-ghost btn-sm btn-icon"
          style={{ marginLeft: "auto", color: "var(--text-muted)" }}
          onClick={() => {
            navigator.clipboard?.writeText(window.location.origin + "/feed");
          }}
          title="Хуулах"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
          </svg>
        </button>
      </div>

      {/* Comments panel */}
      {showComments && <Comments postId={post.id} onClose={() => setShowComments(false)} />}
    </div>
  );
}

/* ── Feed page ── */
export default function FeedPage() {
  const { data: posts = [], isLoading, refetch } = useFeed();

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div className="row" style={{ marginBottom: 16, justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em" }}>Feed</h1>
          <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>Нийтийн нийтлэлүүд</div>
        </div>
        <button
          className="btn btn-ghost btn-sm btn-icon"
          onClick={() => refetch()}
          title="Шинэчлэх"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/>
          </svg>
        </button>
      </div>

      {/* Compose */}
      <ComposeBox />

      {/* Posts */}
      {isLoading ? (
        <div className="col gap-3">
          {[1,2,3].map(i => (
            <div key={i} style={{ height: 140, borderRadius: 14, background: "var(--bg-elevated)", border: "1px solid var(--border)", animation: "pulse 1.5s ease-in-out infinite" }}/>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📣</div>
          <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>Нийтлэл байхгүй байна</div>
          <div style={{ fontSize: 13 }}>Эхний нийтлэлийг бичээрэй!</div>
        </div>
      ) : (
        posts.map(post => <PostCard key={post.id} post={post} />)
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}
