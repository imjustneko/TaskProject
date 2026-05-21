"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { User } from "@/types";

export interface PartnerData {
  pairId: string;
  partner: User;
  todayTotal: number;
  todayDone: number;
  streak: number;
}

export interface PartnerRequest {
  id: string;
  requesterId: string;
  partnerId: string;
  status: string;
  createdAt: string;
  requester: User;
}

export interface PairStatus {
  id: string;
  requesterId: string;
  partnerId: string;
  status: "PENDING" | "ACTIVE" | "DECLINED";
}

export function usePartners() {
  return useQuery({
    queryKey: ["partners"],
    queryFn: () => api.get<PartnerData[]>("/partners").then(r => r.data),
  });
}

export function usePartnerRequests() {
  return useQuery({
    queryKey: ["partners", "requests"],
    queryFn: () => api.get<PartnerRequest[]>("/partners/requests").then(r => r.data),
  });
}

export function usePairStatus(targetId: string) {
  return useQuery({
    queryKey: ["partners", "status", targetId],
    queryFn: () => api.get<PairStatus | null>(`/partners/status/${targetId}`).then(r => r.data),
    enabled: !!targetId,
  });
}

export function useSendPartnerRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.post(`/partners/request/${userId}`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partners"] });
    },
  });
}

export function useAcceptPartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pairId: string) => api.patch(`/partners/accept/${pairId}`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partners"] });
    },
  });
}

export function useDeclinePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pairId: string) => api.patch(`/partners/decline/${pairId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partners"] });
    },
  });
}

export function useRemovePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pairId: string) => api.delete(`/partners/${pairId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partners"] });
    },
  });
}
