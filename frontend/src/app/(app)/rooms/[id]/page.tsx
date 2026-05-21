"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRoom, useAddRoomTask, useSetRoomTaskStatus, useInviteToRoom, useRoomEmojis, useAddRoomEmoji, useDeleteRoomEmoji, useUpdateRoom } from "@/hooks/useRooms";
import { useSearchUsers } from "@/hooks/useFriends";
import { useMessages, useSendRoomMessage } from "@/hooks/useMessages";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/stores/authStore";
import { Avatar } from "@/components/ui/avatar";
import { useT } from "@/hooks/useT";
import { use } from "react";
import type { RoomTask, RoomEmoji } from "@/types";

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RoomView roomId={id} />;
}

// ── Task status button ──────────────────────────────────────────────────────
function TaskStatusButtons({ rt, roomId, userId, memberCount }: {
  rt: RoomTask; roomId: string; userId: string; memberCount: number;
}) {
  const { t } = useT();
  const setStatus = useSetRoomTaskStatus();
  const myStatus =
    rt.completedBy?.includes(userId) ? "DONE"
    : rt.failedBy?.includes(userId) ? "FAILED"
    : rt.skippedBy?.includes(userId) ? "SKIP"
    : null;

  const allCount = (rt.completedBy?.length ?? 0) + (rt.failedBy?.length ?? 0) + (rt.skippedBy?.length ?? 0);
  const pct = memberCount === 0 ? 0 : Math.round((rt.completedBy?.length ?? 0) / memberCount * 100);

  const btn = (status: "DONE"|"FAILED"|"SKIP", icon: React.ReactNode, label: string, color: string) => {
    const active = myStatus === status;
    return (
      <button
        title={label}
        onClick={() => setStatus.mutate({ roomId, taskId: rt.task.id, status: active ? "RESET" : status })}
        style={{
          width:28,height:28,borderRadius:6,border:`1.5px solid ${active ? color : "var(--border-strong)"}`,
          background:active ? `${color}22` : "var(--bg-elevated)",
          display:"grid",placeItems:"center",cursor:"default",transition:"all 120ms",
          color: active ? color : "var(--text-muted)",
          flexShrink:0,
        }}
      >
        {icon}
      </button>
    );
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end",flexShrink:0 }}>
      <div style={{ display:"flex",gap:4 }}>
        {btn("DONE",
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>,
          t("done_btn"),"#16a34a"
        )}
        {btn("FAILED",
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>,
          t("failed_btn"),"#ef4444"
        )}
        {btn("SKIP",
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
          t("skip_btn"),"#f59e0b"
        )}
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:6 }}>
        <div style={{ width:72,height:3,borderRadius:999,background:"var(--border)",overflow:"hidden" }}>
          <div style={{ width:`${pct}%`,height:"100%",background:"#16a34a",transition:"width 300ms" }}/>
        </div>
        <span style={{ fontFamily:"monospace",fontSize:10,color:"var(--text-muted)" }}>
          {allCount}/{memberCount}
        </span>
      </div>
    </div>
  );
}

// ── Who did what avatars ────────────────────────────────────────────────────
function MemberStatuses({ rt, members }: { rt: RoomTask; members: { id: string; userId: string; user: { displayName: string; avatarUrl?: string | null } }[] }) {
  const getStatus = (userId: string) =>
    rt.completedBy?.includes(userId) ? "done"
    : rt.failedBy?.includes(userId) ? "failed"
    : rt.skippedBy?.includes(userId) ? "skip"
    : "pending";

  const color = { done:"#16a34a", failed:"#ef4444", skip:"#f59e0b", pending:"transparent" };

  return (
    <div style={{ display:"flex",gap:2,flexWrap:"wrap" }}>
      {members.map(m => {
        const s = getStatus(m.userId);
        return (
          <div key={m.id} title={`${m.user.displayName}: ${s}`} style={{ position:"relative" }}>
            <div style={{ opacity: s==="pending"?0.3:1, transition:"opacity 150ms" }}>
              <Avatar user={{ displayName:m.user.displayName,avatarUrl:m.user.avatarUrl }} size={20} />
            </div>
            {s !== "pending" && (
              <div style={{
                position:"absolute",bottom:-2,right:-2,width:10,height:10,borderRadius:"50%",
                background:color[s],border:"1.5px solid var(--bg-card)",
                display:"grid",placeItems:"center",
              }}>
                {s==="done" && <svg width="6" height="6" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5"/></svg>}
                {s==="failed" && <svg width="5" height="5" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l6 6M9 3 3 9"/></svg>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Invite modal ────────────────────────────────────────────────────────────
function InviteModal({ open, onClose, roomId, memberIds }: {
  open: boolean; onClose: () => void; roomId: string; memberIds: string[];
}) {
  const { t, tf } = useT();
  const [q, setQ] = useState("");
  const { data: results = [] } = useSearchUsers(q);
  const invite = useInviteToRoom();
  const toast = useToast();

  if (!open) return null;

  const nonMembers = results.filter(u => !memberIds.includes(u.id));

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <h2>{t("invite_title")}</h2>
          <button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <input
          className="input"
          placeholder={t("invite_search_ph")}
          autoFocus
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ marginBottom:12 }}
        />
        <div className="col gap-2" style={{ maxHeight:300,overflowY:"auto" }}>
          {q.length < 2 ? (
            <div style={{ textAlign:"center",color:"var(--text-muted)",fontSize:13,padding:"20px 0" }}>
              {t("invite_type_hint")}
            </div>
          ) : nonMembers.length === 0 ? (
            <div style={{ textAlign:"center",color:"var(--text-muted)",fontSize:13,padding:"20px 0" }}>
              {t("invite_no_result")}
            </div>
          ) : nonMembers.map(u => (
            <div key={u.id} className="row gap-3" style={{ padding:"8px 0",borderBottom:"1px solid var(--border)" }}>
              <Avatar user={u} size={36} />
              <div className="flex1">
                <div style={{ fontSize:13.5,fontWeight:500 }}>{u.displayName}</div>
                <div className="muted" style={{ fontSize:12 }}>@{u.username}</div>
              </div>
              <button
                className="btn btn-sm btn-accent"
                disabled={invite.isPending}
                onClick={() => invite.mutate({ roomId, userId: u.id }, {
                  onSuccess: () => { toast.show(tf("invite_sent", u.displayName)); setQ(""); },
                })}
              >
                {t("invite")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Emoji manager modal ─────────────────────────────────────────────────────
function EmojiModal({ open, onClose, roomId }: { open: boolean; onClose: () => void; roomId: string }) {
  const { t, tf } = useT();
  const { data: emojis = [] } = useRoomEmojis(roomId);
  const addEmoji = useAddRoomEmoji(roomId);
  const deleteEmoji = useDeleteRoomEmoji(roomId);
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { user: me } = useAuthStore();

  if (!open) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    if (!name) setName(f.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9_]/gi, "_").toLowerCase());
  };

  const handleAdd = () => {
    if (!file || !name.trim()) return;
    addEmoji.mutate({ name: name.trim(), file }, {
      onSuccess: () => {
        toast.show(tf("emoji_added", name));
        setName(""); setFile(null); setPreview(null);
        if (fileRef.current) fileRef.current.value = "";
      },
      onError: (e: unknown) => {
        const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
        toast.show(typeof msg === "string" ? msg : t("error_generic"), "error");
      },
    });
  };

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" style={{ maxWidth:480 }} onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <h2>{t("emoji_modal_title")}</h2>
          <button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>

        {/* Upload new */}
        <div style={{ padding:14,background:"var(--bg-subtle)",borderRadius:10,marginBottom:16 }}>
          <div style={{ fontSize:13,fontWeight:600,marginBottom:10 }}>{t("emoji_add_label")}</div>
          <div className="row gap-3" style={{ alignItems:"flex-end" }}>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width:52,height:52,borderRadius:10,border:"2px dashed var(--border-strong)",
                display:"grid",placeItems:"center",cursor:"default",flexShrink:0,overflow:"hidden",
                background:"var(--bg-elevated)",
              }}
            >
              {preview
                ? <img src={preview} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFile} />
            <div className="flex1">
              <label className="field-label">{t("emoji_add_label")}</label>
              <input
                className="input"
                placeholder={t("emoji_name_ph")}
                value={name}
                onChange={e => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))}
                style={{ marginBottom:0 }}
              />
              <div style={{ fontSize:10.5,color:"var(--text-muted)",marginTop:4 }}>{t("emoji_name_hint")}</div>
            </div>
            <button
              className="btn btn-accent"
              disabled={!file || !name.trim() || addEmoji.isPending}
              onClick={handleAdd}
            >
              {addEmoji.isPending ? t("emoji_adding") : t("emoji_add_btn")}
            </button>
          </div>
        </div>

        {/* Existing emojis */}
        <div style={{ maxHeight:280,overflowY:"auto" }}>
          {emojis.length === 0 ? (
            <div style={{ textAlign:"center",color:"var(--text-muted)",fontSize:13,padding:"20px 0" }}>{t("emoji_no_list")}</div>
          ) : (
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:8 }}>
              {emojis.map((em: RoomEmoji) => (
                <div key={em.id} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:8,borderRadius:8,background:"var(--bg-subtle)",position:"relative" }}>
                  <img src={em.imageUrl} alt={em.name} style={{ width:40,height:40,objectFit:"contain",borderRadius:6 }} />
                  <span style={{ fontSize:11,color:"var(--text-muted)" }}>:{em.name}:</span>
                  {em.addedById === me?.id && (
                    <button
                      className="btn btn-ghost btn-sm btn-icon"
                      style={{ position:"absolute",top:2,right:2,opacity:.5,width:18,height:18,padding:0 }}
                      onClick={() => deleteEmoji.mutate(em.id, { onSuccess: () => toast.show(t("emoji_deleted")) })}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Chat with emoji support ─────────────────────────────────────────────────
function parseMessage(content: string, emojis: RoomEmoji[]): React.ReactNode[] {
  if (!emojis.length) return [content];
  const emojiMap = Object.fromEntries(emojis.map(e => [e.name, e.imageUrl]));
  const parts = content.split(/:([a-z0-9_]+):/g);
  return parts.map((part, i) => {
    if (i % 2 === 1 && emojiMap[part]) {
      return <img key={i} src={emojiMap[part]} alt={`:${part}:`} title={`:${part}:`} style={{ width:20,height:20,objectFit:"contain",verticalAlign:"middle",display:"inline" }} />;
    }
    return part;
  });
}

function RoomChat({ roomId, emojis }: { roomId: string; emojis: RoomEmoji[] }) {
  const { user: me } = useAuthStore();
  const { t } = useT();
  const { data: messages = [] } = useMessages(roomId);
  const send = useSendRoomMessage(roomId);
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    send.mutate(text.trim());
    setText("");
  };

  const insertEmoji = useCallback((name: string) => {
    setText(tx => tx + `:${name}: `);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  }, []);

  return (
    <div className="card" style={{ display:"flex",flexDirection:"column",padding:0,overflow:"hidden" }}>
      <div style={{ padding:"14px 16px",borderBottom:"1px solid var(--border)",fontWeight:600,fontSize:14 }}>
        {t("chat_title")}
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:4 }}>
        {messages.length === 0 ? (
          <div style={{ textAlign:"center",color:"var(--text-muted)",fontSize:13,marginTop:"auto" }}>
            {t("no_messages")}
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.senderId === me?.id;
            const prevSame = i > 0 && messages[i-1].senderId === msg.senderId;
            return (
              <div key={msg.id} style={{ display:"flex",gap:8,alignItems:"flex-end",flexDirection:isMe?"row-reverse":"row",marginTop:prevSame?2:10 }}>
                {!isMe && !prevSame && <Avatar user={{ displayName:msg.sender.displayName,avatarUrl:msg.sender.avatarUrl }} size={24} />}
                {!isMe && prevSame && <div style={{ width:24 }}/>}
                <div style={{ maxWidth:"75%",padding:"7px 11px",borderRadius:isMe?"11px 11px 2px 11px":"11px 11px 11px 2px",background:isMe?"var(--accent)":"var(--bg-subtle)",color:isMe?"#fff":"var(--text)",fontSize:13.5,lineHeight:1.45 }}>
                  {parseMessage(msg.content ?? "", emojis)}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Emoji quick-picker */}
      {showEmojiPicker && emojis.length > 0 && (
        <div style={{ padding:"8px 12px",borderTop:"1px solid var(--border)",display:"flex",flexWrap:"wrap",gap:4 }}>
          {emojis.map(em => (
            <button key={em.id} title={`:${em.name}:`} onClick={() => insertEmoji(em.name)}
              style={{ width:32,height:32,borderRadius:6,border:"1px solid var(--border)",background:"var(--bg-subtle)",padding:2,cursor:"default" }}>
              <img src={em.imageUrl} alt={em.name} style={{ width:"100%",height:"100%",objectFit:"contain" }}/>
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSend} style={{ padding:"10px 12px",borderTop:"1px solid var(--border)",display:"flex",gap:8 }}>
        {emojis.length > 0 && (
          <button type="button" className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowEmojiPicker(v=>!v)}
            style={{ flexShrink:0,color: showEmojiPicker?"var(--accent)":"var(--text-muted)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </button>
        )}
        <input ref={inputRef} className="input" style={{ flex:1,height:34,fontSize:13 }} placeholder={t("message_ph")} value={text} onChange={e => setText(e.target.value)} autoComplete="off"/>
        <button type="submit" className="btn btn-accent btn-sm btn-icon" disabled={!text.trim()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 16-8-6 18-3-7-7-3z"/></svg>
        </button>
      </form>
    </div>
  );
}

// ── Edit Room Modal (owner only) ────────────────────────────────────────────
const ACTIVITY_EMOJIS_EDIT: Record<string,string> = {PLAYING:"🎮",COOKING:"🍳",WALKING:"🚶",STUDYING:"📚",READING:"📖",WORKING:"💻",CUSTOM:"✨"};

function EditRoomModal({ open, onClose, room }: {
  open: boolean; onClose: () => void;
  room: { id: string; name: string; description?: string; activityType?: string; isPublic: boolean; imageUrl?: string };
}) {
  const { t } = useT();
  const toast = useToast();
  const [name, setName] = useState(room.name);
  const [desc, setDesc] = useState(room.description ?? "");
  const [activity, setActivity] = useState(room.activityType ?? "");
  const [isPublic, setIsPublic] = useState(room.isPublic);
  const update = useUpdateRoom(room.id);

  if (!open) return null;

  const save = () => {
    if (!name.trim()) return;
    update.mutate(
      { name: name.trim(), description: desc || undefined, activityType: activity || undefined, isPublic },
      {
        onSuccess: () => { toast.show(t("save_changes") + "!"); onClose(); },
        onError: () => toast.show(t("error_generic"), "error"),
      }
    );
  };

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <h2>{t("edit")} room</h2>
          <button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div className="col gap-4">
          <div className="field">
            <label className="field-label">{t("room_name_label")}</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <div className="field">
            <label className="field-label">{t("desc_optional")}</label>
            <textarea className="textarea" rows={2} value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">{t("activity_label")}</label>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6 }}>
              {[["","🏠",t("any_activity")],["PLAYING","🎮",t("gaming")],["STUDYING","📚",t("studying")],["READING","📖",t("reading")],["WALKING","🚶",t("walking")],["COOKING","🍳",t("cooking")],["WORKING","💻",t("working")],["CUSTOM","✨",t("custom_activity")]].map(([k,em,l])=>(
                <button key={k} className="btn btn-sm" onClick={() => setActivity(k as string)} style={{
                  borderColor: activity===k?"var(--accent)":"var(--border-strong)",
                  background: activity===k?"var(--accent-tint)":"var(--bg-elevated)",
                  color: activity===k?"var(--accent)":"var(--text-soft)",
                  gap:4,
                }}>
                  <span>{em}</span><span style={{ fontSize:10 }}>{l}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="field-label">{t("visibility")}</label>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
              {[
                { val: false, label: t("private_label"), desc: t("private_desc") },
                { val: true,  label: t("public_label"),  desc: t("public_desc") },
              ].map(p => (
                <button key={String(p.val)} className="btn" onClick={() => setIsPublic(p.val)} style={{
                  flexDirection:"column",height:60,gap:4,
                  borderColor: isPublic===p.val?"var(--accent)":"var(--border-strong)",
                  background: isPublic===p.val?"var(--accent-tint)":"var(--bg-elevated)",
                }}>
                  <span style={{ fontSize:12,fontWeight:600,color:isPublic===p.val?"var(--accent)":"var(--text-soft)" }}>{p.label}</span>
                  <span style={{ fontSize:10,color:"var(--text-muted)",fontWeight:400 }}>{p.desc}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="row gap-2" style={{ justifyContent:"flex-end" }}>
            <button className="btn" onClick={onClose}>{t("cancel")}</button>
            <button className="btn btn-accent" disabled={!name.trim() || update.isPending} onClick={save}>
              {update.isPending ? t("saving") : t("save_changes")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main room view ──────────────────────────────────────────────────────────
function RoomView({ roomId }: { roomId: string }) {
  const { user: me } = useAuthStore();
  const { t, tf } = useT();
  const { data: room, isLoading } = useRoom(roomId);
  const { data: emojis = [] } = useRoomEmojis(roomId);
  const addTask = useAddRoomTask();
  const [newTask, setNewTask] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const toast = useToast();

  if (isLoading) return (
    <div style={{ height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-muted)" }}>
      {t("loading_room")}
    </div>
  );
  if (!room) return (
    <div style={{ height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-muted)" }}>
      {t("room_not_found")}
    </div>
  );

  const memberCount = room.members?.length ?? 0;
  const activityEmojis: Record<string,string> = {PLAYING:"🎮",COOKING:"🍳",WALKING:"🚶",STUDYING:"📚",READING:"📖",WORKING:"💻",CUSTOM:"✨"};
  const roomEmoji = room.activityType ? activityEmojis[room.activityType] ?? "🏠" : "🏠";
  const memberIds = room.members?.map(m => m.userId) ?? [];
  const isOwner = room.createdById === me?.id;

  return (
    <div style={{ height:"100%",display:"grid",gridTemplateColumns:"1fr 320px",gap:16 }}>
      {/* Left: tasks */}
      <div className="card" style={{ display:"flex",flexDirection:"column",padding:0,overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"14px 20px",borderBottom:"1px solid var(--border)",display:"flex",gap:14,alignItems:"center" }}>
          {/* Room icon — shows image if available, else emoji */}
          <div style={{ width:40,height:40,borderRadius:10,background:"var(--bg-subtle)",border:"1px solid var(--border)",display:"grid",placeItems:"center",fontSize:20,flexShrink:0,overflow:"hidden" }}>
            {room.imageUrl
              ? <img src={room.imageUrl} alt={room.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
              : roomEmoji
            }
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <div className="row gap-2">
              <div style={{ fontSize:15,fontWeight:600 }}>{room.name}</div>
              {room.isPublic
                ? <span style={{ fontSize:10,padding:"1px 6px",borderRadius:4,background:"rgba(99,102,241,0.12)",color:"var(--accent)",fontWeight:500 }}>{t("public_badge")}</span>
                : <span style={{ fontSize:10,padding:"1px 6px",borderRadius:4,background:"var(--bg-subtle)",color:"var(--text-muted)",fontWeight:500 }}>{t("private_badge")}</span>
              }
            </div>
            <div className="muted" style={{ fontSize:11.5 }}>{memberCount} {t("members")}</div>
          </div>
          {/* Actions */}
          <div className="row gap-2">
            {isOwner && (
              <button className="btn btn-sm btn-ghost" onClick={() => setShowEdit(true)} title={t("edit")}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m4 20 4-1 11-11-3-3L5 16l-1 4z"/></svg>
              </button>
            )}
            <button className="btn btn-sm" onClick={() => setShowEmoji(true)} title={t("emojis_btn")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
              {t("emojis_btn")} {emojis.length > 0 && <span style={{ fontSize:10,background:"var(--bg-subtle)",padding:"0 4px",borderRadius:4 }}>{emojis.length}</span>}
            </button>
            <button className="btn btn-sm btn-accent" onClick={() => setShowInvite(true)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              {t("invite_btn")}
            </button>
          </div>
          {/* Member avatars */}
          <div style={{ display:"flex" }}>
            {room.members?.slice(0,4).map((m,i)=>(
              <div key={m.id} style={{ marginLeft:i>0?-6:0 }}>
                <Avatar user={{ displayName:m.user.displayName,avatarUrl:m.user.avatarUrl }} size={28} />
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div style={{ flex:1,overflowY:"auto",padding:"8px 0" }}>
          {(!room.tasks || room.tasks.length === 0) ? (
            <div style={{ padding:"40px 20px",textAlign:"center",color:"var(--text-muted)",fontSize:13 }}>
              {t("no_tasks_room")}
            </div>
          ) : (
            room.tasks.map(rt => (
              <div key={rt.id} style={{ padding:"10px 20px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"flex-start",gap:12 }}>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:13.5,fontWeight:500,color:"var(--text)",marginBottom:4 }}>
                    {rt.task.title}
                  </div>
                  {rt.task.description && (
                    <div style={{ fontSize:12,color:"var(--text-muted)",marginBottom:4,lineHeight:1.4 }}>{rt.task.description}</div>
                  )}
                  {rt.task.imageUrl && (
                    <div style={{ marginBottom:6,borderRadius:8,overflow:"hidden",maxWidth:200 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={rt.task.imageUrl} alt="" style={{ width:"100%",objectFit:"cover",display:"block",maxHeight:120 }} />
                    </div>
                  )}
                  <MemberStatuses rt={rt} members={room.members ?? []} />
                </div>
                <TaskStatusButtons rt={rt} roomId={roomId} userId={me?.id ?? ""} memberCount={memberCount} />
              </div>
            ))
          )}
        </div>

        {/* Add task */}
        <div style={{ padding:"10px 20px",borderTop:"1px solid var(--border)" }}>
          {showTaskForm ? (
            <div className="col gap-2">
              <input
                className="input"
                placeholder={t("shared_task_ph")}
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                autoFocus
                onKeyDown={e => e.key === "Escape" && setShowTaskForm(false)}
              />
              <input
                className="input"
                style={{ fontSize:12.5 }}
                placeholder={t("notes_placeholder")}
                value={newTaskDesc}
                onChange={e => setNewTaskDesc(e.target.value)}
              />
              <div className="row gap-2" style={{ justifyContent:"flex-end" }}>
                <button className="btn btn-sm" onClick={() => { setShowTaskForm(false); setNewTask(""); setNewTaskDesc(""); }}>
                  {t("cancel")}
                </button>
                <button
                  className="btn btn-sm btn-accent"
                  disabled={!newTask.trim() || addTask.isPending}
                  onClick={() => {
                    addTask.mutate({ roomId, title: newTask.trim(), description: newTaskDesc || undefined } as Parameters<typeof addTask.mutate>[0], {
                      onSuccess: () => { toast.show(t("task_added")); setNewTask(""); setNewTaskDesc(""); setShowTaskForm(false); },
                    });
                  }}
                >
                  {t("add")}
                </button>
              </div>
            </div>
          ) : (
            <button
              className="btn btn-sm"
              style={{ width:"100%",justifyContent:"flex-start",color:"var(--text-muted)",gap:8 }}
              onClick={() => setShowTaskForm(true)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              {t("shared_task_ph")}
            </button>
          )}
        </div>
      </div>

      {/* Right: chat */}
      <RoomChat roomId={roomId} emojis={emojis} />

      {/* Modals */}
      <InviteModal open={showInvite} onClose={() => setShowInvite(false)} roomId={roomId} memberIds={memberIds} />
      <EmojiModal open={showEmoji} onClose={() => setShowEmoji(false)} roomId={roomId} />
      {isOwner && (
        <EditRoomModal open={showEdit} onClose={() => setShowEdit(false)} room={room} />
      )}
    </div>
  );
}
