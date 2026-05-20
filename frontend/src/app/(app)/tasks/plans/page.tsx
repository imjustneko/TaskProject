"use client";

import { useState } from "react";
import { usePlansTasks, useToggleTask, useDeleteTask, useCreateTask } from "@/hooks/useTasks";
import { PageHeader } from "@/components/ui/page-header";
import { TaskRow } from "@/components/ui/task-row";
import { formatDate } from "@/lib/utils";
import type { Task } from "@/types";

function groupByDate(tasks: Task[]): { label: string; tasks: Task[] }[] {
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

  if (noDate.length > 0) sorted.push({ label: "Someday", tasks: noDate });
  return sorted;
}

function CreatePlanModal({ open, onClose, onCreate }: {
  open: boolean; onClose: () => void;
  onCreate: (d: { title: string; date?: string; priority?: string }) => void;
}) {
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
          <h2>New plan</h2>
          <button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div className="col gap-4">
          <input className="input" style={{ fontSize: 15, height: 40, fontWeight: 500 }}
            placeholder="What are you planning?" autoFocus value={title}
            onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && save()} />
          <div className="grid-2">
            <div className="field">
              <label className="field-label">Date</label>
              <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)} />
            </div>
            <div className="field">
              <label className="field-label">Priority</label>
              <div className="row gap-2">
                {[{ k: "HIGH", l: "High" }, { k: "MEDIUM", l: "Med" }, { k: "LOW", l: "Low" }].map(p => (
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
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn btn-accent" onClick={save} disabled={!title.trim()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>
              Add plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlansPage() {
  const { data: tasks = [], isLoading } = usePlansTasks();
  const toggle = useToggleTask();
  const remove = useDeleteTask();
  const create = useCreateTask();
  const [showModal, setShowModal] = useState(false);

  const groups = groupByDate(tasks);
  const total = tasks.length;
  const done = tasks.filter(t => t.isCompleted).length;

  return (
    <div className="view-narrow">
      <PageHeader
        eyebrow="Plans"
        title="Upcoming"
        subtitle={`${total - done} task${total - done === 1 ? "" : "s"} planned`}
      >
        <button className="btn btn-accent" onClick={() => setShowModal(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          New plan
        </button>
      </PageHeader>

      {isLoading ? (
        <div className="col gap-4">
          {[1,2,3].map(i => <div key={i} style={{ height: 80, borderRadius: 8, background: "var(--bg-subtle)", animation: "pulse 1.5s ease-in-out infinite" }} />)}
        </div>
      ) : groups.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "60px 20px", color: "var(--text-muted)" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, display: "grid", placeItems: "center", background: "var(--bg-subtle)", fontSize: 24 }}>📅</div>
          <div style={{ fontWeight: 600, color: "var(--text)" }}>No plans yet</div>
          <div style={{ fontSize: 13, textAlign: "center", maxWidth: 280 }}>Add tasks for tomorrow, next week, or someday.</div>
          <button className="btn btn-accent btn-sm" style={{ marginTop: 4 }} onClick={() => setShowModal(true)}>Add first plan</button>
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
                {gTasks.map(t => (
                  <TaskRow key={t.id} task={t}
                    onToggle={id => toggle.mutate(id)}
                    onDelete={id => remove.mutate(id)}
                    showDate />
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
