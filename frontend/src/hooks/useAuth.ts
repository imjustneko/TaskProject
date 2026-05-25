"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/types";

interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post<AuthResponse>("/auth/login", data).then((r) => r.data),
    onSuccess: ({ user, access_token }) => {
      setAuth(user, access_token);
      router.push("/dashboard");
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      email: string;
      username: string;
      displayName: string;
      password: string;
    }) => api.post<AuthResponse>("/auth/register", data).then((r) => r.data),
    onSuccess: ({ user, access_token }) => {
      setAuth(user, access_token);
      router.push("/dashboard");
    },
  });
}

export function useOAuthMutation() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { provider: "google"; token: string } | { provider: "apple"; idToken: string; displayName: string }) => {
      if (data.provider === "google") {
        return api.post<AuthResponse>("/auth/google", { token: data.token }).then((r) => r.data);
      }
      return api.post<AuthResponse>("/auth/apple", { idToken: data.idToken, displayName: data.displayName }).then((r) => r.data);
    },
    onSuccess: ({ user, access_token }) => {
      setAuth(user, access_token);
      router.push("/dashboard");
    },
  });
}

export function useGoogleOAuth() {
  const oauthMutation = useOAuthMutation();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      oauthMutation.mutate({ provider: "google", token: tokenResponse.access_token });
    },
  });

  return { login, isPending: oauthMutation.isPending, error: oauthMutation.error };
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return () => {
    logout();
    router.push("/login");
  };
}
