import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type {
  JobPosition,
  JobPositionFormData,
  JobStatus,
} from "../types/jobPosition.type";
import JobPositionDetail from "../Component/Positions/JobPositionDetail";
import CreateJobPositionModal from "../Component/Positions/JobPositionFormModal";
import ConfirmDialog from "../Component/Modal/ConfirmDialog";
import { jobPositionApi } from "../api/jobPosition.api";
import { ApiError } from "../api/axiosInstance";

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

const JobPositionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const jobId = Number(id);
  const isValidId = Boolean(id) && !Number.isNaN(jobId);

  const [job, setJob] = useState<JobPosition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isArchiveTarget, setIsArchiveTarget] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  useEffect(() => {
    if (!isValidId) return;

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await jobPositionApi.getById(jobId);
        if (!cancelled) setJob(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Failed to load job position.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isValidId, jobId]);

  async function handleEditSubmit(data: JobPositionFormData) {
    if (!job || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const updated = await jobPositionApi.update(job.id, {
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
      });
      setJob(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update job position.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleArchive() {
    if (!job || isArchiving) return;
    setIsArchiving(true);
    try {
      const archived = await jobPositionApi.archive(job.id);
      setJob(archived);
      setIsArchiveTarget(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to archive job position.");
    } finally {
      setIsArchiving(false);
    }
  }

  async function handleStatusChange(status: JobStatus) {
    if (!job || isChangingStatus) return;
    setIsChangingStatus(true);
    try {
      const updated = await jobPositionApi.changeStatus(job.id, { status });
      setJob(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to change job status.");
    } finally {
      setIsChangingStatus(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-400">Loading position...</p>;
  }

  if (!isValidId || (error && !job)) {
    return (
      <div>
        <p className="text-sm text-rose-500 mb-4">
          {isValidId ? error : "Invalid job position."}
        </p>
        <button
          type="button"
          onClick={() => navigate("/jobs")}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          Back to Positions
        </button>
      </div>
    );
  }

  if (!job) return null;

  return (
    <>
      <JobPositionDetail
        job={job}
        onBack={() => navigate("/jobs")}
        onEdit={() => setIsEditing(true)}
        onArchiveRequest={() => setIsArchiveTarget(true)}
        onStatusChange={handleStatusChange}
        isChangingStatus={isChangingStatus}
      />
      {isEditing && (
        <CreateJobPositionModal
          mode="edit"
          initialValues={jobToFormData(job)}
          onClose={() => setIsEditing(false)}
          onSubmit={handleEditSubmit}
          isSubmitting={isSubmitting}
        />
      )}
      {isArchiveTarget && (
        <ConfirmDialog
          title="Archive job position?"
          message={`"${job.title}" will be moved to archived status. You can still view it, but it will no longer accept applicants.`}
          confirmLabel="Archive"
          isConfirming={isArchiving}
          onConfirm={handleArchive}
          onCancel={() => setIsArchiveTarget(false)}
        />
      )}
    </>
  );
};

export default JobPositionDetailPage;
