import { ArrowLeft, Archive } from "lucide-react";
import type { Applicant, JobPosition, JobStatus } from "../../types/jobPosition.type";
import { getMockApplicants } from "../../utils/mockApplicants";

const STATUS_STYLES: Record<Applicant["status"], string> = {
  Pending: "text-amber-500",
  "Partial (Dropped)": "text-orange-500",
  Completed: "text-green-600",
};

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "open", label: "Open" },
  { value: "on_hold", label: "On Hold" },
  { value: "closed", label: "Closed" },
];

interface JobPositionDetailProps {
  job: JobPosition;
  onBack: () => void;
  onEdit: () => void;
  onArchiveRequest: () => void;
  onStatusChange: (status: JobStatus) => void;
  isChangingStatus?: boolean;
}

const JobPositionDetail = ({
  job,
  onBack,
  onEdit,
  onArchiveRequest,
  onStatusChange,
  isChangingStatus = false,
}: JobPositionDetailProps) => {
  const applicants = getMockApplicants(job.id);
  const experienceRange =
    job.min_experience_years === job.max_experience_years
      ? `${job.min_experience_years} yrs`
      : `${job.min_experience_years}-${job.max_experience_years} yrs`;

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-indigo-600 font-medium mb-4 hover:text-indigo-800"
      >
        <ArrowLeft size={16} />
        Back to Positions
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{job.title}</h2>
          <p className="text-gray-500 text-sm mt-1">
            {job.job_description || "No description provided."}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={job.status}
            disabled={isChangingStatus || job.status === "archived"}
            onChange={(e) => onStatusChange(e.target.value as JobStatus)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-slate-600 disabled:opacity-50"
          >
            {job.status === "archived" && (
              <option value="archived">Archived</option>
            )}
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onEdit}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-slate-600 hover:bg-gray-50"
          >
            Edit Position
          </button>
          {job.status !== "archived" && (
            <button
              type="button"
              onClick={onArchiveRequest}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-slate-600 hover:bg-gray-50 flex items-center gap-2"
            >
              <Archive size={14} />
              Archive
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="min-w-0">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Experience
          </p>
          <p className="text-sm font-bold text-slate-700">{experienceRange}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Notice Period
          </p>
          <p className="text-sm font-bold text-slate-700">
            {job.expected_notice_period_days}d / {job.max_notice_period_days}d max
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">
              Applicants ({applicants.length})
            </h3>
            <p className="text-xs text-gray-400">
              Placeholder data - applicant tracking API not integrated yet
            </p>
          </div>

          {applicants.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">
              No applicants yet.
            </p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase text-gray-400 font-bold border-b border-gray-100">
                  <th className="pb-2 font-bold">Candidate</th>
                  <th className="pb-2 font-bold">Phone</th>
                  <th className="pb-2 font-bold">Status</th>
                  <th className="pb-2 font-bold">Applied</th>
                  <th className="pb-2 font-bold">Score</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((applicant) => (
                  <tr
                    key={applicant.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                          {applicant.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            {applicant.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {applicant.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-slate-600">
                      {applicant.phone}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-sm font-medium flex items-center gap-1 ${STATUS_STYLES[applicant.status]}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {applicant.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-slate-600">
                      {applicant.appliedDate}
                    </td>
                    <td className="py-3 text-sm text-slate-600">
                      {applicant.score ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4">Job Details</h3>
          <div className="space-y-3 text-sm">
            <DetailRow label="Department" value={job.department} />
            <DetailRow label="Location" value={job.location} />
            <DetailRow label="Domain" value={job.domain} />
            <DetailRow label="Company" value={job.company_name} />
            <DetailRow
              label="Employment Type"
              value={job.employment_type.replace("_", " ")}
            />
            <DetailRow
              label="Salary Range"
              value={
                job.salary_min != null || job.salary_max != null
                  ? `${job.salary_currency} ${job.salary_min ?? "—"} - ${job.salary_max ?? "—"}`
                  : null
              }
            />
            {job.jd_summary && (
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
                  JD Summary
                </p>
                <p className="text-sm text-slate-700 leading-snug">
                  {job.jd_summary}
                </p>
              </div>
            )}
            {job.requirements && (
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
                  Requirements
                </p>
                <p className="text-sm text-slate-700 leading-snug">
                  {job.requirements}
                </p>
              </div>
            )}
            {job.responsibilities && (
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
                  Responsibilities
                </p>
                <p className="text-sm text-slate-700 leading-snug">
                  {job.responsibilities}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function DetailRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between gap-4">
      <p className="text-[10px] uppercase text-gray-400 font-bold">{label}</p>
      <p className="text-sm font-semibold text-slate-700 text-right">
        {value || "—"}
      </p>
    </div>
  );
}

export default JobPositionDetail;
