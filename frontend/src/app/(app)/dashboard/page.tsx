"use client";

import Link from "next/link";
import { useTodayTasks, useToggleTask, useTaskStats, usePlansTasks, useStreak } from "@/hooks/useTasks";
import { useFriends } from "@/hooks/useFriends";
import { usePartners } from "@/hooks/usePartners";
import { useAuthStore } from "@/stores/authStore";
import { PageHeader } from "@/components/ui/page-header";
import { TaskRow } from "@/components/ui/task-row";
import { Avatar } from "@/components/ui/avatar";
import { StatusPill } from "@/components/ui/status-pill";

function Progress({ value, height = 4 }: { value: number; height?: number }) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{
        height,
        borderRadius: 999,
        background: "var(--bg-subtle)",
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${value}%`,
          background: "var(--accent)",
          transition: "width 400ms cubic-bezier(.2,.8,.2,1)",
        }} />
      </div>
    </div>
  );
}

function ChevronRight({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6"/>
    </svg>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: todayTasks = [] } = useTodayTasks();
  const { data: plansTasks = [] } = usePlansTasks();
  const { data: stats } = useTaskStats();
  const { data: streak } = useStreak();
  const { data: friends = [] } = useFriends();
  const { data: partners = [] } = usePartners();
  const toggle = useToggleTask();

  const firstName = user?.displayName?.split(" ")[0] ?? "there";
  const completed = todayTasks.filter((t) => t.isCompleted).length;
  const total = todayTasks.length;
  const progress = Math.round((completed / Math.max(1, total)) * 100);
  const upcoming = plansTasks.slice(0, 4);
  const eyebrow = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const subtitle =
    progress === 100
      ? "You're done for the day. Nice work."
      : `${completed} of ${total} tasks done · ${total - completed} to go`;

  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={`${greeting()}, ${firstName}`} subtitle={subtitle}>
        <Link href="/tasks/today" className="btn btn-accent">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          New task
        </Link>
      </PageHeader>

      <div style={{ marginBottom: 24 }}>
        <Progress value={progress} height={6} />
      </div>

      <div className="grid-dash">
        {/* LEFT col */}
        <div className="col gap-5">
          {/* Today card */}
          <div className="card">
            <div className="card-hd">
              <h3>Today</h3>
              <span className="muted" style={{ fontSize: 12 }}>{completed}/{total}</span>
              <Link href="/tasks/today" className="card-hd-action">
                View all <ChevronRight />
              </Link>
            </div>
            <div className="list">
              {todayTasks.slice(0, 5).map((t) => (
                <TaskRow key={t.id} task={t} onToggle={(id) => toggle.mutate(id)} />
              ))}
              {todayTasks.length === 0 && (
                <div className="muted" style={{ padding: "16px 4px", fontSize: 13 }}>No tasks for today yet.</div>
              )}
            </div>
          </div>

          {/* Upcoming card */}
          <div className="card">
            <div className="card-hd">
              <h3>Upcoming</h3>
              <Link href="/tasks/plans" className="card-hd-action">
                All plans <ChevronRight />
              </Link>
            </div>
            <div className="list">
              {upcoming.map((t) => (
                <TaskRow key={t.id} task={t} onToggle={(id) => toggle.mutate(id)} showWhen />
              ))}
              {upcoming.length === 0 && (
                <div className="muted" style={{ padding: "16px 4px", fontSize: 13 }}>No upcoming tasks.</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT col */}
        <div className="col gap-5">
          {/* Friends card */}
          <div className="card">
            <div className="card-hd">
              <h3>Friends · now</h3>
              <span className="muted" style={{ fontSize: 12 }}>{friends.length} total</span>
              <Link href="/friends" className="card-hd-action">
                See all <ChevronRight />
              </Link>
            </div>
            <div className="col gap-3">
              {friends.slice(0, 5).map((f) => (
                <div key={f.id} className="row gap-3" style={{ cursor: "default" }}>
                  <Avatar
                    user={{
                      displayName: f.displayName,
                      avatarUrl: f.avatarUrl,
                      status: f.status ? { presence: f.status.presence ?? "ONLINE" } : undefined,
                    }}
                    size={32}
                    status
                    onBg="bg"
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
                <div className="muted" style={{ fontSize: 13 }}>No friends yet.</div>
              )}
            </div>
          </div>

          {/* Streak card */}
          {streak !== undefined && (
            <div className="card">
              <div className="card-hd"><h3>Streak</h3></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <div style={{ fontSize: 28, marginBottom: 2 }}>🔥</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: streak.current > 0 ? "#f97316" : "var(--text-muted)" }}>
                    {streak.current}
                  </div>
                  <div className="muted" style={{ fontSize: 11.5 }}>Одоогийн streak</div>
                </div>
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <div style={{ fontSize: 28, marginBottom: 2 }}>🏆</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "var(--accent)" }}>{streak.best}</div>
                  <div className="muted" style={{ fontSize: 11.5 }}>Хамгийн дээд</div>
                </div>
              </div>
              {streak.current > 0 && (
                <div style={{
                  marginTop: 8, padding: "6px 10px", borderRadius: 8,
                  background: "rgba(249,115,22,0.1)", fontSize: 12,
                  color: "#f97316", textAlign: "center",
                }}>
                  🔥 {streak.current} өдөр дараалж таск хийлээ!
                </div>
              )}
            </div>
          )}

          {/* Stats card */}
          {stats && (
            <div className="card">
              <div className="card-hd">
                <h3>Stats</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[
                  { label: "Total", value: stats.total },
                  { label: "Done", value: stats.completed },
                  { label: "Today", value: stats.today },
                ].map(({ label, value }) => (
                  <div key={label} style={{ textAlign: "center", padding: "8px 0" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)" }}>{value}</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partners card */}
          {partners.length > 0 && (
            <div className="card">
              <div className="card-hd">
                <h3>🤝 Partners · өнөөдөр</h3>
                <Link href="/partners" className="card-hd-action">Бүгд <ChevronRight /></Link>
              </div>
              <div className="col gap-3">
                {partners.map(p => {
                  const pct = p.todayTotal === 0 ? 0 : Math.round(p.todayDone / p.todayTotal * 100);
                  const done = p.todayTotal > 0 && p.todayDone === p.todayTotal;
                  return (
                    <div key={p.pairId} className="row gap-3">
                      <Avatar user={{ displayName: p.partner.displayName, avatarUrl: p.partner.avatarUrl, status: p.partner.status }} size={32} status onBg="bg" />
                      <div className="flex1 truncate">
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{p.partner.displayName}</div>
                        <div style={{ height: 4, borderRadius: 999, background: "var(--bg-subtle)", overflow: "hidden", marginTop: 4 }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: done ? "#22c55e" : "var(--accent)", borderRadius: 999, transition: "width 400ms" }} />
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: done ? "#16a34a" : "var(--text-muted)", minWidth: 38, textAlign: "right" }}>
                        {p.todayDone}/{p.todayTotal}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Friend activity card */}
          <div className="card">
            <div className="card-hd">
              <h3>Friend activity</h3>
            </div>
            <div className="col gap-3">
              {friends.slice(0, 3).map((f) => (
                <div key={f.id} className="row gap-3">
                  <Avatar
                    user={{ displayName: f.displayName, avatarUrl: f.avatarUrl }}
                    size={28}
                    onBg="bg"
                  />
                  <div className="flex1 truncate">
                    <div style={{ fontSize: 13 }}>
                      <b style={{ fontWeight: 600 }}>{f.displayName.split(" ")[0]}</b>{" "}
                      <span className="muted">is active</span>
                    </div>
                    {f.status && (
                      <div className="muted truncate" style={{ fontSize: 11.5 }}>
                        <StatusPill status={{
                          emoji: f.status.emoji,
                          label: f.status.customText ?? f.status.type,
                        }} compact />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {friends.length === 0 && (
                <div className="muted" style={{ fontSize: 13 }}>Add friends to see their activity.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
