import axios, { type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";

export const api = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Refresh Token Interceptor ────────────────────────────────────────────────
// On 401: attempt a silent token refresh then replay the original request.
// If the refresh itself fails, clear cache and redirect to /login.
// Auth-route 401s are passed through immediately — no refresh loop.

type PendingEntry = {
  resolve: () => void;
  reject: (err: unknown) => void;
};

let isRefreshing = false;
let pendingQueue: PendingEntry[] = [];

function drainQueue(error: unknown) {
  pendingQueue.forEach((entry) =>
    error ? entry.reject(error) : entry.resolve()
  );
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    const url = originalRequest?.url ?? "";

    // Never try to refresh on auth-route failures — avoids infinite loops
    if (status !== 401 || url.includes("/auth/")) {
      return Promise.reject(error);
    }

    // Queue concurrent 401s while a refresh is already in flight
    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post("/auth/refresh");
      drainQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      drainQueue(refreshError);

      // Lazy-import to avoid a circular dep at module load time
      const { queryClient } = await import("@/utils/queryClient");
      queryClient.clear();
      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
