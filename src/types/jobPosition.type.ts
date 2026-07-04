export type JobStatus = "draft" | "open" | "on_hold" | "closed" | "archived";

export type EmploymentType =
  | "full_time"
  | "part_time"
  | "contract"
  | "internship";

// Matches JobOpeningRead from the real /api/v1/jobs backend.
export interface JobPosition {
  id: number;
  title: string;
  department: string | null;
  employment_type: EmploymentType;
  location: string | null;
  min_experience_years: number;
  max_experience_years: number;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  job_description: string | null;
  responsibilities: string | null;
  requirements: string | null;
  domain: string | null;
  skills: string[] | null;
  status: JobStatus;
  archived_at: string | null;
  hiring_manager_id: number | null;
  primary_skill: string | null;
  jd_summary: string | null;
  expected_notice_period_days: number;
  max_notice_period_days: number;
  questions_to_ask: number;
  company_name: string | null;
  interviewer_name: string | null;
  created_at: string;
  updated_at: string;
}

// Matches JobOpeningCreate.
export interface JobPositionCreateRequest {
  title: string;
  department?: string | null;
  employment_type?: EmploymentType;
  location?: string | null;
  min_experience_years?: number;
  max_experience_years?: number;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string;
  job_description?: string | null;
  responsibilities?: string | null;
  requirements?: string | null;
  domain?: string | null;
  skills?: string[];
  hiring_manager_id?: number | null;
  primary_skill?: string | null;
  expected_notice_period_days?: number;
  max_notice_period_days?: number;
  questions_to_ask?: number;
  company_name?: string | null;
  interviewer_name?: string | null;
  status?: JobStatus;
}

// Matches JobOpeningUpdate - every field optional.
export type JobPositionUpdateRequest = Partial<JobPositionCreateRequest>;

// Matches JobOpeningStatusUpdate.
export interface JobStatusUpdateRequest {
  status: JobStatus;
}

// Matches Page[JobOpeningRead].
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Query params accepted by GET /api/v1/jobs.
export interface JobListParams {
  q?: string;
  status?: JobStatus;
  department?: string;
  employment_type?: EmploymentType;
  domain?: string;
  skill?: string;
  min_experience?: number;
  max_experience?: number;
  page?: number;
  size?: number;
}

export interface ApiValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ApiValidationError {
  detail: ApiValidationErrorItem[];
}

// --- Local-only mock data (not provided by the real API yet) ---
// Screening question text and applicant tracking are not part of the
// JobOpeningRead schema. questions_to_ask is a real backend field (a count);
// actual question content and applicant records will come from separate
// APIs that don't exist yet, so these are populated with mock data for now.

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Pending" | "Partial (Dropped)" | "Completed";
  appliedDate: string;
  score?: number | null;
}

export interface JobPositionFormData {
  title: string;
  jobDescription: string;
  responsibilities: string;
  requirements: string;
  department: string;
  location: string;
  domain: string;
  companyName: string;
  employmentType: EmploymentType;
  skills: string[];
  minExperienceYears: number;
  maxExperienceYears: number;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  expectedNoticePeriodDays: number;
  maxNoticePeriodDays: number;
  interviewerName: string;
  questionsToAsk: number;
  status: JobStatus;
}
