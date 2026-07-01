import { useSearchParams } from "react-router-dom";
import type { ApplicationFilters } from "@/types/application";

export function useApplicationFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ApplicationFilters = {
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    jobType: searchParams.get("jobType") ?? undefined,
    sortBy: searchParams.get("sortBy") ?? "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc",
    page: Number(searchParams.get("page") ?? "1"),
  };

  const setFilter = (key: string, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        next.set("page", "1");
        return next;
      },
      { replace: true }
    );
  };

  const setPage = (page: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(page));
        return next;
      },
      { replace: true }
    );
  };

  const clearFilters = () => setSearchParams({}, { replace: true });

  const hasActiveFilters = !!(filters.search || filters.status || filters.jobType);

  return { filters, setFilter, setPage, clearFilters, hasActiveFilters };
}
