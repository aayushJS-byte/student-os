import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Never retry on 4xx — those are definitive answers from the server.
      // Retrying on 401 specifically would re-enter the refresh interceptor
      // and create duplicate refresh attempts.
      retry: (failureCount, error) => {
        if (isAxiosError(error) && error.response && error.response.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});
