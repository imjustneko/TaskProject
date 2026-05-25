"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      email: string;
      username: string;
      displayName: string;
      password: string;
    }) =>
      api
        .post<{ status: "verify_email"; email: string } | AuthResponse>("/auth/register", data)
        .then((r) => r.data),
    onSuccess: (data) => {
      if ("status" in data && data.status === "verify_email") {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      }
    },
  });
}

export function useVerifyEmail() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (token: string) =>
      api.post<AuthResponse>("/auth/verify-email", { token }).then((r) => r.data),
    onSuccess: ({ user, access_token }) => {
      setAuth(user, access_token);
      router.push("/dashboard");
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) =>
      api.post("/auth/resend-verification", { email }).then((r) => r.data),
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

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return () => {
    logout();
    router.push("/login");
  };
}
