import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import type {
  EmploymentType,
  JobPositionFormData,
  JobStatus,
} from "../../types/jobPosition.type";
import SkillMultiSelect from "./SkillMultiSelect";

const EMPLOYMENT_TYPE_OPTIONS: { value: EmploymentType; label: string }[] = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "open", label: "Open" },
  { value: "on_hold", label: "On hold" },
];

const INTERVIEWER_OPTIONS = ["Admin", "Gwen", "Priya"];

// Numeric inputs are kept as strings at the form-state level (native input
// values are strings) and parsed to numbers on submit, so the zod schema's
// input and output types stay identical - avoids the zodResolver/RHF generic
// mismatch that `z.coerce.number()` causes.
const wholeNumberString = (label: string, min: number, max: number) =>
  z
    .string()
    .refine((val) => val.trim() !== "" && !Number.isNaN(Number(val)), {
      message: `${label} must be a number`,
    })
    .refine((val) => Number.isInteger(Number(val)), {
      message: `${label} must be a whole number`,
    })
    .refine((val) => Number(val) >= min && Number(val) <= max, {
      message: `${label} must be between ${min} and ${max}`,
    });

const optionalNumberString = (label: string, min: number) =>
  z
    .string()
    .optional()
    .refine((val) => !val || !Number.isNaN(Number(val)), {
      message: `${label} must be a number`,
    })
    .refine((val) => !val || Number(val) >= min, {
      message: `${label} must be >= ${min}`,
    });

const jobPositionSchema = z
  .object({
    title: z.string().trim().min(2, "Title must be at least 2 characters").max(200),
    jobDescription: z.string().trim().max(5000).optional(),
    responsibilities: z.string().trim().max(5000).optional(),
    requirements: z.string().trim().max(5000).optional(),
    department: z.string().trim().max(100).optional(),
    location: z.string().trim().max(200).optional(),
    domain: z.string().trim().max(100).optional(),
    companyName: z.string().trim().max(200).optional(),
    employmentType: z.enum(["full_time", "part_time", "contract", "internship"]),
    skills: z.array(z.string()).min(1, "Select at least one skill"),
    minExperienceYears: wholeNumberString("Min experience", 0, 60),
    maxExperienceYears: wholeNumberString("Max experience", 0, 60),
    salaryMin: optionalNumberString("Salary min", 0),
    salaryMax: optionalNumberString("Salary max", 0),
    salaryCurrency: z.string().trim().length(3, "Use a 3-letter code, e.g. INR"),
    expectedNoticePeriodDays: wholeNumberString("Expected notice period", 0, 365),
    maxNoticePeriodDays: wholeNumberString("Max notice period", 0, 365),
    interviewerName: z.string().trim().max(200).optional(),
    questionsToAsk: wholeNumberString("Questions to ask", 1, 20),
    status: z.enum(["draft", "open", "on_hold", "closed", "archived"]),
  })
  .refine((data) => Number(data.maxExperienceYears) >= Number(data.minExperienceYears), {
    message: "Max experience must be >= min experience",
    path: ["maxExperienceYears"],
  })
  .refine(
    (data) => Number(data.maxNoticePeriodDays) >= Number(data.expectedNoticePeriodDays),
    {
      message: "Max notice period must be >= expected notice period",
      path: ["maxNoticePeriodDays"],
    },
  );

type JobPositionFormValues = z.infer<typeof jobPositionSchema>;

function randomQuestionsToAsk() {
  return 3 + Math.floor(Math.random() * 6);
}

const DEFAULT_VALUES: JobPositionFormValues = {
  title: "",
  jobDescription: "",
  responsibilities: "",
  requirements: "",
  department: "",
  location: "",
  domain: "",
  companyName: "",
  employmentType: "full_time",
  skills: [],
  minExperienceYears: "0",
  maxExperienceYears: "2",
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "INR",
  expectedNoticePeriodDays: "30",
  maxNoticePeriodDays: "60",
  interviewerName: INTERVIEWER_OPTIONS[1],
  questionsToAsk: String(randomQuestionsToAsk()),
  status: "draft",
};

interface CreateJobPositionModalProps {
  mode?: "create" | "edit";
  initialValues?: JobPositionFormData;
  onClose: () => void;
  onSubmit: (data: JobPositionFormData) => void;
  isSubmitting?: boolean;
}

const CreateJobPositionModal = ({
  mode = "create",
  initialValues,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CreateJobPositionModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JobPositionFormValues>({
    resolver: zodResolver(jobPositionSchema),
    defaultValues: initialValues
      ? {
          ...initialValues,
          minExperienceYears: String(initialValues.minExperienceYears),
          maxExperienceYears: String(initialValues.maxExperienceYears),
          salaryMin: initialValues.salaryMin != null ? String(initialValues.salaryMin) : "",
          salaryMax: initialValues.salaryMax != null ? String(initialValues.salaryMax) : "",
          expectedNoticePeriodDays: String(initialValues.expectedNoticePeriodDays),
          maxNoticePeriodDays: String(initialValues.maxNoticePeriodDays),
          questionsToAsk: String(initialValues.questionsToAsk),
        }
      : DEFAULT_VALUES,
  });

  const submit = (values: JobPositionFormValues) => {
    onSubmit({
      title: values.title.trim(),
      jobDescription: values.jobDescription?.trim() ?? "",
      responsibilities: values.responsibilities?.trim() ?? "",
      requirements: values.requirements?.trim() ?? "",
      department: values.department?.trim() ?? "",
      location: values.location?.trim() ?? "",
      domain: values.domain?.trim() ?? "",
      companyName: values.companyName?.trim() ?? "",
      employmentType: values.employmentType,
      skills: values.skills,
      minExperienceYears: Number(values.minExperienceYears),
      maxExperienceYears: Number(values.maxExperienceYears),
      salaryMin: values.salaryMin ? Number(values.salaryMin) : null,
      salaryMax: values.salaryMax ? Number(values.salaryMax) : null,
      salaryCurrency: values.salaryCurrency.toUpperCase(),
      expectedNoticePeriodDays: Number(values.expectedNoticePeriodDays),
      maxNoticePeriodDays: Number(values.maxNoticePeriodDays),
      interviewerName: values.interviewerName?.trim() ?? "",
      questionsToAsk: Number(values.questionsToAsk),
      status: values.status,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit(submit)}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            {mode === "edit" ? "Edit Job Position" : "Create Job Position"}
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
              <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Job Description
            </label>
            <textarea
              {...register("jobDescription")}
              placeholder="Describe the role, responsibilities, and team..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Responsibilities
              </label>
              <textarea
                {...register("responsibilities")}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Requirements
              </label>
              <textarea
                {...register("requirements")}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Skills
              </label>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <SkillMultiSelect value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.skills && (
                <p className="text-xs text-rose-500 mt-1">{errors.skills.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Employment Type
              </label>
              <select
                {...register("employmentType")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Department
              </label>
              <input
                type="text"
                {...register("department")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Location
              </label>
              <input
                type="text"
                {...register("location")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Domain
              </label>
              <input
                type="text"
                {...register("domain")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Min Experience (years)
              </label>
              <input
                type="number"
                min={0}
                max={60}
                {...register("minExperienceYears")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Max Experience (years)
              </label>
              <input
                type="number"
                min={0}
                max={60}
                {...register("maxExperienceYears")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.maxExperienceYears && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.maxExperienceYears.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Expected Notice Period (days)
              </label>
              <input
                type="number"
                min={0}
                max={365}
                {...register("expectedNoticePeriodDays")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Max Notice Period (days)
              </label>
              <input
                type="number"
                min={0}
                max={365}
                {...register("maxNoticePeriodDays")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.maxNoticePeriodDays && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.maxNoticePeriodDays.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Salary Min
              </label>
              <input
                type="number"
                min={0}
                {...register("salaryMin")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Salary Max
              </label>
              <input
                type="number"
                min={0}
                {...register("salaryMax")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Currency
              </label>
              <input
                type="text"
                maxLength={3}
                {...register("salaryCurrency")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.salaryCurrency && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.salaryCurrency.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Company Name
              </label>
              <input
                type="text"
                {...register("companyName")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Assigned Interviewer
              </label>
              <select
                {...register("interviewerName")}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Questions to Ask
              </label>
              <input
                type="number"
                min={1}
                max={20}
                {...register("questionsToAsk")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Question content will be sourced from a separate API later -
                this only sets how many should be asked.
              </p>
            </div>
            {mode === "create" && (
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Initial Status
                </label>
                <select
                  {...register("status")}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
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
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : mode === "edit"
                ? "Save Changes"
                : "Create Position"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobPositionModal;
