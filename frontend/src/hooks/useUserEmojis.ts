"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface UserEmoji {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  createdAt: string;
}

export function useUserEmojis() {
  return useQuery({
    queryKey: ["user-emojis"],
    queryFn: () => api.get<UserEmoji[]>("/users/me/emojis").then((r) => r.data),
  });
}

export function useAddUserEmoji() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, file }: { name: string; file: File }) => {
      const form = new FormData();
      form.append("file", file);
      form.append("name", name);
      return api.post<UserEmoji>("/users/me/emojis", form).then((r) => r.data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-emojis"] }),
  });
}

export function useDeleteUserEmoji() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/users/me/emojis/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-emojis"] }),
  });
}
