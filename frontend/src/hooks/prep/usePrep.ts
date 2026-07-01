import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PrepService } from "@/services/prep.service";
import { PREP_KEYS } from "./queryKeys";
import type { ProgressStatus } from "@/types/prep";

export function useCompanies() {
  return useQuery({
    queryKey: PREP_KEYS.companies(),
    queryFn: PrepService.getCompanies,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSections(company: string) {
  return useQuery({
    queryKey: PREP_KEYS.sections(company),
    queryFn: () => PrepService.getSections(company),
    enabled: !!company,
    staleTime: 10 * 60 * 1000,
  });
}

export function useQuestions(company: string, section?: string) {
  return useQuery({
    queryKey: PREP_KEYS.questions(company, section),
    queryFn: () => PrepService.getQuestions(company, section),
    enabled: !!company,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProgress() {
  return useQuery({
    queryKey: PREP_KEYS.progress(),
    queryFn: PrepService.getProgress,
    staleTime: 2 * 60 * 1000,
  });
}

export function useProgressStats() {
  return useQuery({
    queryKey: PREP_KEYS.progressStats(),
    queryFn: PrepService.getProgressStats,
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, status, notes }: { slug: string; status: ProgressStatus; notes?: string }) =>
      PrepService.updateProgress(slug, status, notes),
    onMutate: async ({ slug, status }) => {
      await queryClient.cancelQueries({ queryKey: PREP_KEYS.progress() });
      const previous = queryClient.getQueryData(PREP_KEYS.progress());
      queryClient.setQueryData(PREP_KEYS.progress(), (old: Record<string, { status: ProgressStatus }> = {}) => {
        if (status === "todo") {
          const { [slug]: _, ...rest } = old;
          return rest;
        }
        return { ...old, [slug]: { status, solvedAt: status === "solved" ? new Date().toISOString() : null } };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(PREP_KEYS.progress(), context.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PREP_KEYS.progressStats() });
    },
  });
}
