export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "oa"
  | "interview"
  | "offer"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "ghosted";

export type JobType = "internship" | "full-time" | "part-time" | "contract";

export type InterviewType =
  | "phone"
  | "technical"
  | "hr"
  | "system_design"
  | "behavioral"
  | "onsite"
  | "group";

export type InterviewResult = "pending" | "passed" | "failed";

export type Currency = "INR" | "USD" | "EUR" | "GBP" | "AED" | "SGD";

export type ApplicationTag =
  | "dream"
  | "target"
  | "safety"
  | "reach"
  | "on-campus"
  | "off-campus"
  | "ppo"
  | "referral"
  | "startup"
  | "product"
  | "service"
  | "return-offer";

export interface Interview {
  _id: string;
  round: number;
  type: InterviewType;
  scheduledAt: string | null;
  duration: number | null;
  notes: string;
  result: InterviewResult;
}

export interface ActivityEntry {
  _id: string;
  action: string;
  details: string;
  createdAt: string;
}

export interface OADetails {
  scheduledAt: string | null;
  platform: string;
  duration: number | null;
  notes: string;
  completed: boolean;
}

export interface OfferDetails {
  ctc: number | null;
  stipend: number | null;
  currency: Currency;
  joiningDate: string | null;
  deadline: string | null;
  accepted: boolean;
}

export interface Application {
  _id: string;
  user: string;
  company: string;
  role: string;
  location: string;
  jobType: JobType;
  jobLink: string;
  status: ApplicationStatus;
  appliedDate: string | null;
  deadline: string | null;
  oa: OADetails;
  interviews: Interview[];
  offer: OfferDetails;
  resumeVersion: string;
  referral: boolean;
  referralName: string;
  notes: string;
  tags: ApplicationTag[];
  activityLog: ActivityEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationListItem
  extends Omit<Application, "activityLog" | "interviews" | "notes" | "offer"> {}

export interface ApplicationListResponse {
  applications: ApplicationListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApplicationStats {
  wishlist: number;
  applied: number;
  oa: number;
  interview: number;
  offer: number;
  accepted: number;
  rejected: number;
  withdrawn: number;
  ghosted: number;
  total: number;
}

export interface ApplicationFilters {
  status?: string;
  jobType?: string;
  search?: string;
  tags?: string;
  referral?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
