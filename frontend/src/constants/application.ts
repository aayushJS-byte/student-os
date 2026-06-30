import type {
  ApplicationStatus,
  ApplicationSource,
  JobType,
  InterviewType,
  InterviewResult,
  Currency,
  ApplicationTag,
} from "@/types/application";

export const APPLICATION_STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  wishlist: {
    label: "Saved",
    className: "text-zinc-400 bg-zinc-800 border-zinc-700",
  },
  applied: {
    label: "Applied",
    className: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  oa: {
    label: "OA",
    className: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  },
  interview: {
    label: "Interview",
    className: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  offer: {
    label: "Offer",
    className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  accepted: {
    label: "Accepted",
    className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  rejected: {
    label: "Rejected",
    className: "text-red-400 bg-red-500/10 border-red-500/20",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "text-zinc-400 bg-zinc-800 border-zinc-700",
  },
  ghosted: {
    label: "Ghosted",
    className: "text-zinc-500 bg-zinc-800/50 border-zinc-700/50",
  },
};

export const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "wishlist", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "oa", label: "OA" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
  { value: "ghosted", label: "Ghosted" },
];

// Allowed statuses when CREATING an application (no terminal outcomes)
export const CREATION_STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "wishlist", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "oa", label: "OA" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
];

// Forward-only transitions — cannot go back to a previous checkpoint
export const ALLOWED_NEXT_STATUSES: Record<ApplicationStatus, ApplicationStatus[]> = {
  wishlist: ["applied"],
  applied: ["oa", "interview", "accepted", "rejected", "withdrawn", "ghosted"],
  oa: ["interview", "accepted", "rejected", "withdrawn", "ghosted"],
  interview: ["accepted", "rejected", "withdrawn", "ghosted"],
  offer: ["accepted", "rejected", "withdrawn", "ghosted"],
  accepted: [],
  rejected: [],
  withdrawn: [],
  ghosted: [],
};

// Status rank for progressive form gating (higher = more advanced stage)
export const STATUS_RANK: Record<ApplicationStatus, number> = {
  wishlist: 0,
  applied: 1,
  oa: 2,
  interview: 3,
  offer: 4,
  accepted: 4,
  rejected: 4,
  withdrawn: 4,
  ghosted: 4,
};

export const JOB_TYPE_OPTIONS: { value: JobType; label: string }[] = [
  { value: "internship", label: "Internship" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
];

export const INTERVIEW_TYPE_OPTIONS: { value: InterviewType; label: string }[] = [
  { value: "technical", label: "Technical" },
  { value: "hr", label: "HR" },
  { value: "behavioral", label: "Behavioral" },
  { value: "system_design", label: "System Design" },
  { value: "phone", label: "Phone Screen" },
  { value: "onsite", label: "Onsite" },
  { value: "group", label: "Group" },
];

export const INTERVIEW_RESULT_OPTIONS: { value: InterviewResult; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "passed", label: "Passed" },
  { value: "failed", label: "Failed" },
];

export const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: "INR", label: "INR ₹" },
  { value: "USD", label: "USD $" },
  { value: "EUR", label: "EUR €" },
  { value: "GBP", label: "GBP £" },
  { value: "AED", label: "AED د.إ" },
  { value: "SGD", label: "SGD S$" },
];

export const SOURCE_OPTIONS: { value: ApplicationSource; label: string }[] = [
  { value: "linkedin",     label: "LinkedIn" },
  { value: "naukri",       label: "Naukri" },
  { value: "campus",       label: "Campus (CDC / On-campus)" },
  { value: "company_site", label: "Company Website" },
  { value: "referral",     label: "Referral" },
  { value: "internshala",  label: "Internshala" },
  { value: "wellfound",    label: "Wellfound / AngelList" },
  { value: "other",        label: "Other" },
];

export const APPLICATION_TAGS: ApplicationTag[] = [
  "dream",
  "target",
  "safety",
  "reach",
  "on-campus",
  "off-campus",
  "ppo",
  "referral",
  "startup",
  "product",
  "service",
  "return-offer",
];
