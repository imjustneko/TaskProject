"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Task, Priority } from "@/types";

export type LogStatus = "DONE" | "FAILED" | "SKIPPED";

export interface TaskLog {
  id: string;
  taskId: string;
  userId: string;
  date: string;
  status: LogStatus;
  note?: string;
  task: Task;
}

interface CreateTaskInput {
  title: string;
  description?: string;
  date?: string;
  time?: string;
  category?: string;
  priority?: Priority;
  isPublic?: boolean;
  labelIds?: string[];
}

const keys = {
  today: ["tasks", "today"] as const,
  plans: ["tasks", "plans"] as const,
  history: ["tasks", "history"] as const,
  stats: ["tasks", "stats"] as const,
  detail: (id: string) => ["tasks", id] as const,
  logsToday: ["tasks", "logs", "today"] as const,
  logsRange: (from: string, to: string) => ["tasks", "logs", from, to] as const,
};

export function useTodayTasks() {
  return useQuery({
    queryKey: keys.today,
    queryFn: () => api.get<Task[]>("/tasks/today").then((r) => r.data),
  });
}

export function usePlansTasks() {
  return useQuery({
    queryKey: keys.plans,
    queryFn: () => api.get<Task[]>("/tasks/plans").then((r) => r.data),
  });
}

export function useTaskHistory() {
  return useQuery({
    queryKey: keys.history,
    queryFn: () => api.get<Task[]>("/tasks/history").then((r) => r.data),
  });
}

export function useTaskStats() {
  return useQuery({
    queryKey: keys.stats,
    queryFn: () =>
      api
        .get<{ total: number; completed: number; today: number }>("/tasks/stats")
        .then((r) => r.data),
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskInput) =>
      api.post<Task>("/tasks", data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useToggleTask(onComplete?: (task: Task) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.patch<Task>(`/tasks/${id}/complete`).then((r) => r.data),
    onSuccess: (task) => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      if (task.isCompleted && onComplete) onComplete(task);
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<CreateTaskInput> & { id: string }) =>
      api.patch<Task>(`/tasks/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useTodayLogs() {
  return useQuery({
    queryKey: keys.logsToday,
    queryFn: () => api.get<TaskLog[]>("/tasks/logs/today").then((r) => r.data),
  });
}

export function useDailyLogs(from: string, to: string) {
  return useQuery({
    queryKey: keys.logsRange(from, to),
    queryFn: () => api.get<TaskLog[]>(`/tasks/logs/daily?from=${from}&to=${to}`).then((r) => r.data),
    enabled: !!from && !!to,
  });
}

export function useSetDailyStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, status, note }: { taskId: string; status: LogStatus; note?: string }) =>
      api.post<TaskLog>(`/tasks/${taskId}/log`, { status, note }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", "logs"] });
    },
  });
}

export function useStreak() {
  return useQuery({
    queryKey: ["tasks", "streak"],
    queryFn: () => api.get<{ current: number; best: number }>("/tasks/streak").then((r) => r.data),
  });
}

export function useClearDailyStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => api.delete(`/tasks/${taskId}/log`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", "logs"] });
    },
  });
}
