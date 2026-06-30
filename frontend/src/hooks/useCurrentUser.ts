import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { AuthService } from "@/services/auth.service";

export const CURRENT_USER_KEY = ["currentUser"] as const;

export function useCurrentUser() {
  const query = useQuery({
    queryKey: CURRENT_USER_KEY,
    queryFn: async () => {
      const response = await AuthService.me();
      return response.data.data;
    },
    // Never retry on 401 — unauthenticated is an expected state, not an error
    retry: (_count, error) => {
      if (isAxiosError(error) && error.response?.status === 401) return false;
      return true;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
  };
}
