import { Trash2 } from "lucide-react";
import type { JobPosition, JobStatus } from "../../types/jobPosition.type";
import { getMockApplicantCount } from "../../utils/mockApplicants";

const STATUS_STYLES: Record<JobStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  open: "bg-green-50 text-green-600",
  on_hold: "bg-amber-50 text-amber-600",
  closed: "bg-slate-100 text-slate-600",
  archived: "bg-rose-50 text-rose-500",
};

const STATUS_LABELS: Record<JobStatus, string> = {
  draft: "Draft",
  open: "Open",
  on_hold: "On Hold",
  closed: "Closed",
  archived: "Archived",
};

interface JobCardProps {
  job: JobPosition;
  isSelected?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

const JobPositionCard = ({
  job,
  isSelected = false,
  onClick,
  onDelete,
}: JobCardProps) => {
  const experienceRange =
    job.min_experience_years === job.max_experience_years
      ? `${job.min_experience_years} yrs`
      : `${job.min_experience_years}-${job.max_experience_years} yrs`;

  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${isSelected ? "border-indigo-600" : "border-transparent shadow-sm"}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-slate-800">{job.title}</h3>
        <div className="flex flex-col items-end gap-1">
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-gray-300 hover:text-rose-500 transition-colors"
              aria-label={`Delete ${job.title}`}
            >
              <Trash2 size={16} color="red" />
            </button>
          )}
          <span className="text-2xl font-bold text-indigo-900">
            {getMockApplicantCount(job.id)}
          </span>
          <span className="text-[10px] uppercase text-gray-400 font-semibold leading-none">
            applicants
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {job.skills?.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium"
          >
            {skill}
          </span>
        ))}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[job.status]}`}
        >
          {STATUS_LABELS[job.status]}
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">
        {job.job_description || "No description provided."}
      </p>

      <div className="grid grid-cols-2 gap-x-2 gap-y-3 border-t pt-4">
        <div className="min-w-0">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Experience
          </p>
          <p className="text-sm font-bold text-slate-700">{experienceRange}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Notice
          </p>
          <p className="text-sm font-bold text-slate-700">
            {job.expected_notice_period_days}d / {job.max_notice_period_days}d
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Questions
          </p>
          <p className="text-sm font-bold text-slate-700">
            {job.questions_to_ask}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Interviewer
          </p>
          <p className="text-sm font-bold text-slate-700">
            {job.interviewer_name || "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobPositionCard;
