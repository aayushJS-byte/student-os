import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicationService } from "@/services/application.service";
import { APPLICATION_KEYS } from "./queryKeys";
import type { InterviewFormData } from "@/schemas/application.schemas";

export function useAddInterview(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InterviewFormData) =>
      ApplicationService.addInterview(applicationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.detail(applicationId) });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.calendar() });
    },
  });
}

export function useUpdateInterview(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      interviewId,
      data,
    }: {
      interviewId: string;
      data: Partial<InterviewFormData>;
    }) => ApplicationService.updateInterview(applicationId, interviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.detail(applicationId) });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.calendar() });
    },
  });
}

export function useDeleteInterview(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (interviewId: string) =>
      ApplicationService.deleteInterview(applicationId, interviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.detail(applicationId) });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.calendar() });
    },
  });
}
