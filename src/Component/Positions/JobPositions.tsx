import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import type {
  JobPosition,
  JobPositionFormData,
} from "../../types/jobPosition.type";
import JobPositionFormModal from "./JobPositionFormModal";
import JobPositionDetail from "./JobPositionDetail";
import { jobPositionApi } from "../../api/jobPosition.api";
import JobPositionCard from "../Card/JobPositionCard";
import { useToast } from "../../hook/useToast";

const JobPositions = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState<JobPosition[] | null>(null);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosition | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const selectedJob = jobData?.find((job) => job.id === selectedJobId) ?? null;
  const totalCandidates = jobData?.reduce(
    (sum, job) => sum + job.applicants,
    0,
  );
  const activeCount = jobData?.filter((job) => job.status === "Active").length;

  useEffect(() => {
    async function fetchJobdata() {
      try {
        setLoading(true);
        const data = await jobPositionApi.getAll();
        setJobData(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchJobdata();
  }, []);

  async function handleCreate(data: JobPositionFormData) {
    const newJob: JobPosition = {
      id: crypto.randomUUID(),
      title: data.title,
      tech: data.primarySkills[0] ?? "",
      tags: data.primarySkills,
      status: "Active",
      applicants: 0,
      description: data.description,
      experience: data.experience,
      noticePeriod: `${data.noticePeriod} max`,
      questions: data.screeningQuestions.length,
      interviewer: data.interviewer,
      screeningQuestions: data.screeningQuestions,
      applicantsList: [],
    };
    setLoading(true);
    try {
      const created = await jobPositionApi.create(newJob);
      setJobData((prev) => (prev ? [created, ...prev] : [created]));
      setIsCreateModalOpen(false);
      showToast("Job position created successfully.", "success");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to create job position.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(job: JobPosition, data: JobPositionFormData) {
    const updatedJob: JobPosition = {
      ...job,
      title: data.title,
      tech: data.primarySkills[0] ?? job.tech,
      tags: data.primarySkills,
      description: data.description,
      experience: data.experience,
      noticePeriod: `${data.noticePeriod} max`,
      questions: data.screeningQuestions.length,
      interviewer: data.interviewer,
      screeningQuestions: data.screeningQuestions,
    };
    setLoading(true);
    try {
      const updated = await jobPositionApi.update(job.id, updatedJob);
      setJobData(
        (prev) =>
          prev?.map((existing) =>
            existing.id === updated.id ? updated : existing,
          ) ?? prev,
      );
      setEditingJob(null);
      showToast("Job position updated successfully.", "success");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to update job position.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {selectedJob ? (
        <JobPositionDetail
          job={selectedJob}
          onBack={() => setSelectedJobId(null)}
          onCreateNew={() => setIsCreateModalOpen(true)}
          onEdit={() => setEditingJob(selectedJob)}
        />
      ) : (
        <>
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Job Positions
              </h2>
              <p className="text-gray-500 text-sm">
                {activeCount} active positions • {totalCandidates} total
                candidates
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm transition-colors"
            >
              <Plus size={18} />
              Create Position
            </button>
          </div>

          {loading && (
            <p className="text-sm text-gray-400">Loading positions...</p>
          )}

          {error && !loading && (
            <p className="text-sm text-rose-500">
              Failed to load job positions: {error.message}
            </p>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobData?.map((job) => (
                <JobPositionCard
                  key={job.id}
                  job={job}
                  onClick={() => setSelectedJobId(job.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {isCreateModalOpen && (
        <JobPositionFormModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreate}
        />
      )}

      {editingJob && (
        <JobPositionFormModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSubmit={(data) => handleUpdate(editingJob, data)}
        />
      )}
    </div>
  );
};

export default JobPositions;
