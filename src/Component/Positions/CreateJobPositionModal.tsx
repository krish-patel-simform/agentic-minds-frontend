import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import type { JobPositionFormData } from "../../types/jobPosition.type";
import ScreeningQuestionsInput from "./ScreeningQuestionsInput";
import SkillMultiSelect from "./SkillMultiSelect";

const EXPERIENCE_OPTIONS = ["0-2 years", "2-4 years", "4-8 years", "8+ years"];

const NOTICE_PERIOD_OPTIONS = ["15 days", "30 days", "60 days", "90 days"];

const INTERVIEWER_OPTIONS = ["Admin", "Gwen", "Priya"];

const jobPositionSchema = z.object({
  title: z.string().trim().min(1, "Job title is required"),
  description: z.string().trim().min(1, "Job description is required"),
  primarySkills: z.array(z.string()).min(1, "Select at least one skill"),
  experience: z.string().min(1),
  noticePeriod: z.string().min(1),
  interviewer: z.string().min(1),
  screeningQuestions: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
    }),
  ),
});

type JobPositionFormValues = z.infer<typeof jobPositionSchema>;

const DEFAULT_QUESTIONS = [
  {
    id: crypto.randomUUID(),
    question:
      "Can you describe your experience with the primary tech stack for this role?",
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
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JobPositionFormValues>({
    resolver: zodResolver(jobPositionSchema),
    defaultValues: {
      title: "",
      description: "",
      primarySkills: [],
      experience: EXPERIENCE_OPTIONS[2],
      noticePeriod: NOTICE_PERIOD_OPTIONS[1],
      interviewer: INTERVIEWER_OPTIONS[1],
      screeningQuestions: DEFAULT_QUESTIONS,
    },
  });

  const onSubmit = (values: JobPositionFormValues) => {
    onCreate({
      title: values.title.trim(),
      description: values.description.trim(),
      primarySkills: values.primarySkills,
      experience: values.experience,
      noticePeriod: values.noticePeriod,
      interviewer: values.interviewer,
      screeningQuestions: values.screeningQuestions.filter(
        (q) => q.question.trim().length > 0,
      ),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            Create Job Position
          </h2>
          <button
            type="button"
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
              {...register("title")}
              placeholder="e.g. Senior Backend Engineer"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.title && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Job Description
            </label>
            <textarea
              {...register("description")}
              placeholder="Describe the role, responsibilities, and team..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Primary Skill
              </label>
              <Controller
                name="primarySkills"
                control={control}
                render={({ field }) => (
                  <SkillMultiSelect
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.primarySkills && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.primarySkills.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Experience Range
              </label>
              <select
                {...register("experience")}
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
                {...register("noticePeriod")}
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
                {...register("interviewer")}
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

          <Controller
            name="screeningQuestions"
            control={control}
            render={({ field }) => (
              <ScreeningQuestionsInput
                questions={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-slate-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-colors"
          >
            Create Position
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobPositionModal;
