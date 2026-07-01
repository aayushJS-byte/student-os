import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth.service";
import { resetRefreshState } from "@/api/axios";
import { CURRENT_USER_KEY } from "./useCurrentUser";
import type { LoginInput } from "@/types/auth";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginInput) => AuthService.login(data),
    onSuccess: async () => {
      // Re-enable refresh attempts for the new authenticated session
      resetRefreshState();
      await queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY });
      navigate("/dashboard");
    },
  });
}
