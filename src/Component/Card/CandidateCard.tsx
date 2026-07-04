import type { Candidate, CandidateStatus } from "../../types/candidate.type";

interface CandidateCardProps {
  candidate: Candidate;
}

const statusStyles: Record<CandidateStatus, string> = {
  Completed: "bg-green-500 text-green-600",
  Pending: "bg-amber-500 text-amber-600",
  Scheduled: "bg-blue-500 text-blue-600",
  "Partial (Dropped)": "bg-orange-500 text-orange-600",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const CandidateCard = ({ candidate }: CandidateCardProps) => {
  const [dotColor, textColor] = statusStyles[candidate.status].split(" ");

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
            {getInitials(candidate.name)}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{candidate.name}</p>
            <p className="text-xs text-gray-400">{candidate.email}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-sm text-gray-600">{candidate.position}</td>
      <td className="py-4 px-6 text-sm text-gray-600">{candidate.phone}</td>
      <td className="py-4 px-6">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${textColor}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          {candidate.status}
        </span>
      </td>
      <td className="py-4 px-6 text-sm text-gray-600">
        {candidate.appliedDate}
      </td>
      <td className="py-4 px-6 text-sm font-bold text-indigo-900">
        {candidate.score !== undefined ? `${candidate.score}/10` : "—"}
      </td>
      <td className="py-4 px-6">
        <button className="text-sm font-semibold text-indigo-700 hover:text-indigo-900">
          View report
        </button>
      </td>
    </tr>
  );
};

export default CandidateCard;
