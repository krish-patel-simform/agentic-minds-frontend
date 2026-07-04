import type { JobPosition } from "../../types/jobPosition.type";

interface JobCardProps {
  job: JobPosition;
  isSelected?: boolean;
}

const JobPositionCard = ({ job, isSelected = false }: JobCardProps) => {
  return (
    <div
      className={`bg-white p-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${isSelected ? "border-indigo-600" : "border-transparent shadow-sm"}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-slate-800">{job.title}</h3>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-indigo-900">
            {job.applicants}
          </span>
          <span className="text-[10px] uppercase text-gray-400 font-semibold leading-none">
            applicants
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {job?.tags?.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium"
          >
            {tag}
          </span>
        ))}
        <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
          {job.status}
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      <div className="grid grid-cols-4 gap-2 border-t pt-4">
        <div>
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Experience
          </p>
          <p className="text-sm font-bold text-slate-700">{job.experience}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Notice
          </p>
          <p className="text-sm font-bold text-slate-700">{job.noticePeriod}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Questions
          </p>
          <p className="text-sm font-bold text-slate-700">{job.questions}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
            Interviewer
          </p>
          <p className="text-sm font-bold text-slate-700">{job.interviewer}</p>
        </div>
      </div>
    </div>
  );
};

export default JobPositionCard;
