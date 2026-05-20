"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { useSendFriendRequest } from "@/hooks/useFriends";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { STATUS_META } from "@/types";
import type { User, StatusType } from "@/types";
import { formatDate } from "@/lib/utils";

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  return <UserProfile username={username} />;
}

function UserProfile({ username }: { username: string }) {
  const router = useRouter();
  const sendReq = useSendFriendRequest();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["users", username],
    queryFn: () => api.get<User>(`/users/${username}`).then(r => r.data),
  });

  if (isLoading) {
    return (
      <div className="view-narrow">
        <div style={{ height:200,borderRadius:18,background:"var(--bg-subtle)",animation:"pulse 1.5s ease-in-out infinite",marginBottom:20 }}/>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
      </div>
    );
  }

  if (!user) return (
    <div className="view-narrow" style={{ textAlign:"center",padding:"60px 20px",color:"var(--text-muted)" }}>
      <div style={{ fontSize:36,marginBottom:12 }}>🔍</div>
      <div style={{ fontWeight:600,color:"var(--text)",marginBottom:6 }}>User not found</div>
      <div style={{ fontSize:13 }}>@{username} does not exist.</div>
    </div>
  );

  const statusMeta = user.status ? STATUS_META[user.status.type as StatusType] : null;
  const joinedDate = formatDate(user.createdAt, { month: "long", year: "numeric" });

  return (
    <div className="view-narrow">
      <div className="row" style={{ marginBottom:20 }}>
        <button className="btn btn-ghost btn-sm" style={{ gap:6 }} onClick={() => router.back()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </button>
      </div>

      {/* Profile card */}
      <div className="card" style={{ padding:0,overflow:"hidden",marginBottom:20 }}>
        {/* Cover */}
        <div style={{ height:96,background:`linear-gradient(135deg,color-mix(in oklab,var(--accent) 40%,#fde68a),var(--accent))` }}/>
        <div style={{ padding:"0 24px 24px",marginTop:-28 }}>
          <div className="row" style={{ alignItems:"flex-end",gap:16,marginBottom:16 }}>
            <div style={{ borderRadius:"50%",boxShadow:"0 0 0 4px var(--bg-elevated)",flexShrink:0 }}>
              <Avatar user={{ displayName:user.displayName,avatarUrl:user.avatarUrl }} size={72} />
            </div>
            <div className="flex1" style={{ paddingBottom:6 }}>
              <h1 style={{ fontSize:22 }}>{user.displayName}</h1>
              <div className="muted" style={{ fontSize:13 }}>@{user.username} · Joined {joinedDate}</div>
            </div>
            <div className="row gap-2">
              <button className="btn" onClick={() => router.push(`/chat/${user.id}`)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 16-8-6 18-3-7-7-3z"/></svg>
                Message
              </button>
              <button
                className="btn btn-primary"
                onClick={() => sendReq.mutate(user.id)}
                disabled={sendReq.isPending}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Add friend
              </button>
            </div>
          </div>

          {user.bio && (
            <div style={{ fontSize:14,color:"var(--text-soft)",lineHeight:1.55,marginBottom:user.status?12:0 }}>
              {user.bio}
            </div>
          )}

          {user.status && statusMeta && (
            <div style={{ marginTop:user.bio?0:16 }}>
              <span style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"5px 12px",borderRadius:999,background:"var(--bg-subtle)",border:"1px solid var(--border)",fontSize:13 }}>
                <span>{statusMeta.emoji}</span>
                <span style={{ color:"var(--text-soft)" }}>{user.status.customText ?? statusMeta.label}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom:20 }}>
        {[
          { label:"Member since", value:joinedDate },
          { label:"Role", value:<Badge tone={user.role==="ADMIN"?"danger":undefined}>{user.role}</Badge> },
          { label:"Status", value:user.isBlocked ? <Badge tone="danger">Blocked</Badge> : <Badge tone="success" dot>Active</Badge> },
        ].map(({ label, value }) => (
          <div key={label} className="card" style={{ textAlign:"center",padding:16 }}>
            <div className="muted" style={{ fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:13,fontWeight:500 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* No public tasks placeholder */}
      <div className="card">
        <div className="card-hd"><h3>Public tasks</h3></div>
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"30px 20px",color:"var(--text-muted)" }}>
          <div style={{ width:40,height:40,borderRadius:10,display:"grid",placeItems:"center",background:"var(--bg-subtle)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
          </div>
          <div style={{ fontWeight:600,color:"var(--text)" }}>Nothing public</div>
          <div style={{ fontSize:12.5,textAlign:"center",maxWidth:280 }}>Friends only see tasks they&apos;ve marked as shared.</div>
        </div>
      </div>
    </div>
  );
}
