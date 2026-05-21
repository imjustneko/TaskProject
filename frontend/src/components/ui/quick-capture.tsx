"use client";

import { useState, useRef, useEffect } from "react";
import { useCreateTask } from "@/hooks/useTasks";
import { useLabels } from "@/hooks/useLabels";
import { useToast } from "./toast";

const PRIORITIES = [
  { k: "HIGH", label: "Өндөр", color: "#ef4444" },
  { k: "MEDIUM", label: "Дунд", color: "#f59e0b" },
  { k: "LOW", label: "Бага", color: "#22c55e" },
] as const;

export function QuickCapture() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [date, setDate] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [showLabels, setShowLabels] = useState(false);
  const createTask = useCreateTask();
  const { data: labels = [] } = useLabels();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else { setTitle(""); setPriority("MEDIUM"); setDate(""); setSelectedLabels([]); }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(v => !v); }
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const save = () => {
    if (!title.trim()) return;
    createTask.mutate(
      {
        title: title.trim(),
        priority: priority as "LOW" | "MEDIUM" | "HIGH",
        date: date || undefined,
        labelIds: selectedLabels,
      } as Parameters<typeof createTask.mutate>[0],
      { onSuccess: () => { toast.show(`"${title}" таск нэмлээ!`); setOpen(false); } }
    );
  };

  const toggleLabel = (id: string) =>
    setSelectedLabels(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        title="Quick capture (Ctrl+K)"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 1000,
          width: 52, height: 52, borderRadius: "50%",
          background: "var(--accent)", color: "#fff", border: "none",
          boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
          display: "grid", placeItems: "center", cursor: "default",
          transition: "transform 120ms, box-shadow 120ms",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(99,102,241,0.55)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(99,102,241,0.4)"; }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 2000,
            background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div style={{
            background: "var(--bg-card)", borderRadius: 16, padding: 20,
            width: "min(480px, calc(100vw - 32px))",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            border: "1px solid var(--border)",
          }}>
            {/* Title input */}
            <input
              ref={inputRef}
              className="input"
              style={{ fontSize: 16, height: 44, fontWeight: 500, marginBottom: 14 }}
              placeholder="Юу хийх вэ? (Ctrl+K)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setOpen(false); }}
            />

            {/* Options row */}
            <div className="row gap-2" style={{ marginBottom: 14, flexWrap: "wrap" }}>
              {/* Priority */}
              {PRIORITIES.map(p => (
                <button
                  key={p.k}
                  className="btn btn-sm"
                  onClick={() => setPriority(p.k)}
                  style={{
                    gap: 5,
                    borderColor: priority === p.k ? p.color : "var(--border-strong)",
                    background: priority === p.k ? `${p.color}18` : "var(--bg-elevated)",
                    color: priority === p.k ? p.color : "var(--text-soft)",
                  }}
                >
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: priority === p.k ? p.color : "var(--text-muted)" }} />
                  {p.label}
                </button>
              ))}

              {/* Date */}
              <input
                type="date"
                className="input"
                style={{ height: 30, fontSize: 12, flex: 1, minWidth: 120 }}
                value={date}
                onChange={e => setDate(e.target.value)}
              />

              {/* Labels toggle */}
              {labels.length > 0 && (
                <button
                  className="btn btn-sm"
                  onClick={() => setShowLabels(v => !v)}
                  style={{ color: showLabels ? "var(--accent)" : "var(--text-muted)", gap: 5 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  Labels {selectedLabels.length > 0 && `(${selectedLabels.length})`}
                </button>
              )}
            </div>

            {/* Label picker */}
            {showLabels && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {labels.map(l => (
                  <button
                    key={l.id}
                    onClick={() => toggleLabel(l.id)}
                    style={{
                      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                      border: `1.5px solid ${selectedLabels.includes(l.id) ? l.color : "var(--border-strong)"}`,
                      background: selectedLabels.includes(l.id) ? `${l.color}22` : "var(--bg-elevated)",
                      color: selectedLabels.includes(l.id) ? l.color : "var(--text-soft)",
                      cursor: "default", display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                    {l.name}
                  </button>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="row gap-2" style={{ justifyContent: "flex-end" }}>
              <button className="btn" onClick={() => setOpen(false)}>Болих</button>
              <button
                className="btn btn-accent"
                disabled={!title.trim() || createTask.isPending}
                onClick={save}
              >
                {createTask.isPending ? "Нэмж байна…" : "Нэмэх"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
