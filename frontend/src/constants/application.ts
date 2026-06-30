import type {
  ApplicationStatus,
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
    label: "Wishlist",
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
  { value: "wishlist", label: "Wishlist" },
  { value: "applied", label: "Applied" },
  { value: "oa", label: "OA" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
  { value: "ghosted", label: "Ghosted" },
];

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
