"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Label {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: string;
  _count?: { tasks: number };
}

export function useLabels() {
  return useQuery({
    queryKey: ["labels"],
    queryFn: () => api.get<Label[]>("/labels").then((r) => r.data),
  });
}

export function useCreateLabel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; color: string }) =>
      api.post<Label>("/labels", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["labels"] }),
  });
}

export function useUpdateLabel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name?: string; color?: string }) =>
      api.patch<Label>(`/labels/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["labels"] }),
  });
}

export function useDeleteLabel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/labels/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["labels"] }),
  });
}
