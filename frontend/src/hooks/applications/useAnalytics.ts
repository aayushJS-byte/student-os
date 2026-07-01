import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { APPLICATION_KEYS } from "./queryKeys";
import { ApplicationService } from "@/services/application.service";

export function useAnalytics() {
  return useQuery({
    queryKey: APPLICATION_KEYS.analytics(),
    queryFn: async () => {
      const response = await ApplicationService.getAnalytics();
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
