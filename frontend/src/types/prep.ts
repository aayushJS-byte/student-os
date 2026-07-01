export type QuestionSection = "OA" | "CS Fundamentals" | "HR" | "System Design";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type ProgressStatus = "todo" | "attempted" | "solved";

export interface QuestionExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Question {
  _id: string;
  company: string;
  section: QuestionSection;
  title: string;
  slug: string;
  question: string;
  functionSignature?: string;
  constraints: string[];
  examples: QuestionExample[];
  difficulty: Difficulty;
  tags: string[];
  year?: number;
  platform?: string;
}

export interface CompanyInfo {
  name: string;
  count: number;
}

export interface QuestionProgress {
  questionSlug: string;
  status: ProgressStatus;
  notes?: string;
  solvedAt?: string;
}

export interface ProgressMap {
  [slug: string]: QuestionProgress;
}

export interface ProgressStats {
  solved: number;
  attempted: number;
  todo: number;
  total: number;
}
