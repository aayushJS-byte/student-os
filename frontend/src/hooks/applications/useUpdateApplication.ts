import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicationService } from "@/services/application.service";
import { APPLICATION_KEYS } from "./queryKeys";
import type { ApplicationFormData } from "@/schemas/application.schemas";

export function useUpdateApplication(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ApplicationFormData>) =>
      ApplicationService.updateApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.analytics() });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.calendar() });
    },
  });
}
