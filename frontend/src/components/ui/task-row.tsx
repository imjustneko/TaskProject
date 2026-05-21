"use client";

import { PriorityDot } from "./priority-dot";
import type { Task } from "@/types";
import { formatDate } from "@/lib/utils";
import { useT } from "@/hooks/useT";

interface TaskWithLabels extends Task {
  labels?: { label: { id: string; name: string; color: string } }[];
}

interface TaskRowProps {
  task: TaskWithLabels;
  onToggle?: (id: string) => void;
  onOpen?: (task: Task) => void;
  onDelete?: (id: string) => void;
  showWhen?: boolean;
  showDate?: boolean;
  showStatus?: boolean;
}

export function TaskRow({ task, onToggle, onOpen, onDelete, showWhen, showDate, showStatus }: TaskRowProps) {
  const { t } = useT();

  return (
    <div
      className={"list-row" + (task.isCompleted ? " is-done" : "")}
      onClick={() => onOpen && onOpen(task)}
    >
      <input
        type="checkbox"
        className="cb"
        checked={task.isCompleted}
        onChange={(e) => {
          e.stopPropagation();
          onToggle && onToggle(task.id);
        }}
        onClick={(e) => e.stopPropagation()}
        readOnly={!onToggle}
      />
      <PriorityDot level={task.priority} />
      <div className="flex1">
        <div
          className="task-title"
          style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text)" }}
        >
          {task.title}
        </div>
      </div>
      {task.category && (
        <span style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"1px 7px 1px 6px",borderRadius:5,fontSize:11,fontWeight:500,color:"var(--text-soft)",background:"var(--bg-subtle)",border:"1px solid var(--border)" }}>
          {task.category}
        </span>
      )}
      {task.labels?.map(tl => (
        <span key={tl.label.id} style={{
          display:"inline-flex",alignItems:"center",gap:4,padding:"1px 7px",borderRadius:20,fontSize:11,fontWeight:500,
          color: tl.label.color,
          background: `${tl.label.color}18`,
          border: `1px solid ${tl.label.color}44`,
          flexShrink: 0,
        }}>
          <div style={{ width:6,height:6,borderRadius:"50%",background:tl.label.color,flexShrink:0 }}/>
          {tl.label.name}
        </span>
      ))}
      {(showWhen || showDate) && task.date && (
        <span className="muted mono" style={{ fontSize: 12, minWidth: 64, textAlign: "right" }}>
          {showDate ? formatDate(task.date, { month: "short", day: "numeric" }) : task.date}
        </span>
      )}
      {task.time && (
        <span className="muted mono" style={{ fontSize: 12, minWidth: 44, textAlign: "right" }}>
          {task.time}
        </span>
      )}
      {showStatus && (
        task.isCompleted ? (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "1px 7px", borderRadius: 5, fontSize: 11, fontWeight: 500,
            color: "#16a34a",
            background: "rgba(34,197,94,0.12)",
            flexShrink: 0,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>
            {t("task_done_badge")}
          </span>
        ) : (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "1px 7px", borderRadius: 5, fontSize: 11, fontWeight: 500,
            color: "var(--text-muted)",
            background: "var(--bg-subtle)",
            flexShrink: 0,
          }}>
            {t("task_pending_badge")}
          </span>
        )
      )}
      {task.isPublic && (
        <span title="Public task" className="muted" style={{ display: "inline-flex" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="9" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 11a3 3 0 1 0 0-6M22 20a5 5 0 0 0-4.5-5"/>
          </svg>
        </span>
      )}
      {onDelete && (
        <button
          className="btn btn-ghost btn-sm btn-icon"
          style={{ opacity: 0, transition: "opacity 120ms", marginLeft: -4 }}
          onClick={e => { e.stopPropagation(); onDelete(task.id); }}
          title={t("task_delete_title")}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
        </button>
      )}
    </div>
  );
}
