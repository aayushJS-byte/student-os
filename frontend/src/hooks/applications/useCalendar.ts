import { useQuery } from "@tanstack/react-query";
import { ApplicationService } from "@/services/application.service";
import { APPLICATION_KEYS } from "./queryKeys";

export function useCalendar() {
  return useQuery({
    queryKey: APPLICATION_KEYS.calendar(),
    queryFn: async () => {
      const res = await ApplicationService.getCalendar();
      return res.data.data.events;
    },
    staleTime: 2 * 60 * 1000, // 2 min
  });
}
