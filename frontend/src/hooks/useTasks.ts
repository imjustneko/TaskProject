"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Task, Priority } from "@/types";

interface CreateTaskInput {
  title: string;
  description?: string;
  date?: string;
  time?: string;
  category?: string;
  priority?: Priority;
  isPublic?: boolean;
}

const keys = {
  today: ["tasks", "today"] as const,
  plans: ["tasks", "plans"] as const,
  history: ["tasks", "history"] as const,
  stats: ["tasks", "stats"] as const,
  detail: (id: string) => ["tasks", id] as const,
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

export function useToggleTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.patch<Task>(`/tasks/${id}/complete`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
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
