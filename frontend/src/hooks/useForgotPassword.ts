import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import type { ForgotPasswordInput } from "@/types/auth";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordInput) => AuthService.forgotPassword(data),
  });
}
