"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Message } from "@/types";

export function useDMs(userId: string) {
  return useQuery({
    queryKey: ["messages", "dm", userId],
    queryFn: () => api.get<Message[]>(`/messages/dm/${userId}`).then(r => r.data.reverse()),
    enabled: !!userId,
    refetchInterval: 3000,
  });
}

export function useSendDM(recipientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      api.post<Message>(`/messages/dm/${recipientId}`, { content }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages", "dm", recipientId] }),
  });
}

export function useConversations() {
  return useQuery({
    queryKey: ["messages", "conversations"],
    queryFn: () => api.get<Message[]>("/messages/conversations").then(r => r.data),
    refetchInterval: 5000,
  });
}
