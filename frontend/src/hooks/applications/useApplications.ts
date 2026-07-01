import { useQuery } from "@tanstack/react-query";
import { ApplicationService } from "@/services/application.service";
import { APPLICATION_KEYS } from "./queryKeys";
import type { ApplicationFilters } from "@/types/application";

export function useApplications(filters: ApplicationFilters = {}) {
  return useQuery({
    queryKey: APPLICATION_KEYS.list(filters),
    queryFn: async () => {
      const response = await ApplicationService.getApplications(filters);
      return response.data.data;
    },
    staleTime: 30 * 1000,
  });
}
