import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth.service";
import { CURRENT_USER_KEY } from "./useCurrentUser";
import type { LoginInput } from "@/types/auth";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginInput) => AuthService.login(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY });
      navigate("/dashboard");
    },
  });
}
