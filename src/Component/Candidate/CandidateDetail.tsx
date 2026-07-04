import { ArrowLeft } from "lucide-react";
import type { Candidate, CandidateStatus } from "../../types/candidate.type";

const STATUS_STYLES: Record<CandidateStatus, string> = {
  new: "bg-blue-50 text-blue-600",
  screening: "bg-amber-50 text-amber-600",
  shortlisted: "bg-indigo-50 text-indigo-600",
  on_hold: "bg-orange-50 text-orange-600",
  rejected: "bg-rose-50 text-rose-500",
  hired: "bg-green-50 text-green-600",
  withdrawn: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<CandidateStatus, string> = {
  new: "New",
  screening: "Screening",
  shortlisted: "Shortlisted",
  on_hold: "On Hold",
  rejected: "Rejected",
  hired: "Hired",
  withdrawn: "Withdrawn",
};

interface CandidateDetailProps {
  candidate: Candidate;
  onBack: () => void;
}

function formatCurrency(value: number | null): string {
  return value != null ? value.toLocaleString() : "—";
}

function formatDateRange(start: string | null, end: string | null): string {
  if (!start && !end) return "—";
  return `${start ?? "—"} – ${end ?? "Present"}`;
}

const CandidateDetail = ({ candidate, onBack }: CandidateDetailProps) => {
  const currentRole = [candidate.current_designation, candidate.current_company]
    .filter(Boolean)
    .join(" @ ");

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-indigo-600 font-medium mb-4 hover:text-indigo-800"
      >
        <ArrowLeft size={16} />
        Back to Candidates
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {candidate.full_name}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {currentRole || "No current role provided."}
          </p>
        </div>
        <span
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold shrink-0 ${STATUS_STYLES[candidate.status]}`}
        >
          {STATUS_LABELS[candidate.status]}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="min-w-0">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Experience
          </p>
          <p className="text-sm font-bold text-slate-700">
            {candidate.total_experience_years} yrs
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Notice Period
          </p>
          <p className="text-sm font-bold text-slate-700">
            {candidate.notice_period_days != null
              ? `${candidate.notice_period_days}d`
              : "—"}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Current CTC
          </p>
          <p className="text-sm font-bold text-slate-700">
            {formatCurrency(candidate.current_ctc)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Expected CTC
          </p>
          <p className="text-sm font-bold text-slate-700">
            {formatCurrency(candidate.expected_ctc)}
          </p>
        </div>
      </div>

      {candidate.skills && candidate.skills.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {candidate.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4">
              Experience ({candidate.experiences.length})
            </h3>
            {candidate.experiences.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">
                No experience records.
              </p>
            ) : (
              <div className="space-y-4">
                {candidate.experiences.map((experience) => (
                  <div
                    key={experience.id}
                    className="border-b border-gray-50 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {experience.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {experience.company}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 shrink-0">
                        {formatDateRange(
                          experience.start_date,
                          experience.end_date,
                        )}
                      </p>
                    </div>
                    {experience.summary && (
                      <p className="text-sm text-slate-600 mt-2 leading-snug">
                        {experience.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4">
              Education ({candidate.educations.length})
            </h3>
            {candidate.educations.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">
                No education records.
              </p>
            ) : (
              <div className="space-y-3">
                {candidate.educations.map((education) => (
                  <div
                    key={education.id}
                    className="flex justify-between items-start gap-4 border-b border-gray-50 last:border-0 pb-3 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {education.institution}
                      </p>
                      <p className="text-xs text-gray-400">
                        {[education.degree, education.field]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 shrink-0">
                      {education.year ?? "—"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4">
              Projects ({candidate.projects.length})
            </h3>
            {candidate.projects.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">
                No project records.
              </p>
            ) : (
              <div className="space-y-3">
                {candidate.projects.map((project) => (
                  <div
                    key={project.id}
                    className="border-b border-gray-50 last:border-0 pb-3 last:pb-0"
                  >
                    <p className="text-sm font-semibold text-slate-700">
                      {project.name}
                    </p>
                    {project.description && (
                      <p className="text-sm text-slate-600 mt-1 leading-snug">
                        {project.description}
                      </p>
                    )}
                    {project.tech && project.tech.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mt-2">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 text-[11px] font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <DetailRow label="Email" value={candidate.email} />
              <DetailRow label="Phone" value={candidate.phone} />
              <DetailRow label="Location" value={candidate.current_location} />
              <DetailRow
                label="Source"
                value={
                  candidate.source.charAt(0).toUpperCase() +
                  candidate.source.slice(1)
                }
              />
            </div>
          </div>

          {candidate.resumes.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4">
                Resumes ({candidate.resumes.length})
              </h3>
              <div className="space-y-3">
                {candidate.resumes.map((resume) => (
                  <div key={resume.id} className="text-sm">
                    <p className="font-semibold text-slate-700 truncate">
                      {resume.filename}
                      {resume.is_current && (
                        <span className="ml-2 text-[10px] uppercase text-indigo-600 font-bold">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(resume.size_bytes / 1024).toFixed(0)} KB •{" "}
                      {resume.parse_status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {candidate.notes && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4">Notes</h3>
              <p className="text-sm text-slate-600 leading-snug">
                {candidate.notes}
              </p>
            </div>
          )}
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

export default CandidateDetail;
