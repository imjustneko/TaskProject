"use client";

import { useTodayTasks, useToggleTask, useTaskStats } from "@/hooks/useTasks";
import { useFriends } from "@/hooks/useFriends";
import { useAuthStore } from "@/stores/authStore";
import { STATUS_META, PRIORITY_META } from "@/types";
import { CheckSquare, Plus, Flame } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Өглөөний мэнд";
  if (h < 18) return "Өдрийн мэнд";
  return "Оройн мэнд";
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: tasks = [], isLoading: tasksLoading } = useTodayTasks();
  const { data: stats } = useTaskStats();
  const { data: friends = [] } = useFriends();
  const toggle = useToggleTask();

  const completed = tasks.filter((t) => t.isCompleted).length;
  const total = tasks.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-base dark:text-text-base-dark">
            {greeting()}, {user?.displayName?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark mt-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long", month: "long", day: "numeric",
            })}
          </p>
        </div>
        <Link
          href="/tasks/today"
          className="h-10 px-4 rounded-input bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Даалгавар нэмэх
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Today tasks */}
          <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-text-base dark:text-text-base-dark flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary-500" />
                Өнөөдрийн даалгавар
              </h2>
              <span className="text-sm text-text-muted dark:text-text-muted-dark">
                {completed}/{total}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-surface-2 dark:bg-surface-dark-2 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>

            {tasksLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-surface-2 dark:bg-surface-dark-2 rounded-input animate-pulse" />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-muted dark:text-text-muted-dark text-sm">
                  Өнөөдрийн даалгавар байхгүй байна.
                </p>
                <Link href="/tasks/today" className="text-primary-500 text-sm hover:underline mt-1 inline-block">
                  + Даалгавар нэмэх
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-input border transition-colors",
                      task.isCompleted
                        ? "border-border dark:border-border-dark bg-surface-2/50 dark:bg-surface-dark-2/50"
                        : "border-border dark:border-border-dark hover:border-primary-200 dark:hover:border-primary-700"
                    )}
                  >
                    <button
                      onClick={() => toggle.mutate(task.id)}
                      className={cn(
                        "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                        task.isCompleted
                          ? "bg-primary-500 border-primary-500"
                          : "border-border dark:border-border-dark hover:border-primary-400"
                      )}
                    >
                      {task.isCompleted && (
                        <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    <span
                      className={cn(
                        "text-sm flex-1 min-w-0 truncate",
                        task.isCompleted
                          ? "line-through text-text-muted dark:text-text-muted-dark"
                          : "text-text-base dark:text-text-base-dark"
                      )}
                    >
                      {task.title}
                    </span>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", PRIORITY_META[task.priority].bg, PRIORITY_META[task.priority].color)}>
                      {PRIORITY_META[task.priority].label}
                    </span>
                  </div>
                ))}
                {tasks.length > 5 && (
                  <Link href="/tasks/today" className="text-sm text-primary-500 hover:underline block text-center pt-1">
                    +{tasks.length - 5} даалгавар харах
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Нийт", value: stats.total, icon: "📋" },
                { label: "Дууссан", value: stats.completed, icon: "✅" },
                { label: "Өнөөдөр", value: stats.today, icon: "📅" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-4 shadow-sm text-center">
                  <p className="text-2xl mb-1">{icon}</p>
                  <p className="text-xl font-bold text-primary-500">{value}</p>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Streak */}
          <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-warning-500" />
              <h2 className="font-semibold text-text-base dark:text-text-base-dark">Streak</h2>
            </div>
            <p className="text-3xl font-bold text-warning-500">0 <span className="text-base font-normal text-text-muted dark:text-text-muted-dark">хоног</span></p>
          </div>

          {/* Friends */}
          <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-text-base dark:text-text-base-dark">Найзууд</h2>
              <Link href="/friends" className="text-xs text-primary-500 hover:underline">Бүгд</Link>
            </div>
            {friends.length === 0 ? (
              <p className="text-sm text-text-muted dark:text-text-muted-dark text-center py-4">
                Найз нэмээгүй байна
              </p>
            ) : (
              <div className="space-y-2">
                {friends.slice(0, 5).map((friend) => (
                  <div key={friend.id} className="flex items-center gap-3">
                    <Avatar name={friend.displayName} src={friend.avatarUrl} size="sm" status={friend.status?.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-base dark:text-text-base-dark truncate">
                        {friend.displayName}
                      </p>
                      {friend.status && (
                        <p className="text-xs text-text-muted dark:text-text-muted-dark">
                          {STATUS_META[friend.status.type].emoji}{" "}
                          {friend.status.customText ?? STATUS_META[friend.status.type].label}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
