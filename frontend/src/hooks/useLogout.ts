import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth.service";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSettled: () => {
      // Clear entire cache regardless of whether logout API call succeeded
      queryClient.clear();
      navigate("/login");
    },
  });
}
