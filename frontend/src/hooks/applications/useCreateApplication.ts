import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicationService } from "@/services/application.service";
import { APPLICATION_KEYS } from "./queryKeys";
import type { ApplicationFormData } from "@/schemas/application.schemas";

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApplicationFormData) => ApplicationService.createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.stats() });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.analytics() });
    },
  });
}
