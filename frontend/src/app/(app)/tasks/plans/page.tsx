"use client";

import { useState } from "react";
import { usePlansTasks, useToggleTask, useDeleteTask, useCreateTask } from "@/hooks/useTasks";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/ui/page-header";
import { TaskRow } from "@/components/ui/task-row";
import { useT } from "@/hooks/useT";
import { formatDate } from "@/lib/utils";
import type { Task } from "@/types";

function groupByDate(tasks: Task[], someday: string): { label: string; tasks: Task[] }[] {
  const groups: Record<string, Task[]> = {};
  const noDate: Task[] = [];

  for (const t of tasks) {
    if (!t.date) { noDate.push(t); continue; }
    const d = new Date(t.date);
    const key = d.toISOString().slice(0, 10);
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  }

  const sorted = Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, tasks]) => ({
      label: formatDate(key, { weekday: "long", month: "long", day: "numeric" }),
      tasks,
    }));

  if (noDate.length > 0) sorted.push({ label: someday, tasks: noDate });
  return sorted;
}

function CreatePlanModal({ open, onClose, onCreate }: {
  open: boolean; onClose: () => void;
  onCreate: (d: { title: string; date?: string; priority?: string }) => void;
}) {
  const { t } = useT();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  if (!open) return null;
  const save = () => {
    if (!title.trim()) return;
    onCreate({ title: title.trim(), date: date || undefined, priority });
    setTitle(""); setDate(""); setPriority("MEDIUM");
    onClose();
  };

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <h2>{t("new_plan_title")}</h2>
          <button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div className="col gap-4">
          <input className="input" style={{ fontSize: 15, height: 40, fontWeight: 500 }}
            placeholder={t("planning_placeholder")} autoFocus value={title}
            onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && save()} />
          <div className="grid-2">
            <div className="field">
              <label className="field-label">{t("date_label")}</label>
              <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)} />
            </div>
            <div className="field">
              <label className="field-label">{t("priority_label")}</label>
              <div className="row gap-2">
                {[{ k: "HIGH", l: t("priority_high") }, { k: "MEDIUM", l: t("priority_med") }, { k: "LOW", l: t("priority_low") }].map(p => (
                  <button key={p.k} className="btn btn-sm" onClick={() => setPriority(p.k)} style={{
                    flex: 1,
                    borderColor: priority === p.k ? "var(--accent)" : "var(--border-strong)",
                    background: priority === p.k ? "var(--accent-tint)" : "var(--bg-elevated)",
                    color: priority === p.k ? "var(--accent)" : "var(--text-soft)",
                  }}>{p.l}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
            <button className="btn" onClick={onClose}>{t("cancel")}</button>
            <button className="btn btn-accent" onClick={save} disabled={!title.trim()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>
              {t("add_plan_btn")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlansPage() {
  const { data: tasks = [], isLoading } = usePlansTasks();
  const toast = useToast();
  const { t, tf } = useT();
  const toggle = useToggleTask((task: Task) => {
    toast.show(tf("task_done_toast", task.title));
  });
  const remove = useDeleteTask();
  const create = useCreateTask();
  const [showModal, setShowModal] = useState(false);

  const groups = groupByDate(tasks, t("someday"));
  const total = tasks.length;
  const done = tasks.filter(tk => tk.isCompleted).length;

  return (
    <div className="view-narrow">
      <PageHeader
        eyebrow={t("plans_eyebrow")}
        title={t("plans_title")}
        subtitle={t("plans_subtitle")}
      >
        <button className="btn btn-accent" onClick={() => setShowModal(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          {t("new_plan_title")}
        </button>
      </PageHeader>

      {isLoading ? (
        <div className="col gap-4">
          {[1,2,3].map(i => <div key={i} style={{ height: 80, borderRadius: 8, background: "var(--bg-subtle)", animation: "pulse 1.5s ease-in-out infinite" }} />)}
        </div>
      ) : groups.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "60px 20px", color: "var(--text-muted)" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, display: "grid", placeItems: "center", background: "var(--bg-subtle)", fontSize: 24 }}>📅</div>
          <div style={{ fontWeight: 600, color: "var(--text)" }}>{t("no_plans_title")}</div>
          <div style={{ fontSize: 13, textAlign: "center", maxWidth: 280 }}>{t("no_plans_hint")}</div>
          <button className="btn btn-accent btn-sm" style={{ marginTop: 4 }} onClick={() => setShowModal(true)}>{t("add_first_plan")}</button>
        </div>
      ) : (
        <div className="col gap-6">
          {groups.map(({ label, tasks: gTasks }) => (
            <div key={label}>
              <div className="row" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
                <span className="muted" style={{ marginLeft: "auto", fontSize: 12 }}>{gTasks.length}</span>
              </div>
              <div className="list">
                {gTasks.map(tk => (
                  <TaskRow key={tk.id} task={tk}
                    onToggle={id => toggle.mutate(id)}
                    onDelete={id => remove.mutate(id)}
                    showDate showStatus />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreatePlanModal open={showModal} onClose={() => setShowModal(false)}
        onCreate={d => create.mutate({ ...d, priority: d.priority as "LOW"|"MEDIUM"|"HIGH"|"URGENT" })} />

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}
