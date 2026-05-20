import { PriorityDot } from "./priority-dot";
import type { Task } from "@/types";

interface TaskRowProps {
  task: Task;
  onToggle?: (id: string) => void;
  onOpen?: (task: Task) => void;
  showWhen?: boolean;
}

export function TaskRow({ task, onToggle, onOpen, showWhen }: TaskRowProps) {
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
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "1px 7px 1px 6px",
            borderRadius: 5,
            fontSize: 11,
            fontWeight: 500,
            color: "var(--text-soft)",
            background: "var(--bg-subtle)",
            border: "1px solid var(--border)",
          }}
        >
          {task.category}
        </span>
      )}
      {showWhen && task.date && (
        <span className="muted mono" style={{ fontSize: 12, minWidth: 64, textAlign: "right" }}>
          {task.date}
        </span>
      )}
      {task.time && (
        <span className="muted mono" style={{ fontSize: 12, minWidth: 44, textAlign: "right" }}>
          {task.time}
        </span>
      )}
      {task.isPublic && (
        <span title="Public task" className="muted" style={{ display: "inline-flex" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="9" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 11a3 3 0 1 0 0-6M22 20a5 5 0 0 0-4.5-5"/>
          </svg>
        </span>
      )}
    </div>
  );
}
