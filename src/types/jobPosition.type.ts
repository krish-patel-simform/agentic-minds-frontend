export interface ScreeningQuestion {
  id: string;
  question: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Pending" | "Partial (Dropped)" | "Completed";
  appliedDate: string;
  score?: number | null;
}

export interface JobPosition {
  id: string;
  title: string;
  tech: string;
  tags?: string[];
  status: "Active" | "Closed";
  applicants: number;
  description: string;
  experience: string;
  noticePeriod: string;
  questions: number;
  interviewer: string;
  screeningQuestions: ScreeningQuestion[];
  applicantsList: Applicant[];
}

export interface JobPositionFormData {
  title: string;
  description: string;
  primarySkill: string;
  experience: string;
  noticePeriod: string;
  interviewer: string;
  screeningQuestions: ScreeningQuestion[];
}
