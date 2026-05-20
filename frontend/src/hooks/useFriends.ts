"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { User, Friend } from "@/types";

export function useFriends() {
  return useQuery({
    queryKey: ["friends"],
    queryFn: () => api.get<User[]>("/friends").then((r) => r.data),
  });
}

export function useIncomingRequests() {
  return useQuery({
    queryKey: ["friends", "requests", "incoming"],
    queryFn: () => api.get<Friend[]>("/friends/requests/incoming").then((r) => r.data),
  });
}

export function useSentRequests() {
  return useQuery({
    queryKey: ["friends", "requests", "sent"],
    queryFn: () => api.get<Friend[]>("/friends/requests/sent").then((r) => r.data),
  });
}

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: () =>
      api.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`).then((r) => r.data),
    enabled: query.length >= 2,
  });
}

export function useSendFriendRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (targetId: string) =>
      api.post(`/friends/request/${targetId}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["friends"] }),
  });
}

export function useAcceptRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) =>
      api.patch(`/friends/accept/${requestId}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["friends"] }),
  });
}

export function useDeclineRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => api.patch(`/friends/decline/${requestId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["friends"] }),
  });
}

export function useUnfriend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (friendId: string) => api.delete(`/friends/${friendId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["friends"] }),
  });
}
