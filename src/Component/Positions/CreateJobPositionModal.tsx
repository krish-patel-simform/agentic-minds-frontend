import { useState } from "react";
import { X } from "lucide-react";
import type {
  JobPositionFormData,
  ScreeningQuestion,
} from "../../types/jobPosition.type";
import ScreeningQuestionsInput from "./ScreeningQuestionsInput";

const EXPERIENCE_OPTIONS = [
  "0-2 years",
  "2-4 years",
  "4-8 years",
  "8+ years",
];

const NOTICE_PERIOD_OPTIONS = ["15 days", "30 days", "60 days", "90 days"];

const INTERVIEWER_OPTIONS = ["Admin", "Gwen", "Priya"];

const DEFAULT_QUESTIONS: ScreeningQuestion[] = [
  {
    id: crypto.randomUUID(),
    question: "Can you describe your experience with the primary tech stack for this role?",
  },
  {
    id: crypto.randomUUID(),
    question: "How do you approach debugging a production issue under pressure?",
  },
];

interface CreateJobPositionModalProps {
  onClose: () => void;
  onCreate: (data: JobPositionFormData) => void;
}

const CreateJobPositionModal = ({
  onClose,
  onCreate,
}: CreateJobPositionModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [primarySkill, setPrimarySkill] = useState("");
  const [experience, setExperience] = useState(EXPERIENCE_OPTIONS[2]);
  const [noticePeriod, setNoticePeriod] = useState(NOTICE_PERIOD_OPTIONS[1]);
  const [interviewer, setInterviewer] = useState(INTERVIEWER_OPTIONS[1]);
  const [screeningQuestions, setScreeningQuestions] =
    useState<ScreeningQuestion[]>(DEFAULT_QUESTIONS);

  const isValid = title.trim().length > 0 && description.trim().length > 0;

  const handleCreate = () => {
    if (!isValid) return;
    onCreate({
      title: title.trim(),
      description: description.trim(),
      primarySkill: primarySkill.trim(),
      experience,
      noticePeriod,
      interviewer,
      screeningQuestions: screeningQuestions.filter(
        (q) => q.question.trim().length > 0,
      ),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            Create Job Position
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-slate-500 hover:bg-indigo-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Job Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Job Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, responsibilities, and team..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Primary Skill
              </label>
              <input
                type="text"
                value={primarySkill}
                onChange={(e) => setPrimarySkill(e.target.value)}
                placeholder="e.g. Python, React, DevOps"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Experience Range
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {EXPERIENCE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Notice Period (max)
              </label>
              <select
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {NOTICE_PERIOD_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Assigned Interviewer
              </label>
              <select
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {INTERVIEWER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ScreeningQuestionsInput
            questions={screeningQuestions}
            onChange={setScreeningQuestions}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-slate-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!isValid}
            className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create Position
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPositionModal;
