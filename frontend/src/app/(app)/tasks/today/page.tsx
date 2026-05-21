"use client";

import { useState } from "react";
import {
  useTodayTasks, useCreateTask, useToggleTask,
  useTodayLogs, useSetDailyStatus, useClearDailyStatus,
  useDailyLogs,
} from "@/hooks/useTasks";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/ui/page-header";
import { TaskRow } from "@/components/ui/task-row";
import { useT } from "@/hooks/useT";
import type { Task, Priority } from "@/types";
import type { LogStatus } from "@/hooks/useTasks";

// ── Helpers ───────────────────────────────────────────────────────────────
function isoDate(d: Date) { return d.toISOString().slice(0, 10); }

function WeekHistory() {
  const { t } = useT();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return isoDate(d);
  });
  const from = days[0], to = days[6];
  const { data: logs = [] } = useDailyLogs(from, to);

  const byDay: Record<string, { done: number; failed: number; skipped: number }> = {};
  for (const d of days) byDay[d] = { done: 0, failed: 0, skipped: 0 };
  for (const l of logs) {
    const key = isoDate(new Date(l.date));
    if (byDay[key]) {
      if (l.status === "DONE") byDay[key].done++;
      else if (l.status === "FAILED") byDay[key].failed++;
      else if (l.status === "SKIPPED") byDay[key].skipped++;
    }
  }

  return (
    <div className="card" style={{ marginBottom: 20, padding: "14px 16px" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 12 }}>
        {t("week_history_title")}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {days.map(day => {
          const { done, failed, skipped } = byDay[day];
          const total = done + failed + skipped;
          const isToday = day === isoDate(new Date());
          const label = new Date(day + "T12:00:00").toLocaleDateString(undefined, { weekday: "short" });
          return (
            <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: "100%", height: 40, borderRadius: 8,
                background: total === 0 ? "var(--bg-subtle)"
                  : done > 0 && failed === 0 ? "rgba(34,197,94,0.25)"
                  : failed > 0 ? "rgba(239,68,68,0.2)"
                  : "rgba(245,158,11,0.2)",
                border: isToday ? "2px solid var(--accent)" : "1px solid var(--border)",
                display: "grid", placeItems: "center",
                fontSize: 11, fontWeight: 600,
                color: total === 0 ? "var(--text-muted)"
                  : done > 0 && failed === 0 ? "#16a34a"
                  : failed > 0 ? "#ef4444"
                  : "#b45309",
              }}>
                {total > 0 ? `${done}/${total}` : "–"}
              </div>
              <span style={{ fontSize: 10, color: isToday ? "var(--accent)" : "var(--text-muted)", fontWeight: isToday ? 600 : 400 }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="row gap-3" style={{ marginTop: 10 }}>
        {([["#16a34a", "today_log_done"],["#ef4444", "today_log_failed"],["#b45309", "today_log_skipped"]] as const).map(([c, key]) => (
          <div key={key} className="row gap-1" style={{ fontSize: 11, color: "var(--text-muted)" }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
            {key === "today_log_done" ? t("done") : key === "today_log_failed" ? t("failed") : t("skip")}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Task row with daily log buttons ──────────────────────────────────────
function TodayTaskRow({ task, logs, onToggle }: {
  task: Task;
  logs: { taskId: string; status: LogStatus }[];
  onToggle: (id: string) => void;
}) {
  const { t } = useT();
  const setStatus = useSetDailyStatus();
  const clearStatus = useClearDailyStatus();
  const toast = useToast();

  const log = logs.find(l => l.taskId === task.id);
  const status = log?.status ?? null;

  const set = (s: LogStatus) => {
    if (status === s) {
      clearStatus.mutate(task.id, { onSuccess: () => toast.show("Статус арилав") });
    } else {
      setStatus.mutate({ taskId: task.id, status: s }, {
        onSuccess: () => toast.show(
          s === "DONE" ? `"${task.title}" дууссан! ✓`
          : s === "FAILED" ? `"${task.title}" болоогүй ✗`
          : `"${task.title}" алгасав →`
        ),
      });
    }
  };

  const btnStyle = (s: LogStatus, color: string) => ({
    width: 26, height: 26, borderRadius: 6, cursor: "default" as const, flexShrink: 0 as const,
    border: `1.5px solid ${status === s ? color : "var(--border-strong)"}`,
    background: status === s ? `${color}22` : "var(--bg-elevated)",
    color: status === s ? color : "var(--text-muted)",
    display: "grid" as const, placeItems: "center" as const, transition: "all 120ms",
  });

  return (
    <div className={"list-row" + (task.isCompleted ? " is-done" : "")}>
      <input
        type="checkbox"
        className="cb"
        checked={task.isCompleted}
        onChange={e => { e.stopPropagation(); onToggle(task.id); }}
        onClick={e => e.stopPropagation()}
      />
      <div className="flex1" style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text)" }}>{task.title}</div>
        {task.category && (
          <span style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--bg-subtle)", padding: "1px 6px", borderRadius: 4, display: "inline-block", marginTop: 2 }}>
            {task.category}
          </span>
        )}
      </div>

      {/* Status badge */}
      {status && (
        <span style={{
          fontSize: 11, padding: "1px 7px", borderRadius: 5, fontWeight: 500, flexShrink: 0,
          color: status === "DONE" ? "#16a34a" : status === "FAILED" ? "#ef4444" : "#b45309",
          background: status === "DONE" ? "rgba(34,197,94,0.12)" : status === "FAILED" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
        }}>
          {status === "DONE" ? t("done") : status === "FAILED" ? t("failed") : t("skip")}
        </span>
      )}

      {/* Log buttons */}
      <div className="row gap-1">
        <button style={btnStyle("DONE","#16a34a")} onClick={() => set("DONE")} title={t("done_btn")}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>
        </button>
        <button style={btnStyle("FAILED","#ef4444")} onClick={() => set("FAILED")} title={t("failed_btn")}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
        <button style={btnStyle("SKIPPED","#b45309")} onClick={() => set("SKIPPED")} title={t("skip_btn")}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>

      {task.time && (
        <span className="muted mono" style={{ fontSize: 12, minWidth: 44, textAlign: "right" }}>{task.time}</span>
      )}
    </div>
  );
}

// ── Create modal ──────────────────────────────────────────────────────────
function CreateTaskModal({ open, onClose, onCreate }: {
  open: boolean; onClose: () => void;
  onCreate: (data: { title: string; description?: string; imageUrl?: string; priority?: string; time?: string }) => void;
}) {
  const { t } = useT();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [priority, setPriority] = useState("MEDIUM");
  const [time, setTime] = useState("");

  if (!open) return null;

  const reset = () => { setTitle(""); setDesc(""); setImageUrl(""); setShowImage(false); setPriority("MEDIUM"); setTime(""); };

  const save = () => {
    if (!title.trim()) return;
    onCreate({ title: title.trim(), description: desc || undefined, imageUrl: imageUrl.trim() || undefined, priority, time: time || undefined });
    reset(); onClose();
  };

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <h2>{t("new_task_title")}</h2>
          <button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div className="col gap-3">
          <input
            className="input" style={{ fontSize: 15, height: 40, fontWeight: 500 }}
            placeholder={t("task_placeholder")} autoFocus value={title}
            onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && save()}
          />
          <textarea className="textarea" placeholder={t("notes_placeholder")} value={desc} onChange={e => setDesc(e.target.value)} rows={2} style={{ minHeight:60 }} />

          {/* Image URL */}
          <div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ gap:6, color: showImage ? "var(--accent)" : "var(--text-muted)" }}
              onClick={() => setShowImage(v=>!v)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m4 18 5-5 4 4 3-3 4 4"/>
              </svg>
              {t("attach_task")}
            </button>
            {showImage && (
              <div style={{ marginTop:8 }}>
                <input className="input" style={{ fontSize:13 }} placeholder="https://..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                {imageUrl && (
                  <div style={{ marginTop:8,borderRadius:8,overflow:"hidden",border:"1px solid var(--border)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="" style={{ width:"100%",maxHeight:180,objectFit:"cover",display:"block" }}
                      onError={e => (e.currentTarget.style.display="none")} />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="field-label">{t("priority_label")}</label>
              <div className="row gap-2">
                {[{ k: "HIGH", label: t("priority_high") },{ k: "MEDIUM", label: t("priority_med") },{ k: "LOW", label: t("priority_low") }].map(p => (
                  <button key={p.k} className="btn btn-sm" onClick={() => setPriority(p.k)} style={{
                    flex:1, borderColor: priority===p.k?"var(--accent)":"var(--border-strong)",
                    background: priority===p.k?"var(--accent-tint)":"var(--bg-elevated)",
                    color: priority===p.k?"var(--accent)":"var(--text-soft)",
                  }}>{p.label}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label className="field-label">{t("time_label")}</label>
              <input className="input" type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>
          <div className="row" style={{ justifyContent: "flex-end", gap: 8, marginTop: 2 }}>
            <button className="btn" onClick={onClose}>{t("cancel")}</button>
            <button className="btn btn-accent" onClick={save} disabled={!title.trim()}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>
              {t("add_task_btn")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function TodayTasksPage() {
  const { data: tasks = [] } = useTodayTasks();
  const { data: logs = [] } = useTodayLogs();
  const createTask = useCreateTask();
  const toast = useToast();
  const { t, tf } = useT();
  const toggle = useToggleTask((task: Task) => {
    toast.show(`"${task.title}" дууссан!`);
  });
  const [showModal, setShowModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const done = tasks.filter(tk => tk.isCompleted);
  const todo = tasks.filter(tk => !tk.isCompleted);
  const date = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  const logsDone = logs.filter(l => l.status === "DONE").length;
  const logsFailed = logs.filter(l => l.status === "FAILED").length;
  const logsSkipped = logs.filter(l => l.status === "SKIPPED").length;

  return (
    <div className="view-narrow">
      <PageHeader
        eyebrow={t("today_eyebrow")}
        title={date}
        subtitle={tf("tasks_subtitle", done.length, tasks.length)}
      >
        <button className="btn btn-sm btn-ghost" onClick={() => setShowHistory(v=>!v)} style={{ color: showHistory?"var(--accent)":undefined }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {t("history_btn")}
        </button>
        <button className="btn btn-accent" onClick={() => setShowModal(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          {t("new_task")}
        </button>
      </PageHeader>

      {/* Progress bar */}
      {tasks.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="row" style={{ marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{done.length} / {tasks.length} {t("stats_done")}</span>
            <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)" }}>{Math.round((done.length / tasks.length) * 100)}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: "var(--bg-subtle)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 999,
              background: done.length === tasks.length ? "#22c55e" : "var(--accent)",
              width: `${(done.length / tasks.length) * 100}%`, transition: "width 400ms ease",
            }} />
          </div>
        </div>
      )}

      {/* Today log summary */}
      {(logsDone + logsFailed + logsSkipped) > 0 && (
        <div className="row gap-3" style={{ marginBottom: 16, padding: "10px 14px", background: "var(--bg-subtle)", borderRadius: 10 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("today_log_summary")}</span>
          {logsDone > 0 && <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 500 }}>{tf("today_log_done", logsDone)}</span>}
          {logsFailed > 0 && <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 500 }}>{tf("today_log_failed", logsFailed)}</span>}
          {logsSkipped > 0 && <span style={{ fontSize: 12, color: "#b45309", fontWeight: 500 }}>{tf("today_log_skipped", logsSkipped)}</span>}
        </div>
      )}

      {/* Week history */}
      {showHistory && <WeekHistory />}

      <div className="col gap-6">
        {/* To do */}
        <div>
          <div className="row" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{t("todo_section")}</span>
            <span className="muted" style={{ marginLeft: "auto", fontSize: 12 }}>{todo.length}</span>
          </div>
          {todo.length === 0 ? (
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"40px 20px",color:"var(--text-muted)" }}>
              <div style={{ width:44,height:44,borderRadius:12,display:"grid",placeItems:"center",background:"var(--bg-subtle)",color:"var(--text-muted)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>
              </div>
              <div style={{ fontWeight:600,color:"var(--text)" }}>{t("all_clear_title")}</div>
              <div style={{ fontSize:12.5,textAlign:"center",maxWidth:320 }}>{t("all_clear_hint")}</div>
            </div>
          ) : (
            <div className="list">
              {todo.map(tk => (
                <TodayTaskRow key={tk.id} task={tk} logs={logs} onToggle={id => toggle.mutate(id)} />
              ))}
            </div>
          )}
        </div>

        {/* Completed */}
        {done.length > 0 && (
          <div>
            <div className="row" style={{ marginBottom: 8 }}>
              <span style={{ fontSize:12,fontWeight:600,color:"var(--text-muted)",letterSpacing:"0.04em",textTransform:"uppercase" }}>{t("completed_section")}</span>
              <span className="muted" style={{ marginLeft:"auto",fontSize:12 }}>{done.length}</span>
            </div>
            <div className="list">
              {done.map(tk => (
                <TodayTaskRow key={tk.id} task={tk} logs={logs} onToggle={id => toggle.mutate(id)} />
              ))}
            </div>
          </div>
        )}
      </div>

      <CreateTaskModal open={showModal} onClose={() => setShowModal(false)} onCreate={d => {
        createTask.mutate({
          title: d.title, description: d.description, imageUrl: d.imageUrl,
          priority: (d.priority as Priority) ?? "MEDIUM", time: d.time,
        });
      }} />
    </div>
  );
}
