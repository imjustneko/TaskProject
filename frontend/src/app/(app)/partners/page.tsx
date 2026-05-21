"use client";

import {
  usePartners, usePartnerRequests,
  useAcceptPartner, useDeclinePartner, useRemovePartner,
  type PartnerData,
} from "@/hooks/usePartners";
import { useToast } from "@/components/ui/toast";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/ui/page-header";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

// ── PartnerSide — individual progress column ──────────────────────────────
function PartnerSide({ label, done, total }: { label: string; done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round(done / total * 100);
  const complete = total > 0 && done === total;
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="row" style={{ marginBottom: 6, gap: 6 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
        <span style={{
          marginLeft: "auto", fontSize: 12, fontWeight: 600, fontVariantNumeric: "tabular-nums",
          color: complete ? "var(--status-online)" : "var(--text-soft)",
          display: "flex", alignItems: "center", gap: 3,
        }}>
          {complete && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>}
          {done}/{total}
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 999, background: "var(--bg-subtle)", border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, borderRadius: 999,
          background: complete ? "var(--status-online)" : "var(--accent)",
          transition: "width 400ms var(--ease-out)",
        }} />
      </div>
    </div>
  );
}

// ── PartnerCard ────────────────────────────────────────────────────────────
function PartnerCard({ p, onRemove }: { p: PartnerData; onRemove: () => void }) {
  const router = useRouter();
  const { user: me } = useAuthStore();
  const pct = p.todayTotal === 0 ? 0 : Math.round(p.todayDone / p.todayTotal * 100);
  const allDone = p.todayTotal > 0 && p.todayDone === p.todayTotal;

  const statusMsg = allDone
    ? `🎉 ${p.partner.displayName.split(" ")[0]} дууссан!`
    : p.todayDone > 0
    ? `⚡ ${p.todayDone} дуусгасан, ${p.todayTotal - p.todayDone} үлдсэн`
    : p.todayTotal === 0 ? "📋 Өнөөдрийн таск алга" : "⏳ Хүлээж байна…";

  return (
    <div className="card" style={{ padding: 18 }}>
      {/* Header — twin avatars */}
      <div className="row gap-3" style={{ marginBottom: 14, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {me && (
            <Avatar user={{ displayName: me.displayName, avatarUrl: me.avatarUrl, status: me.status }} size={36} status onBg="elevated" />
          )}
          <div style={{ marginLeft: -10, boxShadow: "0 0 0 2.5px var(--bg-elevated)", borderRadius: "50%" }}>
            <Avatar user={{ displayName: p.partner.displayName, avatarUrl: p.partner.avatarUrl, status: p.partner.status }} size={36} status onBg="elevated" />
          </div>
        </div>
        <div className="flex1" style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            Та &amp; {p.partner.displayName.split(" ")[0]}
          </div>
          <div className="muted" style={{ fontSize: 11.5 }}>
            🔥 {p.streak} өдрийн streak
          </div>
        </div>
        <button className="btn btn-ghost btn-sm btn-icon" onClick={onRemove} title="Partner болиох" style={{ color: "var(--text-faint)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12M18 6 6 18"/>
          </svg>
        </button>
      </div>

      {/* Today progress */}
      <div className="row gap-3" style={{ marginBottom: 14 }}>
        <PartnerSide label="Та" done={Math.min((me ? 1 : 0), p.todayTotal)} total={p.todayTotal} />
        <div style={{ width: 1, alignSelf: "stretch", background: "var(--border)" }} />
        <PartnerSide label={p.partner.displayName.split(" ")[0]} done={p.todayDone} total={p.todayTotal} />
      </div>

      {/* Status */}
      <div style={{
        padding: "8px 12px", borderRadius: 8, marginBottom: 14, fontSize: 12.5,
        background: allDone ? "rgba(48,209,88,0.08)" : p.todayDone > 0 ? "var(--accent-tint)" : "var(--bg-subtle)",
        color: allDone ? "var(--status-online)" : p.todayDone > 0 ? "var(--accent)" : "var(--text-muted)",
        border: `1px solid ${allDone ? "rgba(48,209,88,0.2)" : "var(--border)"}`,
      }}>
        {statusMsg}
      </div>

      {/* Actions */}
      <div className="row gap-2" style={{ justifyContent: "flex-end" }}>
        <button className="btn btn-ghost btn-sm" onClick={() => router.push(`/chat/${p.partner.id}`)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 16-8-6 18-3-7-7-3z"/></svg>
          Мессеж
        </button>
        <button className="btn btn-sm" onClick={() => router.push(`/users/${p.partner.username}`)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>
          Профайл
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
  const router = useRouter();

  if (!isLoading && partners.length === 0 && requests.length === 0) {
    return (
      <div className="view-narrow">
        <PageHeader eyebrow="Partners" title="Stay accountable, together" />
        <div className="card" style={{ padding: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "56px 24px", textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ position: "relative", width: 80, height: 80 }}>
              <div style={{
                position: "absolute", inset: -10, borderRadius: 28,
                background: "radial-gradient(circle, var(--accent-tint), transparent 70%)", opacity: 0.7,
              }} />
              <div style={{
                position: "relative", width: 80, height: 80, borderRadius: 22,
                display: "grid", placeItems: "center", fontSize: 36,
                background: "linear-gradient(145deg, var(--bg-elevated), var(--bg-subtle))",
                border: "1px solid var(--border)", boxShadow: "var(--shadow-2)",
              }}>🤝</div>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 15, marginBottom: 6 }}>
                Accountability partner алга
              </div>
              <div style={{ fontSize: 13, maxWidth: 320, lineHeight: 1.6 }}>
                Найзтайгаа хосолж өдөр бүрийн дэвшлээ харилцан харж, streak-ийгээ хамт хадгалаарай.
              </div>
            </div>
            <button className="btn btn-accent" onClick={() => router.push("/friends")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Найзаас partner олох
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Partners"
        title="Stay accountable, together"
        subtitle="Хамтдаа streak хадгалж, бие биенийгээ урамшуул."
      >
        <button className="btn btn-accent" onClick={() => router.push("/friends")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Partner нэмэх
        </button>
      </PageHeader>

      {/* Requests strip */}
      {requests.length > 0 && (
        <div className="card" style={{ marginBottom: 18, padding: 14 }}>
          <div className="row gap-3">
            <div style={{
              width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center",
              background: "var(--accent-tint)", color: "var(--accent)", flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="9" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 11a3 3 0 1 0 0-6M22 20a5 5 0 0 0-4.5-5"/>
              </svg>
            </div>
            <div className="flex1">
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>
                <b>{requests[0].requester.displayName}</b> wants to be your partner
              </div>
              <div className="muted" style={{ fontSize: 12 }}>
                Accountability partner болохыг хүсэж байна
              </div>
            </div>
            <button className="btn btn-sm" onClick={() => decline.mutate(requests[0].id, { onSuccess: () => toast.show("Татгалзлаа") })}>
              Татгалзах
            </button>
            <button className="btn btn-sm btn-accent" disabled={accept.isPending}
              onClick={() => accept.mutate(requests[0].id, { onSuccess: () => toast.show(`${requests[0].requester.displayName} partner болов!`) })}>
              Зөвшөөрөх
            </button>
          </div>
          {requests.length > 1 && (
            <div className="muted" style={{ fontSize: 12, marginTop: 8, paddingLeft: 48 }}>
              + {requests.length - 1} өөр хүсэлт
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {partners.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Partners", value: partners.length, icon: "🤝" },
            { label: "Өнөөдөр дуусгасан", value: partners.filter(p => p.todayTotal > 0 && p.todayDone === p.todayTotal).length, icon: "✅" },
            { label: "Нийт streak", value: partners.reduce((s, p) => s + p.streak, 0), icon: "🔥" },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}>{s.value}</div>
              <div className="muted" style={{ fontSize: 11.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Partner cards */}
      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: 16 }}>
          {[1,2].map(i => <div key={i} style={{ height:220,borderRadius:14,background:"var(--bg-subtle)",animation:"pulse 1.5s ease-in-out infinite" }}/>)}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: 16 }}>
          {partners.map(p => (
            <PartnerCard
              key={p.pairId}
              p={p}
              onRemove={() => remove.mutate(p.pairId, { onSuccess: () => toast.show("Partner устгагдлаа") })}
            />
          ))}
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}
