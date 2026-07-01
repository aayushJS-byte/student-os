import { useQuery } from "@tanstack/react-query";
import { ApplicationService } from "@/services/application.service";
import { APPLICATION_KEYS } from "./queryKeys";

export function useApplicationStats() {
  return useQuery({
    queryKey: APPLICATION_KEYS.stats(),
    queryFn: async () => {
      const response = await ApplicationService.getStats();
      return response.data.data;
    },
    staleTime: 60 * 1000,
  });
}
