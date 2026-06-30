import { z } from "zod";
import {
  APPLICATION_STATUS,
  JOB_TYPE,
  INTERVIEW_TYPE,
  INTERVIEW_RESULT,
  CURRENCIES,
  APPLICATION_TAGS,
} from "./application.constants.js";

const statusValues = Object.values(APPLICATION_STATUS);
const jobTypeValues = Object.values(JOB_TYPE);
const interviewTypeValues = Object.values(INTERVIEW_TYPE);
const interviewResultValues = Object.values(INTERVIEW_RESULT);

export const createApplicationSchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(120),
  role: z.string().trim().min(1, "Role is required").max(120),
  location: z.string().trim().max(120).optional().default(""),
  jobType: z.enum(jobTypeValues).optional().default(JOB_TYPE.INTERNSHIP),
  status: z.enum(statusValues).optional().default(APPLICATION_STATUS.WISHLIST),
  jobLink: z.string().trim().max(500).optional().default(""),
  appliedDate: z.coerce.date().optional().nullable(),
  deadline: z.coerce.date().optional().nullable(),
  resumeVersion: z.string().trim().max(80).optional().default(""),
  referral: z.boolean().optional().default(false),
  referralName: z.string().trim().max(80).optional().default(""),
  notes: z.string().max(5000).optional().default(""),
  tags: z.array(z.enum(APPLICATION_TAGS)).optional().default([]),
});

export const updateApplicationSchema = z.object({
  company: z.string().trim().min(1).max(120).optional(),
  role: z.string().trim().min(1).max(120).optional(),
  location: z.string().trim().max(120).optional(),
  jobType: z.enum(jobTypeValues).optional(),
  jobLink: z.string().trim().max(500).optional(),
  appliedDate: z.coerce.date().optional().nullable(),
  deadline: z.coerce.date().optional().nullable(),
  resumeVersion: z.string().trim().max(80).optional(),
  referral: z.boolean().optional(),
  referralName: z.string().trim().max(80).optional(),
  notes: z.string().max(5000).optional(),
  tags: z.array(z.enum(APPLICATION_TAGS)).optional(),
  oa: z
    .object({
      scheduledAt: z.coerce.date().optional().nullable(),
      platform: z.string().trim().max(80).optional(),
      duration: z.number().int().positive().optional().nullable(),
      notes: z.string().max(2000).optional(),
      completed: z.boolean().optional(),
    })
    .optional(),
  offer: z
    .object({
      ctc: z.number().nonnegative().optional().nullable(),
      stipend: z.number().nonnegative().optional().nullable(),
      currency: z.enum(CURRENCIES).optional(),
      joiningDate: z.coerce.date().optional().nullable(),
      deadline: z.coerce.date().optional().nullable(),
      accepted: z.boolean().optional(),
    })
    .optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(statusValues),
});

export const addInterviewSchema = z.object({
  round: z.number().int().positive(),
  type: z.enum(interviewTypeValues),
  scheduledAt: z.coerce.date().optional().nullable(),
  duration: z.number().int().positive().optional().nullable(),
  notes: z.string().max(2000).optional().default(""),
  result: z.enum(interviewResultValues).optional().default(INTERVIEW_RESULT.PENDING),
});

export const updateInterviewSchema = z.object({
  round: z.number().int().positive().optional(),
  type: z.enum(interviewTypeValues).optional(),
  scheduledAt: z.coerce.date().optional().nullable(),
  duration: z.number().int().positive().optional().nullable(),
  notes: z.string().max(2000).optional(),
  result: z.enum(interviewResultValues).optional(),
});
