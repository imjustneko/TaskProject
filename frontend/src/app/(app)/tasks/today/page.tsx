"use client";

import { useState } from "react";
import { useTodayTasks, useCreateTask, useToggleTask } from "@/hooks/useTasks";
import { PageHeader } from "@/components/ui/page-header";
import { TaskRow } from "@/components/ui/task-row";

function CreateTaskModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { title: string; description?: string; priority?: string; time?: string; category?: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [time, setTime] = useState("");

  if (!open) return null;

  const save = () => {
    if (!title.trim()) return;
    onCreate({ title: title.trim(), description: desc || undefined, priority, time: time || undefined });
    setTitle(""); setDesc(""); setPriority("MEDIUM"); setTime("");
    onClose();
  };

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-hd">
          <h2>New task</h2>
          <button className="btn btn-ghost btn-sm btn-icon" onClick={onClose}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div className="col gap-4">
          <input
            className="input"
            style={{ fontSize: 15, height: 40, fontWeight: 500 }}
            placeholder="What's the task?"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
          />
          <textarea
            className="textarea"
            placeholder="Notes (optional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
          />
          <div className="grid-2">
            <div className="field">
              <label className="field-label">Priority</label>
              <div className="row gap-2">
                {[
                  { k: "HIGH", label: "High" },
                  { k: "MEDIUM", label: "Med" },
                  { k: "LOW", label: "Low" },
                ].map((p) => (
                  <button
                    key={p.k}
                    className="btn btn-sm"
                    onClick={() => setPriority(p.k)}
                    style={{
                      flex: 1,
                      borderColor: priority === p.k ? "var(--accent)" : "var(--border-strong)",
                      background: priority === p.k ? "var(--accent-tint)" : "var(--bg-elevated)",
                      color: priority === p.k ? "var(--accent)" : "var(--text-soft)",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <label className="field-label">Time</label>
              <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <div className="row" style={{ justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
            <button className="btn" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-accent"
              onClick={save}
              disabled={!title.trim()}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>
              Add task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TodayTasksPage() {
  const { data: tasks = [] } = useTodayTasks();
  const createTask = useCreateTask();
  const toggle = useToggleTask();
  const [showModal, setShowModal] = useState(false);

  const done = tasks.filter((t) => t.isCompleted);
  const todo = tasks.filter((t) => !t.isCompleted);
  const date = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  const handleCreate = (data: { title: string; description?: string; priority?: string; time?: string }) => {
    createTask.mutate({
      title: data.title,
      description: data.description,
      priority: (data.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT") ?? "MEDIUM",
      time: data.time,
    });
  };

  return (
    <div className="view-narrow">
      <PageHeader
        eyebrow="Today"
        title={date}
        subtitle={`${todo.length} task${todo.length === 1 ? "" : "s"} remaining`}
      >
        <button className="btn btn-accent" onClick={() => setShowModal(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          New task
        </button>
      </PageHeader>

      <div className="col gap-6">
        {/* To do section */}
        <div>
          <div className="row" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              To do
            </span>
            <span className="muted" style={{ marginLeft: "auto", fontSize: 12 }}>{todo.length}</span>
          </div>
          {todo.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 10, padding: "40px 20px", color: "var(--text-muted)",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center",
                background: "var(--bg-subtle)", color: "var(--text-muted)",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>
              </div>
              <div style={{ fontWeight: 600, color: "var(--text)" }}>All clear</div>
              <div style={{ fontSize: 12.5, textAlign: "center", maxWidth: 320 }}>You&apos;ve checked off every task for today. Treat yourself.</div>
            </div>
          ) : (
            <div className="list">
              {todo.map((t) => (
                <TaskRow key={t.id} task={t} onToggle={(id) => toggle.mutate(id)} />
              ))}
            </div>
          )}
        </div>

        {/* Completed section */}
        {done.length > 0 && (
          <div>
            <div className="row" style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Completed
              </span>
              <span className="muted" style={{ marginLeft: "auto", fontSize: 12 }}>{done.length}</span>
            </div>
            <div className="list">
              {done.map((t) => (
                <TaskRow key={t.id} task={t} onToggle={(id) => toggle.mutate(id)} />
              ))}
            </div>
          </div>
        )}
      </div>

      <CreateTaskModal open={showModal} onClose={() => setShowModal(false)} onCreate={handleCreate} />
    </div>
  );
}
