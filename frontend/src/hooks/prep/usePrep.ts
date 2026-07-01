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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PREP_KEYS.progress() });
      queryClient.invalidateQueries({ queryKey: PREP_KEYS.progressStats() });
    },
  });
}
