import { api } from "@/api/axios";
import type { CompanyInfo, Question, ProgressMap, ProgressStats, ProgressStatus } from "@/types/prep";

export const PrepService = {
  getCompanies: async (): Promise<CompanyInfo[]> => {
    const { data } = await api.get("/prep/companies");
    return data.data.companies;
  },

  getSections: async (company: string): Promise<string[]> => {
    const { data } = await api.get("/prep/sections", { params: { company } });
    return data.data.sections;
  },

  getQuestions: async (company: string, section?: string): Promise<Question[]> => {
    const { data } = await api.get("/prep/questions", {
      params: { company, ...(section ? { section } : {}) },
    });
    return data.data.questions;
  },

  getProgress: async (): Promise<ProgressMap> => {
    const { data } = await api.get("/prep/progress");
    return data.data.progress;
  },

  getProgressStats: async (): Promise<ProgressStats> => {
    const { data } = await api.get("/prep/progress/stats");
    return data.data.stats;
  },

  updateProgress: async (slug: string, status: ProgressStatus, notes?: string): Promise<void> => {
    await api.patch(`/prep/questions/${slug}/progress`, { status, notes });
  },
};
