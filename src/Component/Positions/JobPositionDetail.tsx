import { ArrowLeft, ExternalLink, Plus } from "lucide-react";
import type { Applicant, JobPosition } from "../../types/jobPosition.type";

const STATUS_STYLES: Record<Applicant["status"], string> = {
  Pending: "text-amber-500",
  "Partial (Dropped)": "text-orange-500",
  Completed: "text-green-600",
};

interface JobPositionDetailProps {
  job: JobPosition;
  onBack: () => void;
  onCreateNew: () => void;
  onEdit: () => void;
}

const JobPositionDetail = ({
  job,
  onBack,
  onCreateNew,
  onEdit,
}: JobPositionDetailProps) => {
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
          <p className="text-gray-500 text-sm mt-1">{job.description}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-slate-600 hover:bg-gray-50"
          >
            Edit Position
          </button>
          <button
            type="button"
            onClick={onCreateNew}
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm transition-colors"
          >
            <Plus size={16} />
            New Position
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="min-w-0">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Experience
          </p>
          <p className="text-sm font-bold text-slate-700 truncate">
            {job.experience}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Notice Period
          </p>
          <p className="text-sm font-bold text-slate-700 truncate">
            {job.noticePeriod}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Questions
          </p>
          <p className="text-sm font-bold text-slate-700 truncate">
            {job.questions}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Interviewer
          </p>
          <p className="text-sm font-bold text-slate-700 truncate">
            {job.interviewer}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">
              Applicants ({job.applicantsList.length})
            </h3>
            <a
              href="#"
              className="text-sm text-indigo-600 font-medium flex items-center gap-1 hover:text-indigo-800"
            >
              Open Application Form
              <ExternalLink size={14} />
            </a>
          </div>

          {job.applicantsList.length === 0 ? (
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
                  <th className="pb-2 font-bold"></th>
                </tr>
              </thead>
              <tbody>
                {job.applicantsList.map((applicant) => (
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
                    <td className="py-3 text-sm text-indigo-600 font-medium">
                      <a href="#" className="hover:text-indigo-800">
                        View profile
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4">
            Question Bank ({job.screeningQuestions.length})
          </h3>

          {job.screeningQuestions.length === 0 ? (
            <p className="text-sm text-gray-400">No screening questions.</p>
          ) : (
            <div className="space-y-4">
              {job.screeningQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 shrink-0 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-sm text-slate-700 leading-snug">
                      {question.question}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPositionDetail;
