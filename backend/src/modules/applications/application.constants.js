export const APPLICATION_STATUS = Object.freeze({
  WISHLIST: "wishlist",
  APPLIED: "applied",
  OA: "oa",
  INTERVIEW: "interview",
  OFFER: "offer",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
  GHOSTED: "ghosted",
});

export const JOB_TYPE = Object.freeze({
  INTERNSHIP: "internship",
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
});

export const INTERVIEW_TYPE = Object.freeze({
  PHONE: "phone",
  TECHNICAL: "technical",
  HR: "hr",
  SYSTEM_DESIGN: "system_design",
  BEHAVIORAL: "behavioral",
  ONSITE: "onsite",
  GROUP: "group",
});

export const INTERVIEW_RESULT = Object.freeze({
  PENDING: "pending",
  PASSED: "passed",
  FAILED: "failed",
});

export const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED", "SGD"];

export const APPLICATION_TAGS = [
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
