import { api } from "@/api/axios";
import type { ApiResponse } from "@/types/api";
import type {
  Application,
  AnalyticsData,
  ApplicationFilters,
  ApplicationListResponse,
  ApplicationStats,
  OfferRecord,
} from "@/types/application";
import type { ApplicationFormData, InterviewFormData } from "@/schemas/application.schemas";

export const ApplicationService = {
  getApplications(params: ApplicationFilters = {}) {
    return api.get<ApiResponse<ApplicationListResponse>>("/applications", { params });
  },

  getApplication(id: string) {
    return api.get<ApiResponse<Application>>(`/applications/${id}`);
  },

  createApplication(data: ApplicationFormData) {
    return api.post<ApiResponse<Application>>("/applications", data);
  },

  updateApplication(id: string, data: Partial<ApplicationFormData>) {
    return api.put<ApiResponse<Application>>(`/applications/${id}`, data);
  },

  deleteApplication(id: string) {
    return api.delete<ApiResponse<null>>(`/applications/${id}`);
  },

  updateStatus(id: string, status: string) {
    return api.patch<ApiResponse<Application>>(`/applications/${id}/status`, { status });
  },

  addInterview(applicationId: string, data: InterviewFormData) {
    return api.post<ApiResponse<Application>>(
      `/applications/${applicationId}/interviews`,
      data
    );
  },

  updateInterview(applicationId: string, interviewId: string, data: Partial<InterviewFormData>) {
    return api.put<ApiResponse<Application>>(
      `/applications/${applicationId}/interviews/${interviewId}`,
      data
    );
  },

  deleteInterview(applicationId: string, interviewId: string) {
    return api.delete<ApiResponse<Application>>(
      `/applications/${applicationId}/interviews/${interviewId}`
    );
  },

  getStats() {
    return api.get<ApiResponse<ApplicationStats>>("/applications/stats/summary");
  },

  getOffers() {
    return api.get<ApiResponse<{ offers: OfferRecord[] }>>("/applications/offers");
  },

  getAnalytics() {
    return api.get<ApiResponse<AnalyticsData>>("/applications/analytics");
  },
};
