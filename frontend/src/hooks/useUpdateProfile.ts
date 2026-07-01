import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/user.service";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string }) => UserService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] as const });
    },
  });
}
