import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicationService } from "@/services/application.service";
import { APPLICATION_KEYS } from "./queryKeys";
import type { ApplicationStatus } from "@/types/application";

export function useUpdateStatus(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: ApplicationStatus) =>
      ApplicationService.updateStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.detail(applicationId) });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.stats() });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.analytics() });
    },
  });
}
