"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  completedTasks: number;
  totalRooms: number;
}

interface AdminUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  _count: { tasks: number };
}

interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => api.get<AdminStats>("/admin/stats").then(r => r.data),
  });
}

export function useAdminUsers(search?: string, page = 1) {
  return useQuery({
    queryKey: ["admin", "users", search, page],
    queryFn: () =>
      api.get<AdminUsersResponse>(`/admin/users?${search ? `search=${encodeURIComponent(search)}&` : ""}page=${page}`).then(r => r.data),
  });
}

export function useAdminRecentUsers() {
  return useQuery({
    queryKey: ["admin", "users", "recent"],
    queryFn: () => api.get<AdminUser[]>("/admin/users/recent").then(r => r.data),
  });
}

export function useBlockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.patch(`/admin/users/${userId}/block`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useUnblockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.patch(`/admin/users/${userId}/unblock`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useDeleteAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.delete(`/admin/users/${userId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}
