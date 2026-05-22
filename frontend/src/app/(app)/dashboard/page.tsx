"use client";

import Link from "next/link";
import { useTodayAllTasks, useToggleTask, useTaskStats, usePlansTasks, useStreak } from "@/hooks/useTasks";
import { useFriends } from "@/hooks/useFriends";
import { usePartners } from "@/hooks/usePartners";
import { useAuthStore } from "@/stores/authStore";
import { PageHeader } from "@/components/ui/page-header";
import { TaskRow } from "@/components/ui/task-row";
import { Avatar } from "@/components/ui/avatar";
import { StatusPill } from "@/components/ui/status-pill";
import { useT } from "@/hooks/useT";

function ChevronRight({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6"/>
    </svg>
  );
}

// ── Streak card — ambient glow + week bars ────────────────────────────────
function StreakCard({ current, best }: { current: number; best: number }) {
  const { t, lang } = useT();
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;
  const labels = lang === "mn"
    ? ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"]
    : ["M", "T", "W", "T", "F", "S", "S"];
  // estimate weekly from streak (simplified visual)
  const weekly = labels.map((_, i) => {
    if (i > todayIdx) return 0;
    if (current === 0) return 0;
    const daysAgo = todayIdx - i;
    return daysAgo < current ? Math.max(1, 3 - daysAgo) : 0;
  });
  const max = Math.max(...weekly, 1);

  return (
    <div className="card" style={{ position: "relative", overflow: "hidden" }}>
      {/* ambient glow */}
      <div aria-hidden style={{
        position: "absolute", top: -40, right: -40, width: 160, height: 160,
        background: "radial-gradient(circle, var(--accent-tint-strong), transparent 70%)",
        pointerEvents: "none",
      }} />
      <div className="card-hd" style={{ position: "relative" }}>
        <h3>{t("streak_title")}</h3>
        {current > 0 && (
          <span className="badge" data-tone="accent" style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <i className="dot" />{t("streak_active")}
          </span>
        )}
      </div>

      <div className="row" style={{ alignItems: "flex-end", gap: 18, position: "relative", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, lineHeight: 1 }}>
          <span style={{ fontSize: 16 }}>🔥</span>
          <span style={{
            fontSize: 44, fontWeight: 700, color: current > 0 ? "var(--accent)" : "var(--text-faint)",
            letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums",
          }}>{current}</span>
          <span className="muted" style={{ fontSize: 13, fontWeight: 500 }}>
            {t("streak_days")}
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ textAlign: "right" }}>
          <div className="muted" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{t("streak_best")}</div>
          <div className="mono" style={{ fontSize: 18, fontWeight: 600, color: "var(--text-soft)" }}>{best}</div>
        </div>
      </div>

      {/* week bars */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5, position: "relative" }}>
        {weekly.map((v, i) => {
          const isToday = i === todayIdx;
          const h = Math.max(6, Math.round((v / max) * 36));
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{ width: "100%", height: 38, display: "flex", alignItems: "flex-end" }}>
                <div style={{
                  width: "100%", height: h, borderRadius: 4,
                  background: v === 0 ? "var(--bg-subtle)"
                    : isToday ? "var(--accent)"
                    : "var(--accent-tint-strong)",
                  border: !isToday && v > 0 ? "1px solid var(--accent-tint-strong)" : "none",
                  boxShadow: isToday ? "0 1px 4px rgba(212,98,26,0.3)" : "none",
                  transition: "height 400ms var(--ease-out)",
                }} />
              </div>
              <div style={{
                fontSize: 10, fontVariantNumeric: "tabular-nums",
                color: isToday ? "var(--accent)" : "var(--text-faint)",
                fontWeight: isToday ? 700 : 500,
              }}>{labels[i]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Stats card — hero + sparkline ─────────────────────────────────────────
function StatsCard({ total, completed, today }: { total: number; completed: number; today: number }) {
  const { t } = useT();
  const W = 220, H = 36, P = 2;
  // simplified sparkline using stats
  const series = Array.from({ length: 14 }, (_, i) => {
    if (i === 13) return today / Math.max(1, total) * 0.6 + Math.random() * 0.2;
    return 0.2 + Math.random() * 0.6;
  });
  const points = series.map((v, i) => {
    const x = P + (i / (series.length - 1)) * (W - 2 * P);
    const y = H - P - v * (H - 2 * P);
    return [x, y];
  });
  const path = points.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ");
  const area = `${path} L${points[points.length - 1][0]},${H} L${points[0][0]},${H} Z`;

  return (
    <div className="card">
      <div className="card-hd">
        <h3>{t("stats_title")}</h3>
        <span className="muted" style={{ fontSize: 12 }}>{t("stats_alltime")}</span>
      </div>

      <div className="row" style={{ alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
        <div style={{ flex: "0 0 auto" }}>
          <div className="muted" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 4 }}>{t("stats_today")}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, lineHeight: 1 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
              {today}
            </span>
            <span className="muted mono" style={{ fontSize: 14 }}>/ {total}</span>
          </div>
        </div>
        <div style={{ flex: 1, paddingTop: 6 }}>
          <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
            <defs>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#sparkFill)" />
            <path d={path} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="2.5" fill="var(--accent)" />
          </svg>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid var(--border)", paddingTop: 12 }}>
        <div>
          <div className="muted" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 3 }}>{t("stats_all")}</div>
          <div className="row" style={{ alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 17, fontWeight: 600, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.015em" }}>{completed}</span>
            <span className="muted" style={{ fontSize: 11 }}>{t("stats_done")}</span>
          </div>
        </div>
        <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 14 }}>
          <div className="muted" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 3 }}>{t("stats_total")}</div>
          <div className="row" style={{ alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 17, fontWeight: 600, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.015em" }}>{total}</span>
            <span className="muted" style={{ fontSize: 11 }}>{t("stats_created")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Partners card ─────────────────────────────────────────────────────────
function PartnersWidget({ partners }: { partners: ReturnType<typeof usePartners>["data"] }) {
  const { t } = useT();
  if (!partners?.length) return null;
  return (
    <div className="card">
      <div className="card-hd">
        <h3>{t("partners_today")}</h3>
        <Link href="/partners" className="card-hd-action">{t("view_all")} <ChevronRight /></Link>
      </div>
      <div className="col gap-4">
        {partners.map(p => {
          const pct = p.todayTotal === 0 ? 0 : Math.round(p.todayDone / p.todayTotal * 100);
          const done = p.todayTotal > 0 && p.todayDone === p.todayTotal;
          return (
            <div key={p.pairId} className="row gap-3">
              <Avatar user={{ displayName: p.partner.displayName, avatarUrl: p.partner.avatarUrl, status: p.partner.status }} size={34} status onBg="bg" />
              <div className="flex1" style={{ minWidth: 0 }}>
                <div className="row" style={{ marginBottom: 5, gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.partner.displayName.split(" ")[0]}</span>
                  {p.streak > 0 && (
                    <span className="muted" style={{ fontSize: 11.5, whiteSpace: "nowrap" }}>🔥 {p.streak}d</span>
                  )}
                  <span style={{
                    marginLeft: "auto", fontSize: 11.5, fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                    color: done ? "var(--status-online)" : "var(--text-soft)",
                    display: "flex", alignItems: "center", gap: 3,
                  }}>
                    {done && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>}
                    {p.todayDone}/{p.todayTotal}
                  </span>
                </div>
                <div style={{
                  height: 4, borderRadius: 999, overflow: "hidden",
                  background: "var(--bg-subtle)", border: "1px solid var(--border)",
                }}>
                  <div style={{
                    height: "100%", width: `${pct}%`, borderRadius: 999,
                    background: done ? "var(--status-online)" : "var(--accent)",
                    transition: "width 400ms var(--ease-out)",
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: todayTasks = [] } = useTodayAllTasks();
  const { data: plansTasks = [] } = usePlansTasks();
  const { data: stats } = useTaskStats();
  const { data: streak } = useStreak();
  const { data: friends = [] } = useFriends();
  const { data: partners = [] } = usePartners();
  const toggle = useToggleTask();
  const { t, tf } = useT();

  const firstName = user?.displayName?.split(" ")[0] ?? "there";
  const completed = todayTasks.filter(t => t.isCompleted).length;
  const total = todayTasks.length;
  const progress = Math.round((completed / Math.max(1, total)) * 100);
  const upcoming = plansTasks.slice(0, 4);
  const eyebrow = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  const h = new Date().getHours();
  const greetingKey = h < 12 ? "greeting_morning" : h < 18 ? "greeting_afternoon" : "greeting_evening";

  const subtitle = progress === 100
    ? t("tasks_all_done")
    : tf("tasks_subtitle", completed, total);

  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={`${t(greetingKey)}, ${firstName}`} subtitle={subtitle}>
        <Link href="/tasks/today" className="btn btn-accent" style={{ gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          {t("new_task")}
        </Link>
      </PageHeader>

      {/* Progress strip */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          height: 5, borderRadius: 999,
          background: "var(--bg-subtle)", border: "1px solid var(--border)", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: progress === 100 ? "var(--status-online)" : "var(--accent)",
            transition: "width 500ms var(--ease-out)",
          }} />
        </div>
      </div>

      <div className="grid-dash">
        {/* LEFT */}
        <div className="col gap-5">
          <div className="card">
            <div className="card-hd">
              <h3>{t("today_card")}</h3>
              <span className="muted" style={{ fontSize: 12 }}>{completed}/{total}</span>
              <Link href="/tasks/today" className="card-hd-action">{t("view_all")} <ChevronRight /></Link>
            </div>
            <div className="list">
              {todayTasks.slice(0, 5).map(tk => (
                <TaskRow key={tk.id} task={tk} onToggle={id => toggle.mutate(id)} />
              ))}
              {todayTasks.length === 0 && (
                <div className="muted" style={{ padding: "16px 4px", fontSize: 13 }}>{t("no_tasks_today")}</div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-hd">
              <h3>{t("upcoming_card")}</h3>
              <Link href="/tasks/plans" className="card-hd-action">{t("all_plans")} <ChevronRight /></Link>
            </div>
            <div className="list">
              {upcoming.map(tk => (
                <TaskRow key={tk.id} task={tk} onToggle={id => toggle.mutate(id)} showWhen />
              ))}
              {upcoming.length === 0 && (
                <div className="muted" style={{ padding: "16px 4px", fontSize: 13 }}>{t("no_upcoming")}</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col gap-5">
          {streak !== undefined && <StreakCard current={streak.current} best={streak.best} />}

          {stats && <StatsCard total={stats.total} completed={stats.completed} today={stats.today} />}

          <PartnersWidget partners={partners} />

          {/* Friends */}
          <div className="card">
            <div className="card-hd">
              <h3>{t("friends_now")}</h3>
              <span className="muted" style={{ fontSize: 12 }}>{friends.filter(f => f.status).length} {t("friends_active")}</span>
              <Link href="/friends" className="card-hd-action">{t("view_all")} <ChevronRight /></Link>
            </div>
            <div className="col gap-3">
              {friends.slice(0, 5).map(f => (
                <div key={f.id} className="row gap-3">
                  <Avatar
                    user={{ displayName: f.displayName, avatarUrl: f.avatarUrl, status: f.status ? { presence: f.status.presence ?? "ONLINE" } : undefined }}
                    size={32} status onBg="bg"
                  />
                  <div className="flex1 truncate">
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{f.displayName}</div>
                    {f.status && (
                      <div className="muted truncate" style={{ fontSize: 12 }}>
                        {f.status.emoji ?? ""} {f.status.customText ?? f.status.type ?? ""}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {friends.length === 0 && (
                <div className="muted" style={{ fontSize: 13 }}>{t("no_friends_dash")}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
