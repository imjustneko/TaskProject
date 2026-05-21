"use client";

import { useDailyLogs, useStreak } from "@/hooks/useTasks";
import { useT } from "@/hooks/useT";
import { PageHeader } from "@/components/ui/page-header";

function isoDate(d: Date) { return d.toISOString().slice(0, 10); }

function buildCalendar(from: Date, to: Date) {
  const days: Date[] = [];
  const d = new Date(from);
  while (d <= to) { days.push(new Date(d)); d.setDate(d.getDate() + 1); }
  return days;
}

export default function ReportPage() {
  const { t, lang } = useT();

  const WEEKDAY_LABELS = lang === "mn"
    ? ["Да","Мя","Лх","Пү","Ба","Бя","Ня"]
    : ["M","T","W","T","F","S","S"];

  const MONTH_NAMES = lang === "mn"
    ? ["1-р сар","2-р сар","3-р сар","4-р сар","5-р сар","6-р сар","7-р сар","8-р сар","9-р сар","10-р сар","11-р сар","12-р сар"]
    : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const LEGEND = lang === "mn"
    ? [
        { color: "var(--bg-subtle)", label: "Бүртгэл байхгүй" },
        { color: "#86efac", label: "1 дууссан" },
        { color: "#22c55e", label: "2 дууссан" },
        { color: "#16a34a", label: "3+ дууссан" },
        { color: "#fca5a5", label: "Болоогүй бий" },
        { color: "#fcd34d", label: "Алгасав" },
      ]
    : [
        { color: "var(--bg-subtle)", label: "No record" },
        { color: "#86efac", label: "1 done" },
        { color: "#22c55e", label: "2 done" },
        { color: "#16a34a", label: "3+ done" },
        { color: "#fca5a5", label: "Some failed" },
        { color: "#fcd34d", label: "Skipped" },
      ];

  const to = new Date();
  const from = new Date(); from.setDate(from.getDate() - 111);

  const { data: logs = [] } = useDailyLogs(isoDate(from), isoDate(to));
  const { data: streak } = useStreak();

  const byDay: Record<string, { done: number; failed: number; skipped: number }> = {};
  for (const l of logs) {
    const key = isoDate(new Date(l.date));
    if (!byDay[key]) byDay[key] = { done: 0, failed: 0, skipped: 0 };
    if (l.status === "DONE") byDay[key].done++;
    else if (l.status === "FAILED") byDay[key].failed++;
    else if (l.status === "SKIPPED") byDay[key].skipped++;
  }

  const days = buildCalendar(from, to);
  const startPad = (days[0].getDay() + 6) % 7;
  const padded = [...Array(startPad).fill(null), ...days];
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));

  const cellColor = (day: Date | null) => {
    if (!day) return "transparent";
    const key = isoDate(day);
    const s = byDay[key];
    if (!s) return "var(--bg-subtle)";
    const { done, failed, skipped } = s;
    const total = done + failed + skipped;
    if (total === 0) return "var(--bg-subtle)";
    if (done > 0 && failed === 0) return done >= 3 ? "#16a34a" : done >= 2 ? "#22c55e" : "#86efac";
    if (failed > 0) return failed >= 2 ? "#ef4444" : "#fca5a5";
    return "#fcd34d";
  };

  const cellTitle = (day: Date | null) => {
    if (!day) return "";
    const key = isoDate(day);
    const s = byDay[key];
    const dateStr = day.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const noRecord = lang === "mn" ? "бүртгэл байхгүй" : "no record";
    if (!s) return `${dateStr} — ${noRecord}`;
    return `${dateStr} — ✓${s.done} ✗${s.failed} →${s.skipped}`;
  };

  const totalDone = logs.filter(l => l.status === "DONE").length;
  const totalFailed = logs.filter(l => l.status === "FAILED").length;
  const totalSkipped = logs.filter(l => l.status === "SKIPPED").length;
  const activeDays = Object.keys(byDay).filter(k => byDay[k].done + byDay[k].failed + byDay[k].skipped > 0).length;

  const subtitleText = lang === "mn"
    ? "Сүүлийн 16 долоо хоногийн гүйцэтгэл"
    : "Performance over the last 16 weeks";

  const summaryLabels = lang === "mn"
    ? ["Streak", "Дууссан", "Болоогүй", "Идэвхтэй өдөр"]
    : ["Streak", "Done", "Failed", "Active days"];

  const heatmapTitle = lang === "mn" ? "Гүйцэтгэлийн хуваарь" : "Activity heatmap";

  const bestStreakText = lang === "mn"
    ? (s: number) => `Хамгийн дээд streak: ${s} өдөр`
    : (s: number) => `Best streak: ${s} day${s !== 1 ? "s" : ""}`;

  const currentStreakText = lang === "mn"
    ? (s: number) => `🔥 Одоо ${s} өдрийн streak явж байна!`
    : (s: number) => `🔥 Currently on a ${s}-day streak!`;

  return (
    <div className="view-narrow">
      <PageHeader eyebrow={t("report_eyebrow")} title={t("report_title")} subtitle={subtitleText} />

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { icon: "🔥", value: streak?.current ?? 0, color: "#f97316" },
          { icon: "✓", value: totalDone, color: "#16a34a" },
          { icon: "✗", value: totalFailed, color: "#ef4444" },
          { icon: "📅", value: activeDays, color: "var(--accent)" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div className="muted" style={{ fontSize: 11.5 }}>{summaryLabels[i]}</div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{heatmapTitle}</div>

        <div style={{ display: "flex", gap: 2, marginBottom: 4, paddingLeft: 36 }}>
          {WEEKDAY_LABELS.map(d => (
            <div key={d} style={{ width: 14, textAlign: "center", fontSize: 10, color: "var(--text-muted)", flex: "0 0 14px" }}>{d}</div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 3, overflowX: "auto", paddingBottom: 4 }}>
          {weeks.map((week, wi) => {
            const monthLabel = week.find(d => d && d.getDate() <= 7);
            return (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ height: 14, fontSize: 9, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden" }}>
                  {monthLabel ? MONTH_NAMES[monthLabel.getMonth()].slice(0, 3) : ""}
                </div>
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={cellTitle(day)}
                    style={{
                      width: 14, height: 14, borderRadius: 3,
                      background: cellColor(day),
                      border: day && isoDate(day) === isoDate(new Date()) ? "2px solid var(--accent)" : "1px solid var(--border)",
                      transition: "transform 80ms",
                      cursor: day ? "default" : undefined,
                    }}
                    onMouseEnter={e => { if (day) (e.currentTarget as HTMLDivElement).style.transform = "scale(1.4)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; }}
                  />
                ))}
              </div>
            );
          })}
        </div>

        <div className="row gap-3" style={{ marginTop: 12, flexWrap: "wrap" }}>
          {LEGEND.map(l => (
            <div key={l.label} className="row gap-1" style={{ fontSize: 11, color: "var(--text-muted)" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color, border: "1px solid var(--border)", flexShrink: 0 }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {streak && streak.best > 0 && (
        <div className="card" style={{ marginTop: 16, textAlign: "center", padding: "20px" }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>🏆</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{bestStreakText(streak.best)}</div>
          {streak.current > 0 && (
            <div style={{ fontSize: 13, color: "#f97316", marginTop: 6 }}>
              {currentStreakText(streak.current)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
