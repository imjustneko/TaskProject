import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  let token: string | null = (window as any).__authToken ?? null;

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

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];
let handlingLogout = false;

function doLogout() {
  if (handlingLogout) return;
  handlingLogout = true;
  useAuthStore.getState().logout();
  setTimeout(() => { handlingLogout = false; }, 2000);
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status !== 401 ||
      original._retry ||
      typeof window === "undefined"
    ) {
      return Promise.reject(error);
    }

    const store = useAuthStore.getState();
    const refreshToken = store.refreshToken;

    if (!refreshToken) {
      doLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((newToken: string) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(original));
        });
        // if refresh ultimately fails, reject will happen via the catch below
        void reject;
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<{ access_token: string; refresh_token: string }>(
        `${BASE_URL}/auth/refresh`,
        { refresh_token: refreshToken }
      );

      store.setAuth(store.user!, data.access_token, data.refresh_token);
      (window as any).__authToken = data.access_token;

      refreshQueue.forEach((cb) => cb(data.access_token));
      refreshQueue = [];

      original.headers.Authorization = `Bearer ${data.access_token}`;
      return api(original);
    } catch {
      refreshQueue = [];
      doLogout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
