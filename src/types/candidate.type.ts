export type CandidateStatus =
  | "new"
  | "screening"
  | "shortlisted"
  | "on_hold"
  | "rejected"
  | "hired"
  | "withdrawn";

export type CandidateSource = "manual" | "import" | "referral";

export type ResumeParseStatus = "pending" | "parsed" | "failed";

export interface CandidateExperience {
  id: number;
  company: string;
  title: string;
  start_date: string | null;
  end_date: string | null;
  summary: string | null;
}

export interface CandidateEducation {
  id: number;
  institution: string;
  degree: string | null;
  field: string | null;
  year: number | null;
}

export interface CandidateProject {
  id: number;
  name: string;
  description: string | null;
  tech: string[] | null;
}

export interface CandidateResume {
  id: number;
  filename: string;
  content_type: string;
  size_bytes: number;
  parse_status: ResumeParseStatus;
  is_current: boolean;
  created_at: string;
}

// Matches CandidateRead from the real /api/v1/candidates backend.
export interface Candidate {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  current_location: string | null;
  current_company: string | null;
  current_designation: string | null;
  total_experience_years: number;
  primary_skill: string | null;
  skills: string[] | null;
  current_ctc: number | null;
  expected_ctc: number | null;
  notice_period_days: number | null;
  source: CandidateSource;
  status: CandidateStatus;
  parsed_data: Record<string, unknown> | null;
  notes: string | null;
  experiences: CandidateExperience[];
  educations: CandidateEducation[];
  projects: CandidateProject[];
  resumes: CandidateResume[];
  created_at: string;
  updated_at: string;
}

// Matches Page[CandidateRead].
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Query params accepted by GET /api/v1/candidates.
export interface CandidateListParams {
  q?: string;
  status?: CandidateStatus;
  skill?: string;
  min_experience?: number;
  max_experience?: number;
  page?: number;
  size?: number;
}
