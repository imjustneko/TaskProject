"use client";

import { useState, useRef, useEffect } from "react";
import { useRoom, useAddRoomTask, useToggleRoomTask } from "@/hooks/useRooms";
import { useDMs, useSendDM } from "@/hooks/useMessages";
import { useAuthStore } from "@/stores/authStore";
import { Avatar } from "@/components/ui/avatar";
import { use } from "react";

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RoomView roomId={id} />;
}

function RoomView({ roomId }: { roomId: string }) {
  const { user: me } = useAuthStore();
  const { data: room, isLoading } = useRoom(roomId);
  const addTask = useAddRoomTask();
  const toggleTask = useToggleRoomTask();
  const [newTask, setNewTask] = useState("");

  if (isLoading) {
    return (
      <div style={{ height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-muted)" }}>
        Loading room…
      </div>
    );
  }

  if (!room) return (
    <div style={{ height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-muted)" }}>
      Room not found.
    </div>
  );

  const memberCount = room.members?.length ?? 0;

  return (
    <div style={{ height:"100%",display:"grid",gridTemplateColumns:"1fr 320px",gap:16 }}>
      {/* Left: tasks */}
      <div className="card" style={{ display:"flex",flexDirection:"column",padding:0,overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"16px 20px",borderBottom:"1px solid var(--border)",display:"flex",gap:14,alignItems:"center" }}>
          <div style={{ width:44,height:44,borderRadius:10,background:"var(--bg-subtle)",border:"1px solid var(--border)",display:"grid",placeItems:"center",fontSize:22,flexShrink:0 }}>
            🏠
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:16,fontWeight:600 }}>{room.name}</div>
            <div className="muted" style={{ fontSize:12 }}>{memberCount} members</div>
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
        <div style={{ flex:1,overflowY:"auto",padding:"12px 0" }}>
          {(!room.tasks || room.tasks.length === 0) ? (
            <div style={{ padding:"40px 20px",textAlign:"center",color:"var(--text-muted)",fontSize:13 }}>
              No tasks yet. Add the first one below.
            </div>
          ) : (
            room.tasks.map(rt => {
              const completedBy = rt.completedBy ?? [];
              const myDone = completedBy.includes(me?.id ?? "");
              const pct = memberCount === 0 ? 0 : Math.round((completedBy.length / memberCount) * 100);
              return (
                <div key={rt.id} style={{ padding:"12px 20px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:12 }}>
                  <button
                    onClick={() => toggleTask.mutate({ roomId, taskId: rt.task.id })}
                    style={{ width:18,height:18,borderRadius:"50%",border:`1.5px solid ${myDone?"var(--accent)":"var(--border-strong)"}`,background:myDone?"var(--accent)":"var(--bg-elevated)",display:"grid",placeItems:"center",flexShrink:0,cursor:"default",transition:"all 120ms" }}
                  >
                    {myDone && <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.2 5.8 10 11 4.2"/></svg>}
                  </button>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:13.5,fontWeight:500,color:myDone?"var(--text-faint)":"var(--text)",textDecoration:myDone?"line-through":"none" }}>
                      {rt.task.title}
                    </div>
                    <div style={{ marginTop:6,display:"flex",alignItems:"center",gap:8 }}>
                      <div style={{ flex:1,height:3,borderRadius:999,background:"var(--border)",overflow:"hidden" }}>
                        <div style={{ width:`${pct}%`,height:"100%",background:"var(--accent)",transition:"width 300ms" }}/>
                      </div>
                      <span style={{ fontFamily:"var(--font-mono,monospace)",fontSize:10.5,color:"var(--text-muted)",flexShrink:0 }}>
                        {completedBy.length}/{memberCount}
                      </span>
                    </div>
                  </div>
                  {/* Who completed */}
                  <div style={{ display:"flex" }}>
                    {room.members?.map((m,i) => {
                      const done = completedBy.includes(m.userId);
                      return (
                        <div key={m.id} title={`${m.user.displayName} ${done?"✓":"✗"}`} style={{ marginLeft:i>0?-4:0,opacity:done?1:.25 }}>
                          <Avatar user={{ displayName:m.user.displayName,avatarUrl:m.user.avatarUrl }} size={20} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add task */}
        <div style={{ padding:"12px 20px",borderTop:"1px solid var(--border)",display:"flex",gap:8 }}>
          <input
            className="input"
            placeholder="Add a task to this room…"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && newTask.trim()) {
                addTask.mutate({ roomId, title: newTask.trim() });
                setNewTask("");
              }
            }}
            style={{ flex:1 }}
          />
          <button
            className="btn btn-accent btn-sm btn-icon"
            disabled={!newTask.trim() || addTask.isPending}
            onClick={() => { addTask.mutate({ roomId, title: newTask.trim() }); setNewTask(""); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </div>

      {/* Right: chat */}
      <RoomChat roomId={roomId} />
    </div>
  );
}

function RoomChat({ roomId }: { roomId: string }) {
  const { user: me } = useAuthStore();
  const { data: messages = [] } = useDMs(roomId);
  const send = useSendDM(roomId);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    send.mutate(text.trim());
    setText("");
  };

  return (
    <div className="card" style={{ display:"flex",flexDirection:"column",padding:0,overflow:"hidden" }}>
      <div style={{ padding:"14px 16px",borderBottom:"1px solid var(--border)",fontWeight:600,fontSize:14 }}>
        Room chat
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:4 }}>
        {messages.length === 0 ? (
          <div style={{ textAlign:"center",color:"var(--text-muted)",fontSize:13,marginTop:"auto" }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg,i) => {
            const isMe = msg.senderId === me?.id;
            return (
              <div key={msg.id} style={{ display:"flex",gap:8,alignItems:"flex-end",flexDirection:isMe?"row-reverse":"row",marginTop:i>0&&messages[i-1].senderId!==msg.senderId?10:2 }}>
                {!isMe && <Avatar user={{ displayName:msg.sender.displayName,avatarUrl:msg.sender.avatarUrl }} size={24} />}
                <div style={{ maxWidth:"75%",padding:"7px 11px",borderRadius:isMe?"11px 11px 2px 11px":"11px 11px 11px 2px",background:isMe?"var(--accent)":"var(--bg-subtle)",color:isMe?"#fff":"var(--text)",fontSize:13.5,lineHeight:1.45 }}>
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef}/>
      </div>
      <form onSubmit={handleSend} style={{ padding:"10px 12px",borderTop:"1px solid var(--border)",display:"flex",gap:8 }}>
        <input className="input" style={{ flex:1,height:34,fontSize:13 }} placeholder="Message…" value={text} onChange={e => setText(e.target.value)} autoComplete="off"/>
        <button type="submit" className="btn btn-accent btn-sm btn-icon" disabled={!text.trim()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 16-8-6 18-3-7-7-3z"/></svg>
        </button>
      </form>
    </div>
  );
}
