import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import type {
  JobPosition,
  JobPositionFormData,
} from "../../types/jobPosition.type";
import CreateJobPositionModal from "./CreateJobPositionModal";
import JobPositionDetail from "./JobPositionDetail";
import { jobPositionApi } from "../../api/jobPosition.api";
import JobPositionCard from "../Card/JobPositionCard";

const JobPositions = () => {
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState<JobPosition[] | null>(null);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  }

  if (selectedJob) {
    return (
      <JobPositionDetail
        job={selectedJob}
        onBack={() => setSelectedJobId(null)}
        onCreateNew={() => setIsModalOpen(true)}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Job Positions</h2>
          <p className="text-gray-500 text-sm">
            {activeCount} active positions • {totalCandidates} total candidates
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm transition-colors"
        >
          <Plus size={18} />
          Create Position
        </button>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading positions...</p>}

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

      {isModalOpen && (
        <CreateJobPositionModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default JobPositions;
