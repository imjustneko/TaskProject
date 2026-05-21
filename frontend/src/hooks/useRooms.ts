"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Room } from "@/types";

export interface RoomEmoji {
  id: string;
  roomId: string;
  name: string;
  imageUrl: string;
  addedById: string;
  createdAt: string;
}

export function useMyRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: () => api.get<Room[]>("/rooms").then(r => r.data),
  });
}

export function usePublicRooms() {
  return useQuery({
    queryKey: ["rooms", "public"],
    queryFn: () => api.get<Room[]>("/rooms/public").then(r => r.data),
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
    mutationFn: (data: { name: string; description?: string; activityType?: string; isPublic?: boolean }) =>
      api.post<Room>("/rooms", data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

export function useUpdateRoom(roomId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; description?: string; activityType?: string; isPublic?: boolean; imageUrl?: string | null }) =>
      api.patch<Room>(`/rooms/${roomId}`, data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rooms"] });
      qc.invalidateQueries({ queryKey: ["rooms", roomId] });
    },
  });
}

export function useJoinRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (roomId: string) => api.post(`/rooms/${roomId}/join`).then(r => r.data),
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

export function useInviteToRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, userId }: { roomId: string; userId: string }) =>
      api.post(`/rooms/${roomId}/invite/${userId}`).then(r => r.data),
    onSuccess: (_, { roomId }) => qc.invalidateQueries({ queryKey: ["rooms", roomId] }),
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

export function useSetRoomTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, taskId, status }: { roomId: string; taskId: string; status: "DONE" | "FAILED" | "SKIP" | "RESET" }) =>
      api.post(`/rooms/${roomId}/tasks/${taskId}/status`, { status }).then(r => r.data),
    onSuccess: (_, { roomId }) => qc.invalidateQueries({ queryKey: ["rooms", roomId] }),
  });
}

export function useToggleRoomTask() {
  return useSetRoomTaskStatus();
}

export function useRoomEmojis(roomId: string) {
  return useQuery({
    queryKey: ["rooms", roomId, "emojis"],
    queryFn: () => api.get<RoomEmoji[]>(`/rooms/${roomId}/emojis`).then(r => r.data),
    enabled: !!roomId,
  });
}

export function useAddRoomEmoji(roomId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, file }: { name: string; file: File }) => {
      const form = new FormData();
      form.append("file", file);
      form.append("name", name);
      return api.post<RoomEmoji>(`/rooms/${roomId}/emojis`, form).then(r => r.data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms", roomId, "emojis"] }),
  });
}

export function useDeleteRoomEmoji(roomId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (emojiId: string) => api.delete(`/rooms/${roomId}/emojis/${emojiId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rooms", roomId, "emojis"] }),
  });
}
