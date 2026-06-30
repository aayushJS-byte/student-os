import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth.service";
import type { ResetPasswordInput } from "@/types/auth";

export function useResetPassword(token: string) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordInput) =>
      AuthService.resetPassword(token, data),
    onSuccess: () => {
      navigate("/login", {
        state: { message: "Password reset successfully. You can now log in." },
      });
    },
  });
}
