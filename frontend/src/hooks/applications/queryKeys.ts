import type { ApplicationFilters } from "@/types/application";

export const APPLICATION_KEYS = {
  all: ["applications"] as const,
  lists: () => [...APPLICATION_KEYS.all, "list"] as const,
  list: (filters: ApplicationFilters) => [...APPLICATION_KEYS.lists(), filters] as const,
  details: () => [...APPLICATION_KEYS.all, "detail"] as const,
  detail: (id: string) => [...APPLICATION_KEYS.details(), id] as const,
  stats: () => [...APPLICATION_KEYS.all, "stats"] as const,
  offers: () => [...APPLICATION_KEYS.all, "offers"] as const,
  analytics: () => [...APPLICATION_KEYS.all, "analytics"] as const,
};
