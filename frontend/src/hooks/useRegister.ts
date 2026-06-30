import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth.service";
import type { RegisterInput } from "@/types/auth";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterInput) => AuthService.register(data),
    onSuccess: () => {
      // Redirect to login with a message to check email
      navigate("/login", {
        state: { message: "Account created! Please check your email to verify before logging in." },
      });
    },
  });
}
