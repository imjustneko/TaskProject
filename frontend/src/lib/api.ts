import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  // window.__authToken is set by authStore.setAuth (works across module instances)
  let token: string | null = (window as any).__authToken ?? null;

  // On page refresh __authToken won't be set yet — fall back to localStorage
  if (!token) {
    try {
      const raw = localStorage.getItem("taskyy-auth");
      token = JSON.parse(raw ?? "null")?.state?.token ?? null;
      if (token) (window as any).__authToken = token;
    } catch {}
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let handlingLogout = false;

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !handlingLogout
    ) {
      handlingLogout = true;
      useAuthStore.getState().logout();
      // Let (app)/layout.tsx useEffect handle the soft redirect
      setTimeout(() => { handlingLogout = false; }, 2000);
    }
    return Promise.reject(error);
  }
);

export default api;
