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
// Silent token refresh on 401 from any protected route.
//
// WHAT CAUSED THE INFINITE LOOP:
//   Previous versions called `window.location.href = "/login"` on refresh
//   failure. This triggers a full browser page reload, which re-evaluates
//   this module and resets all state — including any "already failed" flag.
//   The next page load immediately fires GET /auth/me → 401 → tries refresh
//   → fails → reloads again → forever.
//
// THE FIX:
//   Do NOT navigate inside the interceptor. Just reject the error.
//   React Query propagates the 401 to useCurrentUser → user = null →
//   ProtectedRoute renders <Navigate to="/login"> (React Router soft nav,
//   no page reload, module state is preserved).
//
//   `refreshFailed` prevents concurrent/subsequent 401s from triggering
//   additional refresh attempts while we're already handling one failure.
//   It is reset on successful login via resetRefreshState().

type PendingEntry = {
  resolve: () => void;
  reject: (err: unknown) => void;
};

let isRefreshing = false;
let refreshFailed = false;
let pendingQueue: PendingEntry[] = [];

/** Reset after a successful login so the new session can refresh normally. */
export function resetRefreshState() {
  refreshFailed = false;
  isRefreshing = false;
  pendingQueue = [];
}

function drainQueue(error: unknown) {
  pendingQueue.forEach((e) => (error ? e.reject(error) : e.resolve()));
  pendingQueue = [];
}

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

    const shouldSkip =
      status !== 401 ||
      refreshFailed ||
      originalRequest._retry ||
      SKIP_REFRESH.some((path) => url.includes(path));

    if (shouldSkip) return Promise.reject(error);

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
      refreshFailed = true;
      drainQueue(refreshError);
      // Do NOT redirect here. Rejecting is enough:
      //   useCurrentUser → error → user=null → ProtectedRoute → <Navigate to="/login">
      // A hard redirect (window.location.href) would reload the page, reset
      // this module, and restart the loop from zero.
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
