"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface FeedPost {
  id: string;
  userId: string;
  content?: string;
  imageUrl?: string;
  createdAt: string;
  likedByMe: boolean;
  likesCount: number;
  commentsCount: number;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    status?: { type: string; customText?: string; emoji?: string } | null;
  };
}

export interface FeedComment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; username: string; displayName: string; avatarUrl?: string };
}

export function useFeed() {
  return useQuery({
    queryKey: ["feed"],
    queryFn: () => api.get<FeedPost[]>("/posts/feed").then(r => r.data),
    refetchInterval: 15000,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { content?: string; imageUrl?: string }) =>
      api.post<FeedPost>("/posts", data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feed"] }),
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => api.delete(`/posts/${postId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feed"] }),
  });
}

export function useToggleLike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) =>
      api.post<{ liked: boolean }>(`/posts/${postId}/like`).then(r => r.data),
    onMutate: async (postId) => {
      await qc.cancelQueries({ queryKey: ["feed"] });
      const prev = qc.getQueryData<FeedPost[]>(["feed"]);
      qc.setQueryData<FeedPost[]>(["feed"], old =>
        old?.map(p => p.id === postId
          ? { ...p, likedByMe: !p.likedByMe, likesCount: p.likesCount + (p.likedByMe ? -1 : 1) }
          : p
        )
      );
      return { prev };
    },
    onError: (_, __, ctx) => qc.setQueryData(["feed"], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["feed"] }),
  });
}

export function usePostComments(postId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["posts", postId, "comments"],
    queryFn: () => api.get<FeedComment[]>(`/posts/${postId}/comments`).then(r => r.data),
    enabled,
  });
}

export function useAddComment(postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      api.post<FeedComment>(`/posts/${postId}/comments`, { content }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
      qc.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}
