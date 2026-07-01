import { useMutation } from "@tanstack/react-query";
import { UserService } from "@/services/user.service";

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      UserService.changePassword(data),
  });
}
