import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicationService } from "@/services/application.service";
import { APPLICATION_KEYS } from "./queryKeys";

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ApplicationService.deleteApplication(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: APPLICATION_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.stats() });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.analytics() });
    },
  });
}
