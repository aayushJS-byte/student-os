export const PREP_KEYS = {
  all: ["prep"] as const,
  companies: () => [...PREP_KEYS.all, "companies"] as const,
  sections: (company: string) => [...PREP_KEYS.all, "sections", company] as const,
  questions: (company: string, section?: string) =>
    [...PREP_KEYS.all, "questions", company, section ?? "all"] as const,
  progress: () => [...PREP_KEYS.all, "progress"] as const,
  progressStats: () => [...PREP_KEYS.all, "progressStats"] as const,
};
