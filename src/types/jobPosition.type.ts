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
}
