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
//
// Only attempts a silent refresh when the backend explicitly says the access
// token is expired ("Access token expired."). Every other 401 — no cookie,
// wrong password, already-logged-out — is passed straight through so React
// Query can handle it cleanly without causing a redirect loop.

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

// Routes that must never trigger a refresh attempt
const SKIP_REFRESH = [
  "/auth/refresh",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    const url = originalRequest?.url ?? "";
    const message = (error.response?.data as { message?: string })?.message;

    // Only refresh when the token was present but expired.
    // "Authentication required." means no token — refreshing won't help.
    const isExpiredToken = message === "Access token expired.";

    const shouldSkip =
      status !== 401 ||
      !isExpiredToken ||
      originalRequest._retry ||
      SKIP_REFRESH.some((path) => url.includes(path));

    if (shouldSkip) return Promise.reject(error);

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

      // Refresh token itself is expired — clear cache and send to login
      const { queryClient } = await import("@/utils/queryClient");
      queryClient.clear();
      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
