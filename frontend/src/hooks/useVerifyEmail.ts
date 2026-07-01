import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";

export function useVerifyEmail(token: string) {
  return useQuery({
    queryKey: ["verifyEmail", token],
    queryFn: async () => {
      const response = await AuthService.verifyEmail(token);
      return response.data;
    },
    enabled: !!token,
    // Email verification is a one-shot action — never re-fetch
    retry: false,
    staleTime: Infinity,
  });
}
