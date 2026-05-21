"use client";

import {
  usePartners, usePartnerRequests,
  useAcceptPartner, useDeclinePartner, useRemovePartner,
  type PartnerData,
} from "@/hooks/usePartners";
import { useToast } from "@/components/ui/toast";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/ui/page-header";
import { useRouter } from "next/navigation";

function ProgressRing({ done, total, size = 52 }: { done: number; total: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const pct = total === 0 ? 0 : Math.min(done / total, 1);
  const stroke = pct === 1 ? "#22c55e" : "var(--accent)";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-subtle)" strokeWidth={5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={stroke} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 400ms" }} />
    </svg>
  );
}

function PartnerCard({ p, onRemove }: { p: PartnerData; onRemove: () => void }) {
  const router = useRouter();
  const pct = p.todayTotal === 0 ? 0 : Math.round(p.todayDone / p.todayTotal * 100);
  const allDone = p.todayTotal > 0 && p.todayDone === p.todayTotal;

  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="row gap-3" style={{ marginBottom: 16 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <ProgressRing done={p.todayDone} total={p.todayTotal} />
          <div style={{
            position: "absolute", inset: 0, display: "grid", placeItems: "center",
          }}>
            <Avatar user={{ displayName: p.partner.displayName, avatarUrl: p.partner.avatarUrl, status: p.partner.status }} size={38} status onBg="bg" />
          </div>
        </div>
        <div className="flex1 truncate">
          <div style={{ fontSize: 14.5, fontWeight: 600 }}>{p.partner.displayName}</div>
          <div className="muted" style={{ fontSize: 12 }}>@{p.partner.username}</div>
          {p.streak > 0 && (
            <div style={{ fontSize: 12, color: "#f97316", marginTop: 2 }}>🔥 {p.streak} өдрийн streak</div>
          )}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{
            fontSize: 20, fontWeight: 800,
            color: allDone ? "#22c55e" : "var(--accent)",
          }}>{pct}%</div>
          <div className="muted" style={{ fontSize: 11 }}>{p.todayDone}/{p.todayTotal} таск</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 5, borderRadius: 999, background: "var(--bg-subtle)", overflow: "hidden", marginBottom: 14 }}>
        <div style={{
          height: "100%", borderRadius: 999, transition: "width 400ms",
          background: allDone ? "#22c55e" : "var(--accent)",
          width: `${pct}%`,
        }} />
      </div>

      {/* Status message */}
      <div style={{
        padding: "8px 12px", borderRadius: 8, marginBottom: 14, fontSize: 13,
        background: allDone ? "rgba(34,197,94,0.1)" : p.todayDone > 0 ? "var(--accent-tint)" : "var(--bg-subtle)",
        color: allDone ? "#16a34a" : p.todayDone > 0 ? "var(--accent)" : "var(--text-muted)",
      }}>
        {allDone
          ? `🎉 ${p.partner.displayName.split(" ")[0]} өнөөдрийн бүх таскийг дуусгалаа!`
          : p.todayDone > 0
          ? `⚡ ${p.todayDone} таск дуусгасан, ${p.todayTotal - p.todayDone} үлдсэн`
          : p.todayTotal === 0
          ? `📋 Өнөөдрийн таск алга`
          : `⏳ Эхлэх хүлээж байна…`
        }
      </div>

      <div className="row gap-2">
        <button
          className="btn btn-sm flex1"
          onClick={() => router.push(`/users/${p.partner.username}`)}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>
          Профайл
        </button>
        <button
          className="btn btn-sm flex1"
          onClick={() => router.push(`/chat/${p.partner.id}`)}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 16-8-6 18-3-7-7-3z"/></svg>
          Мессеж
        </button>
        <button
          className="btn btn-sm btn-ghost"
          style={{ color: "var(--status-busy)" }}
          onClick={onRemove}
          title="Partner болиох"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
    </div>
  );
}

export default function PartnersPage() {
  const { data: partners = [], isLoading } = usePartners();
  const { data: requests = [] } = usePartnerRequests();
  const accept = useAcceptPartner();
  const decline = useDeclinePartner();
  const remove = useRemovePartner();
  const toast = useToast();

  const doneToday = partners.filter(p => p.todayTotal > 0 && p.todayDone === p.todayTotal).length;

  return (
    <div className="view-narrow">
      <PageHeader
        eyebrow="Partners"
        title="Accountability partners"
        subtitle="Найзуудтайгаа зэрэгцэн таск хийж бие биенээ дэмжих."
      />

      {/* Incoming requests */}
      {requests.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-hd">
            <h3>Хүсэлтүүд</h3>
            <span style={{ fontSize: 11, padding: "1px 8px", borderRadius: 999, background: "var(--accent)", color: "#fff", fontWeight: 600 }}>
              {requests.length}
            </span>
          </div>
          <div className="col gap-3">
            {requests.map(r => (
              <div key={r.id} className="row gap-3">
                <Avatar user={{ displayName: r.requester.displayName, avatarUrl: r.requester.avatarUrl }} size={38} />
                <div className="flex1">
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{r.requester.displayName}</div>
                  <div className="muted" style={{ fontSize: 12 }}>Accountability partner болохыг хүсэж байна</div>
                </div>
                <button
                  className="btn btn-sm btn-accent"
                  disabled={accept.isPending}
                  onClick={() => accept.mutate(r.id, {
                    onSuccess: () => toast.show(`${r.requester.displayName} partner болов!`),
                  })}
                >
                  Зөвшөөрөх
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => decline.mutate(r.id, { onSuccess: () => toast.show("Татгалзлаа") })}
                >
                  Татгалзах
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {partners.length > 0 && (
        <div className="row gap-3" style={{ marginBottom: 20 }}>
          {[
            { label: "Partner", value: partners.length },
            { label: "Өнөөдөр дуусгасан", value: doneToday },
            { label: "Нийт streak", value: partners.reduce((s, p) => s + p.streak, 0) },
          ].map(s => (
            <div key={s.label} className="card" style={{ flex: 1, padding: "12px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--accent)" }}>{s.value}</div>
              <div className="muted" style={{ fontSize: 11.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Partners grid */}
      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {[1,2].map(i => <div key={i} style={{ height:200,borderRadius:14,background:"var(--bg-subtle)",animation:"pulse 1.5s ease-in-out infinite" }}/>)}
        </div>
      ) : partners.length === 0 ? (
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"60px 20px",color:"var(--text-muted)" }}>
          <div style={{ fontSize:48 }}>🤝</div>
          <div style={{ fontWeight:600,color:"var(--text)",fontSize:16 }}>Partner алга байна</div>
          <div style={{ fontSize:13,textAlign:"center",maxWidth:320,lineHeight:1.6 }}>
            Найзуудын хуудаснаас найзаа сонгоод <b>Partner нэмэх</b> дарна уу.
            Хоёулаа өдөр бүрийн дэвшлээ харилцан харж дэмжих болно.
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {partners.map(p => (
            <PartnerCard
              key={p.pairId}
              p={p}
              onRemove={() => remove.mutate(p.pairId, {
                onSuccess: () => toast.show("Partner устгагдлаа"),
              })}
            />
          ))}
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}
