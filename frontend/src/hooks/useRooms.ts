"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Room } from "@/types";

export function useMyRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: () => api.get<Room[]>("/rooms").then(r => r.data),
  });
}

export function useRoom(id: string) {
  return useQuery({
    queryKey: ["rooms", id],
    queryFn: () => api.get<Room>(`/rooms/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string; activityType?: string }) =>
      api.post<Room>("/rooms", data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useLeaveRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (roomId: string) => api.delete(`/rooms/${roomId}/leave`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useAddRoomTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, title }: { roomId: string; title: string }) =>
      api.post(`/rooms/${roomId}/tasks`, { title }).then(r => r.data),
    onSuccess: (_, { roomId }) => qc.invalidateQueries({ queryKey: ["rooms", roomId] }),
  });
}

export function useToggleRoomTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, taskId }: { roomId: string; taskId: string }) =>
      api.post(`/rooms/${roomId}/tasks/${taskId}/complete`).then(r => r.data),
    onSuccess: (_, { roomId }) => qc.invalidateQueries({ queryKey: ["rooms", roomId] }),
  });
}

export function useInviteToRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, userId }: { roomId: string; userId: string }) =>
      api.post(`/rooms/${roomId}/invite/${userId}`).then(r => r.data),
    onSuccess: (_, { roomId }) => qc.invalidateQueries({ queryKey: ["rooms", roomId] }),
  });
}
