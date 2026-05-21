"use client";

import { useState } from "react";
import { useMyRooms, useCreateRoom, usePublicRooms, useJoinRoom } from "@/hooks/useRooms";
import { useToast } from "@/components/ui/toast";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/ui/page-header";
import { useRouter } from "next/navigation";
import type { Room } from "@/types";

const ACTIVITY_EMOJIS: Record<string, string> = {
  PLAYING:"🎮",COOKING:"🍳",WALKING:"🚶",STUDYING:"📚",READING:"📖",WORKING:"💻",CUSTOM:"✨",
};

function CreateRoomModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [activity, setActivity] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const create = useCreateRoom();
  const toast = useToast();
  const router = useRouter();

  if (!open) return null;

  const save = () => {
    if (!name.trim()) return;
    create.mutate({ name: name.trim(), description: desc || undefined, activityType: activity || undefined, isPublic }, {
      onSuccess: (room) => {
        toast.show(`"${room.name}" room үүслээ!`);
        router.push(`/rooms/${room.id}`);
        onClose();
      },
      onError: (e: unknown) => {
        const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
        toast.show(typeof msg === "string" ? msg : "Room үүсгэж чадсангүй", "error");
      },
    });
  };

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <h2>New room</h2>
          <button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div className="col gap-4">
          <div className="field">
            <label className="field-label">Room name</label>
            <input className="input" style={{ fontSize:15,height:40,fontWeight:500 }} placeholder="Morning Pages, Book Club…"
              autoFocus value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key==="Enter" && save()} />
          </div>
          <div className="field">
            <label className="field-label">Description (optional)</label>
            <textarea className="textarea" rows={2} placeholder="What will the room be about?" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>

          {/* Public / Private */}
          <div className="field">
            <label className="field-label">Visibility</label>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
              <button
                className="btn"
                onClick={() => setIsPublic(false)}
                style={{
                  flexDirection:"column",height:72,gap:6,
                  borderColor: !isPublic?"var(--accent)":"var(--border-strong)",
                  background: !isPublic?"var(--accent-tint)":"var(--bg-elevated)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={!isPublic?"var(--accent)":"var(--text-muted)"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span style={{ fontSize:12,color:!isPublic?"var(--accent)":"var(--text-soft)" }}>Private</span>
                <span style={{ fontSize:10.5,color:"var(--text-muted)",fontWeight:400 }}>Members only</span>
              </button>
              <button
                className="btn"
                onClick={() => setIsPublic(true)}
                style={{
                  flexDirection:"column",height:72,gap:6,
                  borderColor: isPublic?"var(--accent)":"var(--border-strong)",
                  background: isPublic?"var(--accent-tint)":"var(--bg-elevated)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isPublic?"var(--accent)":"var(--text-muted)"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span style={{ fontSize:12,color:isPublic?"var(--accent)":"var(--text-soft)" }}>Public</span>
                <span style={{ fontSize:10.5,color:"var(--text-muted)",fontWeight:400 }}>Anyone can join</span>
              </button>
            </div>
          </div>

          <div className="field">
            <label className="field-label">Activity (optional)</label>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8 }}>
              {[["","Any"],["READING","Reading"],["STUDYING","Studying"],["WALKING","Walking"],["PLAYING","Gaming"],["COOKING","Cooking"],["WORKING","Working"],["CUSTOM","Custom"]].map(([k,l])=>(
                <button key={k} className="btn btn-sm" onClick={() => setActivity(k)} style={{
                  borderColor: activity===k?"var(--accent)":"var(--border-strong)",
                  background: activity===k?"var(--accent-tint)":"var(--bg-elevated)",
                  color: activity===k?"var(--accent)":"var(--text-soft)",
                  gap:4,
                }}>
                  {k && <span>{ACTIVITY_EMOJIS[k]}</span>}{l}
                </button>
              ))}
            </div>
          </div>

          <div className="row" style={{ justifyContent:"flex-end",gap:8 }}>
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn btn-accent" onClick={save} disabled={!name.trim()||create.isPending}>
              {create.isPending?"Creating…":"Create room"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomCard({ room, onJoin, isJoining }: { room: Room; onJoin?: () => void; isJoining?: boolean }) {
  const router = useRouter();
  const emoji = room.activityType ? ACTIVITY_EMOJIS[room.activityType] ?? "🏠" : "🏠";
  const memberCount = room.members?.length ?? 0;
  const taskCount = room.tasks?.length ?? 0;
  const doneCount = room.tasks?.filter(t => t.completedBy?.length === memberCount && memberCount > 0).length ?? 0;
  const pct = taskCount === 0 ? 0 : Math.round((doneCount / taskCount) * 100);

  return (
    <div className="card" style={{ padding:20,cursor:"default" }} onClick={() => !onJoin && router.push(`/rooms/${room.id}`)}>
      <div className="row gap-3" style={{ marginBottom:14 }}>
        <div style={{ width:44,height:44,borderRadius:10,display:"grid",placeItems:"center",background:"var(--bg-subtle)",border:"1px solid var(--border)",fontSize:22,flexShrink:0 }}>
          {emoji}
        </div>
        <div className="flex1 truncate">
          <div className="row gap-2">
            <div style={{ fontSize:15,fontWeight:600 }}>{room.name}</div>
            {room.isPublic ? (
              <span style={{ fontSize:10,padding:"1px 6px",borderRadius:4,background:"rgba(99,102,241,0.12)",color:"var(--accent)",fontWeight:500 }}>Public</span>
            ) : (
              <span style={{ fontSize:10,padding:"1px 6px",borderRadius:4,background:"var(--bg-subtle)",color:"var(--text-muted)",fontWeight:500 }}>Private</span>
            )}
          </div>
          <div className="muted" style={{ fontSize:12 }}>{memberCount} members · {taskCount} tasks</div>
        </div>
      </div>
      {room.description && (
        <div className="muted" style={{ fontSize:13,marginBottom:12,lineHeight:1.45 }}>{room.description}</div>
      )}
      <div style={{ marginBottom:12 }}>
        <div className="row" style={{ marginBottom:5 }}>
          <span style={{ fontSize:11,color:"var(--text-muted)" }}>Progress</span>
          <span className="mono muted" style={{ fontSize:11,marginLeft:"auto" }}>{doneCount}/{taskCount} · {pct}%</span>
        </div>
        <div style={{ height:4,borderRadius:999,background:"var(--border)",overflow:"hidden" }}>
          <div style={{ width:`${pct}%`,height:"100%",background:"var(--accent)",transition:"width 400ms" }}/>
        </div>
      </div>
      <div className="row">
        <div style={{ display:"flex" }}>
          {room.members?.slice(0,5).map((m,i) => (
            <div key={m.id} style={{ marginLeft:i>0?-6:0 }}>
              <Avatar user={{ displayName:m.user.displayName,avatarUrl:m.user.avatarUrl }} size={24} />
            </div>
          ))}
          {(room.members?.length ?? 0) > 5 && (
            <div style={{ width:24,height:24,borderRadius:"50%",background:"var(--bg-subtle)",border:"1px solid var(--border)",display:"grid",placeItems:"center",fontSize:9,color:"var(--text-muted)",marginLeft:-6 }}>
              +{(room.members?.length ?? 0)-5}
            </div>
          )}
        </div>
        {onJoin && (
          <button
            className="btn btn-accent btn-sm"
            style={{ marginLeft:"auto" }}
            disabled={isJoining}
            onClick={e => { e.stopPropagation(); onJoin(); }}
          >
            {isJoining ? "Joining…" : "Join"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function RoomsPage() {
  const { data: myRooms = [], isLoading } = useMyRooms();
  const { data: publicRooms = [] } = usePublicRooms();
  const [showCreate, setShowCreate] = useState(false);
  const [tab, setTab] = useState<"mine"|"public">("mine");
  const joinRoom = useJoinRoom();
  const toast = useToast();
  const router = useRouter();

  const handleJoin = (room: Room) => {
    joinRoom.mutate(room.id, {
      onSuccess: () => {
        toast.show(`"${room.name}"-д нэгдлээ!`);
        router.push(`/rooms/${room.id}`);
      },
    });
  };

  return (
    <div>
      <PageHeader eyebrow="Rooms" title="Rooms" subtitle="Shared spaces for doing things together.">
        <button className="btn btn-accent" onClick={() => setShowCreate(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          New room
        </button>
      </PageHeader>

      {/* Tabs */}
      <div className="row gap-2" style={{ marginBottom:20 }}>
        {(["mine","public"] as const).map(t => (
          <button key={t} className="btn btn-sm" onClick={() => setTab(t)} style={{
            borderColor: tab===t?"var(--accent)":"var(--border-strong)",
            background: tab===t?"var(--accent-tint)":"var(--bg-elevated)",
            color: tab===t?"var(--accent)":"var(--text-soft)",
          }}>
            {t==="mine" ? "My rooms" : "Discover"}
            {t==="public" && publicRooms.length > 0 && (
              <span style={{ marginLeft:5,padding:"0 5px",borderRadius:99,background:"var(--accent)",color:"#fff",fontSize:10,fontWeight:600 }}>{publicRooms.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "mine" ? (
        isLoading ? (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16 }}>
            {[1,2,3].map(i=><div key={i} style={{ height:160,borderRadius:14,background:"var(--bg-subtle)",animation:"pulse 1.5s ease-in-out infinite" }}/>)}
          </div>
        ) : myRooms.length === 0 ? (
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"60px 20px",color:"var(--text-muted)" }}>
            <div style={{ width:52,height:52,borderRadius:14,display:"grid",placeItems:"center",background:"var(--bg-subtle)",fontSize:24 }}>🏠</div>
            <div style={{ fontWeight:600,color:"var(--text)" }}>No rooms yet</div>
            <div style={{ fontSize:13,textAlign:"center",maxWidth:280 }}>Create a room and invite friends to do activities together.</div>
            <button className="btn btn-accent btn-sm" style={{ marginTop:4 }} onClick={() => setShowCreate(true)}>Create first room</button>
          </div>
        ) : (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16 }}>
            {myRooms.map(room => <RoomCard key={room.id} room={room} />)}
          </div>
        )
      ) : (
        publicRooms.length === 0 ? (
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"60px 20px",color:"var(--text-muted)" }}>
            <div style={{ width:52,height:52,borderRadius:14,display:"grid",placeItems:"center",background:"var(--bg-subtle)",fontSize:24 }}>🌐</div>
            <div style={{ fontWeight:600,color:"var(--text)" }}>No public rooms</div>
            <div style={{ fontSize:13,textAlign:"center",maxWidth:280 }}>No public rooms to discover right now.</div>
          </div>
        ) : (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16 }}>
            {publicRooms.map(room => (
              <RoomCard key={room.id} room={room} onJoin={() => handleJoin(room)} isJoining={joinRoom.isPending} />
            ))}
          </div>
        )
      )}

      <CreateRoomModal open={showCreate} onClose={() => setShowCreate(false)} />
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}
