import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { FieldPath } from "react-hook-form";
import { z } from "zod";
import { Check, X } from "lucide-react";
import type {
  EmploymentType,
  JobPositionFormData,
  JobStatus,
} from "../../types/jobPosition.type";
import SkillMultiSelect from "./SkillMultiSelect";
import { zodResolver } from "@hookform/resolvers/zod";

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

type StepField = FieldPath<JobPositionFormValues>;

const STEPS: { title: string; fields: StepField[] }[] = [
  {
    title: "Basic Info",
    fields: ["title", "jobDescription", "employmentType", "department", "location", "domain"],
  },
  {
    title: "Role Details",
    fields: ["responsibilities", "requirements", "skills"],
  },
  {
    title: "Experience & Notice",
    fields: [
      "minExperienceYears",
      "maxExperienceYears",
      "expectedNoticePeriodDays",
      "maxNoticePeriodDays",
    ],
  },
  {
    title: "Compensation & Hiring",
    fields: [
      "salaryMin",
      "salaryMax",
      "salaryCurrency",
      "companyName",
      "interviewerName",
      "questionsToAsk",
      "status",
    ],
  },
];

const INPUT_CLASS =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const LABEL_CLASS = "text-sm font-semibold text-slate-700 mb-2 block";
const ERROR_CLASS = "text-xs text-rose-500 mt-1";

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
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === STEPS.length - 1;

  const {
    register,
    handleSubmit,
    control,
    trigger,
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

  const goNext = async () => {
    const valid = await trigger(STEPS[currentStep].fields);
    if (valid) setCurrentStep((step) => Math.min(step + 1, STEPS.length - 1));
  };

  const goBack = () => setCurrentStep((step) => Math.max(step - 1, 0));

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

  const handleSave = handleSubmit(submit);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      {/* No button in this form is ever type="submit" - the Save/Create
          action only ever runs via handleSave, called imperatively from
          that button's onClick. This rules out any native-submit path
          (Enter key, a mistakenly-typed submit button, DOM node reuse
          across the Next/Save swap) from saving before the user intends. */}
      <form
        onSubmit={(event) => event.preventDefault()}
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

        <div className="flex items-center mb-8">
          {STEPS.map((step, index) => (
            <div key={step.title} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    index < currentStep
                      ? "bg-indigo-600 text-white"
                      : index === currentStep
                        ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {index < currentStep ? <Check size={14} /> : index + 1}
                </div>
                <span
                  className={`mt-1 text-[11px] font-medium text-center whitespace-nowrap ${
                    index <= currentStep ? "text-indigo-600" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${
                    index < currentStep ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {currentStep === 0 && (
          <div className="space-y-4">
            <div>
              <label className={LABEL_CLASS}>Job Title</label>
              <input
                type="text"
                {...register("title")}
                placeholder="e.g. Senior Backend Engineer"
                className={INPUT_CLASS}
              />
              {errors.title && <p className={ERROR_CLASS}>{errors.title.message}</p>}
            </div>

            <div>
              <label className={LABEL_CLASS}>Job Description</label>
              <textarea
                {...register("jobDescription")}
                placeholder="Describe the role, responsibilities, and team..."
                rows={4}
                className={`${INPUT_CLASS} resize-y`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>Employment Type</label>
                <select {...register("employmentType")} className={INPUT_CLASS}>
                  {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL_CLASS}>Department</label>
                <input type="text" {...register("department")} className={INPUT_CLASS} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>Location</label>
                <input type="text" {...register("location")} className={INPUT_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS}>Domain</label>
                <input type="text" {...register("domain")} className={INPUT_CLASS} />
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>Responsibilities</label>
                <textarea
                  {...register("responsibilities")}
                  rows={4}
                  className={`${INPUT_CLASS} resize-y`}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Requirements</label>
                <textarea
                  {...register("requirements")}
                  rows={4}
                  className={`${INPUT_CLASS} resize-y`}
                />
              </div>
            </div>

            <div>
              <label className={LABEL_CLASS}>Skills</label>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <SkillMultiSelect value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.skills && <p className={ERROR_CLASS}>{errors.skills.message}</p>}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>Min Experience (years)</label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  {...register("minExperienceYears")}
                  className={INPUT_CLASS}
                />
                {errors.minExperienceYears && (
                  <p className={ERROR_CLASS}>{errors.minExperienceYears.message}</p>
                )}
              </div>
              <div>
                <label className={LABEL_CLASS}>Max Experience (years)</label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  {...register("maxExperienceYears")}
                  className={INPUT_CLASS}
                />
                {errors.maxExperienceYears && (
                  <p className={ERROR_CLASS}>{errors.maxExperienceYears.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>Expected Notice Period (days)</label>
                <input
                  type="number"
                  min={0}
                  max={365}
                  {...register("expectedNoticePeriodDays")}
                  className={INPUT_CLASS}
                />
                {errors.expectedNoticePeriodDays && (
                  <p className={ERROR_CLASS}>{errors.expectedNoticePeriodDays.message}</p>
                )}
              </div>
              <div>
                <label className={LABEL_CLASS}>Max Notice Period (days)</label>
                <input
                  type="number"
                  min={0}
                  max={365}
                  {...register("maxNoticePeriodDays")}
                  className={INPUT_CLASS}
                />
                {errors.maxNoticePeriodDays && (
                  <p className={ERROR_CLASS}>{errors.maxNoticePeriodDays.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLASS}>Salary Min</label>
                <input
                  type="number"
                  min={0}
                  {...register("salaryMin")}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Salary Max</label>
                <input
                  type="number"
                  min={0}
                  {...register("salaryMax")}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Currency</label>
                <input
                  type="text"
                  maxLength={3}
                  {...register("salaryCurrency")}
                  className={`${INPUT_CLASS} uppercase`}
                />
                {errors.salaryCurrency && (
                  <p className={ERROR_CLASS}>{errors.salaryCurrency.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>Company Name</label>
                <input type="text" {...register("companyName")} className={INPUT_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS}>Assigned Interviewer</label>
                <select {...register("interviewerName")} className={INPUT_CLASS}>
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
                <label className={LABEL_CLASS}>Questions to Ask</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  {...register("questionsToAsk")}
                  className={INPUT_CLASS}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Question content will be sourced from a separate API later -
                  this only sets how many should be asked.
                </p>
              </div>
              {mode === "create" && (
                <div>
                  <label className={LABEL_CLASS}>Initial Status</label>
                  <select {...register("status")} className={INPUT_CLASS}>
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
        )}

        <div className="flex justify-between items-center gap-3 mt-6 pt-4 border-t border-gray-100">
          <div>
            {currentStep > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-slate-600 hover:bg-gray-50"
              >
                Back
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-slate-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isLastStep && isSubmitting}
              onClick={isLastStep ? handleSave : goNext}
              className={
                isLastStep
                  ? "px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                  : "px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
              }
            >
              {isLastStep
                ? isSubmitting
                  ? "Saving..."
                  : mode === "edit"
                    ? "Save Changes"
                    : "Create Position"
                : "Next"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateJobPositionModal;
