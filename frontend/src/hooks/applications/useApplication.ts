import { useQuery } from "@tanstack/react-query";
import { ApplicationService } from "@/services/application.service";
import { APPLICATION_KEYS } from "./queryKeys";

export function useApplication(id: string) {
  return useQuery({
    queryKey: APPLICATION_KEYS.detail(id),
    queryFn: async () => {
      const response = await ApplicationService.getApplication(id);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}
