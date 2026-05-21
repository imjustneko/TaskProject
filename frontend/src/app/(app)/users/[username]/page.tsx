"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { useSendFriendRequest } from "@/hooks/useFriends";
import { useSendPartnerRequest, usePartners } from "@/hooks/usePartners";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { STATUS_META } from "@/types";
import type { StatusType, Task } from "@/types";
import { formatDate } from "@/lib/utils";

interface PublicStats {
  user: {
    id: string; username: string; displayName: string;
    avatarUrl?: string; bio?: string; role: string;
    isBlocked: boolean; createdAt: string;
    status?: { type: string; presence: string; customText?: string; emoji?: string } | null;
  };
  completedCount: number;
  streak: number;
  publicTasks: (Task & { labels: { label: { id: string; name: string; color: string } }[] })[];
}

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  return <UserProfile username={username} />;
}

function UserProfile({ username }: { username: string }) {
  const router = useRouter();
  const toast = useToast();
  const { user: me } = useAuthStore();
  const sendReq = useSendFriendRequest();
  const sendPartnerReq = useSendPartnerRequest();
  const { data: partners = [] } = usePartners();

  const { data, isLoading } = useQuery<PublicStats>({
    queryKey: ["users", username, "stats"],
    queryFn: () => api.get<PublicStats>(`/users/${username}/stats`).then(r => r.data),
  });

  if (isLoading) return (
    <div className="view-narrow">
      <div style={{ height:200,borderRadius:18,background:"var(--bg-subtle)",animation:"pulse 1.5s ease-in-out infinite",marginBottom:20 }}/>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
  if (!data) return (
    <div className="view-narrow" style={{ textAlign:"center",padding:"60px 20px",color:"var(--text-muted)" }}>
      <div style={{ fontSize:36,marginBottom:12 }}>🔍</div>
      <div style={{ fontWeight:600,color:"var(--text)",marginBottom:6 }}>Хэрэглэгч олдсонгүй</div>
    </div>
  );

  const { user, completedCount, streak, publicTasks } = data;
  const isMe = user.id === me?.id;
  const isPartner = partners.some(p => p.partner.id === user.id);
  const statusMeta = user.status ? STATUS_META[user.status.type as StatusType] : null;
  const joinedDate = formatDate(user.createdAt, { month: "long", year: "numeric" });

  return (
    <div className="view-narrow">
      <div className="row" style={{ marginBottom: 20 }}>
        <button className="btn btn-ghost btn-sm" style={{ gap:6 }} onClick={() => router.back()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Буцах
        </button>
      </div>

      {/* Cover + profile card */}
      <div className="card" style={{ padding:0,overflow:"hidden",marginBottom:20 }}>
        <div style={{ height:100,background:`linear-gradient(135deg,color-mix(in oklab,var(--accent) 40%,#fde68a),var(--accent))` }}/>
        <div style={{ padding:"0 24px 24px",marginTop:-32 }}>
          <div className="row" style={{ alignItems:"flex-end",gap:16,marginBottom:16 }}>
            <div style={{ borderRadius:"50%",boxShadow:"0 0 0 4px var(--bg-elevated)",flexShrink:0 }}>
              <Avatar user={{ displayName:user.displayName,avatarUrl:user.avatarUrl,status:user.status??undefined }} size={72} status onBg="bg" />
            </div>
            <div className="flex1" style={{ paddingBottom:4 }}>
              <div className="row gap-2" style={{ flexWrap:"wrap" }}>
                <h1 style={{ fontSize:22 }}>{user.displayName}</h1>
                {isPartner && (
                  <span style={{ fontSize:11,padding:"2px 8px",borderRadius:999,background:"rgba(99,102,241,0.12)",color:"var(--accent)",fontWeight:600 }}>
                    🤝 Партнер
                  </span>
                )}
              </div>
              <div className="muted" style={{ fontSize:13 }}>@{user.username} · Элссэн {joinedDate}</div>
            </div>
            {!isMe && (
              <div className="row gap-2" style={{ paddingBottom:4,flexWrap:"wrap" }}>
                <button className="btn btn-sm" onClick={() => router.push(`/chat/${user.id}`)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 16-8-6 18-3-7-7-3z"/></svg>
                  Мессеж
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => sendReq.mutate(user.id, {
                    onSuccess: () => toast.show("Найзын хүсэлт илгээв!"),
                    onError: (e: unknown) => {
                      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
                      toast.show(typeof msg === "string" ? msg : "Хүсэлт илгээж чадсангүй", "error");
                    },
                  })}
                  disabled={sendReq.isPending}
                >
                  + Найз нэмэх
                </button>
                {!isPartner && (
                  <button
                    className="btn btn-sm"
                    onClick={() => sendPartnerReq.mutate(user.id, {
                      onSuccess: () => toast.show(`${user.displayName}-д partner хүсэлт илгээв!`),
                      onError: (e: unknown) => {
                        const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
                        toast.show(typeof msg === "string" ? msg : "Хүсэлт илгээж чадсангүй", "error");
                      },
                    })}
                    disabled={sendPartnerReq.isPending}
                  >
                    🤝 Партнер
                  </button>
                )}
              </div>
            )}
          </div>

          {user.bio && (
            <div style={{ fontSize:14,color:"var(--text-soft)",lineHeight:1.55,marginBottom:user.status?12:0 }}>
              {user.bio}
            </div>
          )}

          {user.status && statusMeta && (
            <div style={{ marginTop:user.bio?8:16 }}>
              <span style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"5px 12px",borderRadius:999,background:"var(--bg-subtle)",border:"1px solid var(--border)",fontSize:13 }}>
                <span>{statusMeta.emoji}</span>
                <span style={{ color:"var(--text-soft)" }}>{user.status.customText ?? statusMeta.label}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20 }}>
        {[
          { icon:"✅", value:completedCount, label:"Дуусгасан" },
          { icon:"🔥", value:streak, label:"Streak" },
          { icon:"📋", value:publicTasks.length, label:"Нийтийн таск" },
          { icon:"📅", value:joinedDate, label:"Гишүүн болсон" },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign:"center",padding:"14px 8px" }}>
            <div style={{ fontSize:20,marginBottom:4 }}>{s.icon}</div>
            <div style={{ fontSize:typeof s.value==="number"?20:13, fontWeight:700, color:"var(--accent)" }}>{s.value}</div>
            <div className="muted" style={{ fontSize:11 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Streak banner */}
      {streak > 0 && (
        <div style={{
          marginBottom:20,padding:"12px 16px",borderRadius:12,
          background:"linear-gradient(135deg,rgba(249,115,22,0.12),rgba(234,179,8,0.08))",
          border:"1px solid rgba(249,115,22,0.2)",
          display:"flex",alignItems:"center",gap:12,
        }}>
          <div style={{ fontSize:28 }}>🔥</div>
          <div>
            <div style={{ fontWeight:700,color:"#f97316" }}>{streak} өдрийн streak!</div>
            <div style={{ fontSize:12.5,color:"var(--text-muted)" }}>Дараалсан өдрүүдэд таск дуусгасан</div>
          </div>
        </div>
      )}

      {/* Public tasks */}
      <div className="card">
        <div className="card-hd">
          <h3>Нийтийн таскууд</h3>
          <span className="muted" style={{ fontSize:12 }}>{publicTasks.length}</span>
        </div>
        {publicTasks.length === 0 ? (
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"28px 0",color:"var(--text-muted)" }}>
            <div style={{ width:40,height:40,borderRadius:10,display:"grid",placeItems:"center",background:"var(--bg-subtle)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
            </div>
            <div style={{ fontWeight:600,color:"var(--text)" }}>Нийтийн таск байхгүй</div>
          </div>
        ) : (
          <div className="col">
            {publicTasks.map(t => (
              <div key={t.id} className={"list-row"+(t.isCompleted?" is-done":"")} style={{ gap:10 }}>
                <div style={{
                  width:16,height:16,borderRadius:"50%",flexShrink:0,
                  background:t.isCompleted?"var(--accent)":"var(--bg-elevated)",
                  border:`1.5px solid ${t.isCompleted?"var(--accent)":"var(--border-strong)"}`,
                  display:"grid",placeItems:"center",
                }}>
                  {t.isCompleted&&<svg width="9" height="9" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.2 5.8 10 11 4.2"/></svg>}
                </div>
                <div className="flex1" style={{ fontSize:13.5,fontWeight:500,color:"var(--text)" }}>{t.title}</div>
                {t.labels?.map(tl => (
                  <span key={tl.label.id} style={{
                    fontSize:11,padding:"1px 7px",borderRadius:20,fontWeight:500,
                    color:tl.label.color,background:`${tl.label.color}18`,
                    border:`1px solid ${tl.label.color}44`,flexShrink:0,
                  }}>
                    {tl.label.name}
                  </span>
                ))}
                {t.isCompleted && <span style={{ fontSize:11,color:"#16a34a",flexShrink:0 }}>✓</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
