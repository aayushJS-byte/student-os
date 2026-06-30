import { z } from "zod";
import {
  APPLICATION_STATUS,
  JOB_TYPE,
  INTERVIEW_TYPE,
  INTERVIEW_RESULT,
  CURRENCIES,
  APPLICATION_TAGS,
} from "./application.constants.js";

// ─── Primitives ───────────────────────────────────────────────────────────────
//
// Empty string from an unfilled <input type="date"> or <input type="number">
// must be treated as "not provided" — coercing "" to a Date gives Invalid Date.

/** Optional date: empty string or missing → undefined; valid string → Date */
const optionalDate = z.preprocess(
  (v) => (!v || v === "" ? undefined : v),
  z.coerce.date().optional()
);

/** Optional non-negative number: empty string or missing → undefined */
const optionalNonNegativeNum = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
  z.number().nonnegative().optional()
);

/** Optional positive integer: empty string or missing → undefined */
const optionalPositiveInt = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
  z.number().int().positive().optional()
);

// ─── Enums ───────────────────────────────────────────────────────────────────

const statusValues = Object.values(APPLICATION_STATUS);
const jobTypeValues = Object.values(JOB_TYPE);
const interviewTypeValues = Object.values(INTERVIEW_TYPE);
const interviewResultValues = Object.values(INTERVIEW_RESULT);

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const createApplicationSchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(120),
  role: z.string().trim().min(1, "Role is required").max(120),
  location: z.string().trim().max(120).optional().default(""),
  jobType: z.enum(jobTypeValues).optional().default(JOB_TYPE.INTERNSHIP),
  status: z.enum(statusValues).optional().default(APPLICATION_STATUS.WISHLIST),
  jobLink: z.string().trim().max(500).optional().default(""),
  appliedDate: optionalDate,
  deadline: optionalDate,
  resumeVersion: z.string().trim().max(80).optional().default(""),
  referral: z.boolean().optional().default(false),
  referralName: z.string().trim().max(80).optional().default(""),
  notes: z.string().max(5000).optional().default(""),
  tags: z.array(z.enum(APPLICATION_TAGS)).optional().default([]),
  oa: z
    .object({
      scheduledAt: optionalDate,
      platform: z.string().trim().max(80).optional().default(""),
      duration: optionalPositiveInt,
      notes: z.string().max(2000).optional().default(""),
      completed: z.boolean().optional().default(false),
    })
    .optional(),
  offer: z
    .object({
      ctc: optionalNonNegativeNum,
      stipend: optionalNonNegativeNum,
      currency: z.enum(CURRENCIES).optional().default("INR"),
      joiningDate: optionalDate,
      deadline: optionalDate,
      accepted: z.boolean().optional().default(false),
    })
    .optional(),
});

export const updateApplicationSchema = z.object({
  company: z.string().trim().min(1).max(120).optional(),
  role: z.string().trim().min(1).max(120).optional(),
  location: z.string().trim().max(120).optional(),
  jobType: z.enum(jobTypeValues).optional(),
  jobLink: z.string().trim().max(500).optional(),
  appliedDate: optionalDate,
  deadline: optionalDate,
  resumeVersion: z.string().trim().max(80).optional(),
  referral: z.boolean().optional(),
  referralName: z.string().trim().max(80).optional(),
  notes: z.string().max(5000).optional(),
  tags: z.array(z.enum(APPLICATION_TAGS)).optional(),
  oa: z
    .object({
      scheduledAt: optionalDate,
      platform: z.string().trim().max(80).optional(),
      duration: optionalPositiveInt,
      notes: z.string().max(2000).optional(),
      completed: z.boolean().optional(),
    })
    .optional(),
  offer: z
    .object({
      ctc: optionalNonNegativeNum,
      stipend: optionalNonNegativeNum,
      currency: z.enum(CURRENCIES).optional(),
      joiningDate: optionalDate,
      deadline: optionalDate,
      accepted: z.boolean().optional(),
    })
    .optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(statusValues),
});

export const addInterviewSchema = z.object({
  round: z.coerce.number().int().positive(),
  type: z.enum(interviewTypeValues),
  scheduledAt: optionalDate,
  duration: optionalPositiveInt,
  notes: z.string().max(2000).optional().default(""),
  result: z.enum(interviewResultValues).optional().default(INTERVIEW_RESULT.PENDING),
});

export const updateInterviewSchema = z.object({
  round: z.coerce.number().int().positive().optional(),
  type: z.enum(interviewTypeValues).optional(),
  scheduledAt: optionalDate,
  duration: optionalPositiveInt,
  notes: z.string().max(2000).optional(),
  result: z.enum(interviewResultValues).optional(),
});
