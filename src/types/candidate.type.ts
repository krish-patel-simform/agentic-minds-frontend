export type CandidateStatus =
  | "Completed"
  | "Pending"
  | "Scheduled"
  | "Partial (Dropped)";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  phone: string;
  status: CandidateStatus;
  appliedDate: string;
  score?: number;
}
