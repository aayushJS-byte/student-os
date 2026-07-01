import { z } from "zod";

const STATUS_VALUES = [
  "wishlist", "applied", "oa", "interview", "offer",
  "accepted", "rejected", "withdrawn", "ghosted",
] as const;

const SOURCE_VALUES = [
  "linkedin", "naukri", "company_site", "campus",
  "referral", "internshala", "wellfound", "other",
] as const;

const JOB_TYPE_VALUES = ["internship", "full-time", "part-time", "contract"] as const;

const INTERVIEW_TYPE_VALUES = [
  "phone", "technical", "hr", "system_design", "behavioral", "onsite", "group",
] as const;

const INTERVIEW_RESULT_VALUES = ["pending", "passed", "failed"] as const;

const CURRENCY_VALUES = ["INR", "USD", "EUR", "GBP", "AED", "SGD"] as const;

const APPLICATION_TAG_VALUES = [
  "dream", "target", "safety", "reach", "on-campus", "off-campus",
  "ppo", "referral", "startup", "product", "service", "return-offer",
] as const;

export const applicationSchema = z.object({
  company: z.string().trim().min(1, "Company is required"),
  role: z.string().trim().min(1, "Role is required"),
  location: z.string().trim().default(""),
  jobType: z.enum(JOB_TYPE_VALUES).default("internship"),
  status: z.enum(STATUS_VALUES).default("wishlist"),
  jobLink: z.string().trim().default(""),
  salaryRange: z.string().trim().default(""),
  source: z.enum(SOURCE_VALUES).optional().nullable(),
  appliedDate: z.string().optional(),
  deadline: z.string().optional(),
  resumeVersion: z.string().trim().default(""),
  referral: z.boolean().default(false),
  referralName: z.string().trim().default(""),
  notes: z.string().default(""),
  outcomeReason: z.string().trim().default(""),
  tags: z.array(z.enum(APPLICATION_TAG_VALUES)).default([]),
  oa: z
    .object({
      scheduledAt: z.string().optional(),
      platform: z.string().trim().default(""),
      duration: z.coerce.number().int().positive().optional().nullable(),
      notes: z.string().default(""),
      completed: z.boolean().default(false),
    })
    .optional(),
  offer: z
    .object({
      ctc: z.coerce.number().nonnegative().optional().nullable(),
      stipend: z.coerce.number().nonnegative().optional().nullable(),
      currency: z.enum(CURRENCY_VALUES).default("INR"),
      joiningDate: z.string().optional(),
      deadline: z.string().optional(),
      accepted: z.boolean().default(false),
      documentLink: z.string().trim().max(500).optional(),
    })
    .optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(STATUS_VALUES),
});

export const interviewSchema = z.object({
  round: z.coerce.number().int().positive("Round must be a positive number"),
  type: z.enum(INTERVIEW_TYPE_VALUES, { error: "Select an interview type" }),
  scheduledAt: z.string().optional(),
  duration: z.coerce.number().int().positive().optional().nullable(),
  notes: z.string().default(""),
  result: z.enum(INTERVIEW_RESULT_VALUES).default("pending"),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
export type InterviewFormData = z.infer<typeof interviewSchema>;
