"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTodayTasks, useCreateTask, useToggleTask, useDeleteTask } from "@/hooks/useTasks";
import { PRIORITY_META } from "@/types";
import { Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1, "Гарчиг оруулна уу"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  category: z.string().optional(),
  time: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function TodayTasksPage() {
  const { data: tasks = [], isLoading } = useTodayTasks();
  const createTask = useCreateTask();
  const toggle = useToggleTask();
  const remove = useDeleteTask();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: "MEDIUM" },
  });

  const onSubmit = (data: FormData) => {
    createTask.mutate(data, {
      onSuccess: () => { reset(); setShowForm(false); },
    });
  };

  const filtered = tasks.filter((t) => {
    if (filter === "pending") return !t.isCompleted;
    if (filter === "done") return t.isCompleted;
    return true;
  });

  const completed = tasks.filter((t) => t.isCompleted).length;
  const pct = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-base dark:text-text-base-dark">Өнөөдөр</h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark mt-0.5">
            {new Date().toLocaleDateString("mn-MN", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="h-10 px-4 rounded-input bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Нэмэх
        </button>
      </div>

      {/* Progress */}
      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-5 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-base dark:text-text-base-dark">Ахиц</span>
          <span className="text-sm text-text-muted dark:text-text-muted-dark">{completed}/{tasks.length} дууслаа · {pct}%</span>
        </div>
        <div className="h-2.5 bg-surface-2 dark:bg-surface-dark-2 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-surface dark:bg-surface-dark border border-primary-200 dark:border-primary-700 rounded-card p-5 shadow-md mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-base dark:text-text-base-dark">Шинэ даалгавар</h3>
            <button onClick={() => { setShowForm(false); reset(); }} className="text-text-muted dark:text-text-muted-dark hover:text-text-base dark:hover:text-text-base-dark">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <input
                {...register("title")}
                placeholder="Даалгаврын гарчиг..."
                autoFocus
                className="h-10 w-full rounded-input border border-border dark:border-border-dark bg-surface-2 dark:bg-surface-dark-2 px-3 text-sm text-text-base dark:text-text-base-dark placeholder:text-text-subtle dark:placeholder:text-text-subtle-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.title && <p className="text-xs text-error-500 mt-1">{errors.title.message}</p>}
            </div>
            <input
              {...register("description")}
              placeholder="Тайлбар (заавал биш)..."
              className="h-10 w-full rounded-input border border-border dark:border-border-dark bg-surface-2 dark:bg-surface-dark-2 px-3 text-sm text-text-base dark:text-text-base-dark placeholder:text-text-subtle dark:placeholder:text-text-subtle-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex gap-3">
              <select
                {...register("priority")}
                className="h-10 flex-1 rounded-input border border-border dark:border-border-dark bg-surface-2 dark:bg-surface-dark-2 px-3 text-sm text-text-base dark:text-text-base-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="LOW">🟢 Бага</option>
                <option value="MEDIUM">🟡 Дунд</option>
                <option value="HIGH">🔴 Өндөр</option>
                <option value="URGENT">🚨 Яаралтай</option>
              </select>
              <input
                {...register("time")}
                type="time"
                className="h-10 rounded-input border border-border dark:border-border-dark bg-surface-2 dark:bg-surface-dark-2 px-3 text-sm text-text-base dark:text-text-base-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setShowForm(false); reset(); }} className="h-9 px-4 rounded-input border border-border dark:border-border-dark text-sm text-text-base dark:text-text-base-dark hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors">
                Цуцлах
              </button>
              <button type="submit" disabled={createTask.isPending} className="h-9 px-4 rounded-input bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-60">
                {createTask.isPending ? "Хадгалж байна..." : "Нэмэх"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-1 p-1 bg-surface-2 dark:bg-surface-dark-2 rounded-card w-fit mb-4">
        {(["all", "pending", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-input transition-colors font-medium",
              filter === f
                ? "bg-surface dark:bg-surface-dark shadow-sm text-text-base dark:text-text-base-dark"
                : "text-text-muted dark:text-text-muted-dark hover:text-text-base dark:hover:text-text-base-dark"
            )}
          >
            {f === "all" ? "Бүгд" : f === "pending" ? "Хүлээгдэж байна" : "Дууссан"}
          </button>
        ))}
      </div>

      {/* Task list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-surface-2 dark:bg-surface-dark-2 rounded-card animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-12 shadow-sm text-center">
          <p className="text-4xl mb-3">✅</p>
          <h3 className="font-semibold text-text-base dark:text-text-base-dark mb-1">Даалгавар байхгүй</h3>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">Шинэ даалгавар нэмэх товч дарна уу.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((task) => (
            <div
              key={task.id}
              className={cn(
                "group flex items-center gap-3 p-4 rounded-card border shadow-sm transition-all",
                task.isCompleted
                  ? "border-border dark:border-border-dark bg-surface-2/50 dark:bg-surface-dark-2/50"
                  : "border-border dark:border-border-dark bg-surface dark:bg-surface-dark hover:border-primary-200 dark:hover:border-primary-700"
              )}
            >
              <button
                onClick={() => toggle.mutate(task.id)}
                className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  task.isCompleted
                    ? "bg-primary-500 border-primary-500"
                    : "border-border dark:border-border-dark hover:border-primary-500"
                )}
              >
                {task.isCompleted && (
                  <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium truncate", task.isCompleted ? "line-through text-text-muted dark:text-text-muted-dark" : "text-text-base dark:text-text-base-dark")}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-text-muted dark:text-text-muted-dark truncate mt-0.5">{task.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {task.time && (
                  <span className="text-xs text-text-muted dark:text-text-muted-dark">{task.time}</span>
                )}
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", PRIORITY_META[task.priority].bg, PRIORITY_META[task.priority].color)}>
                  {PRIORITY_META[task.priority].label}
                </span>
                <button
                  onClick={() => remove.mutate(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-text-subtle dark:text-text-subtle-dark hover:text-error-500 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
