import type { Candidate, CandidateStatus } from "../../types/candidate.type";

interface CandidateCardProps {
  candidate: Candidate;
  onClick?: () => void;
}

const STATUS_STYLES: Record<CandidateStatus, string> = {
  new: "bg-blue-500 text-blue-600",
  screening: "bg-amber-500 text-amber-600",
  shortlisted: "bg-indigo-500 text-indigo-600",
  on_hold: "bg-orange-500 text-orange-600",
  rejected: "bg-rose-500 text-rose-600",
  hired: "bg-green-500 text-green-600",
  withdrawn: "bg-gray-400 text-gray-500",
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

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const CandidateCard = ({ candidate, onClick }: CandidateCardProps) => {
  const [dotColor, textColor] = STATUS_STYLES[candidate.status].split(" ");
  const currentRole = [candidate.current_designation, candidate.current_company]
    .filter(Boolean)
    .join(" @ ");

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
            {getInitials(candidate.full_name)}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              {candidate.full_name}
            </p>
            <p className="text-xs text-gray-400">{candidate.email}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-sm text-gray-600">{currentRole || "—"}</td>
      <td className="py-4 px-6 text-sm text-gray-600">
        {candidate.total_experience_years} yrs
      </td>
      <td className="py-4 px-6 text-sm text-gray-600">{candidate.phone}</td>
      <td className="py-4 px-6">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${textColor}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          {STATUS_LABELS[candidate.status]}
        </span>
      </td>
      <td className="py-4 px-6">
        <button
          type="button"
          onClick={onClick}
          className="text-sm font-semibold text-indigo-700 hover:text-indigo-900"
        >
          View profile
        </button>
      </td>
    </tr>
  );
};

export default CandidateCard;
