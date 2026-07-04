import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import type {
  JobPosition,
  JobPositionCreateRequest,
  JobPositionFormData,
  JobStatus,
} from "../../types/jobPosition.type";
import JobPositionDetail from "./JobPositionDetail";
import { jobPositionApi } from "../../api/jobPosition.api";
import { ApiError } from "../../api/axiosInstance";
import JobPositionCard from "../Card/JobPositionCard";
import ConfirmDialog from "../Modal/ConfirmDialog";
import { getMockApplicantCount } from "../../utils/mockApplicants";
import CreateJobPositionModal from "./JobPositionFormModal";
import { useToast } from "../../hook/useToast";

const PAGE_SIZE = 12;

const STATUS_FILTER_OPTIONS: { value: JobStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "open", label: "Open" },
  { value: "on_hold", label: "On Hold" },
  { value: "closed", label: "Closed" },
  { value: "archived", label: "Archived" },
];

function mapFormToCreateRequest(
  data: JobPositionFormData,
): JobPositionCreateRequest {
  return {
    title: data.title,
    job_description: data.jobDescription || null,
    responsibilities: data.responsibilities || null,
    requirements: data.requirements || null,
    department: data.department || null,
    location: data.location || null,
    domain: data.domain || null,
    company_name: data.companyName || null,
    employment_type: data.employmentType,
    skills: data.skills,
    primary_skill: data.skills[0] ?? null,
    min_experience_years: data.minExperienceYears,
    max_experience_years: data.maxExperienceYears,
    salary_min: data.salaryMin,
    salary_max: data.salaryMax,
    salary_currency: data.salaryCurrency,
    expected_notice_period_days: data.expectedNoticePeriodDays,
    max_notice_period_days: data.maxNoticePeriodDays,
    interviewer_name: data.interviewerName || null,
    questions_to_ask: data.questionsToAsk,
    status: data.status,
  };
}

function jobToFormData(job: JobPosition): JobPositionFormData {
  return {
    title: job.title,
    jobDescription: job.job_description ?? "",
    responsibilities: job.responsibilities ?? "",
    requirements: job.requirements ?? "",
    department: job.department ?? "",
    location: job.location ?? "",
    domain: job.domain ?? "",
    companyName: job.company_name ?? "",
    employmentType: job.employment_type,
    skills: job.skills ?? [],
    minExperienceYears: job.min_experience_years,
    maxExperienceYears: job.max_experience_years,
    salaryMin: job.salary_min,
    salaryMax: job.salary_max,
    salaryCurrency: job.salary_currency,
    expectedNoticePeriodDays: job.expected_notice_period_days,
    maxNoticePeriodDays: job.max_notice_period_days,
    interviewerName: job.interviewer_name ?? "",
    questionsToAsk: job.questions_to_ask,
    status: job.status,
  };
}

const JobPositions = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<JobPosition[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "">("");
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JobPosition | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<JobPosition | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const selectedJob = items.find((job) => job.id === selectedJobId) ?? null;
  const pageApplicants = items.reduce(
    (sum, job) => sum + getMockApplicantCount(job.id),
    0,
  );

  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await jobPositionApi.list({
          page,
          size: PAGE_SIZE,
          q: searchInput.trim() || undefined,
          status: statusFilter || undefined,
        });
        if (cancelled) return;
        setItems(response.items);
        setTotal(response.total);
        setPages(response.pages);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Failed to load job positions.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page, searchInput, statusFilter, refreshKey]);

  async function handleCreate(data: JobPositionFormData) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await jobPositionApi.create(mapFormToCreateRequest(data));
      setIsModalOpen(false);
      setPage(1);
      triggerRefresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create job position.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEditSubmit(data: JobPositionFormData) {
    if (!editingJob || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { status: _status, ...updatePayload } = mapFormToCreateRequest(data);
      void _status;
      const updated = await jobPositionApi.update(editingJob.id, updatePayload);
      setItems((prev) =>
        prev.map((job) => (job.id === updated.id ? updated : job)),
      );
      setEditingJob(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update job position.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    try {
      await jobPositionApi.remove(deleteTarget.id);
      setItems((prev) => prev.filter((job) => job.id !== deleteTarget.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete job position.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleArchive() {
    if (!archiveTarget || isArchiving) return;
    setIsArchiving(true);
    try {
      const archived = await jobPositionApi.archive(archiveTarget.id);
      setItems((prev) =>
        prev.map((job) => (job.id === archived.id ? archived : job)),
      );
      setArchiveTarget(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to archive job position.");
    } finally {
      setIsArchiving(false);
    }
  }

  async function handleStatusChange(status: JobStatus) {
    if (!selectedJob || isChangingStatus) return;
    setIsChangingStatus(true);
    try {
      const updated = await jobPositionApi.changeStatus(selectedJob.id, { status });
      setItems((prev) =>
        prev.map((job) => (job.id === updated.id ? updated : job)),
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to change job status.");
    } finally {
      setIsChangingStatus(false);
    }
  }

  if (selectedJob) {
    return (
      <>
        <JobPositionDetail
          job={selectedJob}
          onBack={() => setSelectedJobId(null)}
          onEdit={() => setEditingJob(selectedJob)}
          onArchiveRequest={() => setArchiveTarget(selectedJob)}
          onStatusChange={handleStatusChange}
          isChangingStatus={isChangingStatus}
        />
        {editingJob && (
          <CreateJobPositionModal
            mode="edit"
            initialValues={jobToFormData(editingJob)}
            onClose={() => setEditingJob(null)}
            onSubmit={handleEditSubmit}
            isSubmitting={isSubmitting}
          />
        )}
        {archiveTarget && (
          <ConfirmDialog
            title="Archive job position?"
            message={`"${archiveTarget.title}" will be moved to archived status. You can still view it, but it will no longer accept applicants.`}
            confirmLabel="Archive"
            isConfirming={isArchiving}
            onConfirm={handleArchive}
            onCancel={() => setArchiveTarget(null)}
          />
        )}
      </>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Job Positions</h2>
          <p className="text-gray-500 text-sm">
            {total} total positions • {pageApplicants} candidates on this page
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm transition-colors"
        >
          <Plus size={18} />
          Create Position
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-56">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setPage(1);
              setSearchInput(e.target.value);
            }}
            placeholder="Search job title or description..."
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value as JobStatus | "");
          }}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400"
        >
          {STATUS_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading positions...</p>}

      {error && !loading && (
        <div className="flex items-center gap-3 mb-4">
          <p className="text-sm text-rose-500">{error}</p>
          <button
            type="button"
            onClick={triggerRefresh}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="text-sm text-gray-400 py-12 text-center">
          No job positions found.
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((job) => (
              <JobPositionCard
                key={job.id}
                job={job}
                onClick={() => setSelectedJobId(job.id)}
                onDelete={() => setDeleteTarget(job)}
              />
            ))}
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-slate-600 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {pages} ({total} total)
              </span>
              <button
                type="button"
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-slate-600 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <CreateJobPositionModal
          mode="create"
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete job position?"
          message={`This will soft-delete "${deleteTarget.title}". This action cannot be undone from the UI.`}
          confirmLabel="Delete"
          isConfirming={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default JobPositions;
