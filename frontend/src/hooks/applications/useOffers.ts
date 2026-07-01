import { useQuery } from "@tanstack/react-query";
import { ApplicationService } from "@/services/application.service";
import { APPLICATION_KEYS } from "./queryKeys";

export function useOffers() {
  return useQuery({
    queryKey: APPLICATION_KEYS.offers(),
    queryFn: async () => {
      const response = await ApplicationService.getOffers();
      return response.data.data.offers;
    },
    staleTime: 30 * 1000,
  });
}
