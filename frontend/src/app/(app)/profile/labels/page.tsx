"use client";

import { useState } from "react";
import { useLabels, useCreateLabel, useUpdateLabel, useDeleteLabel, type Label } from "@/hooks/useLabels";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/ui/page-header";

const PRESET_COLORS = [
  "#6366f1","#8b5cf6","#ec4899","#ef4444",
  "#f97316","#f59e0b","#22c55e","#14b8a6",
  "#06b6d4","#3b82f6","#84cc16","#64748b",
];

function LabelRow({ label, onDelete, onUpdate }: {
  label: Label;
  onDelete: () => void;
  onUpdate: (name: string, color: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(label.name);
  const [color, setColor] = useState(label.color);

  const save = () => { onUpdate(name, color); setEditing(false); };

  if (editing) return (
    <div style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
      <div className="row gap-3" style={{ marginBottom: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: color, flexShrink: 0, border: "1px solid var(--border)" }} />
        <input
          className="input"
          style={{ flex: 1, height: 34 }}
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
          onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
        />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {PRESET_COLORS.map(c => (
          <button key={c} onClick={() => setColor(c)}
            style={{ width: 22, height: 22, borderRadius: 4, background: c, border: `2px solid ${color === c ? "var(--text)" : "transparent"}`, cursor: "default" }} />
        ))}
      </div>
      <div className="row gap-2" style={{ justifyContent: "flex-end" }}>
        <button className="btn btn-sm" onClick={() => setEditing(false)}>Болих</button>
        <button className="btn btn-sm btn-accent" onClick={save}>Хадгалах</button>
      </div>
    </div>
  );

  return (
    <div className="row gap-3" style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: label.color, flexShrink: 0, marginTop: 1 }} />
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{label.name}</span>
      <span className="muted" style={{ fontSize: 12 }}>{label._count?.tasks ?? 0} task</span>
      <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setEditing(true)}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </button>
      <button className="btn btn-ghost btn-sm btn-icon" onClick={onDelete} style={{ color: "var(--status-busy)" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
      </button>
    </div>
  );
}

export default function LabelsPage() {
  const { data: labels = [] } = useLabels();
  const createLabel = useCreateLabel();
  const updateLabel = useUpdateLabel();
  const deleteLabel = useDeleteLabel();
  const toast = useToast();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");

  const handleCreate = () => {
    if (!name.trim()) return;
    createLabel.mutate({ name: name.trim(), color }, {
      onSuccess: () => { toast.show(`"${name}" шошго нэмлээ!`); setName(""); },
      onError: (e: unknown) => {
        const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
        toast.show(typeof msg === "string" ? msg : "Шошго нэмж чадсангүй", "error");
      },
    });
  };

  return (
    <div className="view-narrow">
      <PageHeader eyebrow="Профайл" title="Шошго" subtitle="Таскаа өнгөт шошгоор ангилаарай." />

      {/* Create */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Шинэ шошго нэмэх</div>
        <div className="row gap-3" style={{ marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: color, flexShrink: 0, border: "1px solid var(--border)" }} />
          <input
            className="input"
            placeholder="Шошгоны нэр…"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleCreate()}
            style={{ flex: 1 }}
          />
          <button className="btn btn-accent" onClick={handleCreate} disabled={!name.trim() || createLabel.isPending}>
            Нэмэх
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PRESET_COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)}
              style={{ width: 26, height: 26, borderRadius: 6, background: c, border: `2.5px solid ${color === c ? "var(--text)" : "transparent"}`, cursor: "default" }} />
          ))}
        </div>
      </div>

      {/* List */}
      <div className="card">
        {labels.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)", fontSize: 13 }}>
            Label байхгүй байна. Дээрээс нэмнэ үү.
          </div>
        ) : labels.map(l => (
          <LabelRow
            key={l.id}
            label={l}
            onDelete={() => deleteLabel.mutate(l.id, { onSuccess: () => toast.show("Label устгагдлаа") })}
            onUpdate={(n, c) => updateLabel.mutate({ id: l.id, name: n, color: c }, { onSuccess: () => toast.show("Шинэчлэгдлээ") })}
          />
        ))}
      </div>
    </div>
  );
}
