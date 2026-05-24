import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (partial: Partial<User>) => void;
  logout: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setAuth: (user, token) => {
        console.log("[Auth] setAuth called, token:", token ? token.slice(0, 30) + "..." : "NULL");
        if (typeof window !== "undefined") (window as any).__authToken = token;
        set({ user, token, isAuthenticated: true });
      },
      updateUser: (partial) =>
        set((s) => ({ user: s.user ? { ...s.user, ...partial } : null })),
      logout: () => {
        if (typeof window !== "undefined") (window as any).__authToken = null;
        set({ user: null, token: null, isAuthenticated: false });
      },
      setHasHydrated: (v) => set({ _hasHydrated: v }),
    }),
    {
      name: "taskyy-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
